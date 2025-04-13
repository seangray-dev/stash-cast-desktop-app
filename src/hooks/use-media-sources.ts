import { DesktopSource, MediaSources } from '@/types/media';
import { useQuery } from '@tanstack/react-query';

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
export function isScreen(
  source: DesktopSource
): source is DesktopSource & { type: 'screen' } {
  return source.type === 'screen';
}

// Helper to check if a source is a window
export function isWindow(
  source: DesktopSource
): source is DesktopSource & { type: 'window' } {
  return source.type === 'window';
}

export function useMediaSources() {
  return useQuery({
    queryKey: ['media-sources'],
    queryFn: async () => {
      const [screens, mics, cameras] = await Promise.all([
        window.ipcRenderer.invoke('get-screens') as Promise<DesktopSource[]>,
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) =>
            devices.filter((device) => device.kind === 'audioinput')
          ),
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) =>
            devices.filter((device) => device.kind === 'videoinput')
          ),
      ]);

      return {
        displays: screens.map((display) => ({
          ...display,
          name: isScreen(display)
            ? normalizeScreenName(display.name)
            : normalizeWindowName(display.name),
        })),
        audioinputs: mics,
        videoinputs: cameras,
      } as MediaSources;
    },
  });
}
