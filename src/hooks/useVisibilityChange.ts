import { useEffect, useState } from "react";

export const useDocumentVisibilityChange = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setVisible(true);
      } else if (document.visibilityState === 'visible') {
        setVisible(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return visible;
}
