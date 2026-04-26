const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { exec, spawn } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)
const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    frame: false,
    backgroundColor: '#080c14',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.once('ready-to-show', () => win.show())

  if (isDev) {
    win.loadURL('http://localhost:5173')
    setTimeout(() => { if (!win.isVisible()) win.show() }, 4000)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  return win
}

app.whenReady().then(() => {
  const win = createWindow()

  ipcMain.handle('window-minimize', () => win.minimize())
  ipcMain.handle('window-maximize', () => {
    if (win.isMaximized()) win.unmaximize()
    else win.maximize()
  })
  ipcMain.handle('window-close', () => win.close())

  ipcMain.handle('winget-install', async (_, packageId) => {
    return new Promise((resolve) => {
      const proc = spawn('winget', ['install', '--id', packageId, '--silent', '--accept-source-agreements', '--accept-package-agreements'], { shell: true })
      let output = ''
      proc.stdout.on('data', (d) => { output += d.toString() })
      proc.stderr.on('data', (d) => { output += d.toString() })
      proc.on('close', (code) => resolve({ success: code === 0, output }))
    })
  })

  // ELIMINADO: Manejador duplicado scan-drivers

  ipcMain.handle('scan-drivers', async () => {
    try {
      const ps = `
        $gpus = Get-WmiObject Win32_VideoController | Select-Object Name,DriverVersion,Status;
        $cpus = Get-WmiObject Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed,LoadPercentage;
        $ram = Get-WmiObject Win32_PhysicalMemory | Select-Object Capacity,Speed,Manufacturer;
        $disks = Get-WmiObject Win32_DiskDrive | Select-Object Model,Size,MediaType;
        $net = Get-WmiObject Win32_NetworkAdapter | Where-Object { $_.PhysicalAdapter -eq $true } | Select-Object Name,AdapterType,Speed;
        $audio = Get-WmiObject Win32_SoundDevice | Select-Object Name,Manufacturer;
        $drivers = @();
        foreach ($d in $gpus) { $drivers += @{ name = $d.Name; type = 'GPU'; version = $d.DriverVersion; status = 'checking' } }
        foreach ($d in $cpus) { $drivers += @{ name = $d.Name; type = 'Chipset'; version = ''; status = 'checking' } }
        foreach ($d in $disks) { $drivers += @{ name = $d.Model; type = 'Disco'; version = ''; status = 'checking' } }
        foreach ($d in $net) { $drivers += @{ name = $d.Name; type = 'Red'; version = ''; status = 'checking' } }
        foreach ($d in $audio) { $drivers += @{ name = $d.Name; type = 'Audio'; version = ''; status = 'checking' } }
        return $drivers | ConvertTo-Json -Compress
      `;
      const { exec } = require('child_process');
      return new Promise((resolve) => {
        exec(`powershell -Command "${ps}"`, async (err, stdout) => {
          if (err) return resolve({ success: false, error: err.message });
          let drivers = [];
          try { drivers = JSON.parse(stdout); } catch {}
          if (!Array.isArray(drivers) && typeof drivers === 'object') {
            drivers = Object.values(drivers).flat();
          }
          // Verifica online TODOS los drivers para actualizaciones
          for (let d of drivers) {
            const versionOnline = await buscarDriverOnlineSeguro(d.name, d.type);
            if (!d.version && versionOnline) {
              d.status = 'update-available';
              d.version = versionOnline;
            } else if (versionOnline && versionOnline !== d.version) {
              d.status = 'update-available';
              d.versionOnline = versionOnline;
            } else if (d.version) {
              d.status = 'up-to-date';
            } else {
              d.status = 'missing';
            }
          }
          resolve({ success: true, data: drivers });
        });
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // Handler para get-system-info
  ipcMain.handle('get-system-info', async () => {
    try {
      const fs = require('fs');
      const os = require('os');
      const path = require('path');
      const { exec } = require('child_process');
      const scriptLines = [
        '$cpu = Get-WmiObject Win32_Processor | Select-Object -First 1 Name,MaxClockSpeed,NumberOfCores,NumberOfLogicalProcessors,LoadPercentage',
        '$ram = Get-WmiObject Win32_OperatingSystem | Select-Object -First 1 TotalVisibleMemorySize,FreePhysicalMemory',
        '$gpu = Get-WmiObject Win32_VideoController | Select-Object -First 1 Name,DriverVersion,AdapterRAM',
        '$os = Get-WmiObject Win32_OperatingSystem | Select-Object -First 1 Caption,Version,BuildNumber,OSArchitecture',
        '$mb = Get-WmiObject Win32_BaseBoard | Select-Object -First 1 Manufacturer,Product',
        '$disks = Get-WmiObject Win32_DiskDrive | Select-Object Model,Size,MediaType',
        '$info = @{ CPU = $cpu; RAM = $ram; GPU = $gpu; OS = $os; Motherboard = $mb; Disks = $disks }',
        '$info | ConvertTo-Json -Compress'
      ];
      const scriptContent = scriptLines.join('\r\n');
      const tmpScript = path.join(os.tmpdir(), `instaroll_sysinfo_${Date.now()}.ps1`);
      fs.writeFileSync(tmpScript, scriptContent, 'utf8');
      return new Promise((resolve) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, (err, stdout) => {
          fs.unlinkSync(tmpScript);
          if (err) return resolve({ success: false, error: err.message });
          let info = {};
          try { info = JSON.parse(stdout); } catch {}
          resolve({ success: true, data: info });
        });
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // Simulación de búsqueda online segura de drivers
  async function buscarDriverOnlineSeguro(nombre, tipo) {
    // Intenta buscar el driver usando winget
    const { execSync } = require('child_process');
    try {
      // Busca el paquete en winget
      const search = execSync(`winget search "${nombre}" --source msstore --accept-source-agreements`, { encoding: 'utf8' });
      // Si encuentra resultados, retorna una versión simulada
      if (search && search.includes(nombre)) {
        // Aquí podrías parsear la versión real si está disponible
        return 'Encontrado';
      }
    } catch (e) {
      // Si no encuentra, retorna vacío
      return '';
    }
    // Si no encuentra, retorna vacío
    return '';
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
