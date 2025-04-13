import {
  createDefaultWorkspace,
  createNewWorkspace,
  getCurrentDevice,
  getCurrentWorkspace,
  updateWorkspaceSettings,
} from '@/db/operations';
import { DesktopSource } from '@/types/media';
import { WorkspaceSettings } from '@/types/workspace';

const DEFAULT_SETTINGS: WorkspaceSettings = {
  selectedScreenId: null,
  selectedMicId: null,
  selectedCameraId: null,
  defaultDisplayEnabled: true,
  defaultMicEnabled: true,
  defaultCameraEnabled: true,
  defaultSaveLocation: null,
};

export async function saveMediaPreferences(
  settings: Partial<WorkspaceSettings>,
  workspaceName?: string
): Promise<void> {
  const currentDevice = await getCurrentDevice();
  if (!currentDevice) throw new Error('No device found');

  if (workspaceName) {
    // Create new workspace with these settings
    await createNewWorkspace(workspaceName, currentDevice.id, settings);
  } else {
    // Update current workspace settings
    const currentWorkspace = await getCurrentWorkspace();
    if (!currentWorkspace) throw new Error('No workspace found');

    await updateWorkspaceSettings(
      currentWorkspace.id!,
      currentDevice.id,
      settings
    );
  }
}

export async function initializeMediaPreferences(
  screens: DesktopSource[],
  mics: MediaDeviceInfo[],
  cameras: MediaDeviceInfo[]
): Promise<WorkspaceSettings> {
  console.log('🚀 Initializing media preferences');

  const currentDevice = await getCurrentDevice();
  if (!currentDevice) throw new Error('No device found');

  const defaultSettings: WorkspaceSettings = {
    selectedScreenId: screens.length > 0 ? screens[0].id : null,
    selectedMicId: mics.length > 0 ? mics[0].deviceId : null,
    selectedCameraId: cameras.length > 0 ? cameras[0].deviceId : null,
    defaultDisplayEnabled: true,
    defaultMicEnabled: true,
    defaultCameraEnabled: true,
    defaultSaveLocation: null,
  };

  try {
    const currentWorkspace = await getCurrentWorkspace();

    if (!currentWorkspace) {
      console.log('Creating default workspace...');
      await createDefaultWorkspace({
        screens,
        mics,
        cameras,
      });
      return defaultSettings;
    }

    // Get current device settings or create default ones
    const deviceSettings = currentWorkspace.deviceSettings[
      currentDevice.id
    ] || {
      ...DEFAULT_SETTINGS,
    };

    // Update settings if needed
    const updatedSettings = { ...deviceSettings };
    let needsUpdate = false;

    // Only update if devices are not selected but available
    if (!updatedSettings.selectedScreenId && screens.length > 0) {
      updatedSettings.selectedScreenId = screens[0].id;
      updatedSettings.defaultDisplayEnabled = true;
      needsUpdate = true;
    }

    if (!updatedSettings.selectedMicId && mics.length > 0) {
      updatedSettings.selectedMicId = mics[0].deviceId;
      updatedSettings.defaultMicEnabled = true;
      needsUpdate = true;
    }

    if (!updatedSettings.selectedCameraId && cameras.length > 0) {
      updatedSettings.selectedCameraId = cameras[0].deviceId;
      updatedSettings.defaultCameraEnabled = true;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await updateWorkspaceSettings(
        currentWorkspace.id!,
        currentDevice.id,
        updatedSettings
      );
    }

    return updatedSettings;
  } catch (error) {
    console.error('Error initializing media preferences:', error);
    return defaultSettings;
  }
}
