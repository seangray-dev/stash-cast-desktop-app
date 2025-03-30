import { DesktopSource } from '@/hooks/use-media-sources';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface MediaConfigContextType {
  selectedScreen: DesktopSource | null;
  setSelectedScreen: (screen: DesktopSource | null) => void;
  screenStream: MediaStream | null;
  setScreenStream: (stream: MediaStream | null) => void;
  selectedMicId: string | null;
  setSelectedMicId: (id: string | null) => void;
  selectedCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isDisplayEnabled: boolean;
  toggleDisplay: () => void;
}

const MediaConfigContext = createContext<MediaConfigContextType | undefined>(
  undefined
);

export function MediaConfigProvider({ children }: { children: ReactNode }) {
  const [selectedScreen, setSelectedScreen] = useState<DesktopSource | null>(
    null
  );
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isDisplayEnabled, setIsDisplayEnabled] = useState(false);
  const [selectedMicId, setSelectedMicId] = useState<string | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Handle screen capture stream
  useEffect(() => {
    if (!selectedScreen || !isDisplayEnabled) {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      return;
    }

    const startCapture = async () => {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            // @ts-ignore - Electron's desktopCapturer requires these properties
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: selectedScreen.id,
            },
          },
        });
        setScreenStream(stream);
      } catch (error) {
        console.error('Error capturing screen:', error);
        setIsDisplayEnabled(false);
      }
    };

    startCapture();

    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedScreen, isDisplayEnabled]);

  const toggleDisplay = async () => {
    setIsDisplayEnabled(!isDisplayEnabled);
  };

  return (
    <MediaConfigContext.Provider
      value={{
        selectedScreen,
        setSelectedScreen,
        screenStream,
        setScreenStream,
        selectedMicId,
        setSelectedMicId,
        selectedCameraId,
        setSelectedCameraId,
        isRecording,
        setIsRecording,
        isDisplayEnabled,
        toggleDisplay,
      }}>
      {children}
    </MediaConfigContext.Provider>
  );
}

export function useMediaConfig() {
  const context = useContext(MediaConfigContext);
  if (context === undefined) {
    throw new Error('useMediaConfig must be used within a MediaConfigProvider');
  }
  return context;
}
