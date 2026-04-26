// Función para extraer y resumir cambios del output del driver
function resumenCambiosDriver(output: string): string {
  if (!output) return '';
  // Busca líneas relevantes (simulación)
  const lines = output.split('\n').filter(l => l.toLowerCase().includes('update') || l.toLowerCase().includes('fix') || l.toLowerCase().includes('improve'));
  if (lines.length === 0) return 'Actualización aplicada correctamente.';
  return lines.slice(0, 2).join(' · '); // Máximo 2 cambios resumidos
}
import { useState } from 'react'
import { Monitor, Wifi, HardDrive, Cpu, RefreshCw, CheckCircle, AlertCircle, Loader, Volume2, Zap } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

interface DriverItem {
  name: string
  type: string
  icon: typeof Monitor
  status: 'up-to-date' | 'update-available' | 'unknown' | 'checking'
  version?: string
}

const ICONS: Record<string, typeof Monitor> = {
  GPU: Monitor,
  Chipset: Cpu,
  Red: Wifi,
  Disco: HardDrive,
  WiFi: Wifi,
  Audio: Volume2,
}

function RadarAnimation({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      {[0, 15, 30, 45].map(pct => (
        <div key={pct} className="absolute inset-0 rounded-full border border-cyan-400/10"
          style={{ margin: `${pct * 0.85}%` }} />
      ))}
      {[0, 90, 180, 270].map(deg => (
        <div key={deg} className="absolute w-full h-px bg-cyan-400/8" style={{ transform: `rotate(${deg}deg)` }} />
      ))}
      {scanning && (
        <div className="absolute inset-0 animate-radar" style={{ transformOrigin: 'center' }}>
          <svg viewBox="0 0 220 220" className="w-full h-full">
            <path d="M110,110 L110,10 A100,100 0 0,1 200,160 Z" fill="rgba(0,212,255,0.07)" />
            <line x1="110" y1="110" x2="110" y2="12" stroke="rgba(0,212,255,0.65)" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      {scanning && (
        <div className="absolute inset-0 rounded-full animate-pulse-ring"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />
      )}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          scanning ? 'border-cyan-400 bg-cyan-400/10 cyan-glow-strong' : 'border-slate-600 bg-slate-800/50'
        }`}>
          <RefreshCw size={20} className={scanning ? 'text-cyan-400 animate-spin' : 'text-slate-400'} />
        </div>
      </div>
    </div>
  )
}

export default function DriverScanner() {
  const { t } = useLang()
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [drivers, setDrivers] = useState<DriverItem[]>([])
  const [progress, setProgress] = useState(0)

  const startScan = async () => {
    if (scanning) return
    setScanning(true)
    setScanned(false)
    setProgress(0)
    setDrivers([])
    // Llama a Electron para escaneo profundo
    const api = window.electronAPI
    try {
      const result = await api?.scanDrivers()
      if (result?.success && result.data) {
        // result.data debe ser un array de drivers reales
        const foundDrivers = result.data.map((d: any) => ({
          name: d.name,
          type: d.type,
          icon: ICONS[d.type] || Monitor,
          status: d.status,
          version: d.version,
        }))
        setDrivers(foundDrivers)
        setProgress(100)
      } else {
        setDrivers([])
        setProgress(0)
      }
    } catch {
      setDrivers([])
      setProgress(0)
    }
    setScanning(false)
    setScanned(true)
  }

  const updatesAvailable = drivers.filter(d => d.status === 'update-available').length

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t.drivers.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t.drivers.subtitle}</p>
        </div>
        {scanned && updatesAvailable > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20">
            <AlertCircle size={13} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">{updatesAvailable} {t.drivers.updatesAvailable}</span>
          </div>
        )}
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center gap-5 w-72 shrink-0">
          <RadarAnimation scanning={scanning} />
          {scanning && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>{t.drivers.scanHardware}</span>
                <span className="text-cyan-400">{progress}%</span>
              </div>
              <div className="w-full h-1 bg-slate-700/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          <button
            onClick={startScan}
            disabled={scanning}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              scanning ? 'bg-cyan-400/10 text-cyan-400/50 border border-cyan-400/20 cursor-not-allowed' :
              'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/30 hover:cyan-glow'
            }`}
          >
            {scanning ? <><Loader size={14} className="animate-spin" />{t.drivers.scanning}</> :
             scanned ? <><RefreshCw size={14} />{t.drivers.rescan}</> :
             <><RefreshCw size={14} />{t.drivers.startScan}</>}
          </button>
          {scanned && (
            <div className="w-full grid grid-cols-3 gap-2 text-center">
              {[
                { v: drivers.length, label: t.drivers.detected, color: 'text-white' },
                { v: drivers.filter(d => d.status === 'up-to-date').length, label: t.drivers.updated, color: 'text-emerald-400' },
                { v: updatesAvailable, label: t.drivers.outdated, color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-2">
                  <div className={`text-lg font-bold ${s.color}`}>{s.v}</div>
                  <div className="text-[10px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0">
          {drivers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-600">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <p className="text-sm">
                {scanned
                  ? 'El PC está en regla, no hay drivers por actualizar.'
                  : t.drivers.runScan}
              </p>
            </div>
          ) : (
            drivers.map((driver, i) => {
              const Icon = driver.icon
              const isChecking = driver.status === 'checking'
              const hasUpdate = driver.status === 'update-available'
              const isUpToDate = driver.status === 'up-to-date'
              const isMissing = driver.status === 'missing'
              return (
                <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-white/15 transition-all duration-300">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    hasUpdate ? 'bg-amber-400/10 border border-amber-400/20' :
                    isUpToDate ? 'bg-emerald-400/10 border border-emerald-400/20' :
                    isMissing ? 'bg-red-400/10 border border-red-400/20' :
                    'bg-slate-700/50 border border-slate-600/30'
                  }`}>
                    <Icon size={18} className={hasUpdate ? 'text-amber-400' : isUpToDate ? 'text-emerald-400' : isMissing ? 'text-red-400' : 'text-slate-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{driver.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{driver.type}</span>
                      {driver.version && !isChecking && (
                        <span className="text-[10px] text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded">v{driver.version}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isChecking ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500"><Loader size={12} className="animate-spin" />{t.drivers.checking}</div>
                    ) : hasUpdate ? (
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-medium hover:bg-amber-400/30 transition-colors"
                        onClick={async () => {
                          const api = window.electronAPI
                          setDrivers(prev => prev.map((d, idx) => idx === i ? { ...d, status: 'checking' } : d))
                          const res = await api?.wingetInstall(driver.name)
                          setDrivers(prev => prev.map((d, idx) => idx === i ? { ...d, status: res?.success ? 'up-to-date' : 'update-available', changes: res?.output ? resumenCambiosDriver(res.output) : '' } : d))
                        }}
                      >
                        {t.drivers.update}
                      </button>
                    ) : isUpToDate ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400"><CheckCircle size={13} />{t.drivers.upToDate}</div>
                        {driver.changes && (
                          <div className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-1 rounded mt-1">
                            <b>Cambios:</b> {driver.changes}
                          </div>
                        )}
                      </div>
                    ) : isMissing ? (
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-400/20 text-red-400 border border-red-400/30 text-xs font-medium hover:bg-red-400/30 transition-colors"
                        onClick={async () => {
                          const api = window.electronAPI
                          setDrivers(prev => prev.map((d, idx) => idx === i ? { ...d, status: 'checking' } : d))
                          // Simula búsqueda e instalación segura
                          const res = await api?.wingetInstall(driver.name)
                          setDrivers(prev => prev.map((d, idx) => idx === i ? { ...d, status: res?.success ? 'up-to-date' : 'missing' } : d))
                        }}
                      >
                        Buscar e instalar
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500"><AlertCircle size={13} />{t.drivers.unknown}</div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
