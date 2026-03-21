import type { AiVisionState } from '@/hooks/useAiVision';
import { BottomSheet } from 'pure-web-bottom-sheet/react';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { css, cx } from '~styled-system/css';

interface AiContentRendererProps {
  state: AiVisionState;
  onRetry?: () => void;
  onOpenSettings?: () => void;
  onPauseToggle?: () => void;
  onAskQuestion?: (question: string) => void;
  className?: string;
}

export default function AiContentRenderer({
  state,
  onRetry,
  onOpenSettings,
  onPauseToggle,
  onAskQuestion,
  className,
}: AiContentRendererProps) {
  const { status, streamingText, lastError, isPaused, messages } = state;
  const [questionInput, setQuestionInput] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const isProcessing = status === 'capturing' || status === 'streaming';

  const handleSubmitQuestion = () => {
    if (questionInput.trim() && onAskQuestion) {
      onAskQuestion(questionInput.trim());
      setQuestionInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  // Auto-scroll to bottom as content streams
  useEffect(() => {
    if (status === 'streaming' && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamingText, status, messages]);

  // Only show setup/error screens when there are no messages at all
  const hasMessages = messages.length > 0;

  if (
    !hasMessages &&
    (status === 'idle' || status === 'connecting' || (status === 'error' && lastError))
  ) {
    return (
      <div className={className}>
        <BottomSheet
          key="setup"
          tabIndex={0}
          content-height
          style={
            {
              '--sheet-max-height': '75vh',
            } as CSSProperties
          }
          className={cx(
            css({
              '&::part(sheet)': {
                background: 'none',
                boxSizing: 'border-box',
              },
              '&::part(handle)': {
                background: 'rgba(255, 255, 255, 0.15)',
              },
              '&::part(header)': {
                boxSizing: 'border-box',
                background: 'rgba(22, 22, 22, 0.95)',
                backdropFilter: 'blur(8px)',
                zIndex: 1,
              },
              '&::part(content)': {
                padding: 0,
                paddingBottom: 'env(safe-area-inset-bottom)',
                boxSizing: 'border-box',
                background: 'rgba(22, 22, 22, 0.95)',
                backdropFilter: 'blur(8px)',
              },
              '&::part(footer)': {
                display: 'none',
              },
            }),
          )}
        >
          <div slot="header">
            <span
              className={css({
                fontSize: 'sm',
                fontWeight: 'semibold',
                color: 'zinc.300',
              })}
            >
              AI Vision
            </span>
          </div>
          <StatusContent
            status={status}
            lastError={lastError}
            onRetry={onRetry}
            onOpenSettings={onOpenSettings}
          />
        </BottomSheet>
      </div>
    );
  }

  const showContent = status === 'streaming' || messages.length > 0;

  return (
    <div className={className}>
      <BottomSheet
        key={showContent ? 'hasContent' : 'noContent'}
        tabIndex={0}
        content-height
        style={
          {
            '--sheet-max-height': '50vh',
          } as CSSProperties
        }
        className={cx(
          css({
            '&::part(sheet)': {
              background: 'none',
              boxSizing: 'border-box',
            },
            '&::part(handle)': {
              background: 'rgba(255, 255, 255, 0.15)',
            },
            '&::part(header)': {
              boxSizing: 'border-box',
              background: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(8px)',
              zIndex: 1,
            },
            '&::part(content)': {
              padding: 0,
              boxSizing: 'border-box',
              background: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(8px)',
              flex: '1',
              overflow: 'auto',
            },
            '&::part(footer)': {
              boxSizing: 'border-box',
              background: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid',
              borderColor: 'zinc.700',
            },
          }),
        )}
      >
        {showContent && (
          <>
            <div
              slot="snap"
              style={{ '--snap': '35%' } as CSSProperties}
            />
            <div
              slot="snap"
              style={{ '--snap': '100%' } as CSSProperties}
              className={showContent ? 'initial' : ''}
            />
          </>
        )}

        <div slot="header">
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
          </div>
        </div>

        <div
          ref={contentRef}
          className={css({
            padding: 4,
            minHeight: '60px',
          })}
        >
          {(status === 'waiting' || status === 'capturing') &&
          messages.length === 0 &&
          !streamingText ? (
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: 4,
              })}
            >
              <div
                className={css({
                  width: '20px',
                  height: '20px',
                  border: '2px solid',
                  borderColor: 'zinc.600',
                  borderTopColor: 'blue.500',
                  borderRadius: 'full',
                  animation: 'spin 1s linear infinite',
                })}
              />
              <p
                className={css({
                  fontSize: 'sm',
                  color: 'zinc.400',
                  margin: 0,
                })}
              >
                {status === 'capturing' ? 'Capturing frame...' : 'Waiting to start...'}
              </p>
            </div>
          ) : (
            <>
              {messages.slice(-10).map((msg, idx) => (
                <div
                  key={idx}
                  className={css({
                    marginBottom: 3,
                  })}
                >
                  <span
                    className={css({
                      fontSize: 'xs',
                      color: 'zinc.500',
                      fontWeight: 'medium',
                    })}
                  >
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </span>
                  <div className={cssMarkdownMessage}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {status === 'streaming' && streamingText && (
                <>
                  <span
                    className={css({
                      fontSize: 'xs',
                      color: 'zinc.500',
                      fontWeight: 'medium',
                    })}
                  >
                    AI
                  </span>
                  <div className={cssMarkdown}>
                    <ReactMarkdown>{streamingText}</ReactMarkdown>
                  </div>
                </>
              )}

              {messages.length === 0 && status !== 'streaming' && (
                <p
                  className={css({
                    fontSize: 'sm',
                    color: 'zinc.500',
                    margin: 0,
                    textAlign: 'center',
                  })}
                >
                  Point your camera at something to analyze.
                </p>
              )}
            </>
          )}
        </div>

        <div slot="footer">
          <div
            className={css({
              display: 'flex',
              gap: 2,
              padding: 2,
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
              placeholder="Type a question..."
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
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
              onClick={handleSubmitQuestion}
              disabled={!questionInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function StatusContent({
  status,
  lastError,
  onRetry,
  onOpenSettings,
}: {
  status: string;
  lastError: { message: string } | null;
  onRetry?: () => void;
  onOpenSettings?: () => void;
}) {
  if (status === 'connecting') {
    return (
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: 8,
        })}
      >
        <div
          className={css({
            width: '20px',
            height: '20px',
            border: '2px solid',
            borderColor: 'zinc.600',
            borderTopColor: 'blue.500',
            borderRadius: 'full',
            animation: 'spin 1s linear infinite',
          })}
        />
        <p
          className={css({
            fontSize: 'sm',
            color: 'zinc.400',
            margin: 0,
          })}
        >
          Setting up AI Vision...
        </p>
      </div>
    );
  }

  if (status === 'idle' && lastError) {
    return (
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: 6,
        })}
      >
        <div
          className={css({
            fontSize: '24px',
          })}
        >
          ⚙️
        </div>
        <h3
          className={css({
            fontSize: 'lg',
            fontWeight: 'semibold',
            color: 'white',
            margin: 0,
          })}
        >
          AI Not Configured
        </h3>
        <p
          className={css({
            fontSize: 'sm',
            color: 'zinc.300',
            margin: 0,
            textAlign: 'center',
          })}
        >
          Configure your API settings to enable AI-powered vision analysis.
        </p>
        <div
          className={css({
            display: 'flex',
            gap: 3,
            marginTop: 2,
          })}
        >
          <button
            className={css({
              padding: '8px 16px',
              borderRadius: 'md',
              border: 'none',
              backgroundColor: 'blue.500',
              color: 'white',
              fontSize: 'sm',
              fontWeight: 'medium',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'blue.400',
              },
            })}
            onClick={onOpenSettings}
          >
            Configure AI
          </button>
        </div>
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: 8,
        })}
      >
        <p
          className={css({
            fontSize: 'lg',
            fontWeight: 'semibold',
            color: 'white',
            margin: 0,
          })}
        >
          AI Vision
        </p>
        <p
          className={css({
            fontSize: 'sm',
            color: 'zinc.400',
            margin: 0,
            textAlign: 'center',
          })}
        >
          Configure your API settings to enable AI-powered image analysis.
        </p>
        <button
          className={css({
            padding: '10px 20px',
            borderRadius: 'md',
            border: 'none',
            backgroundColor: 'blue.500',
            color: 'white',
            fontSize: 'sm',
            fontWeight: 'medium',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'blue.400',
            },
          })}
          onClick={onOpenSettings}
        >
          Configure AI
        </button>
      </div>
    );
  }

  if (status === 'error' && lastError) {
    return (
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: 6,
        })}
      >
        <div
          className={css({
            fontSize: '24px',
          })}
        >
          ⚠️
        </div>
        <h3
          className={css({
            fontSize: 'lg',
            fontWeight: 'semibold',
            color: 'white',
            margin: 0,
          })}
        >
          AI Vision Error
        </h3>
        <p
          className={css({
            fontSize: 'sm',
            color: 'zinc.300',
            margin: 0,
            textAlign: 'center',
          })}
        >
          {lastError.message}
        </p>
        <div
          className={css({
            display: 'flex',
            gap: 3,
            marginTop: 2,
          })}
        >
          <button
            className={css({
              padding: '8px 16px',
              borderRadius: 'md',
              border: 'none',
              backgroundColor: 'blue.500',
              color: 'white',
              fontSize: 'sm',
              fontWeight: 'medium',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'blue.400',
              },
            })}
            onClick={onRetry}
          >
            Retry
          </button>
          <button
            className={css({
              padding: '8px 16px',
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
            })}
            onClick={onOpenSettings}
          >
            Settings
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const PauseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <rect
      x="6"
      y="4"
      width="4"
      height="16"
      rx="1"
    />
    <rect
      x="14"
      y="4"
      width="4"
      height="16"
      rx="1"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const cssMarkdown = css({
  fontSize: 'sm',
  color: 'white',
  lineHeight: '1.6',
  '& p': {
    margin: '0 0 8px 0',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& strong': {
    fontWeight: 'semibold',
    color: 'white',
  },
  '& em': {
    fontStyle: 'italic',
    color: 'zinc.300',
  },
  '& code': {
    fontSize: 'xs',
    backgroundColor: 'zinc.800',
    padding: '2px 4px',
    borderRadius: 'sm',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: 'zinc.800',
    padding: 3,
    borderRadius: 'md',
    overflow: 'auto',
    margin: '8px 0',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& ul, & ol': {
    margin: '8px 0',
    paddingLeft: 5,
  },
  '& li': {
    marginBottom: 1,
  },
  '& h1, & h2, & h3, & h4': {
    fontWeight: 'semibold',
    marginBottom: 2,
    marginTop: 3,
    color: 'white',
  },
  '& h1': { fontSize: 'lg' },
  '& h2': { fontSize: 'base' },
  '& h3': { fontSize: 'sm' },
  '& h4': { fontSize: 'xs' },
  '& a': {
    color: 'blue.400',
    textDecoration: 'underline',
    '&:hover': {
      color: 'blue.300',
    },
  },
  '& blockquote': {
    borderLeft: '2px solid',
    borderColor: 'zinc.600',
    paddingLeft: 3,
    margin: '8px 0',
    color: 'zinc.400',
    fontStyle: 'italic',
  },
});

const cssMarkdownMessage = css({
  fontSize: 'sm',
  color: 'zinc.200',
  lineHeight: '1.5',
  margin: '2px 0 0 0',
  '& p': {
    margin: '0 0 4px 0',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& strong': {
    fontWeight: 'semibold',
    color: 'white',
  },
  '& em': {
    fontStyle: 'italic',
    color: 'zinc.300',
  },
  '& code': {
    fontSize: 'xs',
    backgroundColor: 'zinc.800',
    padding: '2px 4px',
    borderRadius: 'sm',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: 'zinc.800',
    padding: 2,
    borderRadius: 'md',
    overflow: 'auto',
    margin: '4px 0',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& ul, & ol': {
    margin: '4px 0',
    paddingLeft: 4,
  },
  '& li': {
    marginBottom: 1,
  },
  '& a': {
    color: 'blue.400',
    textDecoration: 'underline',
  },
});
