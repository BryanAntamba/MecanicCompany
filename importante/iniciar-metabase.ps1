# ===================================================================
# Script de Inicio Rápido - Metabase para MecanicCompany
# ===================================================================
# Autor: Sistema BI MecanicCompany
# Fecha: 2026-07-06
# Descripción: Instalación y configuración automatizada de Metabase
# ===================================================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  METABASE - MECANICCOMPANY BI" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ===================================================================
# PASO 1: Verificar Docker
# ===================================================================
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Docker no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instala Docker Desktop:" -ForegroundColor Yellow
    Write-Host "  1. Descargar de: https://www.docker.com/products/docker-desktop" -ForegroundColor White
    Write-Host "  2. Instalar y reiniciar tu computadora" -ForegroundColor White
    Write-Host "  3. Ejecutar este script nuevamente" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

# ===================================================================
# PASO 2: Verificar si Metabase ya está corriendo
# ===================================================================
Write-Host "[2/5] Verificando instancia existente..." -ForegroundColor Yellow

$existing = docker ps -a --filter "name=metabase-mecaniccompany" --format "{{.Names}}"

if ($existing) {
    Write-Host "⚠ Metabase ya existe. ¿Qué deseas hacer?" -ForegroundColor Yellow
    Write-Host "  1. Detener y eliminar (BORRARÁ DATOS)" -ForegroundColor White
    Write-Host "  2. Solo iniciar (si está detenido)" -ForegroundColor White
    Write-Host "  3. Cancelar" -ForegroundColor White
    
    $option = Read-Host "Selecciona opción (1/2/3)"
    
    switch ($option) {
        "1" {
            Write-Host "Eliminando instancia anterior..." -ForegroundColor Yellow
            docker-compose down -v
            Write-Host "✓ Instancia eliminada" -ForegroundColor Green
        }
        "2" {
            Write-Host "Iniciando instancia existente..." -ForegroundColor Yellow
            docker-compose up -d
            Write-Host "✓ Metabase iniciado" -ForegroundColor Green
            Start-Process "http://localhost:3001"
            exit 0
        }
        "3" {
            Write-Host "Cancelado por el usuario" -ForegroundColor Yellow
            exit 0
        }
        default {
            Write-Host "Opción inválida. Cancelando..." -ForegroundColor Red
            exit 1
        }
    }
}

# ===================================================================
# PASO 3: Descargar imagen de Metabase
# ===================================================================
Write-Host "[3/5] Descargando Metabase (puede tardar 2-5 min)..." -ForegroundColor Yellow

docker pull metabase/metabase:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: No se pudo descargar Metabase" -ForegroundColor Red
    Write-Host "Verifica tu conexión a internet" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✓ Imagen descargada" -ForegroundColor Green

# ===================================================================
# PASO 4: Iniciar Metabase con Docker Compose
# ===================================================================
Write-Host "[4/5] Iniciando Metabase..." -ForegroundColor Yellow

docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: No se pudo iniciar Metabase" -ForegroundColor Red
    Write-Host "Revisa los logs con: docker-compose logs" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✓ Metabase iniciado correctamente" -ForegroundColor Green

# ===================================================================
# PASO 5: Esperar inicialización
# ===================================================================
Write-Host "[5/5] Esperando inicialización (30 segundos)..." -ForegroundColor Yellow

for ($i = 30; $i -gt 0; $i--) {
    Write-Host -NoNewline "`r⏳ Tiempo restante: $i segundos   "
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host ""

# ===================================================================
# INFORMACIÓN FINAL
# ===================================================================
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  ✓ METABASE INSTALADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URL de acceso:" -ForegroundColor Cyan
Write-Host "   http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📋 Primera configuración:" -ForegroundColor Cyan
Write-Host "   1. Selecciona idioma: Español" -ForegroundColor White
Write-Host "   2. Crea usuario administrador" -ForegroundColor White
Write-Host "   3. Conecta a PostgreSQL:" -ForegroundColor White
Write-Host "      - Host: host.docker.internal" -ForegroundColor Gray
Write-Host "      - Puerto: 5432" -ForegroundColor Gray
Write-Host "      - Base de datos: [tu nombre de BD]" -ForegroundColor Gray
Write-Host "      - Usuario: metabase_readonly (crear con script)" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver estado:   docker-compose ps" -ForegroundColor White
Write-Host "   Ver logs:     docker-compose logs -f" -ForegroundColor White
Write-Host "   Detener:      docker-compose stop" -ForegroundColor White
Write-Host "   Reiniciar:    docker-compose restart" -ForegroundColor White
Write-Host "   Eliminar:     docker-compose down -v" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación:" -ForegroundColor Cyan
Write-Host "   Consulta PLAN_DASHBOARD_BI.md para más detalles" -ForegroundColor White
Write-Host ""

# ===================================================================
# Abrir navegador automáticamente
# ===================================================================
Write-Host "Abriendo navegador..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
pause
