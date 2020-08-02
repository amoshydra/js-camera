export type VideoStreamConstrain = MediaStreamConstraints['video'];

const STORAGE_KEY = 'video_stream_constrain';

export class ConfigurationStorage {
  static defaultConfig: MediaTrackConstraints = {
    facingMode: 'environment',
    width: { ideal: 640 },
    height: { ideal: 480 }
  }

  config: VideoStreamConstrain;

  constructor() {
    this.config = this.load();
  }

  store(data: VideoStreamConstrain, throwOnFail = false): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      if (throwOnFail) {
        throw error;
      }
      return false;
    }
  }

  load(throwOnFail = false): VideoStreamConstrain {
    const dataString = localStorage.getItem(STORAGE_KEY);

    if (dataString == null) {
      return ConfigurationStorage.defaultConfig;
    }

    try {
      return JSON.parse(dataString);
    } catch (error) {
      this.reset();
      // eslint-disable-next-line no-console
      console.error(error);
      if (throwOnFail) {
        throw error;
      }
    }
  }

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
