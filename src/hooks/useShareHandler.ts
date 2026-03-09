import { useEffect, useState } from 'react';

interface SharedFile {
  file: File;
  webkitRelativePath: string;
}

export function useShareHandler(): SharedFile | null {
  const [sharedFile, setSharedFile] = useState<SharedFile | null>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const launchQueue = (window as any).LaunchQueue;
      if (typeof launchQueue?.setLaunchConsumer !== 'function') {
        return;
      }

      const launchConsumer = async (launchParams: {
        files?: Array<{ kind: string; getFile: () => Promise<File> }>;
      }) => {
        const files = launchParams.files;
        if (files && files.length > 0) {
          const fileHandle = files[0];
          if (fileHandle.kind === 'file') {
            const file = await fileHandle.getFile();
            setSharedFile({
              file,
              webkitRelativePath: file.webkitRelativePath,
            });
          }
        }
      };

      launchQueue.setLaunchConsumer(launchConsumer);
    } catch {
      // Not supported or error
    }
  }, []);

  return sharedFile;
}
