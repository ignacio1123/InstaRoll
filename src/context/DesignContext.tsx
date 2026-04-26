import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface DesignSettings {
  accent: string;
  setAccent: (c: string) => void;
  wallpaper: number;
  setWallpaper: (i: number) => void;
  transparency: number;
  setTransparency: (v: number) => void;
}

const defaultAccent = localStorage.getItem('instaroll-accent') || '#00d4ff';
const defaultWallpaper = Number(localStorage.getItem('instaroll-wallpaper') || 0);
const defaultTransparency = Number(localStorage.getItem('instaroll-transparency') || 75);

const DesignContext = createContext<DesignSettings>({
  accent: defaultAccent,
  setAccent: () => {},
  wallpaper: defaultWallpaper,
  setWallpaper: () => {},
  transparency: defaultTransparency,
  setTransparency: () => {},
});

export function DesignProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<string>(defaultAccent);
  const [wallpaper, setWallpaperState] = useState<number>(defaultWallpaper);
  const [transparency, setTransparencyState] = useState<number>(defaultTransparency);

  useEffect(() => {
    localStorage.setItem('instaroll-accent', accent);
    document.documentElement.style.setProperty('--accent-color', accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem('instaroll-wallpaper', wallpaper.toString());
    document.documentElement.setAttribute('data-wallpaper', wallpaper.toString());
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('instaroll-transparency', transparency.toString());
    document.documentElement.style.setProperty('--glass-opacity', (transparency / 100).toString());
  }, [transparency]);

  return (
    <DesignContext.Provider value={{
      accent,
      setAccent: setAccentState,
      wallpaper,
      setWallpaper: setWallpaperState,
      transparency,
      setTransparency: setTransparencyState,
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export const useDesign = () => useContext(DesignContext);
