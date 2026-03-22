import { useEffect, useState } from 'react';
import { css } from '~styled-system/css';

interface TopicInputProps {
  topic: string | null | undefined;
  editTopic?: string | null;
  onSetTopic?: (topic: string | null) => void;
}

export default function TopicInput({ topic, editTopic, onSetTopic }: TopicInputProps) {
  const [topicInput, setTopicInput] = useState('');

  useEffect(() => {
    if (editTopic) {
      setTopicInput(editTopic);
    }
  }, [editTopic]);

  const handleSubmitTopic = () => {
    if (topicInput.trim() && onSetTopic) {
      onSetTopic(topicInput.trim());
      setTopicInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitTopic();
    }
  };

  return (
    <div
      className={css({
        display: 'flex',
        gap: 2,
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
      })}
    >
      <input
        type="text"
        className={css({
          flex: 1,
          padding: '8px 12px',
          fontSize: 'sm',
          backgroundColor: 'zinc.800',
          border: '1px solid',
          borderColor: 'zinc.700',
          borderRadius: 'md',
          color: 'white',
          '&:focus': {
            outline: 'none',
            borderColor: 'blue.500',
          },
          '&::placeholder': {
            color: 'zinc.500',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        })}
        placeholder={topic ? 'Update topic...' : 'Set a topic to focus...'}
        value={topicInput}
        onChange={(e) => setTopicInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className={css({
          padding: '8px 16px',
          fontSize: 'sm',
          backgroundColor: 'blue.500',
          border: 'none',
          borderRadius: 'md',
          color: 'white',
          cursor: 'pointer',
          '&:hover:not(:disabled)': {
            backgroundColor: 'blue.400',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        })}
        onClick={handleSubmitTopic}
        disabled={!topicInput.trim()}
      >
        {topic ? 'Update' : 'Set'}
      </button>
      {topic && (
        <button
          className={css({
            padding: '8px 12px',
            fontSize: 'sm',
            backgroundColor: 'zinc.700',
            border: 'none',
            borderRadius: 'md',
            color: 'zinc.300',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'zinc.600',
              color: 'white',
            },
          })}
          onClick={() => onSetTopic?.(null)}
        >
          Clear
        </button>
      )}
    </div>
  );
}
