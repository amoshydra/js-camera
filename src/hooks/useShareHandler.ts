import { useEffect, useState } from 'react';

interface FileSystemFileHandle {
  kind: 'file';
  name: string;
  getFile(): Promise<File>;
}

interface LaunchParams {
  files?: FileSystemFileHandle[];
}

interface LaunchQueue {
  setLaunchConsumer(consumer: (params: LaunchParams) => void): void;
}

interface SharedFile {
  file: File;
  webkitRelativePath: string;
}

export function useShareHandler() {
  const [sharedFile, setSharedFile] = useState<SharedFile | null>(null);

  useEffect(() => {
    if (!('LaunchQueue' in window)) {
      return;
    }

    const launchQueue = window.LaunchQueue as unknown as LaunchQueue;
    const launchConsumer = async (launchParams: LaunchParams) => {
      const files = launchParams.files;
      if (files && files.length > 0) {
        const fileHandle = files[0];
        if (fileHandle.kind === 'file') {
          const file = await (fileHandle as FileSystemFileHandle).getFile();
          setSharedFile({
            file,
            webkitRelativePath: file.webkitRelativePath,
          });
        }
      }
    };

    launchQueue.setLaunchConsumer(launchConsumer);
  }, []);

  return sharedFile;
}
