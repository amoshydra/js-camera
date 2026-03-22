import ReactMarkdown from 'react-markdown';
import { useRef } from 'react';
import { css } from '~styled-system/css';
import { cssMarkdownMessage } from './styles';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
  streamingText?: string | null;
  status: string;
}

export default function MessageList({ messages, streamingText, status }: MessageListProps) {
  const isLoading = status === 'waiting' || status === 'capturing';
  const showStreaming = status === 'streaming' && streamingText;

  const hasMessages = messages.length > 0;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (isLoading && messages.length === 0 && !streamingText) {
    return (
      <div
        className={css({
          padding: 4,
          minHeight: '60px',
        })}
      >
        <LoadingState status={status} />
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className={css({
        padding: 4,
        minHeight: '60px',
        overflowY: 'auto',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        })}
      >
        {showStreaming && <StreamingMessage streamingText={streamingText} />}

        {hasMessages &&
          messages
            .slice(-10)
            .reverse()
            .map((msg, idx) => {
              const time = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
              return (
                <MessageItem
                  key={`${msg.role}-${msg.timestamp}-${idx}`}
                  msg={msg}
                  time={time}
                />
              );
            })}

        {!showStreaming && !hasMessages && <EmptyState />}
      </div>
    </div>
  );
}

function StreamingMessage({ streamingText }: { streamingText: string }) {
  return (
    <div
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
        AI
      </span>
      <div className={cssMarkdownMessage}>
        <ReactMarkdown>{streamingText}</ReactMarkdown>
      </div>
    </div>
  );
}

function MessageItem({ msg, time }: { msg: Message; time: string }) {
  return (
    <div
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
        {msg.role === 'user' ? 'You' : 'AI'} · {time}
      </span>
      <div className={cssMarkdownMessage}>
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function LoadingState({ status }: { status: string }) {
  return (
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
  );
}

function EmptyState() {
  return (
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
  );
}
