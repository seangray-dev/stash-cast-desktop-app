import { app, dialog, ipcMain } from 'electron';
import fs from 'fs/promises';
import { join } from 'path';

ipcMain.handle('save-recording', async (_, { buffer }) => {
  try {
    const defaultPath = join(
      app.getPath('desktop'),
      `recording-${Date.now()}.webm`
    );

    const { filePath, canceled } = await dialog.showSaveDialog({
      defaultPath,
      filters: [{ name: 'WebM Video', extensions: ['webm'] }],
    });

    if (canceled || !filePath) {
      return { success: false, error: 'Save dialog was canceled' };
    }

    await fs.writeFile(filePath, Buffer.from(buffer));
    return { success: true, filePath };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to save recording:', error);
    return { success: false, error: errorMessage };
  }
});
