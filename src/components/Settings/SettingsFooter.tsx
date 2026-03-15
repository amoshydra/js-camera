import { css } from '~styled-system/css';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export default function SettingsFooter() {
  const { needRefresh, updateServiceWorker } = useServiceWorker();

  return (
    <div className={cssFooter}>
      {needRefresh && (
        <button
          className={cssUpdateButton}
          onClick={() => updateServiceWorker(true)}
        >
          Update available
        </button>
      )}
      <a
        href="https://github.com/amoshydra/js-camera"
        target="_blank"
        rel="noopener noreferrer"
        className={cssLink}
      >
        GitHub - amoshydra/js-camera
      </a>
      <span className={cssVersion}>{import.meta.env.VITE_GIT_SHA}</span>
    </div>
  );
}

const cssFooter = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 2,
  marginTop: 24,
});

const cssLink = css({
  color: 'blue.600',
  textDecoration: 'none',
  fontSize: '0.75rem',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const cssUpdateButton = css({
  fontSize: '0.75rem',
  padding: '0.25rem 0.5rem',
  backgroundColor: 'green.600',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'green.500',
  },
});

const cssVersion = css({
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.5)',
  fontFamily: 'mono',
});
