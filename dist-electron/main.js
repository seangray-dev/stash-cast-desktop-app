var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, systemPreferences, ipcMain, desktopCapturer, dialog, nativeImage, Tray } from "electron";
import fs from "node:fs/promises";
import { tmpdir as tmpdir$1 } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "child_process";
import { promises } from "fs";
import { tmpdir } from "os";
import { join } from "path";
async function detectHardwareAcceleration() {
  return new Promise((resolve) => {
    const ffmpeg = spawn("ffmpeg", ["-encoders"]);
    let output = "";
    ffmpeg.stdout.on("data", (data) => {
      output += data.toString();
    });
    ffmpeg.stderr.on("data", (data) => {
      output += data.toString();
    });
    ffmpeg.on("close", () => {
      if (process.platform === "darwin" && output.includes("h264_videotoolbox")) {
        resolve({
          type: "videotoolbox",
          available: true,
          name: "Apple VideoToolbox"
        });
      } else if (output.includes("h264_nvenc")) {
        resolve({
          type: "nvenc",
          available: true,
          name: "NVIDIA NVENC"
        });
      } else if (output.includes("h264_qsv")) {
        resolve({
          type: "qsv",
          available: true,
          name: "Intel Quick Sync"
        });
      } else if (output.includes("h264_amf")) {
        resolve({
          type: "amf",
          available: true,
          name: "AMD AMF"
        });
      } else {
        resolve({
          type: "none",
          available: false,
          name: "Software Encoding"
        });
      }
    });
    ffmpeg.on("error", () => {
      resolve({
        type: "none",
        available: false,
        name: "Software Encoding"
      });
    });
  });
}
function getEncoderSettings(hwAccel) {
  switch (hwAccel.type) {
    case "videotoolbox":
      return ["-c:v", "h264_videotoolbox"];
    case "nvenc":
      return ["-c:v", "h264_nvenc", "-preset", "p7", "-tune", "hq"];
    case "qsv":
      return ["-c:v", "h264_qsv", "-preset", "veryslow"];
    case "amf":
      return ["-c:v", "h264_amf", "-quality", "quality"];
    default:
      return ["-c:v", "libx264"];
  }
}
const VIDEO_QUALITY_PRESETS = {
  "2160p": {
    width: 3840,
    height: 2160,
    videoBitrate: "45M",
    audioBitrate: "384k",
    crf: 18
  },
  "1440p": {
    width: 2560,
    height: 1440,
    videoBitrate: "16M",
    audioBitrate: "256k",
    crf: 20
  },
  "1080p": {
    width: 1920,
    height: 1080,
    videoBitrate: "8M",
    audioBitrate: "192k",
    crf: 22
  },
  "720p": {
    width: 1280,
    height: 720,
    videoBitrate: "5M",
    audioBitrate: "128k",
    crf: 23
  },
  "480p": {
    width: 854,
    height: 480,
    videoBitrate: "2.5M",
    audioBitrate: "96k",
    crf: 25
  }
};
class FFmpegService {
  constructor() {
    __publicField(this, "hwAccel", null);
    __publicField(this, "defaultSettings", {
      useHardwareAcceleration: true,
      preset: "medium",
      crf: 23,
      audioQuality: 3,
      maxBitrate: "5M",
      quality: "1080p",
      // Default to 1080p
      maintainAspectRatio: true
    });
    this.initializeHardwareAcceleration();
  }
  async initializeHardwareAcceleration() {
    this.hwAccel = await detectHardwareAcceleration();
    console.log("Hardware acceleration:", this.hwAccel);
  }
  getFFmpegArgs(inputPath, outputPath, settings) {
    var _a;
    const args = [
      "-y",
      // Overwrite output file
      "-i",
      inputPath
      // Input file
    ];
    if (settings.useHardwareAcceleration && ((_a = this.hwAccel) == null ? void 0 : _a.available)) {
      args.push(...getEncoderSettings(this.hwAccel));
    } else {
      args.push("-c:v", "libx264");
    }
    if (settings.quality && VIDEO_QUALITY_PRESETS[settings.quality]) {
      const preset = VIDEO_QUALITY_PRESETS[settings.quality];
      args.push(
        "-vf",
        `scale=${preset.width}:${preset.height}${settings.maintainAspectRatio ? ":force_original_aspect_ratio=decrease" : ""}`,
        "-b:v",
        preset.videoBitrate,
        "-b:a",
        preset.audioBitrate,
        "-crf",
        preset.crf.toString()
      );
    } else if (settings.width && settings.height) {
      args.push(
        "-vf",
        `scale=${settings.width}:${settings.height}${settings.maintainAspectRatio ? ":force_original_aspect_ratio=decrease" : ""}`
      );
    }
    args.push(
      "-preset",
      settings.preset,
      // Audio settings
      "-c:a",
      "aac",
      "-q:a",
      settings.audioQuality.toString(),
      "-ar",
      "48000",
      // Audio sample rate
      "-ac",
      "2",
      // Stereo audio
      // Additional optimizations
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p"
    );
    if (settings.maxBitrate && !settings.quality) {
      args.push(
        "-maxrate",
        settings.maxBitrate,
        "-bufsize",
        settings.maxBitrate
      );
    }
    if (!settings.quality) {
      if (settings.videoBitrate) {
        args.push("-b:v", settings.videoBitrate);
      }
      if (settings.audioBitrate) {
        args.push("-b:a", settings.audioBitrate);
      }
    }
    args.push(outputPath);
    return args;
  }
  async convertVideo(inputBuffer, outputPath, settings = {}, onProgress) {
    try {
      const tempInput = join(tmpdir(), `temp-${Date.now()}.webm`);
      await promises.writeFile(tempInput, Buffer.from(inputBuffer));
      const finalSettings = {
        ...this.defaultSettings,
        ...settings
      };
      return new Promise((resolve, reject) => {
        const args = this.getFFmpegArgs(tempInput, outputPath, finalSettings);
        console.log("FFmpeg arguments:", args);
        const ffmpeg = spawn("ffmpeg", args);
        let duration = 0;
        let errorLog = "";
        ffmpeg.stderr.on("data", (data) => {
          const message = data.toString();
          if (!duration) {
            const match = message.match(/Duration: (\d{2}):(\d{2}):(\d{2})/);
            if (match) {
              duration = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
            }
          }
          const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2})/);
          if (timeMatch && duration && onProgress) {
            const time = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]);
            const progress = {
              percent: time / duration * 100,
              frame: 0,
              // TODO: Parse frame info
              fps: 0,
              // TODO: Parse FPS
              time: `${timeMatch[1]}:${timeMatch[2]}:${timeMatch[3]}`,
              bitrate: "0",
              // TODO: Parse bitrate
              size: "0"
              // TODO: Parse size
            };
            onProgress(progress);
          }
          errorLog += message;
        });
        ffmpeg.on("close", async (code) => {
          try {
            await promises.unlink(tempInput);
            if (code === 0) {
              const fileInfo = await promises.stat(outputPath);
              resolve({
                success: true,
                outputPath,
                duration,
                size: fileInfo.size
              });
            } else {
              reject(new Error(`FFmpeg conversion failed: ${errorLog}`));
            }
          } catch (error) {
            reject(error);
          }
        });
        ffmpeg.on("error", (error) => {
          promises.unlink(tempInput).catch(console.error);
          reject(error);
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to convert video: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
  getHardwareAcceleration() {
    return this.hwAccel;
  }
  async updateSettings(settings) {
    this.defaultSettings = {
      ...this.defaultSettings,
      ...settings
    };
  }
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const applicationName = "Stash Cast";
const ffmpegService = new FFmpegService();
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let tray = null;
let mainAppWindow = null;
let cameraWindow = null;
async function checkAndRequestPermissions() {
  if (process.platform === "darwin") {
    if (!systemPreferences.getMediaAccessStatus("camera")) {
      await systemPreferences.askForMediaAccess("camera");
    }
    if (!systemPreferences.getMediaAccessStatus("microphone")) {
      await systemPreferences.askForMediaAccess("microphone");
    }
  }
}
function createMainAppWindow() {
  mainAppWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 320,
    minHeight: 650,
    titleBarStyle: "default",
    frame: false,
    resizable: true,
    movable: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    mainAppWindow.loadURL(`${VITE_DEV_SERVER_URL}`);
  } else {
    mainAppWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
function createCameraWindow() {
  console.log("Creating camera window...");
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
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      backgroundThrottling: false
    },
    vibrancy: "under-window",
    visualEffectState: "active"
  });
  cameraWindow.setIgnoreMouseEvents(false);
  if (VITE_DEV_SERVER_URL) {
    cameraWindow.loadURL(`${VITE_DEV_SERVER_URL}src/camera.html`);
  } else {
    const filePath = path.join(RENDERER_DIST, "camera.html");
    cameraWindow.loadFile(filePath);
  }
}
function setupTray() {
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,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"
  );
  tray = new Tray(icon);
  tray.setToolTip(applicationName);
  tray.on("click", () => {
    if (!(mainAppWindow == null ? void 0 : mainAppWindow.isVisible())) {
      mainAppWindow == null ? void 0 : mainAppWindow.show();
    }
  });
}
function setupIPC() {
  ipcMain.handle("getSources", async (_event) => {
    const screens = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 150, height: 150 }
    });
    const windows = await desktopCapturer.getSources({
      types: ["window"],
      thumbnailSize: { width: 150, height: 150 }
    });
    const screenThumbnails = screens.map((screen) => {
      return {
        id: screen.id,
        name: screen.name,
        thumbnail: screen.thumbnail.toDataURL(),
        display_id: screen.display_id,
        appIcon: screen.appIcon
      };
    });
    const windowThumbnails = windows.map((window) => {
      return {
        id: window.id,
        name: window.name,
        thumbnail: window.thumbnail.toDataURL(),
        display_id: window.display_id,
        appIcon: window.appIcon
      };
    });
    const sources = [...screenThumbnails, ...windowThumbnails];
    return sources;
  });
  ipcMain.handle(
    "save-recording",
    async (_event, { buffer, mimeType, options }) => {
      try {
        const tempWebM = path.join(tmpdir$1(), `temp-${Date.now()}.webm`);
        console.log("Creating temporary WebM file:", tempWebM);
        await fs.writeFile(tempWebM, Buffer.from(buffer));
        const stats = await fs.stat(tempWebM);
        console.log("Temporary WebM file created:", {
          size: stats.size,
          mimeType
        });
        const { filePath, canceled } = await dialog.showSaveDialog({
          defaultPath: path.join(
            app.getPath("desktop"),
            `recording-${Date.now()}.mov`
          ),
          filters: [{ name: "QuickTime Movie", extensions: ["mov"] }]
        });
        if (canceled || !filePath) {
          console.log("Save dialog was canceled");
          await fs.unlink(tempWebM).catch(console.error);
          return { success: false, error: "Save dialog was canceled" };
        }
        try {
          const result = await ffmpegService.convertVideo(
            buffer,
            filePath,
            {
              useHardwareAcceleration: (options == null ? void 0 : options.useHardwareAcceleration) ?? true,
              preset: "medium",
              crf: 23,
              audioQuality: 3,
              maxBitrate: "5M"
            },
            (progress) => {
              mainAppWindow == null ? void 0 : mainAppWindow.webContents.send("conversion-progress", progress);
            }
          );
          await fs.unlink(tempWebM).catch(console.error);
          return { success: true, filePath: result.outputPath };
        } catch (error) {
          await fs.unlink(tempWebM).catch(console.error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Conversion failed"
          };
        }
      } catch (error) {
        console.error("Failed to save recording:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred"
        };
      }
    }
  );
  ipcMain.on("start-recording", () => {
    console.log("Recording started");
  });
  ipcMain.on("stop-recording", () => {
    console.log("Recording stopped");
  });
  ipcMain.on("close-app", () => {
    app.quit();
  });
  ipcMain.on("show-camera-window", () => {
    console.log("Received show-camera-window event");
    if (!cameraWindow) {
      console.log("No camera window exists, creating new one");
      createCameraWindow();
    } else {
      console.log("Camera window exists, showing it");
      if (cameraWindow.isDestroyed()) {
        console.log("Camera window was destroyed, creating new one");
        createCameraWindow();
      } else {
        cameraWindow.showInactive();
      }
    }
  });
  ipcMain.on("camera-stream-ready", (event, streamInfo) => {
    console.log("Received camera-stream-ready event:", streamInfo);
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      console.log("Forwarding stream info to camera window");
      cameraWindow.webContents.send("camera-stream-ready", streamInfo);
    } else {
      console.log("Camera window not available to receive stream");
    }
  });
  ipcMain.on("hide-camera-window", () => {
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      cameraWindow.hide();
    }
  });
  ipcMain.on("set-camera-window-position", (_event, { x, y }) => {
    if (cameraWindow && !cameraWindow.isDestroyed()) {
      cameraWindow.setPosition(x, y);
    }
  });
  ipcMain.handle("get-display-info", (_event, displayId) => {
    const display = require("electron").screen.getDisplayMatching({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      displayId
    });
    return display;
  });
  ipcMain.handle("get-hardware-acceleration", async () => {
    return {
      type: "none",
      available: false,
      name: "Software Encoding"
    };
  });
  ipcMain.handle("update-ffmpeg-settings", async (_event, settings) => {
    return false;
  });
}
app.whenReady().then(async () => {
  await checkAndRequestPermissions();
  setupIPC();
  setupTray();
  createMainAppWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainAppWindow();
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
//# sourceMappingURL=main.js.map
