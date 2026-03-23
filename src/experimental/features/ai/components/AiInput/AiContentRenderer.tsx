import type { AiVisionState } from '../../hooks/useAiVision';
import { BottomSheet } from 'pure-web-bottom-sheet/react';
import { CSSProperties, useState } from 'react';
import { css, cx } from '~styled-system/css';
import AiHeader from './AiContentRenderer/AiHeader';
import MessageList from './AiContentRenderer/MessageList';
import StatusContent from './AiContentRenderer/StatusContent';
import MemoryList from './AiContentRenderer/MemoryList';

interface AiContentRendererProps {
  state: AiVisionState & { topic?: string | null };
  onRetry?: () => void;
  onOpenSettings?: () => void;
  onPauseToggle?: () => void;
  onSetTopic?: (topic: string | null) => void;
  onToggleShareHistory?: () => void;
  className?: string;
}

const bottomSheetBaseStyles = {
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
    overscrollBehavior: 'contain',
  },
};

export default function AiContentRenderer({
  state,
  onRetry,
  onOpenSettings,
  onPauseToggle,
  onSetTopic,
  onToggleShareHistory,
  className,
}: AiContentRendererProps) {
  const { status, streamingText, lastError, isPaused, messages, topic, shareHistory } = state;

  const [showMemoryList, setShowMemoryList] = useState(false);

  const isProcessing = status === 'capturing' || status === 'streaming';

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
          nested-scroll
          style={
            {
              '--sheet-max-height': '75vh',
            } as CSSProperties
          }
          className={cx(
            css({
              ...bottomSheetBaseStyles,
              '&::part(content)': {
                ...bottomSheetBaseStyles['&::part(content)'],
                paddingBottom: 'env(safe-area-inset-bottom)',
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
        nested-scroll
        style={
          {
            '--sheet-max-height': '50vh',
          } as CSSProperties
        }
        className={cx(
          css({
            ...bottomSheetBaseStyles,
            '&::part(content)': {
              ...bottomSheetBaseStyles['&::part(content)'],
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
          <AiHeader
            isPaused={isPaused}
            isProcessing={isProcessing}
            topic={topic}
            shareHistory={shareHistory}
            onPauseToggle={onPauseToggle}
            onSetTopic={onSetTopic}
            onToggleShareHistory={onToggleShareHistory}
            onToggleMemoryList={() => setShowMemoryList((prev) => !prev)}
          />
        </div>

        {showMemoryList ? (
          <MemoryList
            onClose={() => setShowMemoryList(false)}
            onDisableMemory={() => {
              onToggleShareHistory?.();
              setShowMemoryList(false);
            }}
          />
        ) : (
          <MessageList
            messages={messages}
            streamingText={streamingText}
            status={status}
          />
        )}
      </BottomSheet>
    </div>
  );
}
