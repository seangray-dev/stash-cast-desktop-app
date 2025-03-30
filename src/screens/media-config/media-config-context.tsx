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
  microphoneStream: MediaStream | null;
  setMicrophoneStream: (stream: MediaStream | null) => void;
  selectedCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isDisplayEnabled: boolean;
  setIsDisplayEnabled: (enabled: boolean) => void;
  toggleDisplay: () => void;
  isMicrophoneEnabled: boolean;
  setIsMicrophoneEnabled: (enabled: boolean) => void;
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
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(
    null
  );
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
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

  // Handle microphone stream
  useEffect(() => {
    if (!selectedMicId || !isMicrophoneEnabled) {
      if (microphoneStream) {
        microphoneStream.getTracks().forEach((track) => track.stop());
        setMicrophoneStream(null);
      }
      return;
    }

    const startMicrophone = async () => {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedMicId,
          },
        });
        setMicrophoneStream(stream);
      } catch (error) {
        console.error('Error capturing microphone:', error);
        setIsMicrophoneEnabled(false);
      }
    };

    startMicrophone();

    return () => {
      if (microphoneStream) {
        microphoneStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedMicId, isMicrophoneEnabled]);

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
        microphoneStream,
        setMicrophoneStream,
        selectedCameraId,
        setSelectedCameraId,
        isRecording,
        setIsRecording,
        isDisplayEnabled,
        setIsDisplayEnabled,
        toggleDisplay,
        isMicrophoneEnabled,
        setIsMicrophoneEnabled,
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
