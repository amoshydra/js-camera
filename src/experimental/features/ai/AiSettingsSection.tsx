import { useState } from 'react';
import { css } from '~styled-system/css';
import { aiConfigStore, getDefaultAIConfig, type AIConfig } from './lib/aiConfigStore';
import { OpenAIClient } from './lib/openaiClient';

export default function AiSettingsSection() {
  const [config, setConfig] = useState<AIConfig>(() => aiConfigStore.load());
  const [showApiKey, setShowApiKey] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const fetchModels = async (endpoint: string, key: string) => {
    if (!endpoint.trim()) return;

    setIsFetchingModels(true);
    setTestResult(null);

    const tempConfig: AIConfig = {
      apiEndpoint: endpoint,
      apiKey: key,
      defaultModel: config.defaultModel,
      systemPrompt: config.systemPrompt,
      availableModels: [],
      connectionValid: false,
      temperature: config.temperature,
      topP: config.topP,
      topK: config.topK,
      minP: config.minP,
      presencePenalty: config.presencePenalty,
      repetitionPenalty: config.repetitionPenalty,
    };

    const client = new OpenAIClient(tempConfig);

    try {
      const models = await client.fetchModels();
      setConfig((prev) => ({
        ...prev,
        availableModels: models,
        defaultModel: models.includes(prev.defaultModel) ? prev.defaultModel : models[0] || '',
        connectionValid: true,
      }));
      setTestResult('success');
    } catch {
      setTestResult('error');
      setConfig((prev) => ({
        ...prev,
        connectionValid: false,
      }));
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleApiEndpointBlur = () => {
    if (config.apiEndpoint.trim()) {
      fetchModels(config.apiEndpoint, config.apiKey);
    }
  };

  const handleApiEndpointChange = (value: string) => {
    setConfig((prev) => ({ ...prev, apiEndpoint: value, connectionValid: false }));
    setTestResult(null);
  };

  const handleApiKeyChange = (value: string) => {
    setConfig((prev) => ({ ...prev, apiKey: value, connectionValid: false }));
    setTestResult(null);
  };

  const handleModelChange = (value: string) => {
    setConfig((prev) => ({ ...prev, defaultModel: value }));
  };

  const handleSystemPromptChange = (value: string) => {
    setConfig((prev) => ({ ...prev, systemPrompt: value }));
  };

  const handleTemperatureChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setConfig((prev) => ({ ...prev, temperature: Math.max(0, Math.min(2, num)) }));
    }
  };

  const handleTopPChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setConfig((prev) => ({ ...prev, topP: Math.max(0, Math.min(1, num)) }));
    }
  };

  const handleTopKChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setConfig((prev) => ({ ...prev, topK: Math.max(0, num) }));
    }
  };

  const handleMinPChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setConfig((prev) => ({ ...prev, minP: Math.max(0, Math.min(1, num)) }));
    }
  };

  const handlePresencePenaltyChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setConfig((prev) => ({ ...prev, presencePenalty: Math.max(-2, Math.min(2, num)) }));
    }
  };

  const handleRepetitionPenaltyChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setConfig((prev) => ({ ...prev, repetitionPenalty: Math.max(0, Math.min(2, num)) }));
    }
  };

  const handleTestConnection = async () => {
    await fetchModels(config.apiEndpoint, config.apiKey);
  };

  const handleSave = () => {
    aiConfigStore.store(config);
  };

  const handleResetPrompt = () => {
    const { systemPrompt } = getDefaultAIConfig();
    setConfig((prev) => ({ ...prev, systemPrompt }));
  };

  return (
    <section className={cssSection}>
      <h4 className={cssSectionTitle}>AI Vision</h4>

      <div className={cssFieldGroup}>
        <span className={cssLabel}>API Endpoint</span>
        <input
          type="url"
          className={cssInput}
          value={config.apiEndpoint}
          onChange={(e) => handleApiEndpointChange(e.target.value)}
          onBlur={handleApiEndpointBlur}
          placeholder="http://localhost:11434/v1"
        />
      </div>

      <div className={cssFieldGroup}>
        <span className={cssLabel}>
          API Key
          <span className={cssOptional}>(optional for local)</span>
        </span>
        <div className={cssInputRow}>
          <input
            type={showApiKey ? 'text' : 'password'}
            className={cssInput}
            style={{ flex: 1 }}
            value={config.apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="sk-..."
          />
          <button
            type="button"
            className={cssIconButton}
            onClick={() => setShowApiKey((v) => !v)}
            aria-label={showApiKey ? 'Hide' : 'Show'}
          >
            {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className={cssFieldGroup}>
        <span className={cssLabel}>Model</span>
        <select
          className={cssInput}
          value={config.defaultModel}
          onChange={(e) => handleModelChange(e.target.value)}
        >
          {config.availableModels.map((model) => (
            <option
              key={model}
              value={model}
            >
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className={cssPromptGroup}>
        <div className={cssPromptHeader}>
          <span className={cssLabel}>System Prompt</span>
          <div className={cssPromptActions}>
            <button
              type="button"
              className={cssTextButton}
              onClick={handleResetPrompt}
            >
              Reset
            </button>
            <button
              type="button"
              className={cssTextButton}
              onClick={() => setIsEditingPrompt((v) => !v)}
            >
              {isEditingPrompt ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>
        {isEditingPrompt ? (
          <textarea
            className={cssTextarea}
            value={config.systemPrompt}
            onChange={(e) => handleSystemPromptChange(e.target.value)}
            rows={6}
          />
        ) : (
          <p className={cssPromptPreview}>{config.systemPrompt.slice(0, 100)}...</p>
        )}
      </div>

      <details className={cssDetails}>
        <summary className={cssSummary}>Advanced Parameters</summary>
        <div className={cssParamsGrid}>
          <div className={cssFieldGroup}>
            <span className={cssLabel}>Temperature</span>
            <input
              type="number"
              className={cssInputSmall}
              value={config.temperature}
              onChange={(e) => handleTemperatureChange(e.target.value)}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
          <div className={cssFieldGroup}>
            <span className={cssLabel}>Top P</span>
            <input
              type="number"
              className={cssInputSmall}
              value={config.topP}
              onChange={(e) => handleTopPChange(e.target.value)}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
          <div className={cssFieldGroup}>
            <span className={cssLabel}>Top K</span>
            <input
              type="number"
              className={cssInputSmall}
              value={config.topK}
              onChange={(e) => handleTopKChange(e.target.value)}
              min={0}
              step={1}
            />
          </div>
          <div className={cssFieldGroup}>
            <span className={cssLabel}>Min P</span>
            <input
              type="number"
              className={cssInputSmall}
              value={config.minP}
              onChange={(e) => handleMinPChange(e.target.value)}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
          <div className={cssFieldGroup}>
            <span className={cssLabel}>Presence Penalty</span>
            <input
              type="number"
              className={cssInputSmall}
              value={config.presencePenalty}
              onChange={(e) => handlePresencePenaltyChange(e.target.value)}
              min={-2}
              max={2}
              step={0.1}
            />
          </div>
          <div className={cssFieldGroup}>
            <span className={cssLabel}>Repetition Penalty</span>
            <input
              type="number"
              className={cssInputSmall}
              value={config.repetitionPenalty}
              onChange={(e) => handleRepetitionPenaltyChange(e.target.value)}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </details>

      <div className={cssActionsRow}>
        <button
          type="button"
          className={cssButton}
          onClick={handleTestConnection}
          disabled={isFetchingModels || !config.apiEndpoint.trim()}
        >
          {isFetchingModels ? 'Fetching...' : 'Test'}
        </button>
        {testResult === 'success' && <span className={cssTestSuccess}>✓ Connected</span>}
        {testResult === 'error' && <span className={cssTestError}>✗ Failed</span>}
      </div>

      <div className={cssFieldGroup}>
        <span className={cssLabel} />
        <button
          type="button"
          className={cssSaveButton}
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </section>
  );
}

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle
      cx="12"
      cy="12"
      r="3"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A1181.7 1181.7 0 0 0 3.34 9c.63 1.1 1.5 2.15 2.57 3.09" />
    <path d="M2 2l20 20" />
  </svg>
);

const cssSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const cssSectionTitle = css({
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'rgba(255, 255, 255, 0.5)',
  margin: 0,
});

const cssFieldGroup = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
});

const cssLabel = css({
  fontSize: '0.875rem',
  color: 'rgba(255, 255, 255, 0.9)',
});

const cssOptional = css({
  fontSize: '0.7rem',
  color: 'rgba(255, 255, 255, 0.4)',
  marginLeft: '0.25rem',
});

const cssInput = css({
  minWidth: '0',
  maxWidth: '100%',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '6px',
  color: 'white',
  '&:focus': {
    outline: 'none',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '&::placeholder': {
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

const cssInputRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const cssIconButton = css({
  padding: '0.4rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '6px',
  color: 'rgba(255, 255, 255, 0.7)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const cssPromptGroup = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const cssPromptHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const cssPromptActions = css({
  display: 'flex',
  gap: '0.5rem',
});

const cssTextButton = css({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.5)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: 'white',
  },
});

const cssTextarea = css({
  width: '100%',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '6px',
  color: 'white',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});

const cssPromptPreview = css({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.6)',
  margin: 0,
  lineHeight: '1.4',
});

const cssActionsRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

const cssButton = css({
  padding: '0.4rem 0.75rem',
  fontSize: '0.875rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  '&:hover:not(:disabled)': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const cssTestSuccess = css({
  fontSize: '0.75rem',
  color: '#4ade80',
});

const cssTestError = css({
  fontSize: '0.75rem',
  color: '#f87171',
});

const cssSaveButton = css({
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  backgroundColor: '#3b82f6',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#2563eb',
  },
});

const cssDetails = css({
  marginTop: '0.5rem',
});

const cssSummary = css({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  '&:hover': {
    color: 'white',
  },
});

const cssParamsGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.5rem',
  marginTop: '0.75rem',
});

const cssInputSmall = css({
  width: '80px',
  padding: '0.25rem 0.5rem',
  fontSize: '0.875rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '4px',
  color: 'white',
  '&:focus': {
    outline: 'none',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});
