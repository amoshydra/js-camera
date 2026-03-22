import { useState } from 'react';
import { css } from '~styled-system/css';
import { PauseIcon } from './icons/PauseIcon';
import { PinIcon } from './icons/PinIcon';
import { PlayIcon } from './icons/PlayIcon';
import TopicInput from './TopicInput';

interface AiHeaderProps {
  isPaused: boolean;
  isProcessing: boolean;
  topic?: string | null;
  onPauseToggle?: () => void;
  onSetTopic?: (topic: string | null) => void;
}

export default function AiHeader({
  isPaused,
  isProcessing,
  topic,
  onPauseToggle,
  onSetTopic,
}: AiHeaderProps) {
  const [editTopic, setEditTopic] = useState<string | null>(null);

  const handleEditTopic = (topicToEdit: string) => {
    setEditTopic(topicToEdit);
  };

  const handleSetTopic = (newTopic: string | null) => {
    onSetTopic?.(newTopic);
    setEditTopic(null);
  };

  return (
    <div
      className={css({
        px: 4,
        py: 2,
        pt: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          width: 'full',
        })}
      >
        <StatusBadge
          isProcessing={isProcessing}
          isPaused={isPaused}
        />
        <PauseButton
          isPaused={isPaused}
          onPauseToggle={onPauseToggle}
        />
      </div>
      <TopicInput
        topic={topic}
        editTopic={editTopic}
        onSetTopic={handleSetTopic}
      />
      {topic && (
        <TopicChip
          topic={topic}
          onEdit={handleEditTopic}
        />
      )}
    </div>
  );
}

function StatusBadge({ isProcessing, isPaused }: { isProcessing: boolean; isPaused: boolean }) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          fontWeight: 'semibold',
          color: 'zinc.300',
        })}
      >
        AI Vision
      </span>
      {isProcessing && (
        <span
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: 'xs',
            color: 'blue.400',
          })}
        >
          <span
            className={css({
              width: '6px',
              height: '6px',
              borderRadius: 'full',
              backgroundColor: 'blue.500',
              animation: 'pulse 1.5s ease-in-out infinite',
            })}
          />
          Analyzing...
        </span>
      )}
      {isPaused && !isProcessing && (
        <span
          className={css({
            fontSize: 'xs',
            color: 'zinc.400',
          })}
        >
          Paused
        </span>
      )}
    </div>
  );
}

function PauseButton({
  isPaused,
  onPauseToggle,
}: {
  isPaused: boolean;
  onPauseToggle?: () => void;
}) {
  return (
    <button
      className={css({
        padding: '6px',
        borderRadius: 'md',
        border: '1px solid',
        borderColor: 'zinc.700',
        backgroundColor: 'zinc.800',
        color: 'zinc.300',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          backgroundColor: 'zinc.700',
          color: 'white',
        },
      })}
      onClick={onPauseToggle}
      aria-label={isPaused ? 'Resume' : 'Pause'}
    >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </button>
  );
}

function TopicChip({ topic, onEdit }: { topic: string; onEdit: (topic: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onEdit(topic)}
      className={css({
        display: 'flex',
        alignItems: 'flex-start',
        textAlign: 'left',
        gap: 2,
        padding: '4px 8px',
        backgroundColor: 'blue.500',
        borderRadius: 'xl',
        fontSize: 'xs',
        color: 'white',
        width: 'fit-content',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': {
          backgroundColor: 'blue.400',
        },
        '& svg': {
          flexShrink: 0,
          marginTop: 1,
        },
      })}
    >
      <PinIcon />
      <span>{topic}</span>
    </button>
  );
}
