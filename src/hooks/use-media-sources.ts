import useMediaConfigStore from '@/stores/media-config-store';
import { DesktopSource, MediaSources } from '@/types/media';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

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
  const setMediaSources = useMediaConfigStore((state) => state.setMediaSources);
  const setIsLoading = useMediaConfigStore((state) => state.setIsLoading);

  const { data, isPending, error } = useQuery({
    queryKey: ['media-sources'],
    queryFn: async () => {
      setIsLoading(true);
      try {
        // Request permissions first to ensure we get device labels
        await navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .catch(() => {
            // Even if we can't get access, continue with enumeration
            console.warn(
              'Could not get media permissions, continuing with enumeration'
            );
          });

        const [screens, devices] = await Promise.all([
          window.ipcRenderer.invoke('get-screens') as Promise<DesktopSource[]>,
          navigator.mediaDevices.enumerateDevices(),
        ]);

        const mics = devices.filter((device) => device.kind === 'audioinput');
        const cameras = devices.filter(
          (device) => device.kind === 'videoinput'
        );

        console.log('Enumerated devices:', { screens, mics, cameras });

        const sources: MediaSources = {
          displays: screens.map((display) => ({
            ...display,
            name: isScreen(display)
              ? normalizeScreenName(display.name)
              : normalizeWindowName(display.name),
          })),
          audioinputs: mics,
          videoinputs: cameras,
        };

        return sources;
      } catch (error) {
        console.error('Error getting media sources:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    // Return empty arrays as defaults
    initialData: {
      displays: [],
      audioinputs: [],
      videoinputs: [],
    },
  });

  // Update media sources in store when they change
  useEffect(() => {
    if (data) {
      setMediaSources(data);
    }
  }, [data, setMediaSources]);

  return {
    data,
    isPending,
    error,
  };
}
