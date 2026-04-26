import { Minus, Square, X, Zap } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useState } from 'react'

export default function TitleBar() {
  const api = window.electronAPI
  const { t } = useLang()
  const [showConfirm, setShowConfirm] = useState(false)

  // Detecta si estamos en modo vista previa (puedes ajustar la lógica si usas otra variable)
  const isPreview = process.env.NODE_ENV === 'development' || window.location.href.includes('localhost')

  const handleClose = () => {
    if (isPreview) {
      setShowConfirm(true)
    } else {
      api?.close()
    }
  }

  const handleConfirm = (pack: boolean) => {
    setShowConfirm(false)
    // Cierra procesos de desarrollo automáticamente
    if (window && window.close) {
      // Intenta cerrar la ventana Electron
      api?.close()
    }
    // Intenta cerrar terminales de desarrollo (solo posible si se lanza desde Electron con Node.js)
    if (pack) {
      // Ejecuta el script de empaquetado localmente
      try {
        // Esto solo funcionará si tienes Node.js y permisos
        // Requiere que el script .bat esté en la ruta correcta
        const { exec } = require('child_process')
        exec('start "" "c:\\Users\\aaale\\Desktop\\InstaRoll\\AutomatizarVistaPreviaEmpaquetado.bat"')
      } catch (e) {
        alert('No se pudo ejecutar el script automáticamente. Ejecútalo manualmente si es necesario.')
      }
    }
  }

  return (
    <>
      <div className="drag-region h-10 flex items-center justify-between px-4 glass border-b border-white/5 shrink-0">
        <div className="no-drag flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gradient">{t.appName}</span>
          <span className="text-xs text-slate-500 ml-1">v1.0</span>
        </div>
        <div className="no-drag flex items-center gap-1">
          <button onClick={() => api?.minimize()} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150">
            <Minus size={14} />
          </button>
          <button onClick={() => api?.maximize()} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150">
            <Square size={12} />
          </button>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-red-500/80 transition-all duration-150">
            <X size={14} />
          </button>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 shadow-xl flex flex-col gap-4 min-w-[320px]">
            <span className="text-white text-lg font-semibold">¿Deseas empaquetar y crear el instalador con los últimos cambios?</span>
            <div className="flex gap-3 justify-end">
              <button onClick={() => handleConfirm(false)} className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600">No, solo cerrar</button>
              <button onClick={() => handleConfirm(true)} className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-400">Sí, empaquetar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
