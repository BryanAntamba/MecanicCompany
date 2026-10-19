# Script de Testing Completo - MecanicCompany
# Este script inicia Backend + Frontend + Testing automáticamente
# Uso: powershell -ExecutionPolicy Bypass -File .\test-all.ps1

Clear-Host

Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 INICIADOR DE TESTING COMPLETO - MECANICCOMPANY            ║" -ForegroundColor Cyan
Write-Host "║  Este script inicia Backend, Frontend y ejecuta Tests         ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# ─────────────────────────────────────────────────────────────────────────

Write-Host "📋 OPCIÓN 1: Testing Rápido (Solo Backend)" -ForegroundColor Yellow
Write-Host "   Comando: node test-completo.js"
Write-Host "   ⚠️  Asume que backend y frontend ya están corriendo`n"

Write-Host "📋 OPCIÓN 2: Testing Completo (Backend + Frontend + Tests)" -ForegroundColor Yellow
Write-Host "   Comando: powershell -ExecutionPolicy Bypass -File .\test-all.ps1`n"

Write-Host "📋 OPCIÓN 3: Testing con Setup de Base de Datos" -ForegroundColor Yellow
Write-Host "   Comando: powershell -ExecutionPolicy Bypass -File .\test-all.ps1 -setup`n"

# ─────────────────────────────────────────────────────────────────────────

Write-Host "Detectando proyecto..." -ForegroundColor Cyan

$rootPath = (Get-Location).Path
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "frontend"

if (-not (Test-Path $backendPath)) {
    Write-Host "❌ No se encontró carpeta /backend" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ No se encontró carpeta /frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Proyecto encontrado en: $rootPath`n" -ForegroundColor Green

# ─────────────────────────────────────────────────────────────────────────

function Start-BackendServer {
    Write-Host "`n🏗️  INICIANDO BACKEND SERVER..." -ForegroundColor Cyan
    Write-Host "    Ubicación: $backendPath" -ForegroundColor Gray
    
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd $backendPath && npm run dev" `
        -PassThru -NoNewWindow -ErrorAction SilentlyContinue
    
    if ($null -eq $process) {
        Write-Host "❌ No se pudo iniciar el backend" -ForegroundColor Red
        return $null
    }
    
    Write-Host "✅ Backend iniciándose (PID: $($process.Id))..." -ForegroundColor Green
    Start-Sleep -Seconds 3
    
    # Verificar que está corriendo
    $maxAttempts = 5
    $attempt = 0
    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Backend respondiendo en http://localhost:3000/api" -ForegroundColor Green
                return $process
            }
        } catch {
            Write-Host "⏳ Esperando backend... ($($attempt + 1)/$maxAttempts)" -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
        $attempt++
    }
    
    Write-Host "⚠️  Backend no responde después de $maxAttempts intentos" -ForegroundColor Yellow
    return $process
}

function Start-FrontendServer {
    Write-Host "`n📱 INICIANDO FRONTEND SERVER..." -ForegroundColor Cyan
    Write-Host "    Ubicación: $frontendPath" -ForegroundColor Gray
    
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd $frontendPath && npm start -- --web" `
        -PassThru -NoNewWindow -ErrorAction SilentlyContinue
    
    if ($null -eq $process) {
        Write-Host "❌ No se pudo iniciar el frontend" -ForegroundColor Red
        return $null
    }
    
    Write-Host "✅ Frontend iniciándose (PID: $($process.Id))..." -ForegroundColor Green
    Start-Sleep -Seconds 5
    
    # Verificar que está corriendo
    $maxAttempts = 10
    $attempt = 0
    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8081" -ErrorAction SilentlyContinue
            if ($response.StatusCode -lt 500) {
                Write-Host "✅ Frontend respondiendo en http://localhost:8081" -ForegroundColor Green
                return $process
            }
        } catch {
            Write-Host "⏳ Esperando frontend... ($($attempt + 1)/$maxAttempts)" -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
        $attempt++
    }
    
    Write-Host "⚠️  Frontend no responde después de $maxAttempts intentos" -ForegroundColor Yellow
    return $process
}

function Run-Tests {
    Write-Host "`n🧪 EJECUTANDO TESTS..." -ForegroundColor Cyan
    Write-Host "    Archivo: test-completo.js" -ForegroundColor Gray
    
    Set-Location $rootPath
    $testResult = & node test-completo.js
    
    Write-Host $testResult
    
    return $LASTEXITCODE
}

function Cleanup {
    Write-Host "`n🧹 LIMPIANDO PROCESOS..." -ForegroundColor Yellow
    
    if ($null -ne $backendProcess) {
        Write-Host "  ⏹️  Deteniendo backend (PID: $($backendProcess.Id))..." -ForegroundColor Gray
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Backend detenido" -ForegroundColor Green
    }
    
    if ($null -ne $frontendProcess) {
        Write-Host "  ⏹️  Deteniendo frontend (PID: $($frontendProcess.Id))..." -ForegroundColor Gray
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Frontend detenido" -ForegroundColor Green
    }
    
    Write-Host "✅ Limpieza completada`n" -ForegroundColor Green
}

# Trap para asegurar limpieza
trap {
    Cleanup
    exit 1
}

# ─────────────────────────────────────────────────────────────────────────

# OPCIÓN: Setup de BD si se pasa -setup
if ($args -contains "-setup") {
    Write-Host "🔧 CONFIGURANDO BASE DE DATOS..." -ForegroundColor Cyan
    
    Write-Host "  • Ejecutando seed en backend..." -ForegroundColor Gray
    Push-Location $backendPath
    & npm run db:setup-test 2>&1 | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
    Pop-Location
    
    Write-Host "✅ Base de datos configurada`n" -ForegroundColor Green
}

# ─────────────────────────────────────────────────────────────────────────

# INICIAR SERVIDORES
$backendProcess = Start-BackendServer
$frontendProcess = Start-FrontendServer

if ($null -eq $backendProcess -or $null -eq $frontendProcess) {
    Write-Host "`n❌ Error al iniciar uno o más servidores" -ForegroundColor Red
    Cleanup
    exit 1
}

# EJECUTAR TESTS
Start-Sleep -Seconds 2
$testExitCode = Run-Tests

# LIMPIAR
Cleanup

if ($testExitCode -eq 0) {
    Write-Host "🎉 TESTING COMPLETADO EXITOSAMENTE" -ForegroundColor Green
} else {
    Write-Host "❌ TESTING FALLÓ" -ForegroundColor Red
}

exit $testExitCode
