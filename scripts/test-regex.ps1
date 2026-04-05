$envFile = "Digital-Nomad-Management-System-server\.env"
$envContent = Get-Content $envFile -Encoding UTF8
$dbPassword = $null
foreach ($line in $envContent) {
    Write-Host "Line: '$line'"
    if ($line -match "^DB_PASSWORD=(.*)$") {
        $dbPassword = $Matches[1].Trim()
        Write-Host "Matched password: '$dbPassword'"
        break
    }
}
Write-Host "Final password: '$dbPassword'"
