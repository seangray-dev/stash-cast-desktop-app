export interface DesktopSource {
  id: string;
  name: string;
  thumbnail: Electron.NativeImage;
  display_id: string;
  appIcon: Electron.NativeImage;
  type: 'screen' | 'window';
}

export interface MediaSources {
  displays: DesktopSource[];
  audioinputs: MediaDeviceInfo[];
  videoinputs: MediaDeviceInfo[];
}
