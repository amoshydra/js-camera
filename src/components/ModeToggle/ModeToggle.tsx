import { styled } from '~styled-system/jsx';

export type Mode = 'qr' | 'ai';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  className?: string;
}

const QRIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
    <rect
      x="14"
      y="14"
      width="3"
      height="3"
    />
    <rect
      x="18"
      y="14"
      width="3"
      height="3"
    />
    <rect
      x="14"
      y="18"
      width="3"
      height="3"
    />
    <rect
      x="18"
      y="18"
      width="3"
      height="3"
    />
  </svg>
);

const AIIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
    <circle
      cx="8"
      cy="14"
      r="1.5"
      fill="currentColor"
    />
    <circle
      cx="16"
      cy="14"
      r="1.5"
      fill="currentColor"
    />
    <path d="M9 18h6" />
  </svg>
);

const Container = styled('div', {
  base: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 'md',
    padding: '2px',
    gap: '2px',
  },
});

const ModeButton = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'sm',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontSize: 'sm',
    fontWeight: 'medium',
    color: 'zinc.400',
    backgroundColor: 'transparent',
    '&:hover': {
      color: 'zinc.200',
    },
  },
  variants: {
    active: {
      true: {
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
});

export default function ModeToggle({ mode, onChange, className }: ModeToggleProps) {
  return (
    <div className={className}>
      <Container>
        <ModeButton
          active={mode === 'qr'}
          onClick={() => onChange('qr')}
          aria-label="QR Scanner mode"
          aria-pressed={mode === 'qr'}
        >
          <QRIcon />
          <span>QR</span>
        </ModeButton>
        <ModeButton
          active={mode === 'ai'}
          onClick={() => onChange('ai')}
          aria-label="AI Vision mode"
          aria-pressed={mode === 'ai'}
        >
          <AIIcon />
          <span>AI</span>
        </ModeButton>
      </Container>
    </div>
  );
}
