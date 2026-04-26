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

  ipcMain.handle('antivirus-scan', async (_, scanType) => {
    try {
      const fs = require('fs');
      const os = require('os');
      const path = require('path');
      const { exec } = require('child_process');
      const scriptLines = [
        "$ErrorActionPreference = 'SilentlyContinue'",
        "$threats = @()",
        
        // Motor 1: InstaRoll Heuristics (Apps no firmadas en Startup)
        "$startupKeys = @('HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run')",
        "foreach ($key in $startupKeys) {",
        "  if (Test-Path $key) {",
        "    $entries = Get-ItemProperty -Path $key",
        "    $properties = $entries.psobject.properties | Where-Object { $_.Name -notmatch '^PS' }",
        "    foreach ($prop in $properties) {",
        "      $val = $prop.Value",
        "      if ($val -match '\"([^\"]+)\"') { $exePath = $matches[1] } else { $exePath = ($val -split ' ')[0] }",
        "      if (Test-Path $exePath) {",
        "        $sig = Get-AuthenticodeSignature $exePath",
        "        if ($sig.Status -ne 'Valid') {",
        "          $threats += @{",
        "            id = [guid]::NewGuid().ToString()",
        "            name = \"Suspicious.Unsigned.$($prop.Name)\"",
        "            type = 'InstaRoll Heuristics'",
        "            severity = 3",
        "            resources = @($exePath)",
        "            description = 'Aplicación de inicio no firmada detectada. Posible troyano o spyware oculto en el arranque del sistema.'",
        "            source = 'instaroll'",
        "          }",
        "        }",
        "      }",
        "    }",
        "  }",
        "}",
        
        // Motor 2: Windows Defender
        `Start-MpScan -ScanType ${scanType === 'Full' ? 'FullScan' : 'QuickScan'} | Out-Null`,
        "$defenderThreats = Get-MpThreatDetection",
        "if ($defenderThreats) {",
        "  foreach ($t in $defenderThreats) {",
        "    $resources = @()",
        "    if ($t.Resources) { $resources = $t.Resources }",
        "    $threats += @{",
        "      id = $t.ThreatID.ToString()",
        "      name = $t.ThreatName",
        "      type = 'Windows Defender'",
        "      severity = $t.SeverityID",
        "      resources = $resources",
        "      description = 'Amenaza detectada por Microsoft Defender. Su comportamiento coincide con la base de datos de malware.'",
        "      source = 'defender'",
        "    }",
        "  }",
        "}",
        "$threats | ConvertTo-Json -Compress"
      ];
      
      const scriptContent = scriptLines.join('\\r\\n');
      const tmpScript = path.join(os.tmpdir(), `instaroll_av_${Date.now()}.ps1`);
      fs.writeFileSync(tmpScript, scriptContent, 'utf8');
      
      return new Promise((resolve) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, { maxBuffer: 1024 * 1024 * 15 }, (err, stdout) => {
          try { fs.unlinkSync(tmpScript); } catch {}
          if (err) return resolve({ success: false, error: err.message, debug: stdout });
          
          let parsed = [];
          if (stdout.trim()) {
            try { parsed = JSON.parse(stdout.trim()); } catch (e) {
              return resolve({ success: false, error: 'Parse Error', debug: stdout });
            }
          }
          if (!Array.isArray(parsed) && typeof parsed === 'object') {
            parsed = Object.values(parsed).flat();
          }
          resolve({ success: true, data: parsed });
        });
      });
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('antivirus-remove', async (_, threat) => {
    try {
      const fs = require('fs');
      const os = require('os');
      const path = require('path');
      const { exec } = require('child_process');
      const scriptLines = [
        "$ErrorActionPreference = 'SilentlyContinue'",
      ];
      if (threat.source === 'defender') {
        scriptLines.push(`Remove-MpThreat -ThreatID ${threat.id} | Out-Null`);
      } else if (threat.source === 'instaroll') {
        scriptLines.push(`$paths = @(${threat.resources.map(r => `'${r.replace(/'/g, "''")}'`).join(',')})`);
        scriptLines.push("foreach ($p in $paths) { if (Test-Path $p) { Remove-Item -Path $p -Force -Recurse } }");
        scriptLines.push(`$name = '${threat.name.split('.').pop().replace(/'/g, "''")}'`);
        scriptLines.push("Remove-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name $name -ErrorAction SilentlyContinue");
        scriptLines.push("Remove-ItemProperty -Path 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name $name -ErrorAction SilentlyContinue");
      }
      
      const scriptContent = scriptLines.join('\\r\\n');
      const tmpScript = path.join(os.tmpdir(), `instaroll_rm_${Date.now()}.ps1`);
      fs.writeFileSync(tmpScript, scriptContent, 'utf8');
      
      return new Promise((resolve) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, (err) => {
          try { fs.unlinkSync(tmpScript); } catch {}
          resolve({ success: !err, error: err?.message });
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
