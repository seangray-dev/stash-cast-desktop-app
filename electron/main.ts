import {
  app,
  BrowserWindow,
  desktopCapturer,
  dialog,
  ipcMain,
  nativeImage,
  systemPreferences,
  Tray,
} from 'electron';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const applicationName = 'Stash Cast';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

// Window references
let tray: Tray | null = null;
let mainAppWindow: BrowserWindow | null = null;
let controlsWindow: BrowserWindow | null = null;
let cameraWindow: BrowserWindow | null = null;

async function checkAndRequestPermissions() {
  if (process.platform === 'darwin') {
    // Request camera permission
    if (!systemPreferences.getMediaAccessStatus('camera')) {
      await systemPreferences.askForMediaAccess('camera');
    }

    // Request microphone permission
    if (!systemPreferences.getMediaAccessStatus('microphone')) {
      await systemPreferences.askForMediaAccess('microphone');
    }
  }
}

function createMainAppWindow() {
  mainAppWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 320,
    minHeight: 650,
    titleBarStyle: 'default',
    frame: false,
    resizable: true,
    movable: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    mainAppWindow.loadURL(`${VITE_DEV_SERVER_URL}`);
  } else {
    mainAppWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

// function createControlsWindow() {
//   controlsWindow = new BrowserWindow({
//     width: 200,
//     height: 60,
//     frame: false,
//     resizable: false,
//     movable: false,
//     show: false,
//     alwaysOnTop: true,
//     transparent: true,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.mjs'),
//     },
//   });

//   if (VITE_DEV_SERVER_URL) {
//     controlsWindow.loadURL(`${VITE_DEV_SERVER_URL}/controls`);
//   } else {
//     controlsWindow.loadFile(path.join(RENDERER_DIST, 'controls.html'));
//   }
// }

function createCameraWindow() {
  console.log('Creating camera window...');
  cameraWindow = new BrowserWindow({
    width: 320,
    height: 320,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    hasShadow: false,
    resizable: false,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      backgroundThrottling: false,
    },
    vibrancy: 'under-window',
    visualEffectState: 'active',
  });

  // Set window to be transparent to mouse events except for the video
  cameraWindow.setIgnoreMouseEvents(false);

  if (VITE_DEV_SERVER_URL) {
    console.log(
      'Loading camera window URL:',
      `${VITE_DEV_SERVER_URL}src/camera.html`
    );
    cameraWindow.loadURL(`${VITE_DEV_SERVER_URL}src/camera.html`);
  } else {
    const filePath = path.join(RENDERER_DIST, 'camera.html');
    console.log('Loading camera window file:', filePath);
    cameraWindow.loadFile(filePath);
  }

  // Add window load event logging
  cameraWindow.webContents.on(
    'did-fail-load',
    (event, errorCode, errorDescription) => {
      console.error(
        'Camera window failed to load:',
        errorCode,
        errorDescription
      );
    }
  );

  cameraWindow.webContents.on('did-finish-load', () => {
    console.log('Camera window loaded successfully');
  });

  // Open DevTools for debugging
  cameraWindow.webContents.openDevTools({ mode: 'detach' });
}

function setupTray() {
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,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'
  );
  tray = new Tray(icon);
  tray.setToolTip(applicationName);

  tray.on('click', () => {
    if (!mainAppWindow?.isVisible()) {
      mainAppWindow?.show();
    }
  });
}

async function convertToMov(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Starting FFmpeg conversion...');
    console.log('Input path:', inputPath);
    console.log('Output path:', outputPath);

    // First pass: Analyze the input file
    const ffprobe = spawn('ffprobe', [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height,r_frame_rate,codec_name',
      '-of',
      'json',
      inputPath,
    ]);

    let probeData = '';
    ffprobe.stdout.on('data', (data) => {
      probeData += data.toString();
    });

    ffprobe.on('close', async (code) => {
      if (code !== 0) {
        console.error('FFprobe analysis failed');

        // Try direct conversion as fallback
        await tryConversion(inputPath, outputPath, {}).catch(reject);
        return;
      }

      try {
        const info = JSON.parse(probeData);
        console.log('Input video info:', info);

        const conversionOptions = {
          videoBitrate: '5M',
          audioBitrate: '256k',
          frameRate: info?.streams?.[0]?.r_frame_rate || '30',
          width: info?.streams?.[0]?.width,
          height: info?.streams?.[0]?.height,
        };

        await tryConversion(inputPath, outputPath, conversionOptions);
        resolve();
      } catch (error) {
        console.error('Error parsing probe data:', error);
        reject(error);
      }
    });
  });
}

