import { Palette, Monitor, Sliders } from 'lucide-react'
import { useDesign } from '../context/DesignContext'
import { useLang } from '../context/LanguageContext'

const ACCENTS = ['#00d4ff', '#7b9cff', '#a78bfa', '#34d399', '#f87171', '#fbbf24']

export default function Design() {
  const { t } = useLang()
  const { accent, setAccent, wallpaper, setWallpaper, transparency, setTransparency } = useDesign()

  const wallpapers = [
    { label: 'Dark Cosmos', gradient: 'from-slate-900 to-blue-950' },
    { label: 'Cyber Grid', gradient: 'from-cyan-950 to-slate-900' },
    { label: 'Deep Purple', gradient: 'from-purple-950 to-slate-900' },
    { label: 'Forest Dark', gradient: 'from-emerald-950 to-slate-900' },
  ]

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h1 className="text-xl font-bold text-white">{t.design.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t.design.subtitle}</p>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Palette size={15} className="text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">{t.design.accentColor}</span>
        </div>
        <div className="flex gap-3">
          {ACCENTS.map(c => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className="w-8 h-8 rounded-full transition-all duration-200"
              style={{ background: c, boxShadow: accent === c ? `0 0 0 2px rgba(255,255,255,0.2), 0 0 12px ${c}80` : 'none', transform: accent === c ? 'scale(1.2)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Monitor size={15} className="text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">{t.design.wallpaper}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {wallpapers.map((w, i) => (
            <button
              key={i}
              onClick={() => setWallpaper(i)}
              className={`h-14 rounded-xl bg-gradient-to-br ${w.gradient} transition-all duration-200 relative overflow-hidden ${wallpaper === i ? 'ring-2 ring-cyan-400/50' : 'ring-1 ring-white/10'}`}
            >
              <span className="absolute bottom-1.5 left-2 text-[10px] text-white/70">{w.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sliders size={15} className="text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">{t.design.transparency}</span>
        </div>
        <input type="range" min="0" max="100" value={transparency} onChange={e => setTransparency(Number(e.target.value))} className="w-full accent-cyan-400" />
      </div>
    </div>
  )
}
