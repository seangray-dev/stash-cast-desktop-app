import {
  getCurrentDevice,
  getCurrentWorkspace,
  updateWorkspaceSettings,
} from '@/db/operations';
import { useMediaSources } from '@/hooks/use-media-sources';
import {
  useCreateDefaultWorkspace,
  useCurrentDevice,
  useCurrentWorkspace,
  useUpdateWorkspaceSettings,
  useWorkspaceSettings,
} from '@/hooks/use-workspace-query';
import { DesktopSource, MediaSources } from '@/types/media';
import { useEffect } from 'react';
import { create } from 'zustand';

interface MediaState {
  // Device selections
  selectedScreen: DesktopSource | null;
  selectedScreenId: string | null;
  selectedMicId: string | null;
  selectedCameraId: string | null;

  // Toggle states (temporary)
  isDisplayEnabled: boolean;
  isMicrophoneEnabled: boolean;
  isCameraEnabled: boolean;

  // Streams
  screenStream: MediaStream | null;
  microphoneStream: MediaStream | null;
  cameraStream: MediaStream | null;

  // Media Sources
  mediaSources: MediaSources | null;
  isLoading: boolean;
  isRecording: boolean;

  // Actions
  setSelectedScreen: (screen: DesktopSource | null) => void;
  setSelectedScreenId: (id: string | null) => void;
  setSelectedMicId: (id: string | null) => void;
  setSelectedCameraId: (id: string | null) => void;

  setIsDisplayEnabled: (enabled: boolean) => void;
  setIsMicrophoneEnabled: (enabled: boolean) => void;
  setIsCameraEnabled: (enabled: boolean) => void;

  setScreenStream: (stream: MediaStream | null) => void;
  setMicrophoneStream: (stream: MediaStream | null) => void;
  setCameraStream: (stream: MediaStream | null) => void;

  setMediaSources: (sources: MediaSources | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsRecording: (recording: boolean) => void;

  // Media Handlers
  handleScreenChange: (screen: DesktopSource | null) => Promise<void>;
  handleMicChange: (id: string | null) => Promise<void>;
  handleCameraChange: (id: string | null) => Promise<void>;

  // Utility
  stopAllStreams: () => void;

  // Add new actions for explicit saves
  saveCurrentSettings: () => Promise<void>;
}

const useMediaConfigStore = create<MediaState>((set, get) => ({
  // Media Sources
  mediaSources: {
    displays: [],
    audioinputs: [],
    videoinputs: [],
  },
  setMediaSources: (sources) => {
    if (!sources) return;
    set({ mediaSources: sources });
  },

  // Selected Devices
  selectedScreen: null,
  selectedScreenId: null,
  selectedMicId: null,
  selectedCameraId: null,

  // Toggle States - all enabled by default
  isDisplayEnabled: true,
  isMicrophoneEnabled: true,
  isCameraEnabled: true,

  // Streams
  screenStream: null,
  microphoneStream: null,
  cameraStream: null,

  isLoading: true,
  isRecording: false,

  // Basic setters
  setSelectedScreen: (screen) => set({ selectedScreen: screen }),
  setSelectedScreenId: (id) => set({ selectedScreenId: id }),
  setSelectedMicId: (id) => set({ selectedMicId: id }),
  setSelectedCameraId: (id) => set({ selectedCameraId: id }),

  setIsDisplayEnabled: (enabled) => {
    const { selectedScreen, screenStream, setScreenStream } = get();

    if (!enabled && screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    } else if (enabled && selectedScreen) {
      get().handleScreenChange(selectedScreen);
    }

    set({ isDisplayEnabled: enabled });
  },

  setIsMicrophoneEnabled: (enabled) => {
    const { selectedMicId, microphoneStream, setMicrophoneStream } = get();

    if (!enabled && microphoneStream) {
      microphoneStream.getTracks().forEach((track) => track.stop());
      setMicrophoneStream(null);
    } else if (enabled && selectedMicId) {
      get().handleMicChange(selectedMicId);
    }

    set({ isMicrophoneEnabled: enabled });
  },

  setIsCameraEnabled: (enabled) => {
    const { selectedCameraId, cameraStream, setCameraStream } = get();

    if (!enabled && cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      window.ipcRenderer.send('hide-camera-window');
    } else if (enabled && selectedCameraId) {
      get().handleCameraChange(selectedCameraId);
    }

    set({ isCameraEnabled: enabled });
  },

  setScreenStream: (stream) => set({ screenStream: stream }),
  setMicrophoneStream: (stream) => set({ microphoneStream: stream }),
  setCameraStream: (stream) => set({ cameraStream: stream }),

  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsRecording: (recording) => set({ isRecording: recording }),

  // Media Handlers
  handleScreenChange: async (screen) => {
    const {
      screenStream,
      setScreenStream,
      setSelectedScreen,
      setSelectedScreenId,
      isDisplayEnabled,
    } = get();

    // Stop existing stream
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }

    // Update selection
    setSelectedScreen(screen);
    setSelectedScreenId(screen?.id || null);

    // Start new stream if enabled
    if (screen && isDisplayEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            // @ts-ignore - Electron's desktopCapturer requires these properties
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: screen.id,
            },
          },
        });
        setScreenStream(stream);
      } catch (error) {
        console.error('Error starting screen stream:', error);
      }
    }
  },

  handleMicChange: async (micId) => {
    const {
      microphoneStream,
      setMicrophoneStream,
      setSelectedMicId,
      isMicrophoneEnabled,
    } = get();

    // Stop existing stream
    if (microphoneStream) {
      microphoneStream.getTracks().forEach((track) => track.stop());
      setMicrophoneStream(null);
    }

    // Update selection
    setSelectedMicId(micId);

    // Start new stream if enabled
    if (micId && isMicrophoneEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: micId },
          },
        });
        setMicrophoneStream(stream);
      } catch (error) {
        console.error('Error starting microphone stream:', error);
      }
    }
  },

  handleCameraChange: async (id: string | null) => {
    if (!id) return;

    const { cameraStream, setCameraStream, isCameraEnabled } = get();

    // Stop existing stream
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    // Start new stream if enabled
    if (isCameraEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: id },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        set({ cameraStream: stream, selectedCameraId: id });
      } catch (error) {
        console.error('Error starting camera stream:', error);
        set({ cameraStream: null });
      }
    } else {
      set({ selectedCameraId: id });
    }
  },

  // Utility to stop all media streams
  stopAllStreams: () => {
    const {
      screenStream,
      microphoneStream,
      cameraStream,
      setScreenStream,
      setMicrophoneStream,
      setCameraStream,
    } = get();

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }

    if (microphoneStream) {
      microphoneStream.getTracks().forEach((track) => track.stop());
      setMicrophoneStream(null);
    }

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      window.ipcRenderer.send('hide-camera-window');
    }
  },

  // Add explicit save function
  saveCurrentSettings: async () => {
    const state = get();
    const settings = {
      selectedScreenId: state.selectedScreenId,
      selectedMicId: state.selectedMicId,
      selectedCameraId: state.selectedCameraId,
      defaultDisplayEnabled: state.isDisplayEnabled,
      defaultMicEnabled: state.isMicrophoneEnabled,
      defaultCameraEnabled: state.isCameraEnabled,
    };

    try {
      const currentWorkspace = await getCurrentWorkspace();
      const currentDevice = await getCurrentDevice();

      if (!currentWorkspace?.id || !currentDevice) return;

      await updateWorkspaceSettings(
        currentWorkspace.id,
        currentDevice.id,
        settings
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },
}));

