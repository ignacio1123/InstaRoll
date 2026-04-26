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
      const fs = require('fs');
      const os = require('os');
      const path = require('path');
      const { exec } = require('child_process');
      const scriptLines = [
        "$ErrorActionPreference = 'SilentlyContinue'",
        "$gpus = Get-WmiObject Win32_VideoController | Select-Object Name,DriverVersion",
        "$cpus = Get-WmiObject Win32_Processor | Select-Object Name",
        "$disks = Get-WmiObject Win32_DiskDrive | Select-Object Model",
        "$net = Get-WmiObject Win32_NetworkAdapter | Where-Object { $_.PhysicalAdapter -eq $true } | Select-Object Name",
        "$audio = Get-WmiObject Win32_SoundDevice | Select-Object Name",
        "$drivers = @()",
        "foreach ($d in $gpus) { $drivers += @{ name = $d.Name; type = 'GPU'; version = $d.DriverVersion; status = 'up-to-date'; source = 'system' } }",
        "foreach ($d in $cpus) { $drivers += @{ name = $d.Name; type = 'Chipset'; version = ''; status = 'up-to-date'; source = 'system' } }",
        "foreach ($d in $disks) { $drivers += @{ name = $d.Model; type = 'Disco'; version = ''; status = 'up-to-date'; source = 'system' } }",
        "foreach ($d in $net) { $drivers += @{ name = $d.Name; type = 'Red'; version = ''; status = 'up-to-date'; source = 'system' } }",
        "foreach ($d in $audio) { $drivers += @{ name = $d.Name; type = 'Audio'; version = ''; status = 'up-to-date'; source = 'system' } }",
        "try {",
        "  $Session = New-Object -ComObject Microsoft.Update.Session",
        "  $Searcher = $Session.CreateUpdateSearcher()",
        "  $SearchResult = $Searcher.Search(\"IsInstalled=0 and Type='Driver'\")",
        "  foreach ($update in $SearchResult.Updates) {",
        "    $drivers += @{ name = $update.Title; type = 'Update Oficial'; version = ''; status = 'update-available'; source = 'wua'; id = $update.Title }",
        "  }",
        "} catch {}",
        "$gpuStr = ($gpus.Name -join ' ').ToLower()",
        "if ($gpuStr -match 'nvidia') { $drivers += @{ name = 'NVIDIA GeForce Experience'; type = 'Software GPU'; version = ''; status = 'update-available'; source = 'winget'; id = 'Nvidia.GeForceExperience' } }",
        "if ($gpuStr -match 'amd' -or $gpuStr -match 'radeon') { $drivers += @{ name = 'AMD Radeon Software'; type = 'Software GPU'; version = ''; status = 'update-available'; source = 'winget'; id = 'AMD.RadeonSoftware' } }",
        "if ($gpuStr -match 'intel') { $drivers += @{ name = 'Intel Driver & Support Assistant'; type = 'Software GPU'; version = ''; status = 'update-available'; source = 'winget'; id = 'Intel.DriverAndSupportAssistant' } }",
        "$drivers | ConvertTo-Json -Compress"
      ];
      const scriptContent = scriptLines.join('\r\n');
      const tmpScript = path.join(os.tmpdir(), `instaroll_scan_${Date.now()}.ps1`);
      fs.writeFileSync(tmpScript, scriptContent, 'utf8');
      return new Promise((resolve) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
          try { fs.unlinkSync(tmpScript); } catch {}
          
          fs.writeFileSync(path.join(require('os').homedir(), 'Desktop', 'debug_scan.txt'), `ERR: ${err ? err.message : 'null'}\nSTDERR: ${stderr}\nSTDOUT: ${stdout}`);
          
          if (err) return resolve({ success: false, error: err.message, debug: stdout });
          
          let drivers = [];
          try { 
            drivers = JSON.parse(stdout.trim()); 
          } catch (parseErr) {
            return resolve({ success: false, error: 'Parse Error: ' + parseErr.message, debug: stdout });
          }
          
          if (!Array.isArray(drivers) && typeof drivers === 'object') {
            drivers = Object.values(drivers).flat();
          }
          resolve({ success: true, data: drivers });
        });
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('update-driver', async (_, driverData) => {
    try {
      if (driverData.source === 'winget') {
        const proc = spawn('winget', ['install', '--id', driverData.id, '--silent', '--accept-source-agreements', '--accept-package-agreements'], { shell: true })
        return new Promise((resolve) => {
          proc.on('close', (code) => resolve({ success: code === 0 }))
        })
      } else if (driverData.source === 'wua') {
        const fs = require('fs');
        const os = require('os');
        const path = require('path');
        const { exec } = require('child_process');
        const scriptLines = [
          "$ErrorActionPreference = 'SilentlyContinue'",
          `$Title = '${driverData.id.replace(/'/g, "''")}'`,
          "$Session = New-Object -ComObject Microsoft.Update.Session",
          "$Searcher = $Session.CreateUpdateSearcher()",
          "$SearchResult = $Searcher.Search(\"IsInstalled=0 and Type='Driver' and Title='$Title'\")",
          "if ($SearchResult.Updates.Count -gt 0) {",
          "  $Downloader = $Session.CreateUpdateDownloader()",
          "  $Downloader.Updates = $SearchResult.Updates",
          "  $Downloader.Download()",
          "  $Installer = $Session.CreateUpdateInstaller()",
          "  $Installer.Updates = $SearchResult.Updates",
          "  $Installer.Install()",
          "}"
        ];
        const scriptContent = scriptLines.join('\r\n');
        const tmpScript = path.join(os.tmpdir(), `instaroll_upd_${Date.now()}.ps1`);
        fs.writeFileSync(tmpScript, scriptContent, 'utf8');
        return new Promise((resolve) => {
          exec(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, (err, stdout) => {
            try { fs.unlinkSync(tmpScript); } catch {}
            if (err) return resolve({ success: false, error: err.message });
            resolve({ success: true });
          });
        });
      }
      return { success: false, error: 'Unknown source' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('update-all-drivers', async (_, driversList) => {
    try {
      const fs = require('fs');
      const os = require('os');
      const path = require('path');
      const { exec } = require('child_process');
      const scriptLines = [
        "$ErrorActionPreference = 'SilentlyContinue'",
        "$Session = New-Object -ComObject Microsoft.Update.Session",
        "$Searcher = $Session.CreateUpdateSearcher()",
        "$SearchResult = $Searcher.Search(\"IsInstalled=0 and Type='Driver'\")",
        "if ($SearchResult.Updates.Count -gt 0) {",
        "  $Downloader = $Session.CreateUpdateDownloader()",
        "  $Downloader.Updates = $SearchResult.Updates",
        "  $Downloader.Download()",
        "  $Installer = $Session.CreateUpdateInstaller()",
        "  $Installer.Updates = $SearchResult.Updates",
        "  $Installer.Install()",
        "}"
      ];
      const wingetIds = driversList.filter(d => d.source === 'winget').map(d => d.id);
      for (const id of wingetIds) {
        scriptLines.push(`winget install --id "${id}" --silent --accept-source-agreements --accept-package-agreements`);
      }
      
      const scriptContent = scriptLines.join('\r\n');
      const tmpScript = path.join(os.tmpdir(), `instaroll_updall_${Date.now()}.ps1`);
      fs.writeFileSync(tmpScript, scriptContent, 'utf8');
      return new Promise((resolve) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, { maxBuffer: 1024 * 1024 * 10 }, (err) => {
          try { fs.unlinkSync(tmpScript); } catch {}
          if (err) return resolve({ success: false, error: err.message });
          resolve({ success: true });
        });
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
