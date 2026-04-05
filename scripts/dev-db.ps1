$ErrorActionPreference = "Stop"

if (-not $env:DN_PORT) { $env:DN_PORT = "3306" }
if (-not $env:DN_HOST) { $env:DN_HOST = "127.0.0.1" }
if (-not $env:DN_USER) { $env:DN_USER = "root" }
if (-not $env:DN_DB) { $env:DN_DB = "digital_nomad" }

$scriptPath = $MyInvocation.MyCommand.Path
if (-not $scriptPath) {
    $scriptPath = $PSCommandPath
}
$rootDir = Split-Path -Parent $scriptPath
$projectRoot = Split-Path -Parent $rootDir

$runtimeDir = Join-Path $projectRoot ".runtime"
$mariadbDir = Join-Path $runtimeDir "mariadb-10.11.7-winx64"
$mariadbBin = Join-Path $mariadbDir "bin"
$mysqldExe = Join-Path $mariadbBin "mysqld.exe"
$mysqlExe = Join-Path $mariadbBin "mysql.exe"
$mysqlAdminExe = Join-Path $mariadbBin "mysqladmin.exe"
$iniFile = Join-Path $runtimeDir "mariadb-3306.ini"
$dbFile = Join-Path $projectRoot "Digital-Nomad-Management-System-server\src\database\data\init.sql"
$testDataFile = Join-Path $projectRoot "Digital-Nomad-Management-System-server\src\database\data\test-data.sql"
$envFile = Join-Path $projectRoot "Digital-Nomad-Management-System-server\.env"

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

