# Script para detectar IP automáticamente y configurar Expo

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 MECANICCOMPANY - AUTO IP CONFIG    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Detectar IP
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^127' -and $_.InterfaceAlias -notmatch 'Loopback' } | Select-Object -First 1).IPAddress

if ($ipAddress) {
    Write-Host "✅ Tu IP de red detectada: " -ForegroundColor Green -NoNewline
    Write-Host "$ipAddress`n" -ForegroundColor Yellow
    
    # Actualizar archivos .env.local
    $envPath = ".\frontend\.env.local"
    $envContent = @"
# Expo Configuration
EXPO_DEBUG=false
EXPO_USE_FAST_LANE=true

# API Configuration
REACT_APP_API_URL=http://$ipAddress`:3000
EXPO_PUBLIC_API_URL=http://$ipAddress`:3000
"@
    
    Set-Content -Path $envPath -Value $envContent
    Write-Host "✅ Archivo .env.local actualizado`n" -ForegroundColor Green
    
    Write-Host "📱 INSTRUCCIONES PARA EXPO GO:`n" -ForegroundColor Cyan
    Write-Host "1. En tu teléfono abre: Expo Go" -ForegroundColor White
    Write-Host "2. Escanea el código QR O presiona '+' y escribe:" -ForegroundColor White
    Write-Host "   exp://$ipAddress`:8081`n" -ForegroundColor Yellow
    
    Write-Host "🚀 INICIANDO SERVIDOR...`n" -ForegroundColor Cyan
    Write-Host "Presiona Ctrl+C para detener`n" -ForegroundColor Gray
    
    # Iniciar Expo
    cd frontend
    npx expo start --lan
} else {
    Write-Host "❌ No se pudo detectar la IP. Intenta manualmente:" -ForegroundColor Red
    Write-Host "1. Abre PowerShell como administrador" -ForegroundColor White
    Write-Host "2. Ejecuta: ipconfig" -ForegroundColor White
    Write-Host "3. Busca 'IPv4 Address'" -ForegroundColor White
}
