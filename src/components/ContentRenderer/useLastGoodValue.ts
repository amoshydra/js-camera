import { useRef } from 'react';

export const useLastGoodValue = (_value: string | null) => {
  const lastGoodvalue = useRef('');
  if (_value) {
    lastGoodvalue.current = _value;
  }

  return lastGoodvalue.current || null;
};
