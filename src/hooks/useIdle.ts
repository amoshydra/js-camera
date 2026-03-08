import { useEffect, useRef, useState } from 'react';

const IDLE_TIMEOUT = 30000;

export const useIdle = (timeout = IDLE_TIMEOUT) => {
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const resetIdle = () => {
      lastActivityRef.current = Date.now();
      if (isIdle) {
        setIsIdle(false);
      }
    };

    const checkIdle = () => {
      if (Date.now() - lastActivityRef.current >= timeout) {
        setIsIdle(true);
      }
    };

    const events = ['mousedown', 'touchstart', 'keydown', 'scroll', 'mousemove'];
    events.forEach((event) => {
      document.addEventListener(event, resetIdle, { passive: true });
    });

    intervalRef.current = window.setInterval(checkIdle, 1000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetIdle);
      });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeout, isIdle]);

  return isIdle;
};
