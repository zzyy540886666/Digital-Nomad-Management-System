$ErrorActionPreference = "Stop"

$scriptPath = $MyInvocation.MyCommand.Path
if (-not $scriptPath) {
    $scriptPath = $PSCommandPath
}
$rootDir = Split-Path -Parent $scriptPath
$projectRoot = Split-Path -Parent $rootDir
$adminDir = Join-Path $projectRoot "Digital-Nomad-Management-System-UI"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Digital Nomad - Admin Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project Root: $projectRoot" -ForegroundColor Gray
Write-Host "Admin Dir: $adminDir" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $adminDir)) {
    Write-Host "Error: Admin directory not found: $adminDir" -ForegroundColor Red
    exit 1
}

Set-Location $adminDir

if (-not (Test-Path ".\node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Green
    npm install
}

Write-Host "Starting admin frontend..." -ForegroundColor Green
npm run dev
