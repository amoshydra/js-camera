import { css } from '~styled-system/css';

interface QrReaderDebugProps {
  videoElement: HTMLVideoElement | null;
  isVideoReady: boolean;
  isScanning: boolean;
  videoWidth: number;
  videoHeight: number;
  scanCount: number;
  lastError: string | null;
  scannerType: 'native' | 'legacy';
}

export default function QrReaderDebug({
  videoElement,
  isVideoReady,
  isScanning,
  videoWidth,
  videoHeight,
  scanCount,
  lastError,
  scannerType,
}: QrReaderDebugProps) {
  return (
    <div className={cssWrapper}>
      <div className={cssCard}>
        <div className={cssCardHeader}>
          <span className={cssDot} />
          <span>Debug</span>
        </div>

        <div className={cssSection}>
          <div className={cssSectionTitle}>Camera</div>
          <div className={cssGrid}>
            <div className={cssRow}>
              <span className={cssLabel}>Video</span>
              <span className={cssValue}>
                <span className={cssIndicator(videoElement ? 'success' : 'error')} />
                {videoElement ? 'Connected' : 'None'}
              </span>
            </div>
            <div className={cssRow}>
              <span className={cssLabel}>Ready</span>
              <span className={cssValue}>
                <span className={cssIndicator(isVideoReady ? 'success' : 'warning')} />
                {isVideoReady ? 'Ready' : 'Loading'}
              </span>
            </div>
            <div className={cssRow}>
              <span className={cssLabel}>Resolution</span>
              <span className={cssValue}>
                {videoWidth}x{videoHeight}
              </span>
            </div>
          </div>
        </div>

        <div className={cssDivider} />

        <div className={cssSection}>
          <div className={cssSectionTitle}>Scanner</div>
          <div className={cssGrid}>
            <div className={cssRow}>
              <span className={cssLabel}>Type</span>
              <span className={cssValue}>
                <span className={cssBadge(scannerType)}>
                  {scannerType === 'native' ? 'Native' : 'Legacy'}
                </span>
              </span>
            </div>
            <div className={cssRow}>
              <span className={cssLabel}>Status</span>
              <span className={cssValue}>
                <span className={cssIndicator(isScanning ? 'success' : 'idle')} />
                {isScanning ? 'Active' : 'Idle'}
              </span>
            </div>
            <div className={cssRow}>
              <span className={cssLabel}>Scans</span>
              <span className={cssValue}>{scanCount}</span>
            </div>
          </div>
        </div>

        {lastError && (
          <>
            <div className={cssDivider} />
            <div className={cssSection}>
              <div className={cssSectionTitle}>Error</div>
              <div className={cssError}>
                <span className={cssIndicator('error')} />
                <span className={cssErrorText}>{lastError}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const cssWrapper = css({
  marginTop: 8,
});

const cssCard = css({
  padding: 2,
  fontFamily: 'mono',
});

const cssCardHeader = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(255, 255, 255, 0.5)',
  marginBottom: '12px',
});

const cssDot = css({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#10b981',
  boxShadow: '0 0 8px #10b981',
});

const cssSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const cssSectionTitle = css({
  fontSize: '10px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'rgba(255, 255, 255, 0.35)',
});

const cssGrid = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const cssRow = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
});

const cssLabel = css({
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.5)',
});

const cssValue = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.9)',
});

const cssDivider = css({
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  margin: '10px 0',
});

const cssIndicator = (variant: 'success' | 'error' | 'warning' | 'idle') => {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    idle: 'rgba(255, 255, 255, 0.3)',
  };
  const shadows = {
    success: '0 0 6px #10b981',
    error: '0 0 6px #ef4444',
    warning: '0 0 6px #f59e0b',
    idle: 'none',
  };
  return css({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: colors[variant],
    boxShadow: shadows[variant],
  });
};

const cssBadge = (variant: 'native' | 'legacy') => {
  const styles = {
    native: {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      color: '#60a5fa',
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    legacy: {
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      color: '#c084fc',
      borderColor: 'rgba(168, 85, 247, 0.3)',
    },
  };
  return css({
    padding: '2px 6px',
    fontSize: '9px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '4px',
    border: '1px solid',
    backgroundColor: styles[variant].backgroundColor,
    color: styles[variant].color,
    borderColor: styles[variant].borderColor,
  });
};

const cssError = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '6px',
  padding: '8px',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '6px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
});

const cssErrorText = css({
  fontSize: '10px',
  color: '#fca5a5',
  wordBreak: 'break-word',
  lineHeight: '1.4',
});
