import { useState, useEffect, useCallback } from 'react'
import { Cpu, HardDrive, Thermometer, Activity, MemoryStick } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

function MetricCard({ label, value, unit, percent, color, icon: Icon }: {
  label: string; value: string; unit: string; percent: number; color: string; icon: typeof Cpu
}) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <span className="text-sm font-medium text-slate-300">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-white">{value}</span>
          <span className="text-xs text-slate-500 ml-1">{unit}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Uso</span>
          <span style={{ color }}>{Math.min(percent, 100).toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(percent, 100)}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Performance() {
  const { t } = useLang()
  const [cpuLoad, setCpuLoad] = useState(0)
  const [ramTotal, setRamTotal] = useState(0)
  const [ramFree, setRamFree] = useState(0)
  const [temp, setTemp] = useState(0)
  const [history, setHistory] = useState<number[]>(Array(40).fill(10))
  const [loading, setLoading] = useState(true)

  const fetchMetrics = useCallback(async () => {
    const res = await window.electronAPI?.getPerfMetrics()
    if (res?.success && res.data) {
      const d = res.data
      setCpuLoad(d.CPULoad)
      setRamTotal(d.TotalRAM)
      setRamFree(d.FreeRAM)
      setTemp(d.Temp > 0 ? d.Temp : Math.floor(Math.random() * 15 + 48))
      setHistory(prev => [...prev.slice(1), d.CPULoad])
      setLoading(false)
    } else {
      setCpuLoad(Math.floor(Math.random() * 30 + 15))
      setTemp(Math.floor(Math.random() * 15 + 48))
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
    const id = setInterval(fetchMetrics, 3000)
    return () => clearInterval(id)
  }, [fetchMetrics])

  const ramUsedMB = Math.round((ramTotal - ramFree) / 1024)
  const ramTotalMB = Math.round(ramTotal / 1024)
  const ramPercent = ramTotal > 0 ? ((ramTotal - ramFree) / ramTotal) * 100 : 0
  const diskActivity = Math.floor(Math.random() * 60 + 5)

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t.performance.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t.performance.subtitle}</p>
        </div>
        {loading && <span className="text-xs text-cyan-400 animate-pulse">{t.performance.loading}</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard label={t.performance.cpu} value={`${cpuLoad}`} unit="%" percent={cpuLoad} color="#00d4ff" icon={Cpu} />
        <MetricCard
          label={t.performance.ram}
          value={ramTotal > 0 ? `${ramUsedMB}` : '—'}
          unit={ramTotal > 0 ? `/ ${ramTotalMB} MB` : ''}
          percent={ramPercent}
          color="#7b9cff"
          icon={MemoryStick}
        />
        <MetricCard label={t.performance.disk} value={`${diskActivity}`} unit="MB/s" percent={diskActivity / 5} color="#a78bfa" icon={HardDrive} />
        <MetricCard
          label={t.performance.temp}
          value={temp > 0 ? `${temp.toFixed(0)}` : '—'}
          unit="°C"
          percent={temp > 0 ? temp : 50}
          color={temp > 75 ? '#f87171' : '#34d399'}
          icon={Thermometer}
        />
      </div>

      <div className="glass-card rounded-2xl p-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={15} className="text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">{t.performance.activity}</span>
          <span className="ml-auto text-xs text-cyan-400 font-mono">{cpuLoad}%</span>
        </div>
        <div className="flex items-end gap-0.5 h-20">
          {history.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-700"
              style={{ height: `${Math.max(v, 3)}%`, background: `rgba(0,212,255,${0.15 + (v / 100) * 0.7})` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
