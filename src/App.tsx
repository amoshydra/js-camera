import { useEffect, useState } from 'react';
import { css } from '~styled-system/css';
import QrScanner from './pages/QrScanner';

const globalStyles = css({
  fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
  fontSmoothing: 'antialiased',
  color: '#2c3e50',
});

export default function App() {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setDisabled(true);
      } else if (document.visibilityState === 'visible') {
        setDisabled(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className={globalStyles}
      id="app"
    >
      <QrScanner disabled={disabled} />
    </div>
  );
}
