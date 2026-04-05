$ErrorActionPreference = "Stop"

$scriptPath = $MyInvocation.MyCommand.Path
if (-not $scriptPath) {
    $scriptPath = $PSCommandPath
}
$rootDir = Split-Path -Parent $scriptPath
$projectRoot = Split-Path -Parent $rootDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Digital Nomad - Start All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project Root: $projectRoot" -ForegroundColor Gray
Write-Host ""

$dbScript = Join-Path $rootDir "dev-db.ps1"
$backendScript = Join-Path $rootDir "dev-backend.ps1"
$frontendScript = Join-Path $rootDir "dev-frontend.ps1"

Write-Host "Starting all services in separate windows..." -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $dbScript
Start-Sleep -Seconds 5

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $backendScript
Start-Sleep -Seconds 3

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $frontendScript

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "  - Database: MariaDB on port 3306" -ForegroundColor Gray
Write-Host "  - Backend API: http://localhost:8080" -ForegroundColor Gray
Write-Host "  - Admin UI: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: Each service runs in its own PowerShell window." -ForegroundColor Yellow
Write-Host "Close those windows to stop the services." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
