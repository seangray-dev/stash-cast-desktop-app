import { UserDevice, Workspace } from '@/types/workspace';
import Dexie, { type Table } from 'dexie';

export class StashCastDB extends Dexie {
  workspaces!: Table<Workspace, number>;
  devices!: Table<UserDevice, string>;

  constructor() {
    super('StashCastDB');
    this.version(2).stores({
      workspaces: '++id, &name, deviceSettings, createdAt, updatedAt',
      devices: '&id, name, createdAt, updatedAt',
    });
  }
}

// Delete existing database if it exists and create a new one
export async function resetDatabase() {
  const db = new StashCastDB();
  await db.delete();
  await db.open();
  return db;
}

// Export a singleton instance
export const db = new StashCastDB();
