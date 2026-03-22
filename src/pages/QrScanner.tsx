import { lazy, Suspense, useEffect, useState } from 'react';
import ScannedIndicator from '@/components/ScannedIndicator';
import { type QrReaderData } from '@/lib/barcodeScanner';
import { css } from '~styled-system/css';
import QrInput from '../components/QrInput/QrInput';
import ContentRenderer from '../components/ContentRenderer/ContentRenderer';
import { type Mode } from '../components/ModeToggle/ModeToggle';

const AiView = lazy(() => import('@/experimental/features/ai/AiView'));

interface QrScannerProps {
  disabled?: boolean;
  initialData?: QrReaderData;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  enableAiMode: boolean;
}

export default function QrScanner({
  disabled = false,
  initialData,
  mode,
  onModeChange,
  enableAiMode,
}: QrScannerProps) {
  const [qrData, setQrData] = useState<QrReaderData>(
    initialData ?? {
      data: null,
      error: null,
      scannerType: 'native',
    },
  );
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (initialData?.data || initialData?.error) {
      setQrData(initialData);
    }
  }, [initialData]);

  const handleModeChange = (newMode: Mode) => {
    onModeChange(newMode);
  };

  const handleOpenAiSettings = () => {
    if (mode !== 'ai') {
      onModeChange('ai');
    }
  };

  return (
    <>
      <ScannedIndicator
        data={mode === 'qr' ? qrData.data : null}
        scannerType={qrData.scannerType}
      />
      <div className={cssWrapper}>
        <QrInput
          disabled={disabled}
          onChange={setQrData}
          className={cssTop}
          mode={mode}
          onModeChange={handleModeChange}
          onVideoElement={setVideoElement}
          enableAiMode={enableAiMode}
        />
        {mode === 'qr' ? (
          <ContentRenderer
            data={qrData}
            className={cssBottom}
          />
        ) : (
          <Suspense fallback={<div className={cssBottom} />}>
            <AiView
              videoElement={videoElement}
              disabled={disabled}
              onOpenSettings={handleOpenAiSettings}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}

const cssWrapper = css({
  marginTop: 'env(safe-area-inset-top)',
  marginBottom: 'env(safe-area-inset-bottom)',
  padding: 4,
  display: 'flex',
  height: 'full',
  minHeight: 0,
  flexDirection: 'column',
  gap: 2,
  '@media(orientation: landscape)': {
    flexDirection: 'row',
    maxWidth: '1200px',
    marginX: 'auto',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
  },
});

const cssTop = css({
  flexGrow: 0,
  flexShrink: 1,
  '@media(orientation: landscape)': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '50%',
  },
});

const cssBottom = css({
  flexGrow: 1,
  flexShrink: 0,
  '@media(orientation: landscape)': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '50%',
  },
});
