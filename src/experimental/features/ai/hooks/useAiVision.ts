import { aiConfigStore, DEFAULT_SYSTEM_PROMPT } from '../lib/aiConfigStore';
import { aiMemoryStore } from '../lib/aiMemoryStore';
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
  shareHistory: boolean;
  found: boolean;
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
const FOUND_PATTERN = /\[FOUND\]/i;

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
): AiVisionState & {
  togglePause: () => void;
  toggleShareHistory: () => void;
  askQuestion: (question: string) => void;
} {
  const [state, setState] = useState<AiVisionState>({
    status: 'idle',
    streamingText: '',
    lastCompleteText: null,
    lastCaptureTime: null,
    lastError: null,
    isPaused: false,
    messages: [],
    shareHistory: true,
    found: false,
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

  const toggleShareHistory = useCallback(() => {
    setState((prev) => ({ ...prev, shareHistory: !prev.shareHistory }));
  }, []);

  const foundRef = useRef(false);

  const sendMessage = useCallback(
    async (
      currentFrameDataUrl: string,
      previousFrameDataUrl: string | null,
      previousDescription: string | null,
      userPrompt: string,
      isQuestion: boolean,
      shareHistory: boolean,
    ) => {
      if (!aiConfigStore.isConfigured()) {
        return;
      }

      const requestId = ++currentRequestIdRef.current;
      abortControllerRef.current = new AbortController();
      foundRef.current = false;

      setState((prev) => ({
        ...prev,
        status: 'streaming',
        streamingText: '',
        lastCaptureTime: Date.now(),
        lastError: null,
        found: false,
      }));

      try {
        const config = aiConfigStore.config;
        const endpoint = normalizeEndpoint(config.apiEndpoint);

        const resizedCurrent = resizeDataUrl(currentFrameDataUrl, 960);
        const resizedPrevious = previousFrameDataUrl
          ? resizeDataUrl(previousFrameDataUrl, 480)
          : null;

        type MessageContent =
          | { type: 'text'; text: string }
          | { type: 'image_url'; image_url: { url: string } };

        let systemContent = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;

        const memories = shareHistory ? aiMemoryStore.recall() : [];
        let memoryInstruction = '';

        const userAskedToRemember = isQuestion && /remember|save|memorize/i.test(userPrompt);

        if (shareHistory && userAskedToRemember) {
          const memoryList =
            memories.length > 0
              ? memories.map((m) => `[${m.id}] ${m.content}`).join('\n')
              : 'No memories saved yet.';
          memoryInstruction = `\n\nPrevious memories:\n${memoryList}\n\nIMPORTANT: The user explicitly asked you to remember something from this image. Store it using:\n- memory_action: "remember"\n- memory_content: "exactly what the user wants you to remember"\n\nIf the user asked to forget/remove something:\n- memory_action: "remove"\n- memory_id: "the memory ID to remove"\n\nOnly use memory_action if the user explicitly asked.`;
        } else if (shareHistory && memories.length > 0) {
          const memoryList = memories.map((m) => `[${m.id}] ${m.content}`).join('\n');
          memoryInstruction = `\n\nPrevious memories:\n${memoryList}\n\nWhen you notice something worth remembering, include:\n- memory_action: "remember"\n- memory_content: "concise fact to remember"\n\nWhen you want to remove a memory, include:\n- memory_action: "remove"\n- memory_id: "the memory ID to remove"\n\nOtherwise, do not include memory_action in your response.`;
        } else if (shareHistory) {
          memoryInstruction = `\n\nWhen you notice something worth remembering, include:\n- memory_action: "remember"\n- memory_content: "concise fact to remember"\n\nWhen you want to remove a memory, include:\n- memory_action: "remove"\n- memory_id: "the memory ID to remove"\n\nOtherwise, do not include memory_action in your response.`;
        }

        if (memoryInstruction) {
          systemContent = systemContent + memoryInstruction;
        }

        const messages: Array<{
          role: 'system' | 'user' | 'assistant' | 'tool';
          content: string | MessageContent[];
          tool_call_id?: string;
        }> = [{ role: 'system', content: systemContent }];

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

        const requestBody: Record<string, unknown> = {
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
        };

        if (shareHistory) {
          requestBody.response_format = {
            type: 'json_schema',
            json_schema: {
              name: 'vision_response',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  memory_action: {
                    type: 'string',
                    enum: ['remember', 'remove', 'none'],
                  },
                  memory_content: { type: 'string' },
                  memory_id: { type: 'string' },
                },
                required: ['description'],
                additionalProperties: false,
              },
            },
          };
        } else {
          requestBody.response_format = {
            type: 'json_schema',
            json_schema: {
              name: 'vision_response',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                },
                required: ['description'],
                additionalProperties: false,
              },
            },
          };
        }

        const response = await fetch(`${endpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
          },
          body: JSON.stringify(requestBody),
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
                if (!foundRef.current && FOUND_PATTERN.test(fullResponse)) {
                  foundRef.current = true;
                  navigator.vibrate([100, 50, 100]);
                  setState((prev) => ({ ...prev, found: true }));
                }
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

        let memoryAction: string | null = null;
        let memoryContent: string | null = null;
        let memoryId: string | null = null;
        let textContent = fullResponse;

        try {
          const parsedResponse = JSON.parse(fullResponse);
          textContent = parsedResponse.description || '';

          if (shareHistory) {
            memoryAction = parsedResponse.memory_action || null;
            memoryContent = parsedResponse.memory_content || null;
            memoryId = parsedResponse.memory_id || null;

            if (memoryAction === 'remember' && memoryContent) {
              aiMemoryStore.remember(memoryContent);
            } else if (memoryAction === 'remove' && memoryId) {
              aiMemoryStore.forget(memoryId);
            }
          }
        } catch {
          // If JSON parsing fails, use fullResponse as text
          textContent = fullResponse;
        }

        if (!isQuestion && !foundRef.current && FOUND_PATTERN.test(textContent)) {
          foundRef.current = true;
          navigator.vibrate([100, 50, 100]);
          setState((prev) => ({ ...prev, found: true }));
        }

        if (!isQuestion) {
          previousFrameRef.current = currentFrameDataUrl;
          previousDescriptionRef.current = textContent;
        }

        setState((prev) => {
          const newMessages: AiMessage[] = [
            ...prev.messages,
            { role: 'assistant' as const, content: textContent, timestamp: Date.now() },
          ].slice(-MAX_MESSAGES);

          return {
            ...prev,
            status: 'complete',
            lastCompleteText: textContent,
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
      state.shareHistory,
    );
  }, [videoElement, isEnabled, sendMessage, state.shareHistory]);

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
          state.shareHistory,
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
    [videoElement, sendMessage, state.shareHistory],
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
    toggleShareHistory,
    askQuestion,
  };
}
