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
  cameraStream: MediaStream | null;
  setCameraStream: (stream: MediaStream | null) => void;
  isCameraEnabled: boolean;
  setIsCameraEnabled: (enabled: boolean) => void;
  showCameraWindow: () => void;
  hideCameraWindow: () => void;
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
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

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

  // Handle camera stream
  useEffect(() => {
    console.log('MediaConfig Camera Effect:', {
      hasSelectedCamera: !!selectedCameraId,
      isCameraEnabled,
      hasExistingStream: !!cameraStream,
    });

    const cleanup = () => {
      if (cameraStream) {
        console.log('Cleanup: Stopping camera stream');
        cameraStream.getTracks().forEach((track) => {
          track.stop();
          console.log('Stopped track:', track.id);
        });
        setCameraStream(null);
      }
    };

    if (!selectedCameraId || !isCameraEnabled) {
      cleanup();
      return;
    }

    const startCamera = async () => {
      try {
        console.log('Attempting to start camera with:', {
          deviceId: selectedCameraId,
        });

        // Clean up any existing stream before creating a new one
        cleanup();

        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        console.log('Camera stream obtained:', {
          tracks: stream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            id: t.id,
          })),
        });

        setCameraStream(stream);

        // Only show camera window if we have a screen stream
        if (isDisplayEnabled) {
          console.log('Showing camera window due to display being enabled');
          window.ipcRenderer.send('show-camera-window');
        }
      } catch (error) {
        console.error('Error capturing camera:', error);
        setIsCameraEnabled(false);
      }
    };

    startCamera();

    return cleanup;
  }, [selectedCameraId, isCameraEnabled]);

  // Handle camera window visibility and stream based on display state
  useEffect(() => {
    if (isDisplayEnabled && isCameraEnabled && cameraStream) {
      console.log('Showing camera window and sending stream ID');
      const videoTrack = cameraStream.getVideoTracks()[0];
      if (videoTrack) {
        window.ipcRenderer.send('camera-stream-ready', {
          streamId: videoTrack.id,
          settings: videoTrack.getSettings(),
        });
        window.ipcRenderer.send('show-camera-window');
      }
    } else {
      console.log('Hiding camera window');
      window.ipcRenderer.send('hide-camera-window');
    }
  }, [isDisplayEnabled, isCameraEnabled, cameraStream]);

  const toggleDisplay = async () => {
    setIsDisplayEnabled(!isDisplayEnabled);
  };

  const showCameraWindow = () => {
    window.ipcRenderer.send('show-camera-window');
  };

  const hideCameraWindow = () => {
    window.ipcRenderer.send('hide-camera-window');
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
        cameraStream,
        setCameraStream,
        isCameraEnabled,
        setIsCameraEnabled,
        showCameraWindow,
        hideCameraWindow,
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
