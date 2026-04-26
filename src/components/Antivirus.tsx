import { useState } from 'react'
import { Shield, CheckCircle, AlertTriangle, Scan, Lock, Eye, Loader } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export default function Antivirus() {
  const { t } = useLang()
  const [threats] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState(() => {
    const now = new Date()
    return `${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
  })
  const [scanProgress, setScanProgress] = useState(0)

  const runScan = async () => {
    if (scanning) return
    setScanning(true)
    setScanProgress(0)
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 60))
      setScanProgress(i)
    }
    const now = new Date()
    setLastScan(`${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`)
    setScanning(false)
    setScanProgress(0)
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h1 className="text-xl font-bold text-white">{t.antivirus.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t.antivirus.subtitle}</p>
      </div>

      <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
            scanning ? 'border-cyan-400 bg-cyan-400/10 animate-pulse-ring' : 'border-emerald-400/60 bg-emerald-400/10'
          }`}>
            {scanning
              ? <Loader size={36} className="text-cyan-400 animate-spin" />
              : <Shield size={36} className="text-emerald-400" />
            }
          </div>
          {!scanning && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
              <CheckCircle size={14} className="text-white" />
            </div>
          )}
        </div>

        {scanning ? (
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t.antivirus.scanning}</span>
              <span className="text-cyan-400">{scanProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-200" style={{ width: `${scanProgress}%` }} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">{t.antivirus.protected}</div>
            <div className="text-xs text-slate-500 mt-0.5">{t.antivirus.noThreats}: {lastScan}</div>
          </div>
        )}

        <div className="flex gap-2 w-full">
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex-1 py-2.5 rounded-xl bg-emerald-400/15 text-emerald-400 border border-emerald-400/25 text-sm font-medium hover:bg-emerald-400/25 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Scan size={15} />
            {t.antivirus.quickScan}
          </button>
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex-1 py-2.5 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 text-sm font-medium hover:bg-cyan-400/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Shield size={15} />
            {t.antivirus.fullScan}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Lock, label: t.antivirus.firewall, status: t.antivirus.active, color: '#00d4ff' },
          { icon: Eye, label: t.antivirus.realtime, status: t.antivirus.active, color: '#34d399' },
          { icon: AlertTriangle, label: t.antivirus.threats, status: `${threats} ${t.antivirus.found}`, color: threats > 0 ? '#f87171' : '#34d399' },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-xl p-3 flex flex-col items-center gap-2">
            <item.icon size={18} style={{ color: item.color }} />
            <span className="text-xs font-medium text-slate-400 text-center">{item.label}</span>
            <span className="text-[10px]" style={{ color: item.color }}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
