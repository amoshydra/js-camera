# AI Vision Feature

An experimental feature that uses AI to analyze camera frames in real-time, providing visual narration of what's happening.

## How It Works

AI Vision captures camera frames and sends them to an OpenAI-compatible API for analysis. The AI describes what's happening in the scene in natural language.

**Important:** Video frames are uploaded for processing approximately every 3 seconds. Each query consumes around ~1,000 input tokens for prompt processing and ~200 output tokens. Thinking mode is disabled by default.

Since this is an experimental feature, **using a small local vision model is recommended** to avoid excessive API costs.

## Setup

### 1. Enable AI Vision

1. Open Settings (gear icon)
2. Navigate to **Experimental** section
3. Toggle **AI Vision** to ON

### 2. Configure API Connection

AI Vision requires an OpenAI-compatible API endpoint.

#### API Endpoint

- Default: `http://localhost:11434/v1`
- Enter your API endpoint (must include `/v1` path)

#### API Key

- Optional for local models
- Required for cloud OpenAI-compatible APIs
- Click the eye icon to show/hide the key

#### Model

- After configuring the endpoint, click **Test** to fetch available models
- Select your preferred vision model from the dropdown
- **Recommended:** Use a small local vision model to keep costs low
- Supported models: Any vision model compatible with OpenAI's chat completions API (e.g., Gemma 3 and Qwen 3.5)

Find more models here: https://huggingface.co/models?pipeline_tag=image-text-to-text&apps=llama.cpp&sort=trending

#### Example:

##### llama-server

```bash
# Start a local OpenAI-compatible server:
llama-server -hf unsloth/Qwen3.5-9B-GGUF:Q4_K_M --port 11434 --host 0.0.0.0
```

##### Ollama

```bash
OLLAMA_HOST=0.0.0.0:11434 OLLAMA_ORIGINS="https://amoshydra.github.io" ollama server
```

```bash
ollama pull qwen3.5:9b
```

### 3. System Prompt

The system prompt instructs the AI how to describe the camera feed. A default prompt is provided, but you can customize it:

- Click **Edit** to modify the prompt
- Click **Reset** to restore the default
- The prompt should tell the AI to be conversational and describe what's happening in the current frame

### 4. Save Settings

Click **Save Settings** to persist your configuration.

## Advanced Parameters

Expand **Advanced Parameters** to fine-tune the AI response:

| Parameter              | Range   | Default | Description                             |
| ---------------------- | ------- | ------- | --------------------------------------- |
| **Temperature**        | 0-2     | 1.0     | Higher = more creative/random responses |
| **Top P**              | 0-1     | 0.95    | Nucleus sampling threshold              |
| **Top K**              | 0+      | 20      | Limits vocabulary to top K tokens       |
| **Min P**              | 0-1     | 0.0     | Minimum token probability threshold     |
| **Presence Penalty**   | -2 to 2 | 1.5     | Encourages topic diversity              |
| **Repetition Penalty** | 0-2     | 1.0     | Reduces repeated tokens                 |

## Usage

1. After enabling and configuring AI Vision, switch to **AI mode** using the mode toggle
2. Point your camera at objects or scenes
3. The AI will continuously analyze frames and provide descriptions
4. Click the pause button to pause/resume analysis
5. Use the topic selector to change what aspect the AI focuses on

## Troubleshooting

### Browser blocks connection to insecure endpoint

If you're accessing the app over HTTPS (e.g., `https://amoshydra.github.io/js-camera`) and your API server uses HTTP, modern browsers will block the connection due to mixed content restrictions.

**Solutions:**

- Serve your API over HTTPS
- Access the app via HTTP (not recommended for production)
- Configure your browser to allow mixed content for local development

### Connection shows as valid but no descriptions

- Ensure you're using a vision-capable model
- Check browser console for errors
- Try adjusting the system prompt
