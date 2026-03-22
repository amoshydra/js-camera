import { css } from '~styled-system/css';
import { PauseIcon } from './icons/PauseIcon';
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
  return (
    <>
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          width: 'full',
          px: 4,
          py: 2,
          pt: 0,
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
        onSetTopic={onSetTopic}
      />
      {topic && <TopicChip topic={topic} />}
    </>
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

function TopicChip({ topic }: { topic: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '4px 8px',
        backgroundColor: 'blue.500',
        borderRadius: 'full',
        fontSize: 'xs',
        color: 'white',
        margin: '0 8px 8px 8px',
        width: 'fit-content',
      })}
    >
      <span>📌</span>
      <span>{topic}</span>
    </div>
  );
}
