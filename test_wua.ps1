$ErrorActionPreference = 'SilentlyContinue'
$drivers = @()
try {
  $Session = New-Object -ComObject Microsoft.Update.Session
  $Searcher = $Session.CreateUpdateSearcher()
  $SearchResult = $Searcher.Search("IsInstalled=0 and Type='Driver'")
  foreach ($update in $SearchResult.Updates) {
    $drivers += @{ name = $update.Title; type = 'Update Oficial'; version = ''; status = 'update-available'; source = 'wua'; id = $update.Title }
  }
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}
$drivers | ConvertTo-Json -Compress
