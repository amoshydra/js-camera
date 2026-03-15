import { useEffect, useState } from 'react';
import { css } from '~styled-system/css';
import { clearDebugLogs, getDebugLogs, type DebugLog } from '@/lib/shareDebug';

export default function ShareTargetDebugPanel() {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setLogs(getDebugLogs());
  }, []);

  if (logs.length === 0) {
    return null;
  }

  const statusColors: Record<DebugLog['status'], string> = {
    info: 'rgba(59, 130, 246, 0.8)',
    success: '#10b981',
    error: '#ef4444',
  };

  const statusShadows: Record<DebugLog['status'], string> = {
    info: '0 0 6px rgba(59, 130, 246,0.5)',
    success: '0 0 6px #10b981',
    error: '0 0 6px #ef4444',
  };

  return (
    <div className={cssWrapper}>
      <div className={cssCard}>
        <div
          className={cssCardHeader}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={cssHeaderLeft}>
            <span className={cssDot} />
            <span>Share Target Debug</span>
            <span className={cssLogCount}>{logs.length}</span>
          </div>
          <span className={cssToggle}>{isExpanded ? '▼' : '▶'}</span>
        </div>

        {isExpanded && (
          <>
            <div className={cssLogs}>
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={cssLog}
                >
                  <div className={cssLogHeader}>
                    <span
                      className={css({
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        backgroundColor: statusColors[log.status],
                        boxShadow: statusShadows[log.status],
                      })}
                    />
                    <span className={cssStep}>{log.step}</span>
                    <span className={cssTimestamp}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={cssMessage}>{log.message}</div>
                  {log.data && <pre className={cssData}>{JSON.stringify(log.data, null, 2)}</pre>}
                </div>
              ))}
            </div>

            <button
              className={cssClearButton}
              onClick={() => {
                clearDebugLogs();
                setLogs([]);
              }}
            >
              Clear Logs
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const cssWrapper = css({
  position: 'fixed',
  bottom: 4,
  left: 2,
  right: 2,
  zIndex: 9999,
  pointerEvents: 'auto',
});

const cssCard = css({
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: 2,
  fontFamily: 'mono',
  fontSize: '11px',
  maxHeight: '40vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const cssCardHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  cursor: 'pointer',
  padding: '4px 0',
  marginBottom: '4px',
});

const cssHeaderLeft = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const cssDot = css({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#f59e0b',
  boxShadow: '0 0 8px #f59e0b',
});

const cssLogCount = css({
  padding: '1px 6px',
  fontSize: '9px',
  fontWeight: '600',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  color: 'rgba(255, 255, 255, 0.7)',
});

const cssToggle = css({
  fontSize: '10px',
  color: 'rgba(255, 255, 255, 0.5)',
});

const cssLogs = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  overflowY: 'auto',
  flex: 1,
  marginBottom: '8px',
});

const cssLog = css({
  padding: '6px 8px',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '4px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
});

const cssLogHeader = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '4px',
});

const cssStep = css({
  fontWeight: '600',
  color: 'rgba(255, 255, 255, 0.9)',
  textTransform: 'uppercase',
  fontSize: '10px',
  letterSpacing: '0.05em',
});

const cssTimestamp = css({
  fontSize: '9px',
  color: 'rgba(255, 255, 255, 0.4)',
  marginLeft: 'auto',
});

const cssMessage = css({
  color: 'rgba(255, 255, 255, 0.7)',
  lineHeight: '1.3',
});

const cssData = css({
  marginTop: '6px',
  padding: '4px 6px',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '4px',
  fontSize: '9px',
  color: 'rgba(255, 255, 255, 0.6)',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

const cssClearButton = css({
  padding: '6px 12px',
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '4px',
  color: '#fca5a5',
  fontSize: '10px',
  fontWeight: '600',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  _hover: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
});
