import { useState } from 'react'
import { Activity, Shield, Palette, Gamepad2, Package, Wrench, ScanLine, Settings as SettingsIcon } from 'lucide-react'
import { LanguageProvider } from './context/LanguageContext'
import { DesignProvider } from './context/DesignContext'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import SoftwareDashboard from './components/SoftwareDashboard'
import DriverScanner from './components/DriverScanner'
import Performance from './components/Performance'
import Antivirus from './components/Antivirus'
import Gaming from './components/Gaming'
import Design from './components/Design'
import Tools from './components/Tools'
import Settings from './components/Settings'

const NAV_ITEMS = [
  { id: 'performance', icon: Activity, labelKey: 'performance' as const },
  { id: 'antivirus', icon: Shield, labelKey: 'antivirus' as const },
  { id: 'design', icon: Palette, labelKey: 'design' as const },
  { id: 'gaming', icon: Gamepad2, labelKey: 'gaming' as const },
  { id: 'software', icon: Package, labelKey: 'software' as const },
  { id: 'drivers', icon: ScanLine, labelKey: 'drivers' as const },
  { id: 'tools', icon: Wrench, labelKey: 'tools' as const },
  { id: 'settings', icon: SettingsIcon, labelKey: 'settings' as const },
]

function renderSection(section: string) {
  switch (section) {
    case 'performance': return <Performance />
    case 'antivirus': return <Antivirus />
    case 'design': return <Design />
    case 'gaming': return <Gaming />
    case 'software': return <SoftwareDashboard />
    case 'drivers': return <DriverScanner />
    case 'tools': return <Tools />
    case 'settings': return <Settings />
    default: return <SoftwareDashboard />
  }
}

import { useDesign } from './context/DesignContext'

function AppShell() {
  const [activeSection, setActiveSection] = useState('software')
  const { wallpaper } = useDesign()

  // Selecciona el fondo según el wallpaper
  const wallpaperStyle = {
    background: `var(--wallpaper-gradient-${wallpaper})`
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden" style={wallpaperStyle}>
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} navItems={NAV_ITEMS} />
        <main className="flex-1 overflow-hidden p-5">
          <div key={activeSection} className="h-full animate-fade-up">
            {renderSection(activeSection)}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <DesignProvider>
        <AppShell />
      </DesignProvider>
    </LanguageProvider>
  )
}
