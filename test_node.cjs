const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

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
const tmpScript = path.join(os.tmpdir(), `test_node_${Date.now()}.ps1`);
fs.writeFileSync(tmpScript, scriptContent, 'utf8');

console.log("Running...");
exec(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
  console.log("ERR:", err?.message);
  console.log("STDERR:", stderr);
  console.log("STDOUT:", stdout);
});
