import Dexie, { type EntityTable } from 'dexie';

interface Workspace {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceSettings {
  id: number;
  workspaceId: number;
  selectedScreenId: string | null;
  selectedMicId: string | null;
  selectedCameraId: string | null;
  isMicrophoneEnabled: boolean;
  isCameraEnabled: boolean;
  isDisplayEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const db = new Dexie('StashCastDB') as Dexie & {
  workspaces: EntityTable<
    Workspace,
    'id' // primary key
  >;
  workspaceSettings: EntityTable<
    WorkspaceSettings,
    'id' // primary key
  >;
};

// Schema declaration
db.version(1).stores({
  workspaces: '++id, name, createdAt, updatedAt',
  workspaceSettings:
    '++id, workspaceId, selectedScreenId, selectedMicId, selectedCameraId',
});

export { db };
export type { Workspace, WorkspaceSettings };
