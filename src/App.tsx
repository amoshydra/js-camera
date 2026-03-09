import { useIdle } from './hooks/useIdle';
import QrScanner from './pages/QrScanner';

export default function App() {
  const isIdle = useIdle();

  return <QrScanner disabled={isIdle} />;
}
