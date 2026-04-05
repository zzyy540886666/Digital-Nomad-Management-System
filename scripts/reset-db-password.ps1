$ErrorActionPreference = "Stop"

$scriptPath = $MyInvocation.MyCommand.Path
if (-not $scriptPath) { $scriptPath = $PSCommandPath }
$rootDir = Split-Path -Parent $scriptPath
$projectRoot = Split-Path -Parent $rootDir

$runtimeDir = Join-Path $projectRoot ".runtime"
$mariadbDir = Join-Path $runtimeDir "mariadb-10.11.7-winx64"
$mysqlExe = Join-Path $mariadbDir "bin\mysql.exe"
$mysqldExe = Join-Path $mariadbDir "bin\mysqld.exe"
$iniFile = Join-Path $runtimeDir "mariadb-3306.ini"

Write-Host "Stopping any running MariaDB processes..." -ForegroundColor Yellow
Get-Process -Name mysqld -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

Write-Host "Starting MariaDB with skip-grant-tables..." -ForegroundColor Yellow
Start-Process -FilePath $mysqldExe -ArgumentList "--defaults-file=$iniFile", "--skip-grant-tables" -WindowStyle Hidden
Start-Sleep -Seconds 5

Write-Host "Resetting root password..." -ForegroundColor Yellow

$resetCommands = @(
    "FLUSH PRIVILEGES",
    "CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY 'root'",
    "ALTER USER 'root'@'127.0.0.1' IDENTIFIED BY 'root'",
    "GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION",
    "CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root'",
    "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'",
    "GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION",
    "FLUSH PRIVILEGES"
)

foreach ($cmd in $resetCommands) {
    Write-Host "  Executing: $cmd" -ForegroundColor Gray
    $cmd | & $mysqlExe -u root --default-character-set=utf8mb4 2>&1 | Out-Null
}

Write-Host "Stopping MariaDB..." -ForegroundColor Yellow
Get-Process -Name mysqld -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Password reset complete! Root password is now 'root'." -ForegroundColor Green
Write-Host "You can now run .\scripts\dev-db.ps1 to initialize the database." -ForegroundColor Cyan
