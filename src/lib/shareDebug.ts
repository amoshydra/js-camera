const STORAGE_KEY = 'share-target-debug';

export interface DebugLog {
  timestamp: string;
  step: string;
  status: 'info' | 'success' | 'error';
  message: string;
  data?: Record<string, unknown>;
}

export function getDebugLogs(): DebugLog[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addDebugLog(
  step: string,
  status: DebugLog['status'],
  message: string,
  data?: Record<string, unknown>,
): void {
  try {
    const logs = getDebugLogs();
    logs.push({
      timestamp: new Date().toISOString(),
      step,
      status,
      message,
      data,
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // Ignore storage errors
  }
}

export function clearDebugLogs(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
