$ErrorActionPreference = 'SilentlyContinue'

$threats = @()

# Motor 2: InstaRoll Heuristics (Unsigned / Suspicious Startup entries)
$startupKeys = @(
    "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run",
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
)

foreach ($key in $startupKeys) {
    if (Test-Path $key) {
        $entries = Get-ItemProperty -Path $key
        $properties = $entries.psobject.properties | Where-Object { $_.Name -notmatch "^PS" }
        foreach ($prop in $properties) {
            $val = $prop.Value
            # Extraer ruta del ejecutable eliminando argumentos
            if ($val -match '"([^"]+)"') {
                $exePath = $matches[1]
            } else {
                $exePath = ($val -split ' ')[0]
            }

            if (Test-Path $exePath) {
                $sig = Get-AuthenticodeSignature $exePath
                if ($sig.Status -ne 'Valid') {
                    $threats += @{
                        id = [guid]::NewGuid().ToString()
                        name = "Suspicious.Unsigned.$($prop.Name)"
                        type = "InstaRoll Heuristics"
                        severity = 3 # High
                        resources = @($exePath)
                        description = "Aplicación de inicio no firmada. Posible troyano o spyware oculto."
                        source = "InstaRoll"
                    }
                }
            }
        }
    }
}
$threats | ConvertTo-Json -Compress
