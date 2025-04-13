import { db, type Workspace, type WorkspaceSettings } from './db';

export async function createDefaultWorkspace(
  screens: any[],
  mics: MediaDeviceInfo[],
  cameras: MediaDeviceInfo[]
): Promise<{ workspace: Workspace; settings: WorkspaceSettings }> {
  console.log('📝 Creating default workspace with:', {
    screens: screens.length,
    mics: mics.length,
    cameras: cameras.length,
  });

  const defaultWorkspace = await db.workspaces.add({
    name: 'Default Workspace',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Workspace);

  console.log('✅ Created default workspace:', defaultWorkspace);

  const settings = await db.workspaceSettings.add({
    workspaceId: defaultWorkspace,
    selectedScreenId: screens.length > 0 ? screens[0].id : null,
    selectedMicId: mics.length > 0 ? mics[0].deviceId : null,
    selectedCameraId: cameras.length > 0 ? cameras[0].deviceId : null,
    isMicrophoneEnabled: true,
    isCameraEnabled: true,
    isDisplayEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as WorkspaceSettings);

  console.log('⚙️ Created default settings:', settings);

  const workspace = await db.workspaces.get(defaultWorkspace);
  const workspaceSettings = await db.workspaceSettings.get(settings);

  console.log('🎯 Returning workspace and settings:', {
    workspace,
    settings: workspaceSettings,
  });

  return {
    workspace: workspace!,
    settings: workspaceSettings!,
  };
}

export async function getCurrentWorkspace(): Promise<Workspace | undefined> {
  return await db.workspaces.orderBy('createdAt').first();
}

export async function getWorkspaceSettings(
  workspaceId: number
): Promise<WorkspaceSettings | undefined> {
  return await db.workspaceSettings
    .where('workspaceId')
    .equals(workspaceId)
    .first();
}

export async function updateWorkspaceSettings(
  workspaceId: number,
  settings: {
    selectedScreenId: string | null;
    selectedMicId: string | null;
    selectedCameraId: string | null;
    isMicrophoneEnabled: boolean;
    isCameraEnabled: boolean;
    isDisplayEnabled: boolean;
  }
): Promise<void> {
  console.log('⚙️ Updating workspace settings:', { workspaceId, settings });

  const existingSettings = await db.workspaceSettings
    .where('workspaceId')
    .equals(workspaceId)
    .first();

  if (!existingSettings) {
    throw new Error('No settings found for workspace');
  }

  await db.workspaceSettings.update(existingSettings.id, {
    ...settings,
    updatedAt: new Date(),
  });

  console.log('✅ Updated workspace settings');
}

export async function createNewWorkspace(
  name: string,
  settings: Omit<
    WorkspaceSettings,
    'id' | 'workspaceId' | 'createdAt' | 'updatedAt'
  >
): Promise<number> {
  const workspaceId = await db.workspaces.add({
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Workspace);

  await db.workspaceSettings.add({
    workspaceId,
    ...settings,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as WorkspaceSettings);

  return workspaceId;
}

export async function getAllWorkspaces(): Promise<Workspace[]> {
  return await db.workspaces.orderBy('createdAt').toArray();
}

export async function getWorkspaceWithSettings(workspaceId: number) {
  const workspace = await db.workspaces.get(workspaceId);
  const settings = await getWorkspaceSettings(workspaceId);
  return workspace && settings ? { workspace, settings } : null;
}
