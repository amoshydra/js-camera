import { css } from '~styled-system/css';

interface StatusContentProps {
  status: string;
  lastError: { message: string } | null;
  onRetry?: () => void;
  onOpenSettings?: () => void;
}

export default function StatusContent({
  status,
  lastError,
  onRetry,
  onOpenSettings,
}: StatusContentProps) {
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
