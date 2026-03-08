import { renderHook } from '@testing-library/react';
import { useLastGoodValue } from '../ContentRenderer/useLastGoodValue';

describe('useLastGoodValue', () => {
  it('returns null when value is null', () => {
    const { result } = renderHook(() => useLastGoodValue(null));
    expect(result.current).toBeNull();
  });

  it('returns null when value is empty string', () => {
    const { result } = renderHook(() => useLastGoodValue(''));
    expect(result.current).toBeNull();
  });

  it('returns the value when value is a non-empty string', () => {
    const { result } = renderHook(() => useLastGoodValue('hello'));
    expect(result.current).toBe('hello');
  });

  it('stores and returns the last good value', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string | null }) => useLastGoodValue(value),
      { initialProps: { value: 'first' } },
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second' });
    expect(result.current).toBe('second');

    rerender({ value: '' });
    expect(result.current).toBe('second');

    rerender({ value: null });
    expect(result.current).toBe('second');
  });
});
