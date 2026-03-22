import { aiConfigStore, DEFAULT_SYSTEM_PROMPT } from '../lib/aiConfigStore';
import { AppError, ErrorCode } from '@/lib/errors';
import { captureFrame } from '@/lib/frameCapture';
import { useIdleContext } from '@/hooks/useIdle';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_MESSAGES = 12;

export type AiStatus =
  | 'idle'
  | 'connecting'
  | 'paused'
  | 'waiting'
  | 'capturing'
  | 'streaming'
  | 'complete'
  | 'error';

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AiVisionState {
  status: AiStatus;
  streamingText: string;
  lastCompleteText: string | null;
  lastCaptureTime: number | null;
  lastError: AppError | null;
  isPaused: boolean;
  messages: AiMessage[];
}

const PROMPTS_SINGLE = [
  'Describe what you see in this image. This is the first frame.',
  'What do you observe in this frame? This is your first look.',
  'Tell me about this image. This is the start of the video.',
];

const PROMPTS_COMPARE = [
  'Describe what you see now. The first image is earlier, the second is current.',
  "What's happening in the current frame? First image was before, second is now.",
  'Look at the current frame (second image). Note any changes from before (first image).',
  "What's new in this scene? First image is previous, second is current.",
  'Describe the current frame (second image). Compare to the earlier frame (first image).',
];

let promptIndex = 0;

function getNextPrompt(hasPrevious: boolean): string {
  const prompts = hasPrevious ? PROMPTS_COMPARE : PROMPTS_SINGLE;
  promptIndex = (promptIndex + 1) % prompts.length;
  return prompts[promptIndex];
}

const QUESTION_PROMPT = (question: string) => `${question}\n\nAnswer based on the image(s).`;
const MIN_INTERVAL_MS = 3000;

interface ParsedResponse {
  description: string;
}

function parseAiResponse(response: string): ParsedResponse {
  const trimmed = response.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed.description === 'string') {
      return { description: parsed.description };
    }
  } catch {
    // Not valid JSON, try to fix truncated JSON
  }

  // Try to fix truncated JSON by appending closing characters
  const fixAttempts = [trimmed + '..."}', trimmed + '}'];

  for (const attempt of fixAttempts) {
    try {
      const parsed = JSON.parse(attempt);
      if (typeof parsed.description === 'string') {
        return { description: parsed.description };
      }
    } catch {
      // Continue to next attempt
    }
  }

  // Fallback: use raw response as description
  return { description: trimmed };
}

function extractDescriptionFromPartialJson(partialJson: string): string | null {
  // Try to extract description from partial JSON
  // Match patterns like: "description": "some text or "description":"some text
  const match = partialJson.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (match && match[1]) {
    // Unescape common JSON escapes
    return match[1]
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  return null;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/\/+$/, '');
}

