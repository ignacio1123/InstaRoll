export interface DriverData {
  id: string
  source: string
}

export interface ScannedDriver {
  name: string
  type: string
  version?: string
  status: 'up-to-date' | 'update-available' | 'unknown' | 'checking' | 'missing'
  source: string
  id: string
}

export interface Threat {
  id: string
  name: string
  type: string
  severity: number
  resources: string[]
  description: string
  source: string
}

export interface ElectronAPI {
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
  wingetInstall: (packageId: string) => Promise<{ success: boolean; output?: string }>
  scanDrivers: () => Promise<{ success: boolean; data?: ScannedDriver[]; error?: string }>
  updateDriver: (driverData: DriverData) => Promise<{ success: boolean; error?: string }>
  updateAllDrivers: (driversList: DriverData[]) => Promise<{ success: boolean; error?: string }>
  antivirusScan: (type: 'Quick' | 'Full') => Promise<{ success: boolean; data?: Threat[]; error?: string; debug?: string }>
  antivirusRemove: (threat: Threat) => Promise<{ success: boolean; error?: string }>
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