async function tryConversion(
  inputPath: string,
  outputPath: string,
  options: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    // High quality H.264 settings for optimal quality/size ratio
    const ffmpegArgs = [
      '-y', // Overwrite output file
      '-i',
      inputPath, // Input file
      // Video settings
      '-c:v',
      'h264', // H.264 codec
      '-preset',
      'slow', // Slower encoding = better compression
      '-crf',
      '18', // Constant Rate Factor (18-23 is visually lossless)
      '-profile:v',
      'high', // High profile for better quality
      '-level',
      '4.2', // Compatibility level
      '-movflags',
      '+faststart', // Enable streaming
      // Color settings
      '-pix_fmt',
      'yuv420p', // Standard color space for better compatibility
      // Audio settings
      '-c:a',
      'aac', // AAC audio codec
      '-b:a',
      '320k', // High quality audio bitrate
      '-ar',
      '48000', // Audio sample rate
      '-ac',
      '2', // Stereo audio
    ];

    // Add framerate if specified
    if (options.frameRate) {
      ffmpegArgs.push('-r', options.frameRate);
    }

    // Add output file
    ffmpegArgs.push(outputPath);

    console.log('FFmpeg arguments:', ffmpegArgs);

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    let errorLog = '';

    ffmpeg.stderr.on('data', (data) => {
      const message = data.toString();
      errorLog += message;
      console.log('FFmpeg:', message);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('FFmpeg conversion successful');
        resolve();
      } else {
        console.error('FFmpeg conversion failed with code:', code);
        console.error('Error log:', errorLog);
        reject(new Error(`FFmpeg conversion failed: ${errorLog}`));
      }
    });

    ffmpeg.on('error', (err) => {
      console.error('FFmpeg process error:', err);
      reject(err);
    });
  });
}

function setupIPC() {
  ipcMain.handle('getSources', async (_event: Electron.IpcMainInvokeEvent) => {
    const screens = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 150, height: 150 },
    });

    const windows = await desktopCapturer.getSources({
      types: ['window'],
      thumbnailSize: { width: 150, height: 150 },
    });

    const screenThumbnails = screens.map((screen) => {
      return {
        id: screen.id,
        name: screen.name,
        thumbnail: screen.thumbnail.toDataURL(),
        display_id: screen.display_id,
        appIcon: screen.appIcon,
      };
    });

    const windowThumbnails = windows.map((window) => {
      return {
        id: window.id,
        name: window.name,
        thumbnail: window.thumbnail.toDataURL(),
        display_id: window.display_id,
        appIcon: window.appIcon,
      };
    });

    const sources = [...screenThumbnails, ...windowThumbnails];

    return sources;
  });

  // Updated save-recording handler
  ipcMain.handle('save-recording', async (_event, { buffer, mimeType }) => {
    try {
      // Create temporary WebM file
      const tempWebM = path.join(tmpdir(), `temp-${Date.now()}.webm`);
      console.log('Creating temporary WebM file:', tempWebM);

      await fs.writeFile(tempWebM, Buffer.from(buffer));
      const stats = await fs.stat(tempWebM);
      console.log('Temporary WebM file created:', {
        size: stats.size,
        mimeType,
      });

      // Show save dialog for final MOV file
      const { filePath, canceled } = await dialog.showSaveDialog({
        defaultPath: path.join(
          app.getPath('desktop'),
          `recording-${Date.now()}.mov`
        ),
        filters: [{ name: 'QuickTime Movie', extensions: ['mov'] }],
      });

      if (canceled || !filePath) {
        console.log('Save dialog was canceled');
        await fs.unlink(tempWebM).catch(console.error);
        return { success: false, error: 'Save dialog was canceled' };
      }

      console.log('Starting conversion to:', filePath);
      await convertToMov(tempWebM, filePath);
      console.log('Conversion completed successfully');

      // Clean up temp file
      await fs.unlink(tempWebM).catch(console.error);
      console.log('Temporary file cleaned up');

      return { success: true, filePath };
    } catch (error) {
      console.error('Failed to save recording:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  });

  ipcMain.on('start-recording', () => {
    console.log('Recording started');
  });

  ipcMain.on('stop-recording', () => {
    console.log('Recording stopped');
  });

  ipcMain.on('close-app', () => {
    app.quit();
  });

  ipcMain.on('show-camera-window', () => {
    console.log('Received show-camera-window event');
    if (!cameraWindow) {
      console.log('No camera window exists, creating new one');
      createCameraWindow();
    } else {
      console.log('Camera window exists, showing it');
      if (cameraWindow.isDestroyed()) {
        console.log('Camera window was destroyed, creating new one');
        createCameraWindow();
      } else {
        cameraWindow.showInactive();
      }
    }
  });

  ipcMain.on('camera-stream-ready', (event, streamInfo) => {
    console.log('Received camera-stream-ready event:', streamInfo);
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      console.log('Forwarding stream info to camera window');
      cameraWindow.webContents.send('camera-stream-ready', streamInfo);
    } else {
      console.log('Camera window not available to receive stream');
    }
  });

  ipcMain.on('hide-camera-window', () => {
    console.log('Received hide-camera-window event');
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      cameraWindow.hide();
    }
  });

  ipcMain.on('set-camera-window-position', (_event, { x, y }) => {
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      cameraWindow.setPosition(x, y);
    }
  });

  ipcMain.handle('get-display-info', (_event, displayId) => {
    const display = require('electron').screen.getDisplayMatching({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      displayId: displayId,
    });
    return display;
  });
}

app.whenReady().then(async () => {
  await checkAndRequestPermissions();
  setupIPC();
  setupTray();
  createMainAppWindow();
});

// Keep the app running when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle macOS dock icon clicks
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainAppWindow();
  }
});
