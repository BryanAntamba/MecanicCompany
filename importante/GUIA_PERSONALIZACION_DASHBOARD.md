# 🎨 GUÍA DE PERSONALIZACIÓN - DASHBOARD MECANICCOMPANY

## 🎯 OBJETIVO
Transformar el dashboard de Metabase en una interfaz profesional con diseño de taller mecánico.

---

## 1. CAMBIAR TEMA GLOBAL

### Paso 1: Acceder a configuración
1. Click en **⚙️ (Configuración)** arriba derecha
2. **Admin settings**
3. **Settings** → **Appearance**

### Paso 2: Personalizar apariencia
```
Application name: MecanicCompany BI
Color principal: #1E3A8A (azul mecánico)
Fuente: Inter o Segoe UI
```

### Paso 3: Logo (opcional)
- Formato: PNG transparente
- Tamaño: 200x60 px
- Ubicación: Barra superior

---

## 2. REORGANIZAR DASHBOARD

### Layout Profesional Recomendado

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  💰 $4,186  │  📊 2       │  📈 $2,093  │  ⏰ 5       │
│  Ingresos   │  Servicios  │  Promedio   │  Pendientes │
└─────────────┴─────────────┴─────────────┴─────────────┘
                    (25% ancho cada uno)

┌──────────────────────────────────────────────────────────┐
│     📈 Tendencia de Ingresos (6 meses)                   │
│     Gráfico de línea - 100% ancho                        │
└──────────────────────────────────────────────────────────┘

┌────────────────────────────┬─────────────────────────────┐
│  🏆 Top 5 Mecánicos        │  🔧 Servicios por Tipo      │
│  Barras horizontales - 50% │  Gráfico dona - 50%         │
└────────────────────────────┴─────────────────────────────┘
```

### Cómo reorganizar:
1. Click **✏️ Edit dashboard** (arriba derecha)
2. **Arrastra tarjetas** a su posición
3. **Redimensiona** arrastrando esquinas
4. **Save**

---

## 3. COLORES PERSONALIZADOS POR TARJETA

### KPIs (Números grandes)

**💰 Ingresos del Mes**
- Color: `#16A34A` (Verde éxito)
- Formato: Moneda USD
- Ícono: 💰

**📊 Servicios del Mes**
- Color: `#1E3A8A` (Azul primario)
- Formato: Número entero
- Ícono: 📊

**📈 Promedio por Servicio**
- Color: `#7C3AED` (Morado)
- Formato: Moneda USD
- Ícono: 📈

**⏰ Solicitudes Pendientes**
- Color: `#F59E0B` (Amarillo/Naranja alerta)
- Formato: Número entero
- Ícono: ⏰

### Cómo aplicar colores:
1. En modo edición, click **"..."** en la tarjeta
2. **"Edit question"**
3. **⚙️ Visualization settings**
4. **"Formatting"** → Selecciona color
5. **Save**

---

## 4. GRÁFICOS PROFESIONALES

### 📈 Tendencia de Ingresos
```
Tipo: Line Chart
Color línea: #1E3A8A
Grosor: 3px
Puntos: Visibles
Área bajo curva: Relleno suave 20% opacidad
Eje Y: Formato moneda
```

### 🏆 Top 5 Mecánicos
```
Tipo: Bar Chart (Horizontal)
Color barras: #F97316 (Naranja)
Mostrar valores: Sí
Ordenar: Descendente
```

### 🔧 Servicios por Tipo
```
Tipo: Donut Chart
Mostrar leyenda: Sí (derecha)
Mostrar porcentajes: Sí
Total en el centro: 30 servicios
```

---

## 5. DESCRIPCIONES Y TOOLTIPS

### Agregar contexto a cada visualización:

1. **Edit question**
2. **Description:** (abajo del nombre)

**Ejemplos:**
```
💰 Ingresos del Mes
→ "Total de ingresos generados en el mes actual (mano de obra + repuestos)"

📊 Servicios del Mes
→ "Cantidad de mantenimientos completados este mes"

📈 Promedio por Servicio
→ "Ticket promedio por servicio este mes"

⏰ Solicitudes Pendientes
→ "Solicitudes en espera de ser asignadas a un mecánico"

📈 Tendencia de Ingresos
→ "Evolución de ingresos en los últimos 6 meses"

🏆 Top 5 Mecánicos
→ "Mecánicos con mayor cantidad de servicios realizados"

🔧 Servicios por Tipo
→ "Distribución porcentual de servicios por categoría"
```