$loadTestData = $true
if ($args -contains "-nodata" -or $args -contains "--no-data") {
    $loadTestData = $false
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Digital Nomad - Database Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project Root: $projectRoot" -ForegroundColor Gray
Write-Host "Database Config:" -ForegroundColor Yellow
Write-Host "  Host: $env:DN_HOST" -ForegroundColor Gray
Write-Host "  Port: $env:DN_PORT" -ForegroundColor Gray
Write-Host "  User: $env:DN_USER" -ForegroundColor Gray
Write-Host "  Database: $env:DN_DB" -ForegroundColor Gray
Write-Host "  Load Test Data: $loadTestData" -ForegroundColor Gray
Write-Host ""

function Test-MySQLConnection {
    param([string]$DbHost, [string]$Port, [string]$User, [string]$Password)
    try {
        $testSql = "SELECT 1;"
        if ($Password) {
            $psi = New-Object System.Diagnostics.ProcessStartInfo
            $psi.FileName = $mysqlExe
            $psi.Arguments = "-h $DbHost -P $Port -u $User -p$Password"
            $psi.RedirectStandardInput = $true
            $psi.RedirectStandardOutput = $true
            $psi.RedirectStandardError = $true
            $psi.UseShellExecute = $false
            $psi.CreateNoWindow = $true
            $process = [System.Diagnostics.Process]::Start($psi)
            $process.StandardInput.WriteLine($testSql)
            $process.StandardInput.Close()
            $process.WaitForExit(5000)
            return ($process.ExitCode -eq 0)
        } else {
            $result = $testSql | & $mysqlExe -h $DbHost -P $Port -u $User 2>&1
            return ($LASTEXITCODE -eq 0)
        }
    } catch {
        return $false
    }
}

function Start-MySQLServer {
    Write-Host "Starting MariaDB server..." -ForegroundColor Yellow
    
    $mariadbDirFwd = $mariadbDir -replace '\\', '/'
    $runtimeDirFwd = $runtimeDir -replace '\\', '/'
    
    if (-not (Test-Path $iniFile)) {
        Write-Host "Creating MariaDB configuration file..." -ForegroundColor Gray
        $iniContent = @"
[client]
default-character-set=utf8mb4

[mysqld]
basedir=$mariadbDirFwd
datadir=$runtimeDirFwd/mariadb-data
port=$env:DN_PORT
bind-address=127.0.0.1
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
skip-name-resolve=1
max_connections=200
max_allowed_packet=256M
pid-file=$runtimeDirFwd/mariadb-$env:DN_PORT.pid
log-error=$runtimeDirFwd/mariadb-$env:DN_PORT.err.log
"@
        $iniContent | Out-File -FilePath $iniFile -Encoding ASCII
    }
    
    Start-Process -FilePath $mysqldExe -ArgumentList "--defaults-file=$iniFile" -WindowStyle Hidden
    
    $retries = 0
    $maxRetries = 30
    while ($retries -lt $maxRetries) {
        Start-Sleep -Seconds 1
        if (Test-MySQLConnection -DbHost $env:DN_HOST -Port $env:DN_PORT -User $env:DN_USER -Password $dbPassword) {
            Write-Host "MariaDB server started successfully!" -ForegroundColor Green
            return $true
        }
        $retries++
        Write-Host "Waiting for MariaDB to start... ($retries/$maxRetries)" -ForegroundColor Gray
    }
    
    Write-Host "Failed to start MariaDB server after $maxRetries seconds" -ForegroundColor Red
    return $false
}

function Invoke-SQLFile {
    param([string]$SqlFile, [string]$Description)
    
    if (-not (Test-Path $SqlFile)) {
        Write-Host "Error: SQL file not found: $SqlFile" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Executing $Description..." -ForegroundColor Green
    Write-Host "  File: $SqlFile" -ForegroundColor Gray
    
    if ($dbPassword) {
        $cmdFile = Join-Path $env:TEMP "exec-sql-$(Get-Random).sql"
        Copy-Item $SqlFile $cmdFile -Force
        try {
            $psi = New-Object System.Diagnostics.ProcessStartInfo
            $psi.FileName = $mysqlExe
            $psi.Arguments = "-h $env:DN_HOST -P $env:DN_PORT -u $env:DN_USER -p$dbPassword --default-character-set=utf8mb4 -e `"source $cmdFile`""
            $psi.RedirectStandardOutput = $true
            $psi.RedirectStandardError = $true
            $psi.UseShellExecute = $false
            $psi.CreateNoWindow = $true
            $process = [System.Diagnostics.Process]::Start($psi)
            $process.WaitForExit()
            $exitCode = $process.ExitCode
        } finally {
            Remove-Item $cmdFile -Force -ErrorAction SilentlyContinue
        }
    } else {
        Get-Content $SqlFile -Raw | & $mysqlExe -h $env:DN_HOST -P $env:DN_PORT -u $env:DN_USER --default-character-set=utf8mb4
        $exitCode = $LASTEXITCODE
    }
    
    return ($exitCode -eq 0)
}

Write-Host "Checking if MariaDB is running..." -ForegroundColor Yellow
if (-not (Test-MySQLConnection -DbHost $env:DN_HOST -Port $env:DN_PORT -User $env:DN_USER -Password $dbPassword)) {
    Write-Host "MariaDB is not running." -ForegroundColor Yellow
    if (-not (Start-MySQLServer)) {
        Write-Host "Failed to start MariaDB server!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "MariaDB is already running." -ForegroundColor Green
}

Write-Host ""

$initSuccess = Invoke-SQLFile -SqlFile $dbFile -Description "database initialization script"

if (-not $initSuccess) {
    Write-Host "Database initialization completed with warnings (tables may already exist)." -ForegroundColor Yellow
}

if ($loadTestData -and (Test-Path $testDataFile)) {
    $dataSuccess = Invoke-SQLFile -SqlFile $testDataFile -Description "test data script"
    if (-not $dataSuccess) {
        Write-Host "Test data loading completed with warnings." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Database setup completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Connection: mysql://$env:DN_USER@$env:DN_HOST`:$env:DN_PORT/$env:DN_DB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Accounts:" -ForegroundColor Yellow
Write-Host "  Admin: admin / password123" -ForegroundColor Gray
Write-Host "  Operator: operator1 / password123" -ForegroundColor Gray
Write-Host ""
Write-Host "Usage:" -ForegroundColor Yellow
Write-Host "  .\dev-db.ps1          - Initialize database with test data" -ForegroundColor Gray
Write-Host "  .\dev-db.ps1 -nodata   - Initialize database without test data" -ForegroundColor Gray