function resizeDataUrl(dataUrl: string, maxDimension: number): string {
  const img = new Image();
  img.src = dataUrl;
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  if (scale === 1) return dataUrl;

  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

export interface UseAiVisionOptions {
  promptModifier?: (basePrompt: string, context: { hasPrevious: boolean }) => string;
}

export function useAiVision(
  videoElement: HTMLVideoElement | null,
  isEnabled: boolean,
  options?: UseAiVisionOptions,
): AiVisionState & { togglePause: () => void; askQuestion: (question: string) => void } {
  const [state, setState] = useState<AiVisionState>({
    status: 'idle',
    streamingText: '',
    lastCompleteText: null,
    lastCaptureTime: null,
    lastError: null,
    isPaused: false,
    messages: [],
  });

  const [configVersion, setConfigVersion] = useState(0);
  const isProcessingRef = useRef(false);
  const promptModifierRef = useRef(options?.promptModifier);
  const { requestLongIdle, releaseLongIdle } = useIdleContext();

  useEffect(() => {
    promptModifierRef.current = options?.promptModifier;
  }, [options]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousFrameRef = useRef<string | null>(null);
  const previousDescriptionRef = useRef<string | null>(null);
  const currentRequestIdRef = useRef(0);

  // Listen for config changes
  useEffect(() => {
    const handleConfigChange = () => {
      setConfigVersion((v) => v + 1);
    };
    window.addEventListener('js-camera-ai-config-change', handleConfigChange);
    return () => window.removeEventListener('js-camera-ai-config-change', handleConfigChange);
  }, []);

  const togglePause = useCallback(() => {
    setState((prev) => {
      const newPaused = !prev.isPaused;
      if (newPaused) {
        abortControllerRef.current?.abort();
        isProcessingRef.current = false;
        return {
          ...prev,
          isPaused: true,
          status: 'paused',
          streamingText: '',
        };
      }
      return {
        ...prev,
        isPaused: false,
        status: aiConfigStore.isConfigured() && videoElement ? 'waiting' : 'idle',
      };
    });
  }, [videoElement]);

  const sendMessage = useCallback(
    async (
      currentFrameDataUrl: string,
      previousFrameDataUrl: string | null,
      previousDescription: string | null,
      userPrompt: string,
      isQuestion: boolean,
    ) => {
      if (!aiConfigStore.isConfigured()) {
        return;
      }

      // Generate unique request ID to track this request
      const requestId = ++currentRequestIdRef.current;
      abortControllerRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        status: 'streaming',
        streamingText: '',
        lastCaptureTime: Date.now(),
        lastError: null,
      }));

      try {
        const config = aiConfigStore.config;
        const endpoint = normalizeEndpoint(config.apiEndpoint);

        // Resize images before sending to LLM
        const resizedCurrent = resizeDataUrl(currentFrameDataUrl, 960);
        const resizedPrevious = previousFrameDataUrl
          ? resizeDataUrl(previousFrameDataUrl, 480)
          : null;

        // Build messages array with conversation history
        type MessageContent =
          | { type: 'text'; text: string }
          | { type: 'image_url'; image_url: { url: string } };

        const messages: Array<{
          role: 'system' | 'user' | 'assistant';
          content: string | MessageContent[];
        }> = [{ role: 'system', content: config.systemPrompt || DEFAULT_SYSTEM_PROMPT }];

        // Build messages based on context
        if (isQuestion && resizedPrevious && previousDescription) {
          // Question with conversation history
          messages.push({
            role: 'user',
            content: 'Describe what you see.',
          });
          messages.push({
            role: 'assistant',
            content: previousDescription,
          });
          messages.push({
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: resizedPrevious } },
              { type: 'image_url', image_url: { url: resizedCurrent } },
            ],
          });
        } else if (resizedPrevious) {
          // Auto-capture with both images, no text history
          messages.push({
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: resizedPrevious } },
              { type: 'image_url', image_url: { url: resizedCurrent } },
            ],
          });
        } else {
          // First frame - no history
          messages.push({
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: resizedCurrent } },
            ],
          });
        }

        const response = await fetch(`${endpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
          },
          body: JSON.stringify({
            model: config.defaultModel,
            messages,
            stream: true,
            max_tokens: 4096,
            temperature: config.temperature,
            top_p: config.topP,
            top_k: config.topK,
            min_p: config.minP,
            presence_penalty: config.presencePenalty,
            repetition_penalty: config.repetitionPenalty,
            chat_template_kwargs: { enable_thinking: false },
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'vision_response',
                strict: true,
                schema: {
                  type: 'object',
                  properties: {
                    description: {
                      type: 'string',
                    },
                  },
                  required: ['description'],
                  additionalProperties: false,
                },
              },
            },
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new AppError(`API error: ${response.status}`, ErrorCode.AI_API_ERROR);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new AppError('No response body', ErrorCode.AI_API_ERROR);
        }

        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                // Extract description from partial JSON for streaming display
                const partialDescription = extractDescriptionFromPartialJson(fullResponse);
                if (partialDescription) {
                  setState((prev) => ({
                    ...prev,
                    streamingText: partialDescription,
                  }));
                }
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }

        const parsed = parseAiResponse(fullResponse);

        // Store current frame and description for next comparison (only for auto-capture, not questions)
        if (!isQuestion) {
          previousFrameRef.current = currentFrameDataUrl;
          previousDescriptionRef.current = parsed.description;
        }

        setState((prev) => {
          const newMessages: AiMessage[] = [
            ...prev.messages,
            { role: 'assistant' as const, content: parsed.description, timestamp: Date.now() },
          ].slice(-MAX_MESSAGES);

          return {
            ...prev,
            status: 'complete',
            lastCompleteText: parsed.description,
            streamingText: '',
            isPaused: prev.isPaused,
            messages: newMessages,
          };
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          setState((prev) => ({
            ...prev,
            status: prev.isPaused ? 'paused' : 'waiting',
            streamingText: '',
          }));
          return;
        }
        const appError =
          error instanceof AppError
            ? error
            : new AppError(
                error instanceof Error ? error.message : 'Unknown error',
                ErrorCode.AI_API_ERROR,
              );
        setState((prev) => ({
          ...prev,
          status: 'error',
          lastError: appError,
        }));
      } finally {
        // Only clear processing flag if this is still the current request
        // (prevents race condition when new request supersedes aborted request)
        if (currentRequestIdRef.current === requestId) {
          isProcessingRef.current = false;
        }
      }
    },
    [],
  );

  const processFrame = useCallback(async () => {
    if (!videoElement || isProcessingRef.current || !isEnabled) {
      return;
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return;
    }

    // Set flag BEFORE any async work to prevent concurrent requests
    isProcessingRef.current = true;

    const frame = captureFrame(videoElement, { maxWidth: 1280, quality: 0.8 });
    if (!frame) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        lastError: new AppError('Failed to capture frame', ErrorCode.AI_FRAME_CAPTURE_FAILED),
      }));
      isProcessingRef.current = false;
      return;
    }

    setState((prev) => ({
      ...prev,
      status: 'capturing',
    }));

    const basePrompt = getNextPrompt(!!previousFrameRef.current);
    const userPrompt = promptModifierRef.current
      ? promptModifierRef.current(basePrompt, { hasPrevious: !!previousFrameRef.current })
      : basePrompt;

    await sendMessage(
      frame.dataUrl,
      previousFrameRef.current,
      previousDescriptionRef.current,
      userPrompt,
      false,
    );
  }, [videoElement, isEnabled, sendMessage]);

  // Ask question - process immediately without requiring pause
  const askQuestion = useCallback(
    (question: string) => {
      if (!videoElement) {
        setState((prev) => ({
          ...prev,
          lastError: new AppError('Camera not available', ErrorCode.AI_FRAME_CAPTURE_FAILED),
        }));
        return;
      }

      if (!aiConfigStore.isConfigured()) {
        setState((prev) => ({
          ...prev,
          lastError: new AppError('AI not configured', ErrorCode.AI_NOT_CONFIGURED),
        }));
        return;
      }

      // Add user message to history immediately
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'user' as const, content: question, timestamp: Date.now() },
        ].slice(-MAX_MESSAGES),
        status: 'streaming',
        streamingText: '',
        lastError: null,
      }));

      // Abort any ongoing processing - the new request will supersede it
      abortControllerRef.current?.abort();

      // Capture frame and send question
      const frame = captureFrame(videoElement, { maxWidth: 1280, quality: 0.8 });
      if (frame) {
        sendMessage(
          frame.dataUrl,
          previousFrameRef.current,
          previousDescriptionRef.current,
          QUESTION_PROMPT(question),
          true,
        );
      } else {
        // Frame capture failed - reset status and show error
        setState((prev) => ({
          ...prev,
          status: 'error',
          lastError: new AppError('Failed to capture frame', ErrorCode.AI_FRAME_CAPTURE_FAILED),
        }));
      }
    },
    [videoElement, sendMessage],
  );

  // Update status based on config/isPaused state
  useEffect(() => {
    if (!isEnabled) {
      // Camera is idle/disabled - just abort processing, don't change status
      // This keeps previous content visible
      abortControllerRef.current?.abort();
      isProcessingRef.current = false;
      // Clear any streaming text, but keep previous complete text
      setState((prev) => ({
        ...prev,
        streamingText: '',
      }));
      return;
    }

    if (state.isPaused) {
      return;
    }

    if (!videoElement) {
      setState((prev) => ({
        ...prev,
        status: 'connecting',
        lastError: null,
      }));
      return;
    }

    if (!aiConfigStore.isConfigured()) {
      setState((prev) => ({
        ...prev,
        status: 'idle',
        lastError: new AppError('AI not configured', ErrorCode.AI_NOT_CONFIGURED),
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      status: 'waiting',
      lastError: null,
    }));
  }, [isEnabled, videoElement, configVersion, state.isPaused]);

  // Schedule frame processing (only when not paused and no pending question)
  useEffect(() => {
    if (!isEnabled || !videoElement || !aiConfigStore.isConfigured() || state.isPaused) {
      return;
    }

    if (state.status === 'idle' || state.status === 'error' || state.status === 'connecting') {
      return;
    }

    if (state.status === 'capturing' || state.status === 'streaming') {
      return;
    }

    const timeSinceLastCapture = state.lastCaptureTime
      ? Date.now() - state.lastCaptureTime
      : Infinity;

    const delay = Math.max(0, MIN_INTERVAL_MS - timeSinceLastCapture);

    const timeoutId = setTimeout(() => {
      processFrame();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isEnabled, videoElement, state.status, state.lastCaptureTime, state.isPaused, processFrame]);

  // Cleanup on unmount or when disabled
  useEffect(() => {
    if (!isEnabled || state.isPaused) {
      abortControllerRef.current?.abort();
      isProcessingRef.current = false;
    }
  }, [isEnabled, state.isPaused]);

  // Request/release long idle based on AI activity status
  useEffect(() => {
    const isActiveStatus =
      state.status === 'waiting' ||
      state.status === 'capturing' ||
      state.status === 'streaming' ||
      state.status === 'complete';

    if (isActiveStatus) {
      requestLongIdle();
    } else {
      releaseLongIdle();
    }
  }, [state.status, requestLongIdle, releaseLongIdle]);

  // Release long idle on unmount
  useEffect(() => {
    return () => {
      releaseLongIdle();
    };
  }, [releaseLongIdle]);

  return {
    ...state,
    togglePause,
    askQuestion,
  };
}
