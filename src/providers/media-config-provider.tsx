import { useMediaSources } from '@/hooks/use-media-sources';
import { initializeMediaPreferences } from '@/services/media-preferences';
import { DesktopSource, MediaSources } from '@/types/media';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface MediaConfigContextType {
  // Device selections (persisted)
  selectedScreen: DesktopSource | null;
  setSelectedScreen: (screen: DesktopSource | null) => void;
  selectedMicId: string | null;
  setSelectedMicId: (id: string | null) => void;
  selectedCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;
  selectedScreenId: string | null;
  setSelectedScreenId: (id: string | null) => void;

  // Toggle states (temporary)
  isDisplayEnabled: boolean;
  setIsDisplayEnabled: (enabled: boolean) => void;
  isMicrophoneEnabled: boolean;
  setIsMicrophoneEnabled: (enabled: boolean) => void;
  isCameraEnabled: boolean;
  setIsCameraEnabled: (enabled: boolean) => void;

  // Streams
  screenStream: MediaStream | null;
  setScreenStream: (stream: MediaStream | null) => void;
  microphoneStream: MediaStream | null;
  setMicrophoneStream: (stream: MediaStream | null) => void;
  cameraStream: MediaStream | null;
  setCameraStream: (stream: MediaStream | null) => void;

  // Other
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isLoading: boolean;
  mediaSources: MediaSources | undefined;
  setMediaSources: (sources: MediaSources) => void;

  // Handlers
  handleCameraChange: (id: string | null) => void;
  handleMicChange: (id: string | null) => void;
  handleScreenChange: (screen: DesktopSource | null) => void;
}

export const MediaConfigContext = createContext<MediaConfigContextType | null>(
  null
);

