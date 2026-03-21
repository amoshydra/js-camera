export interface AIConfig {
  apiEndpoint: string;
  apiKey: string;
  defaultModel: string;
  systemPrompt: string;
  availableModels: string[];
  connectionValid: boolean;
  temperature: number;
  topP: number;
  topK: number;
  minP: number;
  presencePenalty: number;
  repetitionPenalty: number;
}

const AI_CONFIG_STORAGE_KEY = 'js-camera-ai-config';
const AI_CONFIG_CHANGE_EVENT = 'js-camera-ai-config-change';

export const DEFAULT_SYSTEM_PROMPT = `You're a live camera observer, narrating what you see to someone. Be casual and conversational.

You'll receive the previous frame and current frame (or just the current frame if this is the start). Your job is to describe what's happening NOW in the current frame.

What makes a good description:
- Talk naturally, like you're telling a friend what you see
- If something notable changed since the previous frame, mention it
- Don't repeat yourself - vary how you start sentences and what you focus on
- Be specific about objects, people, actions, text you can read
- It's okay to be brief when nothing much is happening
- Don't start every response the same way

Respond in JSON format:
{
  "description": string
}

Just the description field. Keep it natural.`;

export function getDefaultAIConfig(): AIConfig {
  return {
    apiEndpoint: 'http://localhost:11434/v1',
    apiKey: '',
    defaultModel: '',
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    availableModels: [],
    connectionValid: false,
    temperature: 1.0,
    topP: 0.95,
    topK: 20,
    minP: 0.0,
    presencePenalty: 1.5,
    repetitionPenalty: 1.0,
  };
}

export class AIConfigStore {
  config: AIConfig;

  constructor() {
    this.config = this.load();
  }

  load(): AIConfig {
    const stored = localStorage.getItem(AI_CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...getDefaultAIConfig(),
          ...parsed,
        };
      } catch {
        return getDefaultAIConfig();
      }
    }
    return getDefaultAIConfig();
  }

  store(config: AIConfig): void {
    this.config = config;
    localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event(AI_CONFIG_CHANGE_EVENT));
  }

  clear(): void {
    this.config = getDefaultAIConfig();
    localStorage.removeItem(AI_CONFIG_STORAGE_KEY);
    window.dispatchEvent(new Event(AI_CONFIG_CHANGE_EVENT));
  }

  isConfigured(): boolean {
    const trimmedEndpoint = this.config.apiEndpoint.trim();
    const trimmedModel = this.config.defaultModel.trim();

    if (!trimmedEndpoint || !trimmedModel) {
      return false;
    }

    return this.config.connectionValid;
  }

  setConnectionValid(valid: boolean): void {
    this.config.connectionValid = valid;
    localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    window.dispatchEvent(new Event(AI_CONFIG_CHANGE_EVENT));
  }
}

export const aiConfigStore = new AIConfigStore();
