import { useState, useEffect, useCallback } from 'react'
import { Cpu, MemoryStick, Monitor, HardDrive, RefreshCw, Globe, Info, Loader, Server } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { type RawSystemInfo } from '../electron.d'

interface SpecRow { icon: typeof Cpu; label: string; value: string; color: string }

function SpecCard({ icon: Icon, label, value, color }: SpecRow) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}22` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium text-white truncate mt-0.5">{value}</div>
      </div>
    </div>
  )
}

export default function Settings() {
  const { t, lang, setLang } = useLang()
  const [specs, setSpecs] = useState<RawSystemInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchSpecs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await window.electronAPI?.getSystemInfo()
      if (res?.success && res.data) setSpecs(res.data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchSpecs() }, [fetchSpecs])

  const fmtRam = (kb: number) => `${(kb / 1024 / 1024).toFixed(1)} GB`
  const fmtDisk = (b: number) => `${(b / 1e9).toFixed(0)} GB`
  const fmtVram = (b: number) => b > 0 ? `${(b / 1024 / 1024 / 1024).toFixed(0)} GB VRAM` : ''

  const specRows: SpecRow[] = specs ? [
    { icon: Cpu, label: t.settings.processor, value: specs.CPU?.Name ?? '—', color: '#00d4ff' },
    { icon: MemoryStick, label: t.settings.memory, value: `${fmtRam(specs.RAM?.TotalVisibleMemorySize ?? 0)} · ${fmtRam(specs.RAM?.FreePhysicalMemory ?? 0)} libre`, color: '#7b9cff' },
    { icon: Monitor, label: t.settings.gpu, value: `${specs.GPU?.Name ?? '—'} ${fmtVram(specs.GPU?.AdapterRAM ?? 0)}`, color: '#a78bfa' },
    { icon: Globe, label: t.settings.os, value: `${specs.OS?.Caption ?? '—'} (${specs.OS?.OSArchitecture ?? ''})`, color: '#34d399' },
    { icon: Server, label: t.settings.motherboard, value: `${specs.Motherboard?.Manufacturer ?? ''} ${specs.Motherboard?.Product ?? ''}`, color: '#fbbf24' },
    {
      icon: HardDrive, label: t.settings.disk,
      value: Array.isArray(specs.Disks)
        ? specs.Disks.map(d => `${d.Model} (${fmtDisk(d.Size)})`).join(' · ')
        : specs.Disks ? `${(specs.Disks as { Model: string; Size: number }).Model} (${fmtDisk((specs.Disks as { Model: string; Size: number }).Size)})` : '—',
      color: '#fb923c'
    },
  ] : []

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-white">{t.settings.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t.settings.subtitle}</p>
      </div>

      {/* Idioma */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-white">{t.settings.language}</span>
        </div>
        <p className="text-xs text-slate-500">{t.settings.languageDesc}</p>
        <div className="flex gap-2">
          {(['es', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                lang === l
                  ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40'
                  : 'bg-transparent text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {l === 'es' ? `🇪🇸 ${t.settings.spanish}` : `🇬🇧 ${t.settings.english}`}
            </button>
          ))}
        </div>
      </div>

      {/* Especificaciones del PC */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-white">{t.settings.pcSpecs}</span>
          </div>
          <button
            onClick={fetchSpecs}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {t.settings.refresh}
          </button>
        </div>
        <p className="text-xs text-slate-500">{t.settings.pcSpecsDesc}</p>

        {loading && !specs ? (
          <div className="flex items-center justify-center gap-3 py-8 text-slate-500">
            <Loader size={18} className="animate-spin text-cyan-400" />
            <span className="text-sm">{t.settings.loading}</span>
          </div>
        ) : specRows.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {specRows.map(row => <SpecCard key={row.label} {...row} />)}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-600 text-sm">
            No se pudo obtener la información del sistema
          </div>
        )}
      </div>

      {/* Acerca de */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-white">{t.settings.about}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/20 flex items-center justify-center text-lg">⚡</div>
          <div>
            <div className="text-sm font-bold text-white">InstaRoll</div>
            <div className="text-xs text-slate-500">{t.settings.version} 1.0.0</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{t.settings.about1}</p>
      </div>
    </div>
  )
}