// Custom hook to initialize media config with workspace settings
export function useInitializeMediaConfig() {
  const { data: mediaSources, isPending: isLoadingDevices } = useMediaSources();
  const { data: currentDevice, isSuccess: hasDevice } = useCurrentDevice();
  const { data: currentWorkspace, isSuccess: hasWorkspaceResult } =
    useCurrentWorkspace();
  const createDefaultWorkspace = useCreateDefaultWorkspace();
  const updateSettings = useUpdateWorkspaceSettings();

  const {
    handleScreenChange,
    handleMicChange,
    handleCameraChange,
    setSelectedScreen,
    setSelectedScreenId,
    setSelectedMicId,
    setSelectedCameraId,
    setIsDisplayEnabled,
    setIsMicrophoneEnabled,
    setIsCameraEnabled,
    setIsLoading,
    setMediaSources,
  } = useMediaConfigStore();

  // Initialize workspace and apply settings
  useEffect(() => {
    async function initializeWorkspace() {
      // Wait for all required data
      if (
        !mediaSources ||
        !hasDevice ||
        !currentDevice ||
        !hasWorkspaceResult
      ) {
        return;
      }

      // Ensure we have access to media devices
      try {
        await navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .catch(() => {
            // Even if we can't get access, continue with the initialization
            console.warn(
              'Could not get media permissions, continuing with initialization'
            );
          });
      } catch (error) {
        console.warn('Media permissions error:', error);
      }

      // Re-enumerate devices to ensure we have labels
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter((d) => d.kind === 'audioinput');
      const cameras = devices.filter((d) => d.kind === 'videoinput');

      setIsLoading(true);
      setMediaSources({
        ...mediaSources,
        audioinputs: mics,
        videoinputs: cameras,
      });

      try {
        // Find first available devices
        const defaultScreen =
          mediaSources.displays.find((d) => d.type === 'screen') ||
          mediaSources.displays[0] ||
          null;
        const defaultMic = mics[0] || null;
        const defaultCamera = cameras[0] || null;

        console.log('Available devices:', {
          screens: mediaSources.displays,
          mics,
          cameras,
        });

        // If no workspace exists, create default
        if (!currentWorkspace) {
          console.log('Creating default workspace with devices:', {
            screen: defaultScreen?.id,
            mic: defaultMic?.deviceId,
            camera: defaultCamera?.deviceId,
          });

          const { workspace } = await createDefaultWorkspace.mutateAsync({
            screens: mediaSources.displays,
            mics,
            cameras,
          });

          // Apply initial device selections
          if (defaultScreen) {
            setSelectedScreen(defaultScreen);
            setSelectedScreenId(defaultScreen.id);
            setIsDisplayEnabled(true);
            await handleScreenChange(defaultScreen);
          }

          if (defaultMic) {
            setSelectedMicId(defaultMic.deviceId);
            setIsMicrophoneEnabled(true);
            await handleMicChange(defaultMic.deviceId);
          }

          if (defaultCamera) {
            setSelectedCameraId(defaultCamera.deviceId);
            setIsCameraEnabled(true);
            await handleCameraChange(defaultCamera.deviceId);
          }

          // Save the initial settings
          await updateSettings.mutateAsync({
            workspaceId: workspace.id!,
            deviceId: currentDevice.id,
            settings: {
              selectedScreenId: defaultScreen?.id || null,
              selectedMicId: defaultMic?.deviceId || null,
              selectedCameraId: defaultCamera?.deviceId || null,
              defaultDisplayEnabled: true,
              defaultMicEnabled: true,
              defaultCameraEnabled: true,
            },
          });

          return;
        }

        // Get settings for current device
        const deviceSettings =
          currentWorkspace.deviceSettings[currentDevice.id];

        if (deviceSettings) {
          // Apply existing settings
          setSelectedScreenId(deviceSettings.selectedScreenId);
          setSelectedMicId(deviceSettings.selectedMicId);
          setSelectedCameraId(deviceSettings.selectedCameraId);

          setIsDisplayEnabled(deviceSettings.defaultDisplayEnabled);
          setIsMicrophoneEnabled(deviceSettings.defaultMicEnabled);
          setIsCameraEnabled(deviceSettings.defaultCameraEnabled);

          // Initialize streams based on settings
          if (deviceSettings.selectedScreenId) {
            const screen = mediaSources.displays.find(
              (s) => s.id === deviceSettings.selectedScreenId
            );
            if (screen) {
              setSelectedScreen(screen);
              await handleScreenChange(screen);
            }
          }

          if (deviceSettings.selectedMicId) {
            await handleMicChange(deviceSettings.selectedMicId);
          }

          if (deviceSettings.selectedCameraId) {
            await handleCameraChange(deviceSettings.selectedCameraId);
          }
        } else {
          // No device settings found, create default settings for this device
          await updateSettings.mutateAsync({
            workspaceId: currentWorkspace.id!,
            deviceId: currentDevice.id,
            settings: {
              selectedScreenId: defaultScreen?.id || null,
              selectedMicId: defaultMic?.deviceId || null,
              selectedCameraId: defaultCamera?.deviceId || null,
              defaultDisplayEnabled: true,
              defaultMicEnabled: true,
              defaultCameraEnabled: true,
            },
          });
        }
      } catch (error) {
        console.error('❌ Error initializing media config:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeWorkspace();
  }, [
    mediaSources,
    currentDevice,
    hasDevice,
    currentWorkspace,
    hasWorkspaceResult,
  ]);

  return {
    isLoading:
      isLoadingDevices ||
      createDefaultWorkspace.isPending ||
      updateSettings.isPending,
  };
}

// Custom hook for managing screen capture
export function useScreenCapture() {
  const { selectedScreen, isDisplayEnabled, screenStream, setScreenStream } =
    useMediaConfigStore();

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
        useMediaConfigStore.setState({ isDisplayEnabled: false });
      }
    }

    startScreenCapture();

    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
    };
  }, [selectedScreen, isDisplayEnabled, screenStream]);

  return { screenStream };
}

// Custom hook for managing camera capture
export function useCameraCapture() {
  const {
    selectedCameraId,
    isCameraEnabled,
    cameraStream,
    setCameraStream,
    setIsCameraEnabled,
  } = useMediaConfigStore();

  useEffect(() => {
    async function updateCameraStream() {
      if (!isCameraEnabled || !selectedCameraId) {
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
          setCameraStream(null);
        }
        window.ipcRenderer.send('hide-camera-window');
        return;
      }

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

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
        window.ipcRenderer.send('hide-camera-window');
      }
    };
  }, [isCameraEnabled, selectedCameraId, cameraStream]);

  return { cameraStream };
}

export default useMediaConfigStore;
