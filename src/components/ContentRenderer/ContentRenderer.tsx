import { type QrReaderData } from '@/lib/barcodeScanner';
import { AppError } from '@/lib/errors';
import { BottomSheet } from 'pure-web-bottom-sheet/react';
import { CSSProperties } from 'react';
import { css, cx } from '~styled-system/css';
import ContentAction from './ContentAction';
import ContentCard from './ContentCard';
import ErrorDisplay from './ErrorDisplay';
import { Button, ContentHeading } from './Style';
import { useLastGoodValue } from './useLastGoodValue';

interface ContentRendererProps {
  data: QrReaderData | null;
  className?: string;
}

function checkIsUrl(data: string): boolean {
  try {
    new URL(data);
    return true;
  } catch {
    return false;
  }
}

export default function ContentRenderer({ data, className }: ContentRendererProps) {
  const error = data?.error;
  const d = data?.data?.rawValue;
  const value = useLastGoodValue(d);
  const isUrl = value ? checkIsUrl(value) : false;

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
          error={error}
          isUrl={isUrl}
          value={value}
        />

        {value && (
          <div slot="footer">
            <ContentAction
              value={value}
              isUrl={isUrl}
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
}
function ContentRendererContent({ error, value, isUrl }: ContentRendererContentProps) {
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
          <Button>Upload file</Button>
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
