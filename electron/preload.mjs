import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, ...args) => {
    const validChannels = [
      'getSources',
      'get-display-info',
      'get-machine-id',
      'get-hostname',
    ];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error('Invalid channel'));
  },
  send: (channel, ...args) => {
    const validChannels = [
      'close-app',
      'start-recording',
      'stop-recording',
      'show-camera-window',
      'hide-camera-window',
      'set-camera-window-position',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  on: (channel, func) => {
    const validChannels = ['camera-stream-ready'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  removeListener: (channel, func) => {
    const validChannels = ['camera-stream-ready'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, func);
    }
  },
});
