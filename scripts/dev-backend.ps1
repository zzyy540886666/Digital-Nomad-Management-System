$ErrorActionPreference = "Stop"

$scriptPath = $MyInvocation.MyCommand.Path
if (-not $scriptPath) {
    $scriptPath = $PSCommandPath
}
$rootDir = Split-Path -Parent $scriptPath
$projectRoot = Split-Path -Parent $rootDir
$serverDir = Join-Path $projectRoot "Digital-Nomad-Management-System-server"
$envFile = Join-Path $serverDir ".env"

if (-not $env:DN_PORT) { $env:DN_PORT = "3306" }
if (-not $env:DN_HOST) { $env:DN_HOST = "127.0.0.1" }
if (-not $env:DN_USER) { $env:DN_USER = "root" }
if (-not $env:DN_DB) { $env:DN_DB = "digital_nomad" }
if (-not $env:SERVER_PORT) { $env:SERVER_PORT = "8080" }

$dbPassword = $env:DN_PSWD
if (-not $dbPassword) {
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile -Encoding UTF8
        foreach ($line in $envContent) {
            if ($line -match "^DB_PASSWORD=(.*)$") {
                $dbPassword = $Matches[1].Trim()
                break
            }
        }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Digital Nomad - Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project Root: $projectRoot" -ForegroundColor Gray
Write-Host "Server Dir: $serverDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Database: $env:DN_HOST`:$env:DN_PORT/$env:DN_DB" -ForegroundColor Gray
Write-Host "  Server Port: $env:SERVER_PORT" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $serverDir)) {
    Write-Host "Error: Server directory not found: $serverDir" -ForegroundColor Red
    exit 1
}

Set-Location $serverDir

if (-not (Test-Path ".\node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Green
    npm install
}

Write-Host "Starting backend server..." -ForegroundColor Green
npm run dev
