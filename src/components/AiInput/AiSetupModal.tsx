import { aiConfigStore, type AIConfig } from '@/lib/aiConfigStore';
import { OpenAIClient } from '@/lib/openaiClient';
import { useState } from 'react';
import { css, cx } from '~styled-system/css';
import Dialog from '../Dialog/Dialog';

interface AiSetupModalProps {
  open: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

export default function AiSetupModal({ open, onClose, onConfigured }: AiSetupModalProps) {
  const [apiEndpoint, setApiEndpoint] = useState(aiConfigStore.config.apiEndpoint);
  const [apiKey, setApiKey] = useState(aiConfigStore.config.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [defaultModel, setDefaultModel] = useState(aiConfigStore.config.defaultModel);
  const [availableModels, setAvailableModels] = useState<string[]>(
    aiConfigStore.config.availableModels,
  );
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchModels = async (endpoint: string, key: string) => {
    if (!endpoint.trim()) return;

    setIsFetchingModels(true);
    setTestResult(null);

    const tempConfig: AIConfig = {
      apiEndpoint: endpoint,
      apiKey: key,
      defaultModel: '',
      systemPrompt: '',
      availableModels: [],
      connectionValid: false,
      temperature: 1.0,
      topP: 0.95,
      topK: 20,
      minP: 0.0,
      presencePenalty: 1.5,
      repetitionPenalty: 1.0,
    };

    const client = new OpenAIClient(tempConfig);

    try {
      const models = await client.fetchModels();
      if (models.length > 0) {
        setAvailableModels(models);
        if (!models.includes(defaultModel)) {
          setDefaultModel(models[0]);
        }
        setTestResult('success');
      } else {
        setTestResult('error');
        setErrorMessage('No models found');
      }
    } catch (error) {
      setTestResult('error');
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleEndpointBlur = () => {
    if (apiEndpoint.trim()) {
      fetchModels(apiEndpoint, apiKey);
    }
  };

  const handleTestConnection = async () => {
    await fetchModels(apiEndpoint, apiKey);
  };

  const handleSave = () => {
    const config: AIConfig = {
      apiEndpoint,
      apiKey,
      defaultModel,
      systemPrompt: aiConfigStore.config.systemPrompt,
      availableModels,
      connectionValid: testResult === 'success',
      temperature: aiConfigStore.config.temperature,
      topP: aiConfigStore.config.topP,
      topK: aiConfigStore.config.topK,
      minP: aiConfigStore.config.minP,
      presencePenalty: aiConfigStore.config.presencePenalty,
      repetitionPenalty: aiConfigStore.config.repetitionPenalty,
    };
    aiConfigStore.store(config);
    onConfigured();
    onClose();
  };

  const isValid = apiEndpoint.trim() && defaultModel.trim() && testResult === 'success';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={cssDialog}
    >
      <div className={cssContent}>
        <h2 className={cssTitle}>Configure AI Vision</h2>
        <p className={cssDescription}>
          Connect to an OpenAI-compatible API to enable AI-powered vision analysis.
        </p>

        <div className={cssField}>
          <label className={cssLabel}>API Endpoint</label>
          <input
            type="url"
            className={cssInput}
            value={apiEndpoint}
            onChange={(e) => {
              setApiEndpoint(e.target.value);
              setTestResult(null);
            }}
            onBlur={handleEndpointBlur}
            placeholder="http://localhost:11434/v1"
          />
        </div>

        <div className={cssField}>
          <label className={cssLabel}>
            API Key
            <span className={cssOptional}>(optional for local LLMs)</span>
          </label>
          <div className={cssInputRow}>
            <input
              type={showApiKey ? 'text' : 'password'}
              className={cx(cssInput, cssFlex1)}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult(null);
              }}
              placeholder="sk-..."
            />
            <button
              type="button"
              className={cssIconButton}
              onClick={() => setShowApiKey((v) => !v)}
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
            >
              {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className={cssField}>
          <label className={cssLabel}>Model</label>
          <select
            className={cssSelect}
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value)}
          >
            {availableModels.map((model) => (
              <option
                key={model}
                value={model}
              >
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className={cssTestRow}>
          <button
            type="button"
            className={cssTestButton}
            onClick={handleTestConnection}
            disabled={isFetchingModels || !apiEndpoint.trim()}
          >
            {isFetchingModels ? 'Fetching...' : 'Test Connection'}
          </button>
          {testResult === 'success' && <span className={cssTestSuccess}>✓ Connected</span>}
          {testResult === 'error' && (
            <span className={cssTestError}>✗ {errorMessage || 'Failed'}</span>
          )}
        </div>

        <div className={cssWarning}>
          <span className={cssWarningIcon}>⚠️</span>
          <span>API key is stored locally in your browser.</span>
        </div>

        <div className={cssActions}>
          <button
            type="button"
            className={cssCancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={cssSaveButton}
            onClick={handleSave}
            disabled={!isValid}
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
}

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
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
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A1181.7 1 0 0 6.61 6.61" />
    <path d="M2 2l20 20" />
  </svg>
);

const cssDialog = css({
  maxWidth: '420px',
  width: '100%',
  borderRadius: 'lg',
  padding: '0',
  backgroundColor: 'zinc.900',
  color: 'white',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: '0',
});

const cssContent = css({
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const cssTitle = css({
  fontSize: 'xl',
  fontWeight: 'semibold',
  margin: 0,
});

const cssDescription = css({
  fontSize: 'sm',
  color: 'zinc.400',
  margin: 0,
});

const cssField = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const cssLabel = css({
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'zinc.300',
});

const cssOptional = css({
  fontSize: 'xs',
  color: 'zinc.500',
  marginLeft: '4px',
});

const cssInput = css({
  padding: '10px 12px',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'zinc.700',
  backgroundColor: 'zinc.800',
  color: 'white',
  fontSize: 'sm',
  '&:focus': {
    outline: 'none',
    borderColor: 'blue.500',
  },
  '&::placeholder': {
    color: 'zinc.500',
  },
});

const cssInputRow = css({
  display: 'flex',
  gap: '8px',
});

const cssFlex1 = css({
  flex: 1,
});

const cssIconButton = css({
  padding: '8px',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'zinc.700',
  backgroundColor: 'zinc.800',
  color: 'zinc.400',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    color: 'white',
    backgroundColor: 'zinc.700',
  },
});

const cssSelect = css({
  padding: '10px 12px',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'zinc.700',
  backgroundColor: 'zinc.800',
  color: 'white',
  fontSize: 'sm',
  cursor: 'pointer',
  '&:focus': {
    outline: 'none',
    borderColor: 'blue.500',
  },
});

const cssTestRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const cssTestButton = css({
  padding: '8px 16px',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'zinc.600',
  backgroundColor: 'zinc.800',
  color: 'zinc.300',
  fontSize: 'sm',
  cursor: 'pointer',
  '&:hover:not(:disabled)': {
    backgroundColor: 'zinc.700',
    color: 'white',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const cssTestSuccess = css({
  fontSize: 'sm',
  color: 'green.400',
});

const cssTestError = css({
  fontSize: 'sm',
  color: 'red.400',
});

const cssWarning = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '12px',
  borderRadius: 'md',
  backgroundColor: 'amber.900/20',
  border: '1px solid',
  borderColor: 'amber.700/50',
  fontSize: 'xs',
  color: 'amber.200',
});

const cssWarningIcon = css({
  flexShrink: 0,
});

const cssActions = css({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '8px',
});

const cssCancelButton = css({
  padding: '10px 20px',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'zinc.600',
  backgroundColor: 'transparent',
  color: 'zinc.300',
  fontSize: 'sm',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'zinc.800',
    color: 'white',
  },
});

const cssSaveButton = css({
  padding: '10px 20px',
  borderRadius: 'md',
  border: 'none',
  backgroundColor: 'blue.500',
  color: 'white',
  fontSize: 'sm',
  fontWeight: 'medium',
  cursor: 'pointer',
  '&:hover:not(:disabled)': {
    backgroundColor: 'blue.400',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
