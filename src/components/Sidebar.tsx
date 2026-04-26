import { type LucideIcon } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick: () => void
}

function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 relative
        ${active ? 'bg-cyan-400/15 text-cyan-400 cyan-glow' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-400 rounded-r-full" />}
      <Icon size={20} strokeWidth={active ? 2 : 1.5} />
      <span className="text-[10px] font-medium leading-none text-center">{label}</span>
    </button>
  )
}

interface SidebarProps {
  activeSection: string
  onSectionChange: (s: string) => void
  navItems: { id: string; icon: LucideIcon; labelKey: keyof ReturnType<typeof useLang>['t']['nav'] }[]
}

export default function Sidebar({ activeSection, onSectionChange, navItems }: SidebarProps) {
  const { t } = useLang()

  return (
    <div className="glass-sidebar w-20 flex flex-col items-center py-4 gap-1 shrink-0">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/20 flex items-center justify-center mb-4">
        <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-500" />
      </div>

      <div className="flex flex-col gap-1 w-full px-2 flex-1 overflow-y-auto">
        {navItems.map(item => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={t.nav[item.labelKey]}
            active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      <div className="w-8 h-px bg-white/10 my-2" />
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border border-white/10 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-300">A</span>
      </div>
    </div>
  )
}
