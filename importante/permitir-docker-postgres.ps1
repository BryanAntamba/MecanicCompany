# Script para permitir conexiones de Docker a PostgreSQL
# Ejecutar como Administrador

$pgHbaPath = "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"

Write-Host "🔧 Configurando PostgreSQL para aceptar conexiones desde Docker..." -ForegroundColor Yellow

# Verificar que el archivo existe
if (-not (Test-Path $pgHbaPath)) {
    Write-Host "❌ No se encontró pg_hba.conf en $pgHbaPath" -ForegroundColor Red
    exit 1
}

# Crear backup
$backupPath = "$pgHbaPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item $pgHbaPath $backupPath
Write-Host "✓ Backup creado: $backupPath" -ForegroundColor Green

# Leer contenido actual
$content = Get-Content $pgHbaPath

# Verificar si ya existe la regla
$dockerRuleExists = $content | Select-String -Pattern "172.19.0.0/16"

if ($dockerRuleExists) {
    Write-Host "✓ La regla para Docker ya existe" -ForegroundColor Green
} else {
    # Buscar la línea después de "# IPv4 local connections:"
    $lineNumber = 0
    for ($i = 0; $i -lt $content.Length; $i++) {
        if ($content[$i] -match "# IPv4 local connections:") {
            $lineNumber = $i + 1
            break
        }
    }

    # Insertar nueva regla
    $newRule = "host    all             all             172.19.0.0/16           scram-sha-256"
    
    if ($lineNumber -gt 0) {
        $newContent = @()
        $newContent += $content[0..($lineNumber - 1)]
        $newContent += $newRule
        $newContent += $content[$lineNumber..($content.Length - 1)]
        
        # Guardar archivo
        $newContent | Set-Content $pgHbaPath
        Write-Host "✓ Regla agregada: $newRule" -ForegroundColor Green
    } else {
        # Agregar al final si no se encuentra la sección
        Add-Content $pgHbaPath "`n# Docker network`n$newRule"
        Write-Host "✓ Regla agregada al final del archivo" -ForegroundColor Green
    }
}

# Recargar configuración de PostgreSQL
Write-Host "`n🔄 Recargando configuración de PostgreSQL..." -ForegroundColor Yellow

try {
    # Opción 1: Usando pg_ctl
    $pgBinPath = "C:\Program Files\PostgreSQL\17\bin"
    $env:Path = "$pgBinPath;$env:Path"
    
    & "$pgBinPath\pg_ctl.exe" reload -D "C:\Program Files\PostgreSQL\17\data"
    Write-Host "✓ PostgreSQL recargado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "⚠ No se pudo recargar automáticamente. Reinicia el servicio manualmente:" -ForegroundColor Yellow
    Write-Host "  Restart-Service postgresql-x64-17" -ForegroundColor Cyan
}

Write-Host "`n✅ Configuración completada!" -ForegroundColor Green
Write-Host "`n📝 Ahora usa estos valores en Metabase:" -ForegroundColor Cyan
Write-Host "   Host: 172.19.0.1" -ForegroundColor White
Write-Host "   Puerto: 5432" -ForegroundColor White
Write-Host "   Base de datos: mecaniccompany" -ForegroundColor White
Write-Host "   Usuario: mecanico" -ForegroundColor White
Write-Host "   Contraseña: 12345" -ForegroundColor White
