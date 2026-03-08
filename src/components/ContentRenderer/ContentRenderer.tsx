import { type DetectedBarcode, type QrReaderData } from '@/lib/barcodeScanner';
import { decodeImageQRCode } from '@/lib/decodeImageQRCode';
import { AppError, ErrorCode } from '@/lib/errors';
import { BottomSheet } from 'pure-web-bottom-sheet/react';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { css, cx } from '~styled-system/css';
import ContentAction from './ContentAction';
import ContentCard from './ContentCard';
import ErrorDisplay from './ErrorDisplay';
import { Button, ContentHeading } from './Style';
import { useLastGoodValue } from './useLastGoodValue';

interface ContentRendererProps {
  data: QrReaderData | null;
  className?: string;
  onFileUpload?: (barcode: DetectedBarcode) => void;
}

function checkIsUrl(data: string): boolean {
  try {
    new URL(data);
    return true;
  } catch {
    return false;
  }
}

export default function ContentRenderer({ data, className, onFileUpload }: ContentRendererProps) {
  const error = data?.error;
  const d = data?.data?.rawValue;
  const scannedValue = useLastGoodValue(d);
  const [uploadedValue, setUploadedValue] = useState<string | null>(null);
  const value = uploadedValue ?? scannedValue;
  const isUrl = value ? checkIsUrl(value) : false;
  const [uploadError, setUploadError] = useState<AppError | null>(null);

  useEffect(() => {
    if (scannedValue) {
      setUploadedValue(null);
    }
  }, [scannedValue]);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    try {
      const result = await decodeImageQRCode(file);
      setUploadedValue(result.rawValue);
      onFileUpload?.(result);
    } catch (e) {
      if (e instanceof AppError) {
        setUploadError(e);
      } else {
        setUploadError(new AppError(String(e), ErrorCode.BARCODE_DETECTION_FAILED));
      }
    }
  };

  const displayError = error ?? uploadError;

  return (
    <div className={className}>
      <BottomSheet
        key={value ? 'hasValue' : 'noValue'}
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
            '&::part(header)': {
              boxSizing: 'border-box',
              paddingBottom: 2,
              background: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(8px)',
              zIndex: 1,
            },
            '&::part(content)': {
              padding: 2,
              boxSizing: 'border-box',
              background: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(8px)',
            },
            '&::part(footer)': {
              padding: 4,
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
              boxSizing: 'border-box',
              background: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(8px)',
              zIndex: 1,
            },
          }),
        )}
      >
        {value && (
          <>
            <div
              slot="snap"
              style={{ '--snap': '35%' } as CSSProperties}
            />
            <div
              slot="snap"
              style={{ '--snap': '100%' } as CSSProperties}
              className={value ? 'initial' : ''}
            />
          </>
        )}

        <div slot="header">
          {value ? (
            <ContentHeading>Result</ContentHeading>
          ) : (
            <ContentHeading>Scan a QR Code</ContentHeading>
          )}
        </div>

        <ContentRendererContent
          error={displayError}
          isUrl={isUrl}
          value={value}
          onFileUpload={handleFileUpload}
        />

        {value && (
          <div slot="footer">
            <ContentAction
              value={value}
              isUrl={isUrl}
              onFileUpload={handleFileUpload}
            />
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

interface ContentRendererContentProps {
  error: AppError | null;
  value: string;
  isUrl: boolean;
  onFileUpload?: (file: File) => void;
}
function ContentRendererContent({
  error,
  value,
  isUrl,
  onFileUpload,
}: ContentRendererContentProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
      e.target.value = '';
    }
  };

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!value) {
    return (
      <div
        className={cx(
          css({
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDir: 'column',
            gap: 6,
          }),
        )}
      >
        <div>
          <Button onClick={() => inputRef.current?.click()}>Upload file</Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={css({ display: 'none' })}
          />
        </div>
      </div>
    );
  }

  return (
    <ContentCard
      value={value}
      isUrl={isUrl}
    />
  );
}
