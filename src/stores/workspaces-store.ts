import { getAllWorkspaces, getCurrentDevice } from '@/db/operations';
import { Workspace, WorkspaceSettings } from '@/types/workspace';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { create } from 'zustand';

interface PendingSettings {
  workspaceId: number;
  settings: Partial<WorkspaceSettings>;
  isDirty: boolean;
}

interface WorkspaceState {
  // Data State
  workspaces: Workspace[];
  currentWorkspaceId: number | null;

  // UI State
  isSettingsOpen: boolean;
  pendingSettings: PendingSettings | null;

  // Data Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspaceId: number) => void;
  getCurrentWorkspace: () => Workspace | undefined;
  getWorkspaceById: (id: number) => Workspace | undefined;

  // Settings UI Actions
  openSettings: () => void;
  closeSettings: () => void;

  // Settings Management
  setPendingSettings: (settings: Partial<WorkspaceSettings>) => void;
  discardPendingSettings: () => void;
  markSettingsAsClean: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => ({
  // Initial State
  workspaces: [],
  currentWorkspaceId: null,
  isSettingsOpen: false,
  pendingSettings: null,

  // Data Actions
  setWorkspaces: (workspaces) => {
    set({ workspaces });

    // Set first workspace as current if none selected
    if (!get().currentWorkspaceId && workspaces.length > 0) {
      set({ currentWorkspaceId: workspaces[0].id });
    }
  },

  setCurrentWorkspace: (workspaceId) => {
    set({
      currentWorkspaceId: workspaceId,
      pendingSettings: null, // Clear pending settings when switching
    });
  },

  getCurrentWorkspace: () => {
    const { workspaces, currentWorkspaceId } = get();
    return workspaces.find((w) => w.id === currentWorkspaceId);
  },

  getWorkspaceById: (id) => {
    return get().workspaces.find((w) => w.id === id);
  },

  // Settings UI Actions
  openSettings: () => {
    set({ isSettingsOpen: true });
  },

  closeSettings: () => {
    set({
      isSettingsOpen: false,
      pendingSettings: null,
    });
  },

  // Settings Management
  setPendingSettings: (settings) => {
    const { currentWorkspaceId, pendingSettings } = get();
    if (!currentWorkspaceId) return;

    set({
      pendingSettings: {
        workspaceId: currentWorkspaceId,
        settings: {
          ...(pendingSettings?.settings || {}),
          ...settings,
        },
        isDirty: true,
      },
    });
  },

  discardPendingSettings: () => {
    set({ pendingSettings: null });
  },

  markSettingsAsClean: () => {
    const { pendingSettings } = get();
    if (!pendingSettings) return;

    set({
      pendingSettings: {
        ...pendingSettings,
        isDirty: false,
      },
    });
  },
}));

// Selectors
export const selectWorkspaces = (state: WorkspaceState) => state.workspaces;
export const selectCurrentWorkspaceId = (state: WorkspaceState) =>
  state.currentWorkspaceId;
export const selectCurrentWorkspace = (state: WorkspaceState) =>
  state.workspaces.find((w) => w.id === state.currentWorkspaceId);
export const selectPendingSettings = (state: WorkspaceState) =>
  state.pendingSettings;
export const selectIsSettingsDirty = (state: WorkspaceState) =>
  state.pendingSettings?.isDirty ?? false;

// Hook to sync DB with store
export function useWorkspaceSync() {
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);

  // Get workspaces from DB
  const workspacesQuery = useQuery({
    queryKey: ['workspaces'],
    queryFn: getAllWorkspaces,
  });

  // Update store when workspaces change
  React.useEffect(() => {
    if (workspacesQuery.data) {
      setWorkspaces(workspacesQuery.data);
    }
  }, [workspacesQuery.data, setWorkspaces]);

  // Get current device
  const deviceQuery = useQuery({
    queryKey: ['currentDevice'],
    queryFn: getCurrentDevice,
  });

  return {
    workspaces: workspacesQuery.data,
    currentDevice: deviceQuery.data,
    isLoading: workspacesQuery.isLoading || deviceQuery.isLoading,
  };
}

// Convenience hook for workspace settings
export function useWorkspaceSettings() {
  const store = useWorkspaceStore();
  const currentWorkspace = useWorkspaceStore(selectCurrentWorkspace);
  const currentDevice = useWorkspaceSync().currentDevice;

  return {
    currentWorkspace,
    currentDevice,
    isOpen: store.isSettingsOpen,
    isDirty: store.pendingSettings?.isDirty ?? false,
    pendingSettings: store.pendingSettings?.settings,

    // Actions
    open: store.openSettings,
    close: store.closeSettings,
    updateSettings: store.setPendingSettings,
    discard: store.discardPendingSettings,
    markClean: store.markSettingsAsClean,
  };
}

// Remove the node-machine-id import and update the function
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
