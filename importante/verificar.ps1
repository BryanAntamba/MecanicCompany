# Script de Verificación Rápida - Dashboard BI
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE REQUISITOS - BI" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. PowerShell
Write-Host "[1/4] PowerShell:" -ForegroundColor Yellow
Write-Host "  ✓ Version $($PSVersionTable.PSVersion)" -ForegroundColor Green

# 2. Docker
Write-Host ""
Write-Host "[2/4] Docker:" -ForegroundColor Yellow
try {
    $dockerVer = docker --version 2>$null
    if ($dockerVer) {
        Write-Host "  ✓ $dockerVer" -ForegroundColor Green
        docker info 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Docker está corriendo" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Docker no está corriendo. Abre Docker Desktop" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ Docker no instalado" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Docker no instalado" -ForegroundColor Red
}

# 3. Puerto 3001
Write-Host ""
Write-Host "[3/4] Puerto 3001:" -ForegroundColor Yellow
$port = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "  ⚠ Puerto 3001 en uso" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ Puerto 3001 disponible" -ForegroundColor Green
}

# 4. Archivos
Write-Host ""
Write-Host "[4/4] Archivos del proyecto:" -ForegroundColor Yellow
$files = @("docker-compose.yml", "iniciar-metabase.ps1")
foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Host "  ✓ $f" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $f faltante" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ✓ Verificación completada" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Siguiente paso: .\iniciar-metabase.ps1" -ForegroundColor White
Write-Host ""
