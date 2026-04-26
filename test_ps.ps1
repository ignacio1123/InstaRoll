$ErrorActionPreference = 'SilentlyContinue'
$gpus = Get-WmiObject Win32_VideoController | Select-Object Name,DriverVersion
$cpus = Get-WmiObject Win32_Processor | Select-Object Name
$disks = Get-WmiObject Win32_DiskDrive | Select-Object Model
$net = Get-WmiObject Win32_NetworkAdapter | Where-Object { $_.PhysicalAdapter -eq $true } | Select-Object Name
$audio = Get-WmiObject Win32_SoundDevice | Select-Object Name
$drivers = @()
foreach ($d in $gpus) { $drivers += @{ name = $d.Name; type = 'GPU'; version = $d.DriverVersion; status = 'up-to-date'; source = 'system' } }
foreach ($d in $cpus) { $drivers += @{ name = $d.Name; type = 'Chipset'; version = ''; status = 'up-to-date'; source = 'system' } }
foreach ($d in $disks) { $drivers += @{ name = $d.Model; type = 'Disco'; version = ''; status = 'up-to-date'; source = 'system' } }
foreach ($d in $net) { $drivers += @{ name = $d.Name; type = 'Red'; version = ''; status = 'up-to-date'; source = 'system' } }
foreach ($d in $audio) { $drivers += @{ name = $d.Name; type = 'Audio'; version = ''; status = 'up-to-date'; source = 'system' } }
$gpuStr = ($gpus.Name -join ' ').ToLower()
if ($gpuStr -match 'nvidia') { $drivers += @{ name = 'NVIDIA GeForce Experience'; type = 'Software GPU'; version = ''; status = 'update-available'; source = 'winget'; id = 'Nvidia.GeForceExperience' } }
if ($gpuStr -match 'amd' -or $gpuStr -match 'radeon') { $drivers += @{ name = 'AMD Radeon Software'; type = 'Software GPU'; version = ''; status = 'update-available'; source = 'winget'; id = 'AMD.RadeonSoftware' } }
if ($gpuStr -match 'intel') { $drivers += @{ name = 'Intel Driver & Support Assistant'; type = 'Software GPU'; version = ''; status = 'update-available'; source = 'winget'; id = 'Intel.DriverAndSupportAssistant' } }
$drivers | ConvertTo-Json -Compress
