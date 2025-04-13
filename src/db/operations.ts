import { UserDevice, Workspace, WorkspaceSettings } from '@/types/workspace';
import { db, resetDatabase } from './db';

const getMachineId = async () => {
  try {
    const id = await window.ipcRenderer.invoke('get-machine-id');
    if (!id) {
      throw new Error('Failed to get machine ID');
    }
    return id;
  } catch (error) {
    console.error('Error getting machine ID:', error);
    throw error;
  }
};

const getHostname = async () => {
  try {
    return await window.ipcRenderer.invoke('get-hostname');
  } catch (error) {
    console.error('Error getting hostname:', error);
    return 'Unknown Device';
  }
};

export async function initializeFirstTimeUser(
  screens: any[],
  mics: MediaDeviceInfo[],
  cameras: MediaDeviceInfo[]
): Promise<{ workspace: Workspace; device: UserDevice }> {
  // Reset database to ensure clean state
  await resetDatabase();

  // Create device first
  const deviceId = await getMachineId();
  const hostname = await getHostname();

  const device: UserDevice = {
    id: deviceId,
    name: hostname,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Find first available screen (not window)
  const defaultScreen =
    screens.find((d) => d.type === 'screen') || screens[0] || null;
  const defaultMic = mics[0] || null;
  const defaultCamera = cameras[0] || null;

  // Create default settings
  const settings: WorkspaceSettings = {
    selectedScreenId: defaultScreen?.id || null,
    selectedMicId: defaultMic?.deviceId || null,
    selectedCameraId: defaultCamera?.deviceId || null,
    defaultDisplayEnabled: true,
    defaultMicEnabled: true,
    defaultCameraEnabled: true,
    defaultSaveLocation: 'desktop',
  };

  console.log('Creating workspace with settings:', settings);

  // Create workspace
  const workspaceToCreate: Omit<Workspace, 'id'> = {
    name: 'Default Workspace',
    deviceSettings: {
      [deviceId]: settings,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    // Add device and workspace in sequence
    await db.devices.add(device);
    const workspaceId = await db.workspaces.add(workspaceToCreate);
    const workspace = { ...workspaceToCreate, id: workspaceId };

    return { workspace, device };
  } catch (error) {
    console.error('Error initializing first-time user:', error);
    throw error;
  }
}

export async function createDefaultWorkspace({
  screens,
  mics,
  cameras,
}: {
  screens: any[];
  mics: MediaDeviceInfo[];
  cameras: MediaDeviceInfo[];
}) {
  return initializeFirstTimeUser(screens, mics, cameras);
}

export async function getCurrentWorkspace(): Promise<Workspace | undefined> {
  return await db.workspaces.orderBy('createdAt').first();
}

export async function getWorkspaceSettings(
  workspaceId: number
): Promise<Workspace | undefined> {
  return await db.workspaces.get(workspaceId);
}

export async function updateWorkspaceSettings(
  workspaceId: number,
  deviceId: string,
  settings: Partial<WorkspaceSettings>
): Promise<void> {
  console.log('⚙️ Updating workspace settings:', {
    workspaceId,
    deviceId,
    settings,
  });

  const workspace = await db.workspaces.get(workspaceId);

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  const currentDeviceSettings = workspace.deviceSettings[deviceId] || {
    selectedScreenId: null,
    selectedMicId: null,
    selectedCameraId: null,
    defaultDisplayEnabled: true,
    defaultMicEnabled: true,
    defaultCameraEnabled: true,
    defaultSaveLocation: null,
  };

  const updatedSettings = {
    ...workspace.deviceSettings,
    [deviceId]: {
      ...currentDeviceSettings,
      ...settings,
    },
  };

  await db.workspaces.update(workspaceId, {
    deviceSettings: updatedSettings,
    updatedAt: new Date(),
  });

  console.log('✅ Updated workspace settings');
}

export async function createNewWorkspace(
  name: string,
  deviceId: string,
  initialSettings?: Partial<WorkspaceSettings>
): Promise<number> {
  const defaultSettings: WorkspaceSettings = {
    selectedScreenId: null,
    selectedMicId: null,
    selectedCameraId: null,
    defaultDisplayEnabled: true,
    defaultMicEnabled: true,
    defaultCameraEnabled: true,
    defaultSaveLocation: null,
  };

  // Create workspace without id first
  const workspaceToCreate = {
    name,
    deviceSettings: {
      [deviceId]: {
        ...defaultSettings,
        ...initialSettings,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('📝 Creating new workspace:', workspaceToCreate);
  const workspaceId = await db.workspaces.add(workspaceToCreate);
  console.log('✅ Created workspace with id:', workspaceId);

  return workspaceId;
}

export async function getAllWorkspaces(): Promise<Workspace[]> {
  return await db.workspaces.orderBy('createdAt').toArray();
}

export async function getDeviceSettings(
  workspace: Workspace,
  deviceId: string
): Promise<WorkspaceSettings | null> {
  return workspace.deviceSettings[deviceId] || null;
}

// Device Operations
export async function getCurrentDevice(): Promise<UserDevice> {
  const deviceId = await getMachineId();
  console.log('🔍 Getting current device with ID:', deviceId);

  const existingDevice = await db.devices.get(deviceId);

  if (existingDevice) {
    console.log('✅ Found existing device:', existingDevice);
    return existingDevice;
  }

  const hostname = await getHostname();
  const newDevice: UserDevice = {
    id: deviceId,
    name: hostname,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('📝 Creating new device:', newDevice);
  await db.devices.add(newDevice);

  return newDevice;
}

export async function updateDeviceName(
  deviceId: string,
  name: string
): Promise<void> {
  console.log('📝 Updating device name:', { deviceId, name });

  await db.devices.update(deviceId, {
    name,
    updatedAt: new Date(),
  });
}

export async function getAllDevices(): Promise<UserDevice[]> {
  return await db.devices.toArray();
}
