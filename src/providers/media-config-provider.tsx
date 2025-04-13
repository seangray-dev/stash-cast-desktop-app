import { getCurrentWorkspace } from '@/db/operations';
import { useMediaSources } from '@/hooks/use-media-sources';
import {
  initializeMediaPreferences,
  saveMediaPreferences,
  type MediaPreferences,
} from '@/services/media-preferences';
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
  setMediaConfig: (config: MediaPreferences) => void;
  isLoading: boolean;
  selectedScreenId: string | null;
  setSelectedScreenId: (id: string | null) => void;
  mediaSources: MediaSources | undefined;
  setMediaSources: (sources: MediaSources) => void;
  handleCameraChange: (cameraId: string | null) => void;
}

const MediaConfigContext = createContext<MediaConfigContextType>(null!);

export function MediaConfigProvider({ children }: { children: ReactNode }) {
  const { data: mediaSources, isPending } = useMediaSources();
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedScreen, setSelectedScreen] = useState<DesktopSource | null>(
    null
  );
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [selectedMicId, setSelectedMicId] = useState<string | null>(null);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(
    null
  );
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDisplayEnabled, setIsDisplayEnabled] = useState(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [mediaSourcesState, setMediaSourcesState] = useState<MediaSources>();
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const previousSettings = useRef<MediaPreferences | null>(null);

  useEffect(() => {
    if (mediaSources) {
      setMediaSourcesState(mediaSources);
    }
  }, [mediaSources]);

  // Handle screen capture when display is enabled
  useEffect(() => {
    if (!selectedScreen || !isDisplayEnabled) {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      return;
    }

    async function startCapture(screen: DesktopSource) {
      try {
        console.log('🎥 Starting screen capture for:', screen.name);
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            // @ts-ignore - Electron's desktopCapturer requires these properties
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: screen.id,
            },
          },
        });
        console.log('📺 Screen capture stream obtained');
        setScreenStream(stream);
      } catch (error) {
        console.error('❌ Error capturing screen:', error);
        setIsDisplayEnabled(false);
      }
    }

    startCapture(selectedScreen);

    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedScreen, isDisplayEnabled]);

  useEffect(() => {
    async function initializeConfig() {
      if (!mediaSources) return;

      try {
        console.log('🔄 Starting media config initialization');
        setIsInitializing(true);
        const preferences = await initializeMediaPreferences(
          mediaSources.displays,
          mediaSources.audioinputs,
          mediaSources.videoinputs
        );
        console.log('📦 Received preferences:', preferences);

        // Initialize state with preferences
        if (preferences.selectedScreenId) {
          console.log(
            '🎯 Setting selected screen:',
            preferences.selectedScreenId
          );
          const screen = mediaSources.displays.find(
            (s) => s.id === preferences.selectedScreenId
          );
          if (screen) {
            console.log('🖥️ Found matching screen:', screen.name);
            setSelectedScreen(screen);
            setSelectedScreenId(preferences.selectedScreenId);
          } else {
            console.log('⚠️ Selected screen not found in available displays');
          }
        }

        // Set all state at once to avoid race conditions
        setSelectedMicId(preferences.selectedMicId);
        setSelectedCameraId(preferences.selectedCameraId);
        setIsMicrophoneEnabled(preferences.isMicrophoneEnabled);
        setIsCameraEnabled(preferences.isCameraEnabled);
        setIsDisplayEnabled(preferences.isDisplayEnabled);

        console.log('✨ Initialized state:', {
          selectedScreenId: preferences.selectedScreenId,
          selectedMicId: preferences.selectedMicId,
          selectedCameraId: preferences.selectedCameraId,
          isMicrophoneEnabled: preferences.isMicrophoneEnabled,
          isCameraEnabled: preferences.isCameraEnabled,
          isDisplayEnabled: preferences.isDisplayEnabled,
        });

        // Save preferences to ensure they persist
        await saveMediaPreferences(preferences);
      } catch (error) {
        console.error('❌ Error initializing media config:', error);
      } finally {
        setIsInitializing(false);
        console.log('✅ Initialization complete');
      }
    }

    if (!isPending && mediaSources) {
      console.log('🎬 Media sources ready:', {
        displays: mediaSources.displays.length,
        audioinputs: mediaSources.audioinputs.length,
        videoinputs: mediaSources.videoinputs.length,
      });
      initializeConfig();
    }
  }, [mediaSources, isPending]);

  // Handle camera stream when camera is enabled
  useEffect(() => {
    console.log('📸 Camera Effect:', {
      hasSelectedCamera: !!selectedCameraId,
      isCameraEnabled,
      hasExistingStream: !!cameraStream,
    });

    const cleanup = () => {
      if (cameraStream) {
        console.log('🧹 Cleanup: Stopping camera stream');
        cameraStream.getTracks().forEach((track) => {
          track.stop();
          console.log('✋ Stopped track:', track.id);
        });
        setCameraStream(null);
      }
    };

    if (!selectedCameraId || !isCameraEnabled) {
      cleanup();
      hideCameraWindow();
      return;
    }

    async function startCamera() {
      try {
        console.log('🎥 Starting camera with:', { deviceId: selectedCameraId });
        cleanup(); // Clean up any existing stream before creating a new one

        // Ensure selectedCameraId is not null before using it
        if (!selectedCameraId) {
          throw new Error('No camera selected');
        }

        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        console.log('📹 Camera stream obtained:', {
          tracks: stream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            id: t.id,
          })),
        });

        setCameraStream(stream);

        // Only show camera window if we have a screen stream
        if (isDisplayEnabled) {
          console.log('🪟 Showing camera window due to display being enabled');
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            window.ipcRenderer.send('camera-stream-ready', {
              streamId: videoTrack.id,
              settings: videoTrack.getSettings(),
            });
            showCameraWindow();
          }
        }
      } catch (error) {
        console.error('❌ Error capturing camera:', error);
        setIsCameraEnabled(false);
        hideCameraWindow();
      }
    }

    startCamera();
    return cleanup;
  }, [selectedCameraId, isCameraEnabled]);

  // Handle camera window visibility based on display state
  useEffect(() => {
    console.log('🪟 Camera Window Effect:', {
      isDisplayEnabled,
      isCameraEnabled,
      hasCameraStream: !!cameraStream,
    });

    if (isDisplayEnabled && isCameraEnabled && cameraStream) {
      console.log('📺 Showing camera window and sending stream ID');
      const videoTrack = cameraStream.getVideoTracks()[0];
      if (videoTrack) {
        window.ipcRenderer.send('camera-stream-ready', {
          streamId: videoTrack.id,
          settings: videoTrack.getSettings(),
        });
        showCameraWindow();
      }
    } else {
      console.log('🚫 Hiding camera window');
      hideCameraWindow();
    }
  }, [isDisplayEnabled, isCameraEnabled, cameraStream]);

  const showCameraWindow = () => {
    window.ipcRenderer.send('show-camera-window');
  };

  const hideCameraWindow = () => {
    window.ipcRenderer.send('hide-camera-window');
  };

  const toggleDisplay = async () => {
    const newState = !isDisplayEnabled;
    setIsDisplayEnabled(newState);

    // Save the new state
    const preferences: MediaPreferences = {
      selectedScreenId,
      selectedMicId,
      selectedCameraId,
      isMicrophoneEnabled,
      isCameraEnabled,
      isDisplayEnabled: newState,
    };
    await saveMediaPreferences(preferences);
  };

  const setMediaConfig = async (config: MediaPreferences) => {
    console.log('🔄 Setting media config:', config);

    // First update all the state
    setSelectedScreenId(config.selectedScreenId);
    if (config.selectedScreenId && mediaSources) {
      const screen = mediaSources.displays.find(
        (s) => s.id === config.selectedScreenId
      );
      setSelectedScreen(screen || null);
    }
    setSelectedMicId(config.selectedMicId);
    setSelectedCameraId(config.selectedCameraId);
    setIsMicrophoneEnabled(config.isMicrophoneEnabled);
    setIsCameraEnabled(config.isCameraEnabled);
    setIsDisplayEnabled(config.isDisplayEnabled);

    // Then save the preferences
    await saveMediaPreferences(config);
  };

  const handleWorkspaceSave = async (workspaceId: number) => {
    console.log('💾 Saving workspace:', workspaceId);

    // Get current settings
    const currentSettings: MediaPreferences = {
      selectedScreenId: selectedScreen?.id || null,
      selectedMicId,
      selectedCameraId,
      isMicrophoneEnabled,
      isCameraEnabled,
      isDisplayEnabled,
    };

    // Save the current settings
    await saveMediaPreferences(currentSettings);

    // Update the current workspace reference
    const workspace = await getCurrentWorkspace();
    setCurrentWorkspace(workspace);

    // Store these as the previous settings to prevent another dialog
    previousSettings.current = currentSettings;

    // Close the dialog
  };

  // Handle camera selection changes
  const handleCameraChange = useCallback(
    async (cameraId: string | null) => {
      console.log('🎥 Changing camera to:', cameraId);

      // First stop any existing camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }

      // Update the camera ID
      setSelectedCameraId(cameraId);

      // If we're selecting a camera, enable it
      if (cameraId) {
        setIsCameraEnabled(true);
      }

      // Save the new settings immediately
      const newSettings: MediaPreferences = {
        selectedScreenId: selectedScreen?.id || null,
        selectedMicId,
        selectedCameraId: cameraId,
        isMicrophoneEnabled,
        isCameraEnabled: true,
        isDisplayEnabled,
      };

      await saveMediaPreferences(newSettings);
      previousSettings.current = newSettings;
    },
    [
      cameraStream,
      selectedScreen,
      selectedMicId,
      isMicrophoneEnabled,
      isDisplayEnabled,
    ]
  );

  const handleSettingsChange = useCallback(async () => {
    // Don't show dialog during initialization
    if (isInitializing) return;

    const currentSettings: MediaPreferences = {
      selectedScreenId: selectedScreen?.id || null,
      selectedMicId,
      selectedCameraId,
      isMicrophoneEnabled,
      isCameraEnabled,
      isDisplayEnabled,
    };

    // If this is the first change, store the initial settings
    if (!previousSettings.current) {
      previousSettings.current = currentSettings;
      return;
    }

    // Check if any settings have changed
    const hasChanges = Object.entries(currentSettings).some(
      ([key, value]) =>
        previousSettings.current?.[key as keyof MediaPreferences] !== value
    );

    if (hasChanges) {
      const workspace = await getCurrentWorkspace();
      setCurrentWorkspace(workspace);
    }

    previousSettings.current = currentSettings;
  }, [
    isInitializing,
    selectedScreen,
    selectedMicId,
    selectedCameraId,
    isMicrophoneEnabled,
    isCameraEnabled,
    isDisplayEnabled,
  ]);

  // Watch for settings changes
  useEffect(() => {
    handleSettingsChange();
  }, [handleSettingsChange]);

  const value = {
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
    setMediaConfig,
    isLoading: isInitializing || isPending,
    selectedScreenId,
    setSelectedScreenId,
    mediaSources: mediaSourcesState,
    setMediaSources: setMediaSourcesState,
    handleCameraChange,
  };

  return (
    <MediaConfigContext.Provider
      value={{
        ...value,
        handleCameraChange,
      }}>
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
