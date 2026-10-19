# 📦 EXPORTAR METABASE A OTRA COMPUTADORA

## 🚀 Método Completo (con dashboards, usuarios y configuraciones)

### **EN TU COMPUTADORA ACTUAL:**

#### Paso 1: Crear backup completo
```powershell
cd c:\Users\kstiv\MecanicCompany\importante

docker run --rm `
  -v metabase-data:/data `
  -v ${PWD}:/backup `
  alpine tar czf /backup/metabase-backup.tar.gz -C /data .
```

#### Paso 2: Copiar archivos a USB/nube
Lleva a la otra PC:
- `docker-compose.yml`
- `metabase-backup.tar.gz`

---

### **EN LA COMPUTADORA NUEVA:**

#### Paso 1: Instalar Docker Desktop
Descarga e instala: https://www.docker.com/products/docker-desktop

#### Paso 2: Crear carpeta del proyecto
```powershell
mkdir C:\MecanicCompany-BI
cd C:\MecanicCompany-BI
```

#### Paso 3: Copiar archivos
- Pegar `docker-compose.yml` en la carpeta
- Pegar `metabase-backup.tar.gz` en la carpeta

#### Paso 4: Restaurar y ejecutar
```powershell
# Crear volumen
docker volume create metabase-data

# Restaurar datos
docker run --rm `
  -v metabase-data:/data `
  -v ${PWD}:/backup `
  alpine tar xzf /backup/metabase-backup.tar.gz -C /data

# Iniciar Metabase
docker-compose up -d

# Esperar 1-2 minutos
```

#### Paso 5: Acceder
Abre navegador: **http://localhost:3001**

✅ ¡Listo! Todo debería estar igual que en tu PC original.

---

## 🔧 Configuración adicional necesaria

### Conectar a PostgreSQL:
Si la base de datos PostgreSQL está en tu PC original:

**Opción A:** Usar misma red local
- Cambiar host a la IP de tu PC: `192.168.X.X`

**Opción B:** Exportar también la BD PostgreSQL
```powershell
# En PC original
pg_dump -U postgres mecaniccompany > mecaniccompany_backup.sql

# En PC nueva (después de instalar PostgreSQL)
psql -U postgres -d mecaniccompany < mecaniccompany_backup.sql
```

**Opción C:** Usar Docker también para PostgreSQL
```yaml
# Agregar al docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: tu_password
      POSTGRES_DB: mecaniccompany
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  metabase-data:
  postgres-data:
```

---

## 📊 Verificar que funcionó

1. Abre http://localhost:3001
2. Inicia sesión con tu usuario
3. Verifica que aparezcan tus dashboards
4. Verifica que la conexión a PostgreSQL funcione
5. Prueba ejecutar una consulta

---

## ⚠️ Problemas comunes

### "Puerto 3001 en uso"
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3001

# Cambiar puerto en docker-compose.yml:
# "3002:3000" en lugar de "3001:3000"
```

### "No conecta a PostgreSQL"
- Verificar que PostgreSQL esté corriendo
- Ajustar host en Metabase:
  - Windows/Mac: `host.docker.internal`
  - Linux: `172.17.0.1`
  - Otra PC en red: IP de esa PC

### "Dashboards vacíos"
- Revisar que la conexión a BD funcione
- Ejecutar consultas manualmente para verificar datos

---

## 💾 Tamaño del backup

Aproximado:
- Metabase sin datos: ~200 MB
- Metabase con configuraciones: ~250 MB
- PostgreSQL backup: Depende de tus datos

---

## 🔄 Mantener sincronizado

Si trabajas en ambas PCs, considera:

1. **Exportar regularmente:**
```powershell
# Hacer backup cada semana
docker run --rm `
  -v metabase-data:/data `
  -v ${PWD}:/backup `
  alpine tar czf /backup/metabase-backup-$(Get-Date -Format 'yyyy-MM-dd').tar.gz -C /data .
```

2. **Usar repositorio Git:**
- Guarda `docker-compose.yml`
- Exporta dashboards como JSON
- Comparte consultas SQL

---

## ✅ Checklist final

- [ ] Docker Desktop instalado en PC nueva
- [ ] Archivo `metabase-backup.tar.gz` copiado
- [ ] Archivo `docker-compose.yml` copiado
- [ ] Volumen creado y restaurado
- [ ] Metabase iniciado con `docker-compose up -d`
- [ ] Navegador abierto en http://localhost:3001
- [ ] Login funciona con tu usuario
- [ ] Dashboards aparecen correctamente
- [ ] Conexión a PostgreSQL configurada
- [ ] Consultas ejecutan correctamente

---

**¿Necesitas ayuda?** Revisa los logs:
```powershell
docker logs metabase-mecaniccompany -f
```
