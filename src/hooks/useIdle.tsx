import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const DEFAULT_IDLE_TIMEOUT = 30000;
const LONG_IDLE_TIMEOUT = 300000;

interface IdleContextValue {
  isIdle: boolean;
  requestLongIdle: () => void;
  releaseLongIdle: () => void;
}

const IdleContext = createContext<IdleContextValue | null>(null);

export const useIdleContext = () => {
  const context = useContext(IdleContext);
  if (!context) {
    throw new Error('useIdleContext must be used within IdleProvider');
  }
  return context;
};

export const IdleProvider = ({ children }: { children: React.ReactNode }) => {
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);
  const longIdleRequestCountRef = useRef(0);

  const getTimeout = useCallback(() => {
    return longIdleRequestCountRef.current > 0 ? LONG_IDLE_TIMEOUT : DEFAULT_IDLE_TIMEOUT;
  }, []);

  const requestLongIdle = useCallback(() => {
    longIdleRequestCountRef.current++;
  }, []);

  const releaseLongIdle = useCallback(() => {
    longIdleRequestCountRef.current = Math.max(0, longIdleRequestCountRef.current - 1);
  }, []);

  useEffect(() => {
    const resetIdle = () => {
      lastActivityRef.current = Date.now();
      if (isIdle) {
        setIsIdle(false);
      }
    };

    const checkIdle = () => {
      if (Date.now() - lastActivityRef.current >= getTimeout()) {
        setIsIdle(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsIdle(true);
      } else {
        lastActivityRef.current = Date.now();
        setIsIdle(false);
      }
    };

    const events = ['mousedown', 'touchstart', 'keydown', 'scroll', 'mousemove'];
    events.forEach((event) => {
      document.addEventListener(event, resetIdle, { passive: true });
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    intervalRef.current = window.setInterval(checkIdle, 1000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetIdle);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isIdle, getTimeout]);

  return (
    <IdleContext.Provider value={{ isIdle, requestLongIdle, releaseLongIdle }}>
      {children}
    </IdleContext.Provider>
  );
};
