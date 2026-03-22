import { aiConfigStore, type AIConfig } from './aiConfigStore';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ChatContent[];
}

export interface ChatContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

export interface ModelInfo {
  id: string;
  owned_by?: string;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/\/+$/, '');
}

export class OpenAIClient {
  private config: AIConfig;

  constructor(config: AIConfig = aiConfigStore.config) {
    this.config = config;
  }

  updateConfig(config: AIConfig): void {
    this.config = config;
  }

  async fetchModels(): Promise<string[]> {
    const endpoint = normalizeEndpoint(this.config.apiEndpoint);
    const response = await fetch(`${endpoint}/models`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch models: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const models: string[] =
      (data.data || data.models || [])
        ?.map((model: ModelInfo | string) => (typeof model === 'string' ? model : model.id))
        ?.sort() || [];

    return models;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.fetchModels();
      return true;
    } catch {
      return false;
    }
  }

  async sendMessage(image: string, userPrompt: string, callbacks: StreamCallbacks): Promise<void> {
    const endpoint = normalizeEndpoint(this.config.apiEndpoint);
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: this.config.systemPrompt,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userPrompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`,
            },
          },
        ],
      },
    ];

    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.config.defaultModel,
        messages,
        stream: true,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      callbacks.onError(new Error(`API error: ${response.status} ${errorText}`));
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError(new Error('No response body'));
      return;
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
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
              callbacks.onToken(content);
            }
          } catch {
            // Skip unparseable lines
          }
        }
      }

      callbacks.onComplete(fullResponse);
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async sendMessageOnce(image: string, userPrompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let fullResponse = '';

      this.sendMessage(image, userPrompt, {
        onToken: (token) => {
          fullResponse += token;
        },
        onComplete: () => {
          resolve(fullResponse);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }
}

export const openaiClient = new OpenAIClient();
