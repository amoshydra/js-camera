import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorker() {
  const {
    needRefresh: [needRefresh],
  } = useRegisterSW();

  return { needRefresh };
}
