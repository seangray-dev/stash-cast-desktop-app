import {
  createDefaultWorkspace,
  createNewWorkspace,
  getAllWorkspaces,
  getCurrentWorkspace,
  getWorkspaceSettings,
  updateWorkspaceSettings,
} from '@/db/operations';
import { DesktopSource } from '@/types/media';

export interface MediaPreferences {
  selectedScreenId: string | null;
  selectedMicId: string | null;
  selectedCameraId: string | null;
  isMicrophoneEnabled: boolean;
  isCameraEnabled: boolean;
  isDisplayEnabled: boolean;
}

const DEFAULT_PREFERENCES: MediaPreferences = {
  selectedScreenId: null,
  selectedMicId: null,
  selectedCameraId: null,
  isMicrophoneEnabled: false,
  isCameraEnabled: false,
  isDisplayEnabled: false,
};

export async function saveMediaPreferences(
  preferences: MediaPreferences,
  workspaceName?: string
): Promise<void> {
  if (workspaceName) {
    // Save to a new workspace
    await createNewWorkspace(workspaceName, preferences);
  } else {
    // Save to current workspace
    const currentWorkspace = await getCurrentWorkspace();
    if (currentWorkspace) {
      await updateWorkspaceSettings(currentWorkspace.id, preferences);
    }
  }
}

export async function getMediaPreferences(): Promise<MediaPreferences> {
  const currentWorkspace = await getCurrentWorkspace();
  if (!currentWorkspace) {
    return DEFAULT_PREFERENCES;
  }

  const settings = await getWorkspaceSettings(currentWorkspace.id);
  return settings || DEFAULT_PREFERENCES;
}

export async function getWorkspaces() {
  return await getAllWorkspaces();
}

export async function initializeMediaPreferences(
  screens: DesktopSource[],
  mics: MediaDeviceInfo[],
  cameras: MediaDeviceInfo[]
): Promise<MediaPreferences> {
  console.log('🚀 Initializing media preferences with:', {
    availableScreens: screens.map((s) => ({ id: s.id, name: s.name })),
    availableMics: mics.map((m) => ({ id: m.deviceId, label: m.label })),
    availableCameras: cameras.map((c) => ({ id: c.deviceId, label: c.label })),
  });

  const currentWorkspace = await getCurrentWorkspace();
  console.log('📂 Current workspace:', currentWorkspace);

  if (!currentWorkspace) {
    console.log('🆕 No workspace found, creating default workspace');
    const defaultSettings: MediaPreferences = {
      selectedScreenId: screens.length > 0 ? screens[0].id : null,
      selectedMicId: mics.length > 0 ? mics[0].deviceId : null,
      selectedCameraId: cameras.length > 0 ? cameras[0].deviceId : null,
      isMicrophoneEnabled: true,
      isCameraEnabled: true,
      isDisplayEnabled: true,
    };
    console.log('⚙️ Default settings:', defaultSettings);

    const { settings } = await createDefaultWorkspace(screens, mics, cameras);
    console.log('✅ Created default workspace with settings:', settings);

    // Return our defaultSettings instead of the database settings to ensure correct initial state
    return defaultSettings;
  }

  const preferences = await getMediaPreferences();
  console.log('📱 Existing preferences:', preferences);

  // For existing workspaces, ensure devices are enabled if they're selected
  const updatedPreferences = { ...preferences };
  let needsUpdate = false;

  if (
    updatedPreferences.selectedScreenId &&
    !updatedPreferences.isDisplayEnabled
  ) {
    console.log('🖥️ Screen selected but not enabled, enabling display');
    updatedPreferences.isDisplayEnabled = true;
    needsUpdate = true;
  }

  if (
    updatedPreferences.selectedMicId &&
    !updatedPreferences.isMicrophoneEnabled
  ) {
    console.log('🎤 Mic selected but not enabled, enabling microphone');
    updatedPreferences.isMicrophoneEnabled = true;
    needsUpdate = true;
  }

  if (
    updatedPreferences.selectedCameraId &&
    !updatedPreferences.isCameraEnabled
  ) {
    console.log('📸 Camera selected but not enabled, enabling camera');
    updatedPreferences.isCameraEnabled = true;
    needsUpdate = true;
  }

  // If no devices are selected, select and enable the first available ones
  if (!updatedPreferences.selectedScreenId && screens.length > 0) {
    console.log(
      '🖥️ No screen selected, selecting first available screen:',
      screens[0].id
    );
    updatedPreferences.selectedScreenId = screens[0].id;
    updatedPreferences.isDisplayEnabled = true;
    needsUpdate = true;
  }

  if (!updatedPreferences.selectedMicId && mics.length > 0) {
    console.log(
      '🎤 No mic selected, selecting first available mic:',
      mics[0].deviceId
    );
    updatedPreferences.selectedMicId = mics[0].deviceId;
    updatedPreferences.isMicrophoneEnabled = true;
    needsUpdate = true;
  }

  if (!updatedPreferences.selectedCameraId && cameras.length > 0) {
    console.log(
      '📸 No camera selected, selecting first available camera:',
      cameras[0].deviceId
    );
    updatedPreferences.selectedCameraId = cameras[0].deviceId;
    updatedPreferences.isCameraEnabled = true;
    needsUpdate = true;
  }

  if (needsUpdate) {
    console.log('💾 Saving updated preferences:', updatedPreferences);
    await saveMediaPreferences(updatedPreferences);
  }

  console.log('🏁 Returning preferences:', updatedPreferences);
  return updatedPreferences;
}
