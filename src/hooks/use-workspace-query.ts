import {
  createDefaultWorkspace,
  createNewWorkspace,
  getAllDevices,
  getAllWorkspaces,
  getCurrentDevice,
  getCurrentWorkspace,
  getWorkspaceSettings,
  updateDeviceName,
  updateWorkspaceSettings,
} from '@/db/operations';
import type { WorkspaceSettings } from '@/types/workspace';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query Keys
export const QueryKeys = {
  currentDevice: ['currentDevice'] as const,
  devices: ['devices'] as const,
  workspaces: ['workspaces'] as const,
  currentWorkspace: ['currentWorkspace'] as const,
  workspaceSettings: (workspaceId: number) =>
    ['workspace', workspaceId, 'settings'] as const,
} as const;

// Device Hooks
export function useCurrentDevice() {
  return useQuery({
    queryKey: QueryKeys.currentDevice,
    queryFn: getCurrentDevice,
  });
}

export function useDevices() {
  return useQuery({
    queryKey: QueryKeys.devices,
    queryFn: getAllDevices,
  });
}

export function useUpdateDeviceName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, name }: { deviceId: string; name: string }) =>
      updateDeviceName(deviceId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.devices });
      queryClient.invalidateQueries({ queryKey: QueryKeys.currentDevice });
    },
  });
}

// Workspace Hooks
export function useWorkspaces() {
  return useQuery({
    queryKey: QueryKeys.workspaces,
    queryFn: getAllWorkspaces,
  });
}

export function useCurrentWorkspace() {
  const { data: currentDevice } = useCurrentDevice();

  return useQuery({
    queryKey: QueryKeys.currentWorkspace,
    queryFn: getCurrentWorkspace,
    enabled: !!currentDevice,
    initialData: null,
  });
}

export function useWorkspaceSettings(workspaceId: number) {
  return useQuery({
    queryKey: QueryKeys.workspaceSettings(workspaceId),
    queryFn: () => getWorkspaceSettings(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      deviceId,
      initialSettings,
    }: {
      name: string;
      deviceId: string;
      initialSettings?: Partial<WorkspaceSettings>;
    }) => createNewWorkspace(name, deviceId, initialSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.workspaces });
      queryClient.invalidateQueries({ queryKey: QueryKeys.currentWorkspace });
    },
  });
}

export function useUpdateWorkspaceSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      deviceId,
      settings,
    }: {
      workspaceId: number;
      deviceId: string;
      settings: Partial<WorkspaceSettings>;
    }) => updateWorkspaceSettings(workspaceId, deviceId, settings),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.workspaceSettings(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.currentWorkspace });
    },
  });
}

export function useCreateDefaultWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      screens: any[];
      mics: MediaDeviceInfo[];
      cameras: MediaDeviceInfo[];
      initialSettings?: {
        selectedScreenId: string | null;
        selectedMicId: string | null;
        selectedCameraId: string | null;
        defaultDisplayEnabled: boolean;
        defaultMicEnabled: boolean;
        defaultCameraEnabled: boolean;
      };
    }) => createDefaultWorkspace(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.workspaces });
      queryClient.invalidateQueries({ queryKey: QueryKeys.currentWorkspace });
    },
  });
}
