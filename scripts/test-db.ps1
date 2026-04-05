$ErrorActionPreference = "Stop"

$projectRoot = "E:\Ai_code\TraeAi\Trae_dm\Digital-Nomad-Management-System-cn"
$mysqlExe = Join-Path $projectRoot ".runtime\mariadb-10.11.7-winx64\bin\mysql.exe"
$dbFile = Join-Path $projectRoot "Digital-Nomad-Management-System-server\src\database\data\init.sql"

Write-Host "Testing MySQL connection with password 'root'..." -ForegroundColor Yellow
& $mysqlExe -u root -proot -e "SELECT 1"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Connection successful!" -ForegroundColor Green
    
    Write-Host "Initializing database..." -ForegroundColor Yellow
    & $mysqlExe -u root -proot --default-character-set=utf8mb4 -e "source $dbFile"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database initialized successfully!" -ForegroundColor Green
    } else {
        Write-Host "Database initialization failed!" -ForegroundColor Red
    }
} else {
    Write-Host "Connection failed!" -ForegroundColor Red
}
