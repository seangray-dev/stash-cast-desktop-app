import { useQuery } from '@tanstack/react-query';

export interface DesktopSource {
  id: string;
  name: string;
  thumbnail: Electron.NativeImage;
  display_id: string;
  appIcon: Electron.NativeImage;
}

interface MediaSources {
  displays: DesktopSource[];
  audioinputs: MediaDeviceInfo[];
  videoinputs: MediaDeviceInfo[];
}

export const getMediaSources = async (): Promise<MediaSources> => {
  const displays = await window.ipcRenderer.invoke('getSources');

  const devices = await window.navigator.mediaDevices.enumerateDevices();
  const audioinputs = devices.filter((device) => device.kind === 'audioinput');
  const videoinputs = devices.filter((device) => device.kind === 'videoinput');

  return { displays, audioinputs, videoinputs };
};

export function useMediaSources() {
  return useQuery({
    queryKey: ['media-sources'],
    queryFn: getMediaSources,
  });
}
