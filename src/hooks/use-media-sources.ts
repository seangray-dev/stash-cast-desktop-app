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

// Helper to normalize screen names across platforms
function normalizeScreenName(name: string): string {
  // On some platforms it might be "Entire Screen" or "Screen <index>"
  // We want to show a consistent name
  if (name.toLowerCase().includes('entire')) {
    return 'Main Screen';
  }
  return name;
}

// Helper to normalize window names across platforms
function normalizeWindowName(name: string): string {
  // Remove platform-specific window manager decorations if present
  return name.replace(/^(.*?) - .*$/, '$1').trim();
}

// Helper to check if a source is a screen
export function isScreen(source: DesktopSource): boolean {
  return source.id.startsWith('screen:');
}

// Helper to check if a source is a window
export function isWindow(source: DesktopSource): boolean {
  return source.id.startsWith('window:');
}

export const getMediaSources = async (): Promise<MediaSources> => {
  const rawDisplays = await window.ipcRenderer.invoke('getSources');

  // Normalize the display sources
  const displays = rawDisplays.map((display: DesktopSource) => ({
    ...display,
    name: isScreen(display)
      ? normalizeScreenName(display.name)
      : normalizeWindowName(display.name),
  }));

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