---

## 6. CONFIGURACIÓN AVANZADA

### Filtros Interactivos (opcional)
1. **Edit dashboard**
2. **Add filter** (arriba)
3. Agregar filtro por:
   - Rango de fechas
   - Mecánico específico
   - Tipo de servicio

### Actualización Automática
1. **Dashboard settings**
2. **Auto-refresh:** Cada 5 minutos
3. Útil para monitores en tiempo real

### Exportar Dashboard
1. **"..." → Export as PDF**
2. Ideal para reportes mensuales

---

## 7. PALETA DE COLORES MECANICCOMPANY

### Colores Principales
```css
Azul Primario:    #1E3A8A  /* Mecánico profesional */
Gris Metal:       #475569  /* Fondo/texto secundario */
Verde Éxito:      #16A34A  /* Ingresos/positivo */
Naranja Trabajo:  #F97316  /* Alertas/acción */
Amarillo Alerta:  #F59E0B  /* Pendientes */
Rojo Peligro:     #DC2626  /* Errores */
Morado Análisis:  #7C3AED  /* Métricas especiales */
```

### Aplicación de colores
- **Fondos:** Gris claro #F8FAFC
- **Textos:** Gris oscuro #1E293B
- **Acentos:** Azul #1E3A8A
- **KPIs positivos:** Verde #16A34A
- **KPIs neutros:** Azul #1E3A8A
- **KPIs alertas:** Naranja/Amarillo #F59E0B

---

## 8. TIPOGRAFÍA

### Fuentes recomendadas
```
Títulos: Inter Bold, Segoe UI Bold
Números KPI: Inter, Roboto Mono (números tabulares)
Texto: Inter Regular, Segoe UI
```

### Tamaños
```
Título dashboard: 24px
Títulos tarjetas: 14px
Números KPI: 48px
Etiquetas: 12px
```

---

## 9. COMPARTIR DASHBOARD

### Opción 1: Acceso público
1. **Dashboard settings → Sharing**
2. **Enable public link**
3. Copiar URL generada

### Opción 2: Usuarios específicos
1. **Admin → People**
2. **Add person**
3. Asignar permisos (View/Edit)

### Opción 3: Embed en sitio web
1. **Sharing → Embed**
2. Copiar código iframe
3. Insertar en tu sitio

---

## 10. MANTENIMIENTO

### Actualizar datos
```bash
# Desde terminal en backend/
npm run seed:dashboard
```

### Backup de configuración
1. **Admin → Troubleshooting**
2. **Export app data**
3. Guardar archivo .json

### Monitoreo
- Revisar dashboard diariamente
- Actualizar visualizaciones según necesidad
- Ajustar filtros según feedback del equipo

---

## ✅ CHECKLIST FINAL

- [ ] Tema de Metabase personalizado (azul #1E3A8A)
- [ ] Logo de MecanicCompany agregado
- [ ] Layout reorganizado (4 KPIs, Tendencia, Top 5, Distribución)
- [ ] Colores aplicados a cada tarjeta
- [ ] Descripciones agregadas
- [ ] Gráficos con formato profesional
- [ ] Dashboard compartido con el equipo
- [ ] Datos actualizados y verificados

---

## 🚀 PRÓXIMOS PASOS

1. **Dashboard de Mecánicos Individuales**
   - Rendimiento por mecánico
   - Ingresos generados
   - Tiempo promedio de servicio

2. **Dashboard Financiero**
   - Análisis de costos
   - Márgenes de ganancia
   - Proyecciones

3. **Dashboard de Clientes**
   - Clientes recurrentes
   - Servicios por cliente
   - Satisfacción

4. **Alertas Automáticas**
   - Email cuando solicitudes > 10
   - Alerta si ingresos bajan 20%
   - Notificación de servicios pendientes

---

**Documentación creada:** 2026-07-06  
**Versión:** 1.0  
**Dashboard:** MecanicCompany BI v1
