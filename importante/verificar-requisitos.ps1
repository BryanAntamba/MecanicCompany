# Script de Verificación de Requisitos - Dashboard BI
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE REQUISITOS - BI" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# 1. Verificar PowerShell Version
Write-Host "[1/5] Verificando PowerShell..." -ForegroundColor Yellow
Write-Host "  ✓ PowerShell $($PSVersionTable.PSVersion) detectado" -ForegroundColor Green

# ===================================================================
# 2. Verificar Docker
# ===================================================================
Write-Host ""
Write-Host "[2/5] Verificando Docker Desktop..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "  ✓ Docker encontrado: $dockerVersion" -ForegroundColor Green
        
        # Verificar si Docker está corriendo
        $dockerInfo = docker info 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Docker está corriendo" -ForegroundColor Green
        } 
        else {
            Write-Host "  ⚠ Docker instalado pero NO está corriendo" -ForegroundColor Yellow
            Write-Host "    Abre Docker Desktop y vuelve a intentar" -ForegroundColor Yellow
            $allGood = $false
        }
    }
} 
catch {
    Write-Host "  ✗ Docker NO está instalado" -ForegroundColor Red
    Write-Host "    Descarga de: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    $allGood = $false
}

# ===================================================================
# 3. Verificar Puerto 3001 disponible
# ===================================================================
Write-Host ""
Write-Host "[3/5] Verificando puerto 3001..." -ForegroundColor Yellow

$portInUse = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "  ✗ Puerto 3001 ya está en uso" -ForegroundColor Red
    Write-Host "    Proceso usando el puerto:" -ForegroundColor Yellow
    $portInUse | ForEach-Object {
        $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        Write-Host "    - $($process.Name) (PID: $($_.OwningProcess))" -ForegroundColor Gray
    }
    Write-Host "    Opciones:" -ForegroundColor Yellow
    Write-Host "      1. Detener el proceso que usa el puerto" -ForegroundColor White
    Write-Host "      2. Cambiar puerto en docker-compose.yml (3001 → otro)" -ForegroundColor White
    $allGood = $false
} 
else {
    Write-Host "  ✓ Puerto 3001 disponible" -ForegroundColor Green
}

# ===================================================================
# 4. Verificar PostgreSQL
# ===================================================================
Write-Host ""
Write-Host "[4/5] Verificando PostgreSQL..." -ForegroundColor Yellow

# Intentar conectar usando Prisma
$backendPath = Join-Path $PSScriptRoot "backend"

if (Test-Path $backendPath) {
    Push-Location $backendPath
    
    # Verificar si .env existe
    if (Test-Path ".env") {
        Write-Host "  ✓ Archivo .env encontrado" -ForegroundColor Green
        
        # Intentar leer DATABASE_URL
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "DATABASE_URL") {
            Write-Host "  ✓ DATABASE_URL configurado" -ForegroundColor Green
            
            # Intentar validar conexión con Prisma
            Write-Host "    Probando conexión a base de datos..." -ForegroundColor Gray
            $prismaCheck = npx prisma db pull --force 2>&1
            
            if ($LASTEXITCODE -eq 0) {
              
            else {
                Write-Host "  ⚠ No se pudo conectar a PostgreSQL" -ForegroundColor Yellow
                Write-Host "    Verifica que el servidor PostgreSQL esté corriendo" -ForegroundColor Yellow
                Write-Host "    Error: $($prismaCheck[-1])" -ForegroundColor Gray
            }
        } 
        else {
            Write-Host "  ⚠ DATABASE_URL no encontrado en .env" -ForegroundColor Yellow
        }
    } 
      }
    } else {
        Write-Host "  ⚠ Archivo .env no encontrado" -ForegroundColor Yellow
        Write-Host "    Crea .env en /backend con DATABASE_URL" -ForegroundColor Yellow
  
  }
    
    Pop-Location
} else {
    Write-Host "  ⚠ Carpeta backend/ no encontrada" -ForegroundColor Yellow
}

# ===================================================================
# 5. Verificar archivos necesarios
# ===================================================================
Write-Host ""
Write-Host "[5/5] Verificando archivos del proyecto..." -ForegroundColor Yellow

$requiredFiles = @(
    "docker-compose.yml",
    "iniciar-metabase.ps1",
    "crear-usuario-readonly.sql",
    "GUIA_INICIO_RAPIDO_BI.md",
    "consultas-sql-metabase.sql"
)

$missingFiles = @()

foreach ($file in $requiredFiles) {
    $filePath = Join-Path $PSScriptRoot $file
    if (Test-Path $filePath) {
      
      Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file NO encontrado" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "  Archivos faltantes: $($missingFiles -join ', ')" -ForegroundColor Red
    $allGood = $false
}

# ===================================================================
# RESUMEN FINAL
# ===================================================================
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "  ✓ TODOS LOS REQUISITOS CUMPLIDOS" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 Estás listo para instalar Metabase!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Siguiente paso:" -ForegroundColor Cyan
    Write-Host "  .\iniciar-metabase.ps1" -ForegroundColor White
  
  Write-Host ""
} else {
    Write-Host "  ⚠ ALGUNOS REQUISITOS NO SE CUMPLEN" -ForegroundColor Yellow
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Por favor, resuelve los problemas arriba antes de continuar." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
