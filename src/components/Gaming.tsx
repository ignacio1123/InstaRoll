import { Gamepad2, Monitor, Cpu, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

function Toggle({ label, description, enabled, onToggle }: {
  label: string; description: string; enabled: boolean; onToggle: () => void
}) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{description}</div>
      </div>
      <button onClick={onToggle} className="shrink-0">
        {enabled
          ? <ToggleRight size={28} className="text-cyan-400" />
          : <ToggleLeft size={28} className="text-slate-600" />
        }
      </button>
    </div>
  )
}

export default function Gaming() {
  const { t } = useLang()
  const [settings, setSettings] = useState({
    gameMode: true, gpuBoost: false, autoClose: true, overlay: false,
  })
  const toggle = (k: keyof typeof settings) => setSettings(p => ({ ...p, [k]: !p[k] }))

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h1 className="text-xl font-bold text-white">{t.gaming.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t.gaming.subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Gamepad2, label: 'Game Mode', value: settings.gameMode ? 'ON' : 'OFF', color: '#00d4ff' },
          { icon: Monitor, label: t.gaming.display, value: '144 Hz', color: '#7b9cff' },
          { icon: Cpu, label: t.gaming.cpuPriority, value: t.gaming.high, color: '#a78bfa' },
        ].map(item => (
          <div key={item.label} className="glass-card rounded-xl p-3 flex flex-col items-center gap-2">
            <item.icon size={20} style={{ color: item.color }} />
            <span className="text-xs text-slate-500 text-center">{item.label}</span>
            <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <Toggle label={t.gaming.gameMode} description={t.gaming.gameModeDesc} enabled={settings.gameMode} onToggle={() => toggle('gameMode')} />
        <Toggle label={t.gaming.gpuBoost} description={t.gaming.gpuBoostDesc} enabled={settings.gpuBoost} onToggle={() => toggle('gpuBoost')} />
        <Toggle label={t.gaming.autoClose} description={t.gaming.autoCloseDesc} enabled={settings.autoClose} onToggle={() => toggle('autoClose')} />
        <Toggle label={t.gaming.overlay} description={t.gaming.overlayDesc} enabled={settings.overlay} onToggle={() => toggle('overlay')} />
      </div>
    </div>
  )
}
