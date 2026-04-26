const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  wingetInstall: (packageId) => ipcRenderer.invoke('winget-install', packageId),
  scanDrivers: () => ipcRenderer.invoke('scan-drivers'),
  updateDriver: (driverData) => ipcRenderer.invoke('update-driver', driverData),
  updateAllDrivers: (driversList) => ipcRenderer.invoke('update-all-drivers', driversList),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getPerfMetrics: () => ipcRenderer.invoke('get-perf-metrics'),
  openTool: (tool) => ipcRenderer.invoke('open-tool', tool),
})
