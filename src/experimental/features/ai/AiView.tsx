import AiContentRenderer from './components/AiInput/AiContentRenderer';
import AiSetupModal from './components/AiInput/AiSetupModal';
import { useAiVisionTopic } from './hooks/useAiVisionTopic';
import { aiConfigStore } from './lib/aiConfigStore';
import { useEffect, useRef, useState } from 'react';
import { css } from '~styled-system/css';

interface AiViewProps {
  videoElement: HTMLVideoElement | null;
  disabled: boolean;
  onOpenSettings: () => void;
}

export default function AiView({ videoElement, disabled, onOpenSettings }: AiViewProps) {
  const [showAiSetupModal, setShowAiSetupModal] = useState(false);
  const hasShownSetupModal = useRef(false);

  const isAiEnabled = !disabled;

  const { togglePause, setTopic, ...aiState } = useAiVisionTopic(videoElement, isAiEnabled);

  useEffect(() => {
    if (!aiConfigStore.isConfigured() && !hasShownSetupModal.current) {
      setShowAiSetupModal(true);
      hasShownSetupModal.current = true;
    }
  }, []);

  const handleConfigured = () => {
    setShowAiSetupModal(false);
  };

  const handleRetry = () => {
    window.dispatchEvent(new Event('js-camera-ai-config-change'));
  };

  return (
    <>
      <AiContentRenderer
        state={aiState}
        onRetry={handleRetry}
        onOpenSettings={onOpenSettings}
        onPauseToggle={togglePause}
        onSetTopic={setTopic}
        className={cssBottom}
      />
      <AiSetupModal
        open={showAiSetupModal}
        onClose={() => setShowAiSetupModal(false)}
        onConfigured={handleConfigured}
      />
    </>
  );
}

const cssBottom = css({
  flexGrow: 1,
  flexShrink: 0,
  '@media(orientation: landscape)': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '50%',
  },
});
