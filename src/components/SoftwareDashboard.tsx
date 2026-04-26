import { useState } from 'react'
import { Search, Download, CheckCircle, Loader, Filter } from 'lucide-react'
import { SOFTWARE_CATALOG, CATEGORY_MAP_ES, CATEGORY_MAP_EN, type SoftwareItem } from '../data/software'
import { useLang } from '../context/LanguageContext'

type InstallStatus = 'idle' | 'installing' | 'done' | 'error'

const ALL_CATEGORIES_ES = ['Todos', 'Navegadores', 'Comunicación', 'Gaming', 'Multimedia', 'Utilidades', 'Desarrollo', 'PDF / Ofimática', 'Diseño', 'Antivirus']
const ALL_CATEGORIES_EN = ['All', 'Browsers', 'Communication', 'Gaming', 'Media', 'Utilities', 'Development', 'PDF / Office', 'Design', 'Antivirus']

export default function SoftwareDashboard() {
  const { t, lang } = useLang()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [installStatus, setInstallStatus] = useState<Record<string, InstallStatus>>({})

  const categoryMap = lang === 'es' ? CATEGORY_MAP_ES : CATEGORY_MAP_EN
  const categories = lang === 'es' ? ALL_CATEGORIES_ES : ALL_CATEGORIES_EN
  const allLabel = lang === 'es' ? 'Todos' : 'All'

  const filtered = SOFTWARE_CATALOG.filter(s => {
    const searchLower = search.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(searchLower) ||
      (lang === 'es' ? s.description : s.descriptionEn).toLowerCase().includes(searchLower)
    const matchCat = activeCategory === 'all' || activeCategory === allLabel ||
      categoryMap[s.category] === activeCategory
    return matchSearch && matchCat
  })

  const handleInstall = async (item: SoftwareItem) => {
    if (installStatus[item.id] === 'installing' || installStatus[item.id] === 'done') return
    setInstallStatus(p => ({ ...p, [item.id]: 'installing' }))
    try {
      const result = await window.electronAPI?.wingetInstall(item.wingetId)
      setInstallStatus(p => ({ ...p, [item.id]: result?.success ? 'done' : 'error' }))
    } catch {
      setInstallStatus(p => ({ ...p, [item.id]: 'error' }))
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t.software.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t.software.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {t.software.wingetReady}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.software.search}
            className="w-full glass-card rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-transparent focus:border-cyan-400/40 transition-colors"
          />
        </div>
        <button className="glass-card rounded-xl px-3 py-2.5 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/10">
          <Filter size={14} />
          {t.software.filter}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeCategory === cat || (activeCategory === 'all' && cat === allLabel)
                ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                : 'text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 pb-2">
          {filtered.map((item, i) => {
            const status = installStatus[item.id] ?? 'idle'
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-4 flex flex-col gap-3 hover:border-white/15 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 20, 400)}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${item.color}22`, border: `1px solid ${item.color}33` }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-tight line-clamp-2">
                      {lang === 'es' ? item.description : item.descriptionEn}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${item.color}22`, color: item.color }}>
                    {categoryMap[item.category] ?? item.category}
                  </span>
                  <button
                    onClick={() => handleInstall(item)}
                    disabled={status === 'installing' || status === 'done'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      status === 'done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      status === 'installing' ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' :
                      status === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' :
                      'bg-cyan-400/15 text-cyan-400 border border-cyan-400/25 hover:bg-cyan-400/25'
                    }`}
                  >
                    {status === 'done' ? <><CheckCircle size={12} />{t.software.installed}</> :
                     status === 'installing' ? <><Loader size={12} className="animate-spin" />{t.software.installing}</> :
                     status === 'error' ? t.software.retry :
                     <><Download size={12} />{t.software.install}</>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
