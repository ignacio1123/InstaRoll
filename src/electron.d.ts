export interface ElectronAPI {
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
  wingetInstall: (packageId: string) => Promise<{ success: boolean; output?: string }>
  scanDrivers: () => Promise<{ success: boolean; data?: string; error?: string }>
  getSystemInfo: () => Promise<{ success: boolean; data?: RawSystemInfo; error?: string }>
  getPerfMetrics: () => Promise<{ success: boolean; data?: PerfMetrics; error?: string }>
  openTool: (tool: string) => Promise<{ success: boolean }>
}

export interface PerfMetrics {
  CPULoad: number
  TotalRAM: number
  FreeRAM: number
  Temp: number
}

export interface RawSystemInfo {
  CPU: { Name: string; NumberOfCores: number; NumberOfLogicalProcessors: number; MaxClockSpeed: number; LoadPercentage: number }
  RAM: { TotalVisibleMemorySize: number; FreePhysicalMemory: number }
  GPU: { Name: string; DriverVersion: string; AdapterRAM: number }
  OS: { Caption: string; Version: string; BuildNumber: string; OSArchitecture: string }
  Motherboard: { Manufacturer: string; Product: string }
  Disks: { Model: string; Size: number; MediaType: string }[]
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
