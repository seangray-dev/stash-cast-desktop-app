export type UserDevice = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Workspace = {
  id?: number;
  name: string;
  deviceSettings: {
    [deviceId: string]: WorkspaceSettings;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type WorkspaceSettings = {
  selectedScreenId: string | null;
  selectedMicId: string | null;
  selectedCameraId: string | null;
  defaultDisplayEnabled: boolean;
  defaultMicEnabled: boolean;
  defaultCameraEnabled: boolean;
  defaultSaveLocation: string | null;
};
