import { useEffect, useState } from 'react';
import { deleteFile, getFile, openDB } from '@/lib/idb';
import { addDebugLog } from '@/lib/shareDebug';

interface SharedFile {
  file: File;
  webkitRelativePath: string;
}

export function useShareHandler(): SharedFile | null {
  const [sharedFile, setSharedFile] = useState<SharedFile | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('shared');

    addDebugLog(
      'check-query-param',
      sharedId ? 'success' : 'info',
      sharedId ? `Found shared param: ${sharedId}` : 'No shared param found',
    );

    if (!sharedId) {
      return;
    }

    (async () => {
      try {
        addDebugLog('open-idb', 'info', 'Opening IndexedDB...');
        const db = await openDB();
        addDebugLog('open-idb', 'success', 'IndexedDB opened');

        addDebugLog('get-file', 'info', `Getting file with ID: ${sharedId}`);
        const file = await getFile(db, sharedId);

        if (file) {
          addDebugLog('get-file', 'success', 'File retrieved', {
            name: file.name,
            size: file.size,
            type: file.type,
          });
          setSharedFile({ file, webkitRelativePath: '' });

          window.history.replaceState({}, '', window.location.pathname);

          addDebugLog('delete-file', 'info', `Deleting file with ID: ${sharedId}`);
          await deleteFile(db, sharedId);
          addDebugLog('delete-file', 'success', 'File deleted from IndexedDB');
        } else {
          addDebugLog('get-file', 'error', 'File not found in IndexedDB', { sharedId });
        }
      } catch (error) {
        addDebugLog('error', 'error', 'Failed to process shared file', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    })();
  }, []);

  return sharedFile;
}
