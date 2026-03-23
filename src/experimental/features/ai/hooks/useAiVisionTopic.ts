import { useAiVision, type AiVisionState, type UseAiVisionOptions } from './useAiVision';
import { isObjectSearchTopic, FOUND_INSTRUCTION, HIGHLIGHT_INSTRUCTION } from '../lib/topicModes';
import { useCallback, useState } from 'react';

export type { AiStatus, AiMessage, AiVisionState } from './useAiVision';

export interface AiVisionTopicState extends AiVisionState {
  topic: string | null;
  shareHistory: boolean;
  found: boolean;
}

function getTopicPrompt(topic: string, hasPrevious: boolean): string {
  const foundInstruction = isObjectSearchTopic(topic)
    ? `\n\n${FOUND_INSTRUCTION}\n\n${HIGHLIGHT_INSTRUCTION}`
    : '';

  if (hasPrevious) {
    return `Focus topic: "${topic}"${foundInstruction}

Current frame (second image): Analyze for topic relevance.
Previous frame (first image): Context only.

If current frame relates to the topic → describe relevant details.
If not related → briefly describe what you see instead.`;
  }
  return `Focus topic: "${topic}"${foundInstruction}

Analyze this image for anything related to the topic.
If relevant → provide details. If not → briefly note what's visible instead.`;
}

export function useAiVisionTopic(
  videoElement: HTMLVideoElement | null,
  isEnabled: boolean,
): AiVisionTopicState & {
  setTopic: (topic: string | null) => void;
  togglePause: () => void;
  toggleShareHistory: () => void;
} {
  const [topic, setTopicState] = useState<string | null>(null);

  const promptModifier = useCallback<NonNullable<UseAiVisionOptions['promptModifier']>>(
    (basePrompt, context) => {
      if (!topic) {
        return basePrompt;
      }
      return getTopicPrompt(topic, context.hasPrevious);
    },
    [topic],
  );

  const core = useAiVision(videoElement, isEnabled, { promptModifier });

  const setTopic = useCallback((newTopic: string | null) => {
    setTopicState(newTopic?.trim() || null);
  }, []);

  return {
    ...core,
    topic,
    setTopic,
    toggleShareHistory: core.toggleShareHistory,
  };
}
