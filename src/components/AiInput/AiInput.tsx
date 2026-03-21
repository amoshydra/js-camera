import { useEffect, useState } from 'react';
import { css, cx } from '~styled-system/css';
import { aiConfigStore } from '@/lib/aiConfigStore';
import AiSetupModal from './AiSetupModal';

interface AiInputProps {
  videoElement: HTMLVideoElement | null;
  disabled?: boolean;
  onResponse?: (text: string, isStreaming: boolean) => void;
  onError?: (error: Error) => void;
  onCapture?: () => void;
  className?: string;
}

export default function AiInput({
  videoElement,
  disabled = false,
  onResponse,
  onError,
  onCapture,
  className,
}: AiInputProps) {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isConfigured, setIsConfigured] = useState(aiConfigStore.isConfigured());

  useEffect(() => {
    if (!isConfigured && !disabled) {
      setShowSetupModal(true);
    }
  }, [isConfigured, disabled]);

  useEffect(() => {
    if (!videoElement || !isConfigured || disabled) {
      return;
    }

    const checkConfig = () => {
      setIsConfigured(aiConfigStore.isConfigured());
    };

    window.addEventListener('storage', checkConfig);
    return () => window.removeEventListener('storage', checkConfig);
  }, [videoElement, isConfigured, disabled]);

  useEffect(() => {
    if (!videoElement || !isConfigured || disabled) {
      return;
    }

    let isProcessing = false;
    let isAborted = false;

    const captureAndSend = async () => {
      if (isProcessing || isAborted) return;

      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        return;
      }

      isProcessing = true;
      onCapture?.();

      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1280 / videoElement.videoWidth);
      canvas.width = Math.round(videoElement.videoWidth * scale);
      canvas.height = Math.round(videoElement.videoHeight * scale);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        isProcessing = false;
        return;
      }

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

      const config = aiConfigStore.config;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (config.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      const userPrompt =
        "Describe what you see in this image. If this is similar to what you saw before, focus on what's new or different. Be concise.";

      const messages = [
        { role: 'system', content: config.systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ];

      try {
        const response = await fetch(`${config.apiEndpoint}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: config.defaultModel,
            messages,
            stream: true,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} ${errorText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let fullResponse = '';

        onCapture?.();

        while (!isAborted) {
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
                onResponse?.(fullResponse, true);
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }

        onResponse?.(fullResponse, false);
      } catch (error) {
        if (!isAborted) {
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      } finally {
        isProcessing = false;
      }
    };

    const interval = setInterval(captureAndSend, 3000);

    return () => {
      isAborted = true;
      clearInterval(interval);
    };
  }, [videoElement, isConfigured, disabled, onCapture, onResponse, onError]);

  if (!isConfigured) {
    return null;
  }

  return (
    <div className={cx(cssOverlay, className)}>
      <AiSetupModal
        open={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onConfigured={() => setIsConfigured(true)}
      />
    </div>
  );
}

const cssOverlay = css({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
});
