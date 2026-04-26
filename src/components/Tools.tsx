import { Wrench, Trash2, RefreshCw, HardDrive, Settings, Terminal, ListTodo, DatabaseBackup } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export default function Tools() {
  const { t } = useLang()

  const TOOLS = [
    { icon: Trash2, label: t.tools.diskCleanup, description: t.tools.diskCleanupDesc, color: '#f87171', action: t.tools.clean, toolId: 'cleanup' },
    { icon: RefreshCw, label: t.tools.systemRestore, description: t.tools.systemRestoreDesc, color: '#7b9cff', action: t.tools.open, toolId: 'restore' },
    { icon: HardDrive, label: t.tools.defrag, description: t.tools.defragDesc, color: '#a78bfa', action: t.tools.run, toolId: 'defrag' },
    { icon: Settings, label: t.tools.startup, description: t.tools.startupDesc, color: '#00d4ff', action: t.tools.manage, toolId: 'startup' },
    { icon: Terminal, label: t.tools.powershell, description: t.tools.powershellDesc, color: '#34d399', action: t.tools.open, toolId: 'powershell' },
    { icon: Wrench, label: t.tools.sysinfo, description: t.tools.sysinfoDesc, color: '#fbbf24', action: t.tools.view, toolId: 'sysinfo' },
    { icon: ListTodo, label: t.tools.taskManager, description: t.tools.taskManagerDesc, color: '#fb923c', action: t.tools.open, toolId: 'taskmanager' },
    { icon: DatabaseBackup, label: t.tools.registry, description: t.tools.registryDesc, color: '#e879f9', action: t.tools.open, toolId: 'registry' },
  ]

  const handleTool = async (toolId: string) => {
    await window.electronAPI?.openTool(toolId)
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h1 className="text-xl font-bold text-white">{t.tools.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t.tools.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto">
        {TOOLS.map(tool => (
          <div key={tool.toolId} className="glass-card rounded-2xl p-4 flex flex-col gap-3 hover:border-white/15 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${tool.color}22`, border: `1px solid ${tool.color}33` }}>
              <tool.icon size={18} style={{ color: tool.color }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{tool.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{tool.description}</div>
            </div>
            <button
              onClick={() => handleTool(tool.toolId)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
              style={{ color: tool.color, borderColor: `${tool.color}30`, background: `${tool.color}15` }}
            >
              {tool.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
