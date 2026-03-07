import { css } from '~styled-system/css';
import { useDocumentVisibilityChange } from './hooks/useVisibilityChange';
import QrScanner from './pages/QrScanner';

const globalStyles = css({
  fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
  fontSmoothing: 'antialiased',
  color: '#2c3e50',
});

export default function App() {
  const documentVisible = useDocumentVisibilityChange();

  return (
    <div
      className={globalStyles}
      id="app"
    >
      <QrScanner disabled={documentVisible} />
    </div>
  );
}
