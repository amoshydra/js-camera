import { useDocumentVisibilityChange } from './hooks/useVisibilityChange';
import QrScanner from './pages/QrScanner';

export default function App() {
  const documentVisible = useDocumentVisibilityChange();

  return (
    <QrScanner disabled={documentVisible} />
  );
}
