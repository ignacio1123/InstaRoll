import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Lang, translations } from '../i18n/translations'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: typeof translations.es
}

const LanguageContext = createContext<LangCtx>({
  lang: 'es',
  setLang: () => {},
  t: translations.es,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('instaroll-lang') as Lang) ?? 'es'
  })

  const setLang = (l: Lang) => {
    localStorage.setItem('instaroll-lang', l)
    setLangState(l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as typeof translations.es }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
