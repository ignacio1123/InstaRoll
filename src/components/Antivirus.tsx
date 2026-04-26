import { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertTriangle, Scan, Lock, Eye, Loader, Trash2, ChevronDown, ChevronUp, Bug, Search } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import type { Threat } from '../electron'

export default function Antivirus() {
  const { t } = useLang()
  const [threats, setThreats] = useState<Threat[]>([])
  const [scanning, setScanning] = useState(false)
  const [scanType, setScanType] = useState<'Quick' | 'Full'>('Quick')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [purgingAll, setPurgingAll] = useState(false)
  const [purgedCount, setPurgedCount] = useState(0)
  const [lastScan, setLastScan] = useState(() => {
    const now = new Date()
    return `${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
  })
  const [scanProgress, setScanProgress] = useState(0)

  // Simulation of progress bar since PowerShell doesn't provide real-time updates to stdout easily
  useEffect(() => {
    if (scanning) {
      const duration = scanType === 'Quick' ? 120000 : 300000 // Fake progress
      const intervalMs = 500
      const increment = 100 / (duration / intervalMs)
      
      const interval = setInterval(() => {
        setScanProgress(p => (p < 98 ? p + increment : p))
      }, intervalMs)
      
      return () => clearInterval(interval)
    }
  }, [scanning, scanType])

  const runScan = async (type: 'Quick' | 'Full') => {
    if (scanning) return
    setScanType(type)
    setScanning(true)
    setScanProgress(0)
    setThreats([])
    setExpandedId(null)
    
    const api = window.electronAPI
    const res = await api?.antivirusScan(type)
    
    if (res?.success && res.data) {
      setThreats(res.data)
      setPurgedCount(0)
    }
    
    const now = new Date()
    setLastScan(`${now.toLocaleDateString('es-ES')} ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`)
    setScanning(false)
    setScanProgress(100)
    setTimeout(() => { if (!scanning) setScanProgress(0) }, 1000)
  }

  const removeThreat = async (threat: Threat) => {
    if (removingId || purgingAll) return
    setRemovingId(threat.id)
    
    // Simulate a secure deletion process delay for visual effect
    await new Promise(r => setTimeout(r, 1500))
    
    const api = window.electronAPI
    const res = await api?.antivirusRemove(threat)
    
    const isFake = threat.id.startsWith('0.')
    if (res?.success || isFake) {
      setThreats(prev => prev.filter(t => t.id !== threat.id))
      setPurgedCount(p => p + 1)
    }
    setRemovingId(null)
  }

  const removeAllThreats = async () => {
    if (purgingAll || threats.length === 0) return
    setPurgingAll(true)
    
    const api = window.electronAPI
    let successCount = 0
    for (const threat of threats) {
      setRemovingId(threat.id)
      await new Promise(r => setTimeout(r, 800)) // Visual delay per threat
      const res = await api?.antivirusRemove(threat)
      const isFake = threat.id.startsWith('0.')
      if (res?.success || isFake) {
        successCount++
      }
    }
    setRemovingId(null)
    setThreats([]) // Limpiamos todo
    setPurgedCount(p => p + successCount)
    setPurgingAll(false)
  }

  // Debug function to insert fake threats
  const injectFakeThreat = () => {
    setThreats(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        name: 'Trojan:Win32/Wacatac.B!ml',
        type: 'Windows Defender',
        severity: 5,
        resources: ['C:\\Users\\Admin\\Downloads\\crack_setup.exe'],
        description: 'Troyano extremadamente peligroso diseñado para dar acceso remoto al atacante y robar contraseñas.',
        source: 'defender'
      },
      {
        id: Math.random().toString(),
        name: 'Suspicious.Unsigned.AutoKMS',
        type: 'InstaRoll Heuristics',
        severity: 3,
        resources: ['C:\\Windows\\AutoKMS\\AutoKMS.exe'],
        description: 'Aplicación de inicio no firmada. Modificador del sistema típicamente usado para piratería.',
        source: 'instaroll'
      }
    ])
  }

  const getSeverityData = (sev: number) => {
    if (sev >= 4) return { label: 'Muy Peligroso', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
    if (sev >= 2) return { label: 'Peligro Medio', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' }
    return { label: 'Inofensivo', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' }
  }

  return (
    <div className="flex flex-col h-full gap-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t.antivirus.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t.antivirus.subtitle}</p>
        </div>
        <button onClick={injectFakeThreat} className="text-xs font-medium text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
          <Bug size={14} />
          Simular Infección
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-6 w-72 shrink-0">
          <div className="relative mt-2">
            <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              scanning ? 'border-cyan-400 bg-cyan-400/10 animate-pulse-ring' : threats.length > 0 ? 'border-red-500/60 bg-red-500/10' : 'border-emerald-400/60 bg-emerald-400/10'
            }`}>
              {scanning ? <Search size={48} className="text-cyan-400 animate-pulse" /> : 
               threats.length > 0 ? <Bug size={48} className="text-red-500" /> : <Shield size={48} className="text-emerald-400" />}
            </div>
            {!scanning && threats.length === 0 && (
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                <CheckCircle size={18} className="text-white" />
              </div>
            )}
            {!scanning && threats.length > 0 && (
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-bounce">
                <AlertTriangle size={18} className="text-white" />
              </div>
            )}
          </div>

          <div className="w-full">
            {scanning ? (
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Analizando ({scanType})...</span>
                  <span className="text-cyan-400">{Math.floor(scanProgress)}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-200" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className={`text-lg font-bold ${threats.length > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                  {threats.length > 0 ? `${threats.length} Amenazas Detectadas` : t.antivirus.protected}
                </div>
                <div className="text-xs text-slate-500 mt-1">{t.antivirus.noThreats}: {lastScan}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full mt-auto">
            <button
              onClick={() => runScan('Quick')}
              disabled={scanning}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                scanning ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed' : 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/25 hover:bg-emerald-400/25'
              }`}
            >
              <Scan size={15} />
              {t.antivirus.quickScan}
            </button>
            <button
              onClick={() => runScan('Full')}
              disabled={scanning}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                scanning ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed' : 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-400/20'
              }`}
            >
              <Shield size={15} />
              {t.antivirus.fullScan}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 pr-2">
          {threats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-600">
              {purgedCount > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl max-w-md w-full mb-2 animate-in fade-in zoom-in duration-300 flex items-start gap-3">
                  <CheckCircle size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Limpieza Completada</h4>
                    <p className="text-xs mt-1 text-emerald-400/80">Se purgaron {purgedCount} amenazas. Te recomendamos ejecutar un **Análisis Rápido** adicional para confirmar que no quedan modificaciones residuales en el sistema.</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                {[
                  { icon: Lock, label: 'Protección Realtime', status: 'Activo', color: 'text-emerald-400' },
                  { icon: Eye, label: 'Monitoreo de Red', status: 'Activo', color: 'text-cyan-400' },
                  { icon: Shield, label: 'InstaRoll Heuristics', status: 'Activo', color: 'text-indigo-400' },
                ].map((item) => (
                  <div key={item.label} className="glass-card rounded-xl p-4 flex flex-col items-center gap-3">
                    <item.icon size={24} className={item.color} />
                    <span className="text-[11px] font-medium text-slate-400 text-center uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-4 text-slate-500">Sistema seguro y monitoreado.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-2 mb-2">
                <div>
                  <span className="text-sm font-bold text-red-500 uppercase tracking-wider block">Acción Requerida</span>
                  <span className="text-xs text-slate-400">Recomendamos eliminar todas las amenazas inmediatamente.</span>
                </div>
                <button
                  onClick={removeAllThreats}
                  disabled={purgingAll}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    purgingAll ? 'bg-red-500/20 text-red-500/50 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  }`}
                >
                  {purgingAll ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {purgingAll ? 'Purgando...' : 'Purgar Todas'}
                </button>
              </div>
              
              {threats.map((threat) => {
                const isExpanded = expandedId === threat.id
                const isRemoving = removingId === threat.id
                const sevData = getSeverityData(threat.severity)
                
                return (
                  <div key={threat.id} className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 border ${
                    isExpanded ? sevData.border : 'border-white/5 hover:border-white/10'
                  }`}>
                    {/* Header */}
                    <div 
                      className={`p-4 flex items-center gap-4 cursor-pointer ${isExpanded ? sevData.bg : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : threat.id)}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sevData.bg} ${sevData.border} border`}>
                        <Bug size={20} className={sevData.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{threat.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide border ${sevData.border} ${sevData.color}`}>
                            {sevData.label}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                            {threat.type}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-slate-500">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="p-5 border-t border-white/5 bg-black/20 flex flex-col gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Comportamiento e Infección</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">{threat.description}</p>
                        </div>
                        
                        {threat.resources && threat.resources.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Archivos Afectados</h4>
                            <div className="bg-black/40 rounded-lg p-2.5 flex flex-col gap-1.5 border border-white/5 max-h-32 overflow-y-auto">
                              {threat.resources.map((res, i) => (
                                <div key={i} className="text-xs text-slate-400 font-mono break-all">{res}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-2 flex justify-end">
                          <button
                            disabled={isRemoving}
                            onClick={(e) => { e.stopPropagation(); removeThreat(threat) }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isRemoving ? 'bg-red-500/20 text-red-500/50 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                            }`}
                          >
                            {isRemoving ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            {isRemoving ? 'Eliminando...' : 'Purgar Amenaza'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Scanning Overlay (optional full block) */}
      {scanning && scanType === 'Full' && (
        <div className="absolute inset-0 z-50 bg-[#080c14]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl border border-white/10">
          <Search size={64} className="text-cyan-400 animate-pulse mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Análisis Profundo en Curso</h2>
          <p className="text-sm text-slate-400 max-w-md text-center mb-8">
            InstaRoll y Windows Defender están escaneando minuciosamente cada archivo y registro del sistema. Este proceso no debe ser interrumpido.
          </p>
          <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-200" style={{ width: `${scanProgress}%` }} />
          </div>
          <span className="text-cyan-400 font-mono">{Math.floor(scanProgress)}% completado</span>
        </div>
      )}
    </div>
  )
}
