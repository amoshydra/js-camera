import { useEffect, useState } from 'react';
import { deleteFile, getFile, openDB } from '@/lib/idb';

interface SharedFile {
  file: File;
  webkitRelativePath: string;
}

export function useShareHandler(): SharedFile | null {
  const [sharedFile, setSharedFile] = useState<SharedFile | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[#&]shared=([^&]+)/);
    const sharedId = match ? match[1] : null;

    if (!sharedId) {
      return;
    }

    (async () => {
      try {
        const db = await openDB();
        const file = await getFile(db, sharedId);

        if (file) {
          setSharedFile({ file, webkitRelativePath: '' });

          window.history.replaceState({}, '', window.location.pathname + window.location.search);

          await deleteFile(db, sharedId);
        }
      } catch {
        // Silently ignore errors
      }
    })();
  }, []);

  return sharedFile;
}
