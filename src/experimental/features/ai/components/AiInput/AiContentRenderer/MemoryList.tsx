import { useState } from 'react';
import { css } from '~styled-system/css';
import { aiMemoryStore } from '../../../lib/aiMemoryStore';

interface MemoryListProps {
  onClose: () => void;
  onDisableMemory: () => void;
}

export default function MemoryList({ onClose, onDisableMemory }: MemoryListProps) {
  const [memories, setMemories] = useState(() => aiMemoryStore.recall());

  const handleRemove = (id: string) => {
    aiMemoryStore.forget(id);
    setMemories(aiMemoryStore.recall());
  };

  const handleClearAll = () => {
    aiMemoryStore.clear();
    setMemories([]);
  };

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          py: 3,
          borderBottom: '1px solid',
          borderColor: 'zinc.700',
        })}
      >
        <span
          className={css({
            fontSize: 'sm',
            fontWeight: 'semibold',
            color: 'zinc.200',
          })}
        >
          Memories ({memories.length})
        </span>
        <div
          className={css({
            display: 'flex',
            gap: 2,
          })}
        >
          <button
            onClick={onDisableMemory}
            className={css({
              padding: '4px 8px',
              fontSize: 'xs',
              borderRadius: 'md',
              border: '1px solid',
              borderColor: 'zinc.600',
              backgroundColor: 'transparent',
              color: 'zinc.400',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'zinc.700',
                color: 'zinc.200',
              },
            })}
          >
            Disable Memory
          </button>
          {memories.length > 0 && (
            <button
              onClick={handleClearAll}
              className={css({
                padding: '4px 8px',
                fontSize: 'xs',
                borderRadius: 'md',
                border: '1px solid',
                borderColor: 'red.700',
                backgroundColor: 'transparent',
                color: 'red.400',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'red.900',
                  color: 'red.200',
                },
              })}
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className={css({
              padding: '4px 8px',
              fontSize: 'xs',
              borderRadius: 'md',
              border: '1px solid',
              borderColor: 'zinc.600',
              backgroundColor: 'zinc.700',
              color: 'zinc.200',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'zinc.600',
                color: 'white',
              },
            })}
          >
            Done
          </button>
        </div>
      </div>

      <div
        className={css({
          flex: 1,
          overflow: 'auto',
          p: 3,
        })}
      >
        {memories.length === 0 ? (
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'full',
              color: 'zinc.500',
              fontSize: 'sm',
              textAlign: 'center',
              gap: 2,
            })}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z" />
              <circle
                cx="12"
                cy="10"
                r="3"
              />
            </svg>
            <span>No memories saved yet</span>
            <span
              className={css({
                fontSize: 'xs',
                color: 'zinc.600',
                maxWidth: '200px',
              })}
            >
              Ask the AI to remember something, or enable history to let it proactively remember.
            </span>
          </div>
        ) : (
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            })}
          >
            {memories.map((memory) => (
              <div
                key={memory.id}
                className={css({
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 3,
                  backgroundColor: 'zinc.800',
                  borderRadius: 'md',
                  border: '1px solid',
                  borderColor: 'zinc.700',
                })}
              >
                <span
                  className={css({
                    fontSize: 'xs',
                    fontWeight: 'medium',
                    color: 'blue.400',
                    minWidth: '24px',
                  })}
                >
                  {memory.id}
                </span>
                <span
                  className={css({
                    flex: 1,
                    fontSize: 'sm',
                    color: 'zinc.200',
                    wordBreak: 'break-word',
                  })}
                >
                  {memory.content}
                </span>
                <button
                  onClick={() => handleRemove(memory.id)}
                  className={css({
                    padding: '4px',
                    borderRadius: 'sm',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'zinc.500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: 'zinc.700',
                      color: 'red.400',
                    },
                  })}
                  aria-label={`Remove memory ${memory.id}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line
                      x1="18"
                      y1="6"
                      x2="6"
                      y2="18"
                    />
                    <line
                      x1="6"
                      y1="6"
                      x2="18"
                      y2="18"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
