import { useIdle } from './hooks/useIdle';
import { useSharedQRCode } from './hooks/useSharedQRCode';
import QrScanner from './pages/QrScanner';

export default function App() {
  const isIdle = useIdle();
  const initialData = useSharedQRCode();

  return (
    <QrScanner
      disabled={isIdle}
      initialData={initialData}
    />
  );
}
