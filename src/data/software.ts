export interface SoftwareItem {
  id: string
  name: string
  description: string
  descriptionEn: string
  category: string
  wingetId: string
  color: string
  icon: string
}

export const SOFTWARE_CATALOG: SoftwareItem[] = [
  // Navegadores
  { id: 'b1', name: 'Google Chrome', description: 'Navegador rápido y seguro', descriptionEn: 'Fast and secure web browser', category: 'browser', wingetId: 'Google.Chrome', color: '#4285F4', icon: '🌐' },
  { id: 'b2', name: 'Mozilla Firefox', description: 'Navegador enfocado en privacidad', descriptionEn: 'Privacy-focused browser', category: 'browser', wingetId: 'Mozilla.Firefox', color: '#FF7139', icon: '🦊' },
  { id: 'b3', name: 'Brave', description: 'Bloquea anuncios y rastreadores', descriptionEn: 'Blocks ads and trackers', category: 'browser', wingetId: 'Brave.Brave', color: '#FB542B', icon: '🦁' },
  { id: 'b4', name: 'Opera', description: 'Navegador con VPN integrada', descriptionEn: 'Browser with built-in VPN', category: 'browser', wingetId: 'Opera.Opera', color: '#FF1B2D', icon: '🎭' },
  { id: 'b5', name: 'Opera GX', description: 'Navegador gaming con límites de RAM/CPU', descriptionEn: 'Gaming browser with RAM/CPU limits', category: 'browser', wingetId: 'Opera.OperaGX', color: '#CC0000', icon: '🎮' },
  { id: 'b6', name: 'LibreWolf', description: 'Firefox sin telemetría, máxima privacidad', descriptionEn: 'Firefox fork, maximum privacy', category: 'browser', wingetId: 'LibreWolf.LibreWolf', color: '#0063CC', icon: '🐺' },
  { id: 'b7', name: 'Microsoft Edge', description: 'Navegador oficial de Windows', descriptionEn: 'Official Windows browser', category: 'browser', wingetId: 'Microsoft.Edge', color: '#0078D4', icon: '🔷' },
  { id: 'b8', name: 'Vivaldi', description: 'Navegador altamente personalizable', descriptionEn: 'Highly customizable browser', category: 'browser', wingetId: 'VivaldiTechnologies.Vivaldi', color: '#EF3939', icon: '🎵' },
  { id: 'b9', name: 'Tor Browser', description: 'Navegación anónima por la red Tor', descriptionEn: 'Anonymous browsing via Tor network', category: 'browser', wingetId: 'TorProject.TorBrowser', color: '#7D4698', icon: '🧅' },

  // Comunicación
  { id: 'c1', name: 'WhatsApp', description: 'Mensajería instantánea de Meta', descriptionEn: 'Meta instant messaging', category: 'communication', wingetId: '9NKSQGP7F2NH', color: '#25D366', icon: '💬' },
  { id: 'c2', name: 'Discord', description: 'Voz, vídeo y texto para comunidades', descriptionEn: 'Voice, video & text for communities', category: 'communication', wingetId: 'Discord.Discord', color: '#5865F2', icon: '🎮' },
  { id: 'c3', name: 'Telegram', description: 'Mensajería rápida y segura', descriptionEn: 'Fast and secure messaging', category: 'communication', wingetId: 'Telegram.TelegramDesktop', color: '#2AABEE', icon: '✈️' },
  { id: 'c4', name: 'Zoom', description: 'Videoconferencias profesionales', descriptionEn: 'Professional video conferencing', category: 'communication', wingetId: 'Zoom.Zoom', color: '#2D8CFF', icon: '📹' },
  { id: 'c5', name: 'Microsoft Teams', description: 'Colaboración empresarial de Microsoft', descriptionEn: 'Microsoft business collaboration', category: 'communication', wingetId: 'Microsoft.Teams', color: '#6264A7', icon: '🏢' },
  { id: 'c6', name: 'Slack', description: 'Mensajería para equipos de trabajo', descriptionEn: 'Team messaging platform', category: 'communication', wingetId: 'SlackTechnologies.Slack', color: '#4A154B', icon: '💼' },
  { id: 'c7', name: 'Signal', description: 'Mensajería con cifrado de extremo a extremo', descriptionEn: 'End-to-end encrypted messaging', category: 'communication', wingetId: 'OpenWhisperSystems.Signal', color: '#3A76F0', icon: '🔒' },
  { id: 'c8', name: 'Skype', description: 'Videollamadas y mensajería de Microsoft', descriptionEn: 'Microsoft video calls and messaging', category: 'communication', wingetId: 'Microsoft.Skype', color: '#00AFF0', icon: '📞' },
  { id: 'c9', name: 'Viber', description: 'Llamadas y mensajes gratuitos', descriptionEn: 'Free calls and messages', category: 'communication', wingetId: 'Viber.Viber', color: '#7360F2', icon: '📱' },

  // Gaming
  { id: 'g1', name: 'Steam', description: 'Plataforma líder de distribución de juegos', descriptionEn: 'Leading game distribution platform', category: 'gaming', wingetId: 'Valve.Steam', color: '#1B2838', icon: '🎮' },
  { id: 'g2', name: 'Epic Games Launcher', description: 'Juegos gratis y AAA de Epic', descriptionEn: 'Free games and AAA titles from Epic', category: 'gaming', wingetId: 'EpicGames.EpicGamesLauncher', color: '#0074E4', icon: '⚡' },
  { id: 'g3', name: 'Battle.net', description: 'Launcher de Blizzard (WoW, OW, Diablo)', descriptionEn: 'Blizzard launcher (WoW, OW, Diablo)', category: 'gaming', wingetId: 'Blizzard.BattleNet', color: '#148EFF', icon: '🔵' },
  { id: 'g4', name: 'Roblox', description: 'Plataforma de juegos para todas las edades', descriptionEn: 'Gaming platform for all ages', category: 'gaming', wingetId: 'Roblox.Roblox', color: '#E2231A', icon: '🟥' },
  { id: 'g5', name: 'GOG Galaxy', description: 'Biblioteca de juegos DRM-free', descriptionEn: 'DRM-free game library', category: 'gaming', wingetId: 'GOG.Galaxy', color: '#7B2FBE', icon: '🌌' },
  { id: 'g6', name: 'Xbox App', description: 'Juegos de PC con Game Pass', descriptionEn: 'PC gaming with Game Pass', category: 'gaming', wingetId: 'Microsoft.GamingApp', color: '#107C10', icon: '🎮' },
  { id: 'g7', name: 'Ubisoft Connect', description: 'Launcher de Ubisoft (Assassin\'s, Far Cry)', descriptionEn: 'Ubisoft launcher (Assassin\'s, Far Cry)', category: 'gaming', wingetId: 'Ubisoft.Connect', color: '#0070FF', icon: '🔵' },
  { id: 'g8', name: 'EA App', description: 'Launcher de Electronic Arts', descriptionEn: 'Electronic Arts game launcher', category: 'gaming', wingetId: 'ElectronicArts.EADesktop', color: '#FF4747', icon: '🎯' },

  // Multimedia
  { id: 'm1', name: 'VLC Media Player', description: 'Reproductor multimedia universal', descriptionEn: 'Universal media player', category: 'media', wingetId: 'VideoLAN.VLC', color: '#FF8800', icon: '▶️' },
  { id: 'm2', name: 'Spotify', description: 'Streaming de música', descriptionEn: 'Music streaming service', category: 'media', wingetId: 'Spotify.Spotify', color: '#1DB954', icon: '🎵' },
  { id: 'm3', name: 'OBS Studio', description: 'Grabación y streaming en directo', descriptionEn: 'Recording and live streaming', category: 'media', wingetId: 'OBSProject.OBSStudio', color: '#302E31', icon: '🎬' },
  { id: 'm4', name: 'Audacity', description: 'Editor de audio gratuito', descriptionEn: 'Free audio editor', category: 'media', wingetId: 'Audacity.Audacity', color: '#0000CC', icon: '🎙️' },
  { id: 'm5', name: 'GIMP', description: 'Editor de imágenes de código abierto', descriptionEn: 'Open source image editor', category: 'media', wingetId: 'GIMP.GIMP', color: '#6A0F00', icon: '🖼️' },
  { id: 'm6', name: 'HandBrake', description: 'Conversor de vídeo gratuito', descriptionEn: 'Free video transcoder', category: 'media', wingetId: 'HandBrake.HandBrake', color: '#E6181B', icon: '🎞️' },
  { id: 'm7', name: 'VirtualDJ', description: 'Software de DJ profesional', descriptionEn: 'Professional DJ software', category: 'media', wingetId: 'AtomixProductions.VirtualDJ', color: '#CC0000', icon: '🎧' },
  { id: 'm8', name: 'Kodi', description: 'Centro multimedia de código abierto', descriptionEn: 'Open source media center', category: 'media', wingetId: 'XBMCFoundation.Kodi', color: '#1AADCF', icon: '📺' },

  // Utilidades
  { id: 'u1', name: '7-Zip', description: 'Compresor de archivos gratuito', descriptionEn: 'Free file archiver', category: 'utility', wingetId: '7zip.7zip', color: '#00A651', icon: '📦' },
  { id: 'u2', name: 'WinRAR', description: 'Compresor de archivos RAR/ZIP', descriptionEn: 'RAR/ZIP file compressor', category: 'utility', wingetId: 'RARLab.WinRAR', color: '#8B0000', icon: '🗜️' },
  { id: 'u3', name: 'qBittorrent', description: 'Cliente torrent sin publicidad', descriptionEn: 'Ad-free torrent client', category: 'utility', wingetId: 'qBittorrent.qBittorrent', color: '#2196F3', icon: '⬇️' },
  { id: 'u4', name: 'Everything', description: 'Búsqueda instantánea de archivos', descriptionEn: 'Instant file search', category: 'utility', wingetId: 'voidtools.Everything', color: '#1565C0', icon: '🔍' },
  { id: 'u5', name: 'CPU-Z', description: 'Información detallada de hardware', descriptionEn: 'Detailed hardware information', category: 'utility', wingetId: 'CPUID.CPU-Z', color: '#1E88E5', icon: '🔧' },
  { id: 'u6', name: 'GPU-Z', description: 'Información detallada de la GPU', descriptionEn: 'Detailed GPU information', category: 'utility', wingetId: 'TechPowerUp.GPU-Z', color: '#43A047', icon: '🖥️' },
  { id: 'u7', name: 'TreeSize Free', description: 'Analiza el espacio en disco', descriptionEn: 'Disk space analyzer', category: 'utility', wingetId: 'JAM-Software.TreeSize.Free', color: '#FF6F00', icon: '📊' },
  { id: 'u8', name: 'Rufus', description: 'Crea USBs de arranque', descriptionEn: 'Create bootable USB drives', category: 'utility', wingetId: 'Rufus.Rufus', color: '#009688', icon: '💾' },
  { id: 'u9', name: 'CCleaner', description: 'Limpieza y optimización del sistema', descriptionEn: 'System cleaning and optimization', category: 'utility', wingetId: 'Piriform.CCleaner', color: '#00BCD4', icon: '🧹' },

  // Desarrollo
  { id: 'd1', name: 'VS Code', description: 'Editor de código ligero y potente', descriptionEn: 'Lightweight and powerful code editor', category: 'development', wingetId: 'Microsoft.VisualStudioCode', color: '#007ACC', icon: '💻' },
  { id: 'd2', name: 'Git', description: 'Sistema de control de versiones', descriptionEn: 'Version control system', category: 'development', wingetId: 'Git.Git', color: '#F05032', icon: '🔀' },
  { id: 'd3', name: 'Python', description: 'Lenguaje de programación Python 3', descriptionEn: 'Python 3 programming language', category: 'development', wingetId: 'Python.Python.3.12', color: '#3776AB', icon: '🐍' },
  { id: 'd4', name: 'Node.js', description: 'Entorno de ejecución JavaScript', descriptionEn: 'JavaScript runtime environment', category: 'development', wingetId: 'OpenJS.NodeJS', color: '#339933', icon: '⬢' },
  { id: 'd5', name: 'Docker Desktop', description: 'Contenedores para desarrolladores', descriptionEn: 'Containers for developers', category: 'development', wingetId: 'Docker.DockerDesktop', color: '#2496ED', icon: '🐳' },
  { id: 'd6', name: 'Postman', description: 'Pruebas de APIs REST', descriptionEn: 'REST API testing tool', category: 'development', wingetId: 'Postman.Postman', color: '#FF6C37', icon: '📮' },

  // PDF / Ofimática
  { id: 'p1', name: 'Adobe Acrobat Reader', description: 'Visor de PDF oficial de Adobe', descriptionEn: 'Official Adobe PDF viewer', category: 'pdf', wingetId: 'Adobe.Acrobat.Reader.64-bit', color: '#EC1C24', icon: '📄' },
  { id: 'p2', name: 'Foxit PDF Reader', description: 'Lector de PDF rápido y ligero', descriptionEn: 'Fast and lightweight PDF reader', category: 'pdf', wingetId: 'Foxit.FoxitReader', color: '#FF6B00', icon: '📋' },
  { id: 'p3', name: 'LibreOffice', description: 'Suite ofimática gratuita completa', descriptionEn: 'Complete free office suite', category: 'pdf', wingetId: 'TheDocumentFoundation.LibreOffice', color: '#18A303', icon: '📝' },
  { id: 'p4', name: 'WPS Office', description: 'Suite compatible con Microsoft Office', descriptionEn: 'Microsoft Office compatible suite', category: 'pdf', wingetId: 'Kingsoft.WPSOffice', color: '#C50000', icon: '📊' },
  { id: 'p5', name: 'Notion', description: 'Espacio de trabajo todo en uno', descriptionEn: 'All-in-one workspace', category: 'pdf', wingetId: 'Notion.Notion', color: '#000000', icon: '🗒️' },
  { id: 'p6', name: 'Obsidian', description: 'Notas en Markdown con grafos', descriptionEn: 'Markdown notes with graph view', category: 'pdf', wingetId: 'Obsidian.Obsidian', color: '#7C3AED', icon: '💎' },
  { id: 'p7', name: 'SumatraPDF', description: 'Lector de PDF ultraligero', descriptionEn: 'Ultra-lightweight PDF reader', category: 'pdf', wingetId: 'SumatraPDF.SumatraPDF', color: '#1A5276', icon: '📖' },
  { id: 'p8', name: 'PDF24 Creator', description: 'Crear y editar PDFs gratis', descriptionEn: 'Create and edit PDFs for free', category: 'pdf', wingetId: 'geek-soft.pdf24', color: '#E74C3C', icon: '✏️' },

  // Diseño
  { id: 'des1', name: 'Figma', description: 'Diseño UI/UX colaborativo', descriptionEn: 'Collaborative UI/UX design', category: 'design', wingetId: 'Figma.Figma', color: '#F24E1E', icon: '🎨' },
  { id: 'des2', name: 'Inkscape', description: 'Editor de gráficos vectoriales', descriptionEn: 'Vector graphics editor', category: 'design', wingetId: 'Inkscape.Inkscape', color: '#000080', icon: '✒️' },
  { id: 'des3', name: 'Blender', description: 'Modelado y animación 3D', descriptionEn: '3D modeling and animation', category: 'design', wingetId: 'BlenderFoundation.Blender', color: '#E87D0D', icon: '🎲' },
  { id: 'des4', name: 'DaVinci Resolve', description: 'Edición de vídeo profesional gratuita', descriptionEn: 'Free professional video editing', category: 'design', wingetId: 'BlackmagicDesign.DaVinciResolve', color: '#CC6600', icon: '🎬' },

  // Antivirus
  { id: 'av1', name: 'Malwarebytes', description: 'Eliminación de malware y spyware', descriptionEn: 'Malware and spyware removal', category: 'antivirus', wingetId: 'Malwarebytes.Malwarebytes', color: '#00549E', icon: '🛡️' },
  { id: 'av2', name: 'Avast Free Antivirus', description: 'Antivirus gratuito con protección en tiempo real', descriptionEn: 'Free antivirus with real-time protection', category: 'antivirus', wingetId: 'AVAST.Avast', color: '#FF7800', icon: '🛡️' },
  { id: 'av3', name: 'AVG Antivirus Free', description: 'Protección básica contra virus', descriptionEn: 'Basic virus protection', category: 'antivirus', wingetId: 'AVG.AVG', color: '#0055FF', icon: '🔐' },
  { id: 'av4', name: 'Bitdefender Free', description: 'Motor antivirus de alto rendimiento', descriptionEn: 'High-performance antivirus engine', category: 'antivirus', wingetId: 'Bitdefender.Bitdefender', color: '#ED1C24', icon: '🦠' },
  { id: 'av5', name: 'Kaspersky Security Cloud', description: 'Suite de seguridad completa', descriptionEn: 'Complete security suite', category: 'antivirus', wingetId: 'AO Kaspersky Lab.KasperskySecurityCloud', color: '#006D5B', icon: '🟢' },
  { id: 'av6', name: 'Windows Defender', description: 'Antivirus integrado de Windows', descriptionEn: 'Built-in Windows antivirus', category: 'antivirus', wingetId: 'Microsoft.WindowsDefender', color: '#0078D4', icon: '🪟' },
  { id: 'av7', name: 'HitmanPro', description: 'Escáner de segunda opinión', descriptionEn: 'Second opinion malware scanner', category: 'antivirus', wingetId: 'SurfRight.HitmanPro', color: '#CC0000', icon: '🔫' },
  { id: 'av8', name: 'AdwCleaner', description: 'Elimina adware y programas no deseados', descriptionEn: 'Removes adware and PUPs', category: 'antivirus', wingetId: 'Malwarebytes.AdwCleaner', color: '#1565C0', icon: '🧽' },
]

export const CATEGORIES_ES = ['Todos', 'Navegadores', 'Comunicación', 'Gaming', 'Multimedia', 'Utilidades', 'Desarrollo', 'PDF / Ofimática', 'Diseño', 'Antivirus']
export const CATEGORIES_EN = ['All', 'Browsers', 'Communication', 'Gaming', 'Media', 'Utilities', 'Development', 'PDF / Office', 'Design', 'Antivirus']

export const CATEGORY_MAP_ES: Record<string, string> = {
  browser: 'Navegadores', communication: 'Comunicación', gaming: 'Gaming',
  media: 'Multimedia', utility: 'Utilidades', development: 'Desarrollo',
  pdf: 'PDF / Ofimática', design: 'Diseño', antivirus: 'Antivirus',
}
export const CATEGORY_MAP_EN: Record<string, string> = {
  browser: 'Browsers', communication: 'Communication', gaming: 'Gaming',
  media: 'Media', utility: 'Utilities', development: 'Development',
  pdf: 'PDF / Office', design: 'Design', antivirus: 'Antivirus',
}