export function MediaConfigProvider({ children }: { children: ReactNode }) {
  const { data: mediaSources, isPending } = useMediaSources();
  const [isInitializing, setIsInitializing] = useState(true);

  // Device selections (persisted)
  const [selectedScreen, setSelectedScreen] = useState<DesktopSource | null>(
    null
  );
  const [selectedMicId, setSelectedMicId] = useState<string | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Toggle states (temporary)
  const [isDisplayEnabled, setIsDisplayEnabled] = useState(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  // Streams
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(
    null
  );
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Other
  const [isRecording, setIsRecording] = useState(false);
  const [mediaSourcesState, setMediaSourcesState] = useState<MediaSources>();

  // Track changes for device selections only
  const previousSettings = useRef<{
    selectedScreenId: string | null;
    selectedMicId: string | null;
    selectedCameraId: string | null;
  } | null>(null);

  // Handle device changes (these affect persisted settings)
  const handleCameraChange = useCallback(
    async (cameraId: string | null) => {
      console.log('🎥 Changing camera to:', cameraId);

      // Stop existing stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }

      // Update selection
      setSelectedCameraId(cameraId);

      // If we have a camera ID and it's enabled, start the stream
      if (cameraId && isCameraEnabled) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: cameraId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });
          setCameraStream(stream);

          // Send stream to camera window
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            window.ipcRenderer.send('camera-stream-ready', {
              streamId: videoTrack.id,
              settings: videoTrack.getSettings(),
            });
            window.ipcRenderer.send('show-camera-window');
          }
        } catch (error) {
          console.error('❌ Error starting camera stream:', error);
          setIsCameraEnabled(false);
        }
      } else {
        window.ipcRenderer.send('hide-camera-window');
      }

      // Track the change
      if (previousSettings.current) {
        previousSettings.current.selectedCameraId = cameraId;
      }
    },
    [cameraStream, isCameraEnabled]
  );

  const handleMicChange = useCallback(
    async (micId: string | null) => {
      console.log('🎤 Changing microphone to:', micId);

      // Stop existing stream
      if (microphoneStream) {
        microphoneStream.getTracks().forEach((track) => track.stop());
        setMicrophoneStream(null);
      }

      // Update selection
      setSelectedMicId(micId);

      // Track the change
      if (previousSettings.current) {
        previousSettings.current.selectedMicId = micId;
      }
    },
    [microphoneStream]
  );

  const handleScreenChange = useCallback(
    async (screen: DesktopSource | null) => {
      console.log('🖥️ Changing screen to:', screen?.name);

      // Stop existing stream
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }

      // Update selection
      setSelectedScreen(screen);
      setSelectedScreenId(screen?.id || null);

      // Track the change
      if (previousSettings.current) {
        previousSettings.current.selectedScreenId = screen?.id || null;
      }
    },
    [screenStream]
  );

  // Handle screen stream when display is enabled/disabled
  useEffect(() => {
    async function startScreenCapture() {
      if (!selectedScreen || !isDisplayEnabled) {
        if (screenStream) {
          screenStream.getTracks().forEach((track) => track.stop());
          setScreenStream(null);
        }
        return;
      }

      try {
        console.log('🖥️ Starting screen capture for:', selectedScreen.name);
        const stream = await navigator.mediaDevices.getUserMedia({
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
        console.error('❌ Error capturing screen:', error);
        setIsDisplayEnabled(false);
      }
    }

    startScreenCapture();
  }, [selectedScreen, isDisplayEnabled]);

  // Handle camera stream when enabled/disabled
  useEffect(() => {
    async function updateCameraStream() {
      // If disabled or no camera selected, stop stream
      if (!isCameraEnabled || !selectedCameraId) {
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
          setCameraStream(null);
        }
        window.ipcRenderer.send('hide-camera-window');
        return;
      }

      // If already streaming the correct camera, just update window visibility
      if (cameraStream) {
        const videoTrack = cameraStream.getVideoTracks()[0];
        if (videoTrack) {
          window.ipcRenderer.send('camera-stream-ready', {
            streamId: videoTrack.id,
            settings: videoTrack.getSettings(),
          });
          window.ipcRenderer.send('show-camera-window');
        }
        return;
      }

      // Start new stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        setCameraStream(stream);

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          window.ipcRenderer.send('camera-stream-ready', {
            streamId: videoTrack.id,
            settings: videoTrack.getSettings(),
          });
          window.ipcRenderer.send('show-camera-window');
        }
      } catch (error) {
        console.error('❌ Error starting camera stream:', error);
        setIsCameraEnabled(false);
      }
    }

    updateCameraStream();
  }, [isCameraEnabled, selectedCameraId]);

  // Initialize from workspace settings
  useEffect(() => {
    async function initializeConfig() {
      if (!mediaSources) return;

      try {
        console.log('🚀 Initializing media config');
        const preferences = await initializeMediaPreferences(
          mediaSources.displays,
          mediaSources.audioinputs,
          mediaSources.videoinputs
        );

        // Set device selections (persisted settings)
        setSelectedScreenId(preferences.selectedScreenId);
        if (preferences.selectedScreenId) {
          const screen = mediaSources.displays.find(
            (s) => s.id === preferences.selectedScreenId
          );
          setSelectedScreen(screen || null);
        }
        setSelectedMicId(preferences.selectedMicId);
        setSelectedCameraId(preferences.selectedCameraId);

        // Set initial toggle states
        setIsDisplayEnabled(preferences.isDisplayEnabled);
        setIsMicrophoneEnabled(preferences.isMicrophoneEnabled);
        setIsCameraEnabled(preferences.isCameraEnabled);

        // Initialize change tracking
        previousSettings.current = {
          selectedScreenId: preferences.selectedScreenId,
          selectedMicId: preferences.selectedMicId,
          selectedCameraId: preferences.selectedCameraId,
        };

        console.log('✅ Media config initialized:', preferences);
      } catch (error) {
        console.error('❌ Error initializing media config:', error);
      } finally {
        setIsInitializing(false);
      }
    }

    if (!isPending && mediaSources) {
      initializeConfig();
    }
  }, [mediaSources, isPending]);

  const value: MediaConfigContextType = {
    // Device selections
    selectedScreen,
    setSelectedScreen,
    selectedMicId,
    setSelectedMicId,
    selectedCameraId,
    setSelectedCameraId,
    selectedScreenId,
    setSelectedScreenId,

    // Toggle states
    isDisplayEnabled,
    setIsDisplayEnabled,
    isMicrophoneEnabled,
    setIsMicrophoneEnabled,
    isCameraEnabled,
    setIsCameraEnabled,

    // Streams
    screenStream,
    setScreenStream,
    microphoneStream,
    setMicrophoneStream,
    cameraStream,
    setCameraStream,

    // Other
    isRecording,
    setIsRecording,
    isLoading: isInitializing || isPending,
    mediaSources: mediaSourcesState,
    setMediaSources: setMediaSourcesState,

    // Handlers
    handleCameraChange,
    handleMicChange,
    handleScreenChange,
  };

  return (
    <MediaConfigContext.Provider value={value}>
      {children}
    </MediaConfigContext.Provider>
  );
}

export function useMediaConfig() {
  const context = useContext(MediaConfigContext);
  if (!context) {
    throw new Error('useMediaConfig must be used within a MediaConfigProvider');
  }
  return context;
}
