// Importa StyleSheet desde React Native para crear estilos optimizados para la app
import { StyleSheet } from 'react-native';

// Alturas fijas del bloque hero + video (evita franjas negras entre ambos en layout flex)
export const HERO_SECTION_HEIGHT = 520;
export const VIDEO_BG_SECTION_HEIGHT = 550;
export const HERO_VIDEO_BLOCK_HEIGHT = HERO_SECTION_HEIGHT + VIDEO_BG_SECTION_HEIGHT;

// Exporta por defecto un objeto de estilos creado con StyleSheet.create()
// StyleSheet.create valida los estilos y los optimiza en tiempo de compilación
export default StyleSheet.create({

  // --- PÁGINA PRINCIPAL ---
  page: {
    flex: 1,                    // Ocupa todo el espacio disponible en pantalla
    backgroundColor: '#000000', // Fondo negro para toda la página
  },

  // Contenido interno del ScrollView principal
  scrollContent: {
    paddingBottom: 36, // Espacio inferior para que el último elemento no quede pegado al borde
  },

  // Carrusel hero + video apilados con altura total fija (sin hueco flex entre secciones)
  heroVideoBlock: {
    margin: 0,
    padding: 0,
    height: HERO_VIDEO_BLOCK_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  //Seccion hero
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_SECTION_HEIGHT,
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  // Scroll horizontal del hero: misma altura que el contenedor (evita banda negra abajo)
  heroSlider: {
    height: HERO_SECTION_HEIGHT,
  },

  // Contenedor animado de cada slide del carrusel hero
  heroSlide: {
    height: HERO_SECTION_HEIGHT,
    overflow: 'hidden',
    // width se aplica inline porque depende de heroWidth (dinámico)
  },

  // Imagen de fondo: cubre todo el slide (absoluteFill + cover)
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111827',
  },

  // Capa oscura semitransparente sobre la imagen para legibilidad del texto
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_SECTION_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  // Contenedor del texto y botón — overlay único sobre el hero
  heroTextOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    alignItems: 'flex-start',
  },

  // Texto principal del slide (título)
  heroText: {
    color: '#F8FAFC',
    fontSize: 36,            // Más grande
    fontWeight: '800',
    textAlign: 'left',       // Izquierda
    marginBottom: 0,
    width: '100%',
  },

  // Contenedor de altura fija para los títulos apilados
  // Altura fija evita que el subtítulo se mueva cuando los títulos se superponen
  heroTitleContainer: {
    width: '100%',
    height: 90,              // Suficiente para 2 líneas del título más grande
    marginBottom: 8,
  },

  // Cada título se posiciona absolutamente dentro del contenedor
  heroTitleAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  // Subtítulo del slide
  heroCaption: {
    color: '#E2E8F0',
    textAlign: 'left',       // Izquierda
    fontSize: 14,
    lineHeight: 20,
    width: '100%',
    marginBottom: 20,
  },

  // Botón SOLICITA TU CITA — blanco en reposo, más ancho
  heroCitaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 0,
    alignItems: 'center',
    alignSelf: 'center',     // Centrado horizontalmente
    width: '100%',           // Ocupa todo el ancho disponible
    marginTop: 4,
  },

  // Botón al presionar — azul
  heroCitaButtonPressed: {
    backgroundColor: '#2563EB',
  },

  // Texto del botón — negro en reposo
  heroCitaButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },

  // Texto del botón al presionar — blanco
  heroCitaButtonTextPressed: {
    color: '#FFFFFF',
  },

  // Contenedor del texto descriptivo debajo del carrusel (ya no se usa, se mantiene por compatibilidad)
  heroCaptionContainer: {
    marginTop: 14,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    backgroundColor: '#000000',
  },

  // Contenedor de los puntos indicadores del carrusel
  heroIndicator: {
    marginTop: 12,              // Separación superior respecto a la imagen
    flexDirection: 'row',       // Puntos alineados horizontalmente
    justifyContent: 'flex-start', // Alineados a la izquierda
    paddingHorizontal: 16,      // Relleno horizontal
  },

  // Contenedor individual de cada punto indicador
  heroIndicatorDot: {
    marginHorizontal: 4, // Separación entre puntos
  },

  // Estilo base de cada punto indicador (inactivo)
  heroDot: {
    width: 30,                  // Ancho del punto (alargado, tipo pastilla)
    height: 10,                 // Alto del punto
    borderRadius: 4,            // Bordes redondeados
    backgroundColor: '#475569', // Color gris oscuro para puntos inactivos
  },

  // Estilo adicional para el punto indicador activo (slide actual)
  heroDotActive: {
    backgroundColor: '#FFFFFF', // Blanco puro para destacar el slide activo
  },

  // ── SECCIÓN VIDEO DE FONDO ──

  // Sección video: pegada al hero (top = altura hero dentro de heroVideoBlock)
  videoBgSection: {
    position: 'absolute',
    top: HERO_SECTION_HEIGHT,
    left: 0,
    right: 0,
    height: VIDEO_BG_SECTION_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#000000',
  },

  // Video que ocupa todo el fondo
  videoBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },

  // Capa oscura más intensa sobre el video
  videoBgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.72)', // Más oscuro
    zIndex: 1,
  },

  // Contenido encima del video — absolute para no afectar el layout nativo del <Video>
  videoBgContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 0,
    paddingTop: 12,
    zIndex: 2,
    width: '100%',
  },

  // logotipoTransparente encima del video — más grande
  videoBgIcon: {
    width: 260,
    height: 260,
    marginBottom: 8,         // Menos separación entre logo y frase
  },

  // Subtitulo1.png en tamaño grande dentro del video
  videoBgSubtitle: {
    width: '92%',
    height: 140,
    marginBottom: 14,
  },

  // Frase inspiracional — más grande, sin comillas
  videoBgPhrase: {
    color: '#F8FAFC',
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
    opacity: 0.95,
    paddingHorizontal: 8,
    marginTop: 4,
  },

  //Seccion generica (Nosotros)
  section: {
    marginTop: 50,         // Separación superior entre secciones
    paddingHorizontal: 16, // Relleno horizontal
  },

  // Sección "Nosotros" sin padding horizontal ni marginTop — pegada al video
  sectionNosotros: {
    marginTop: 0,
  },

  // Título de cada sección
  sectionTitle: {
    color: '#F8FAFC',    // Color blanco casi puro
    fontSize: 22,        // Tamaño grande para jerarquía
    fontWeight: '800',   // Extra negrita
    marginBottom: 10,    // Separación inferior entre título y contenido
  },

  // Texto descriptivo dentro de cada sección
  sectionText: {
    color: '#FFFFFF',  // Blanco puro
    fontSize: 15,      // Tamaño legible
    lineHeight: 22,    // Interlineado para comodidad de lectura
  },

  //Tarjeta de la seccion nosotros
  aboutCard: {
    width: 260,                 // Ancho fijo (coincide con CARD_WIDTH en index.tsx)
    backgroundColor: '#1E293B', // Fondo casi negro (igual que los círculos de las flechas)
    borderRadius: 20,           // Bordes muy redondeados
    overflow: 'hidden',         // Recorta elementos que salgan del borde redondeado
    borderWidth: 1,             // Borde fino
    borderColor: '#273449',     // Color del borde (azul grisáceo oscuro)
    padding: 20,                // Relleno interno de la tarjeta
    alignItems: 'center',       // Centra el contenido horizontalmente
  },

  // Subtitulo1.png que reemplaza al logo en la sección nosotros
  aboutSubtituloImg: {
    width: '85%',
    height: 100,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 16,
  },

  // Logo de la empresa encima del carrusel, centrado y más grande
  aboutLogo: {
    width: 320,
    height: 320,
    alignSelf: 'center',
    marginBottom: 0,
    borderRadius: 24,
  },

  // Contenedor del carrusel de vehículos
  vehicleCarousel: {
    width: '100%',
    height: 280,         // Más alto para imágenes más grandes
    marginTop: 0,        // Pegado al logotipo sin separación
    marginBottom: 24,
    overflow: 'hidden',
  },

  // Cada slide del carrusel de vehículos
  vehicleSlide: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Imagen de cada vehículo — más grande y centrada
  vehicleImage: {
    width: '100%',       // Ocupa todo el ancho disponible
    height: 270,         // Altura aumentada
    alignSelf: 'center',
  },

  // Contenedor animado del logo (opacity y transform se aplican inline por ser Animated values)
  logoAnimContainer: {
    alignSelf: 'center',
  },

  // Fila que contiene: flecha izquierda + carrusel + flecha derecha
  aboutCarouselRow: {
    flexDirection: 'row',    // Elementos en fila horizontal
    alignItems: 'center',    // Centra verticalmente flechas y carrusel
  },

  // Botón de flecha (izquierda o derecha)
  aboutArrow: {
    width: 36,               // Ancho del botón
    height: 36,              // Alto del botón
    borderRadius: 18,        // Circular
    backgroundColor: '#1E293B', // Fondo oscuro
    alignItems: 'center',    // Centra el texto horizontalmente
    justifyContent: 'center',// Centra el texto verticalmente
    zIndex: 10,              // Por encima del carrusel
  },

  // Flecha invisible (cuando está en el primer o último elemento)
  aboutArrowHidden: {
    opacity: 0,              // Invisible pero sigue ocupando espacio (mantiene el layout)
  },

  // Texto de la flecha (‹ o ›)
  aboutArrowText: {
    color: '#F8FAFC',        // Blanco casi puro
    fontSize: 28,            // Tamaño grande para que sea fácil de tocar
    lineHeight: 32,          // Ajuste de altura de línea para centrado visual
    fontWeight: '300',       // Fino para estética moderna
  },

  // Contenedor del hammer — alineado al lado derecho
  // Wrapper del carrusel "Nosotros": ocupa el espacio entre las flechas
  aboutCarouselWrapper: {
    flex: 1,
    overflow: 'visible',
  },

  // Contenedor del hammer — alineado al lado derecho
  hammerContainer: {
    alignSelf: 'flex-end',
    marginTop: 16,
    marginRight: 0,
  },

  // Imagen del hammer — más grande
  hammerImage: {
    width: 280,
    height: 280,
  },

  // contentContainerStyle del carrusel (paddingHorizontal se calcula inline por ser dinámico)
  carouselContent: {
    paddingVertical: 20,
  },

  // Lista scrolleable de horas en el dropdown
  timeScrollList: {
    maxHeight: 200,
  },

  // Título de cada tarjeta del carrusel
  aboutCardTitle: {
    color: '#F8FAFC',    // Blanco casi puro
    fontSize: 18,        // Tamaño destacado para el título
    fontWeight: '800',   // Extra negrita
    marginBottom: 10,    // Separación entre título y texto
    textAlign: 'center', // Centrado horizontalmente
  },

  // Texto descriptivo de cada tarjeta del carrusel
  aboutCardText: {
    color: '#CBD5E1',    // Gris azulado claro para texto secundario
    fontSize: 14,        // Tamaño legible
    lineHeight: 22,      // Interlineado confortable
    textAlign: 'center', // Centrado horizontalmente
  },

  // Imagen dentro de la tarjeta "Nosotros"
  aboutImage: {
    width: '80%',        // No ocupa todo el ancho, más estético
    height: 180,         // Altura fija
    marginTop: 20,       // Separación superior
    alignSelf: 'center', // Centrada horizontalmente dentro de su contenedor
  },

  // Contenedor del texto dentro de la tarjeta "Nosotros"
  aboutContent: {
    paddingHorizontal: 16, // Relleno horizontal
    paddingVertical: 0,    // Sin relleno vertical (el espaciado lo maneja el hijo)
  },

  // Texto descriptivo de la sección "Nosotros"
  aboutText: {
    color: '#CBD5E1',  // Gris azulado claro para texto secundario
    fontSize: 15,      // Tamaño legible
    lineHeight: 22,    // Interlineado confortable
  },

  // Texto de error debajo de un campo del formulario — rojo pequeño
  fieldError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Campo con error — borde rojo
  inputError: {
    borderColor: '#EF4444',
  },

  // Texto de error debajo de un campo — rojo pequeño
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  //Formulario de la solicitud
  form: {
    marginTop: 20,         // Separación superior respecto al subtítulo
    paddingHorizontal: 0,  // Sin padding extra (ya lo tiene la sección)
    paddingBottom: 24,     // Espacio inferior
  },

  // Título centrado del formulario
  formTitle: {
    color: '#F8FAFC',    // Blanco casi puro
    fontSize: 22,        // Tamaño grande para jerarquía
    fontWeight: '800',   // Extra negrita
    textAlign: 'center', // Centrado
    marginBottom: 8,     // Separación inferior
  },

  // Descripción breve debajo del título del formulario
  formSubtitle: {
    color: '#94A3B8',    // Gris azulado para texto secundario
    fontSize: 13,        // Más pequeño que el título
    textAlign: 'center', // Centrado
    lineHeight: 20,      // Interlineado cómodo
    marginBottom: 4,     // Separación inferior
    paddingHorizontal: 8,// Pequeño margen lateral
  },

  // Separador con línea y texto entre grupos de campos
  formDivider: {
    flexDirection: 'row',  // Línea - texto - línea en fila
    alignItems: 'center',  // Centra verticalmente
    marginTop: 20,         // Separación superior
    marginBottom: 14,      // Separación inferior
  },

  // Línea horizontal del separador
  formDividerLine: {
    flex: 1,               // Ocupa el espacio restante
    height: 1,             // Línea de 1px
    backgroundColor: '#1E293B', // Color oscuro
  },

  // Texto del separador entre las líneas
  formDividerText: {
    color: '#64748B',      // Gris medio
    fontSize: 11,          // Pequeño
    fontWeight: '600',     // Semi-negrita
    marginHorizontal: 10,  // Separación respecto a las líneas
    textTransform: 'uppercase', // Mayúsculas para estilo de etiqueta
    letterSpacing: 0.8,    // Espaciado entre letras
  },

  // Fila de dos inputs lado a lado
  formRow: {
    flexDirection: 'row', // Inputs en fila
    gap: 10,              // Separación entre inputs
  },

  // Input que ocupa la mitad del ancho en una fila
  inputHalf: {
    flex: 1,         // Ocupa la mitad disponible
    marginBottom: 12,// Separación inferior
  },

  // Estilo base de cada campo de texto del formulario
  input: {
    backgroundColor: '#111827', // Fondo oscuro para el campo
    borderColor: '#334155',     // Color del borde gris azulado
    borderWidth: 1,             // Borde fino
    borderRadius: 16,           // Bordes muy redondeados (estilo moderno)
    color: '#F8FAFC',           // Color del texto escrito por el usuario
    paddingVertical: 14,        // Relleno vertical interno generoso
    paddingHorizontal: 14,      // Relleno horizontal interno
    marginBottom: 12,           // Separación entre campos del formulario
    fontSize: 15,               // Tamaño de fuente del texto ingresado
  },

  // Estilos adicionales para el campo de texto multilínea (descripción)
  textarea: {
    minHeight: 110,            // Altura mínima para área de texto
    textAlignVertical: 'top',  // El texto empieza desde la parte superior (Android)
  },

  // Botón del selector de tipo de servicio (dropdown)
  dropdown: {
    backgroundColor: '#111827', // Mismo fondo que los inputs
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 4,            // Menos margen para que la lista quede pegada
    flexDirection: 'row',       // Texto + flecha en fila
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Texto del dropdown cuando no hay selección
  dropdownPlaceholder: {
    color: '#94A3B8',  // Gris igual que los placeholders de los inputs
    fontSize: 15,
  },

  // Texto del dropdown cuando hay una opción seleccionada
  dropdownSelected: {
    color: '#F8FAFC',  // Blanco como el texto de los inputs
    fontSize: 15,
  },

  // Flecha del dropdown (▲ / ▼)
  dropdownArrow: {
    color: '#64748B',  // Gris medio
    fontSize: 12,
  },

  // Lista desplegable de opciones
  dropdownList: {
    backgroundColor: '#1E293B', // Fondo oscuro diferenciado
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',         // Recorta los bordes redondeados
  },

  // Cada opción dentro de la lista
  dropdownItem: {
    flexDirection: 'row',       // Checkmark + texto en fila
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#273449', // Línea divisoria entre opciones
  },

  // Opción actualmente seleccionada
  dropdownItemActive: {
    backgroundColor: '#0F172A', // Fondo más oscuro para destacar la selección
  },

  // Checkmark de la opción seleccionada
  dropdownItemCheck: {
    color: '#2563EB',  // Azul brand para el checkmark
    fontSize: 14,
    fontWeight: '700',
    width: 20,         // Ancho fijo para alinear el texto
  },

  // Texto de cada opción del dropdown
  dropdownItemText: {
    color: '#F8FAFC',  // Blanco
    fontSize: 15,
  },

  // ── CALENDARIO MODAL ──

  // Fondo semitransparente del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Contenedor blanco/oscuro del calendario dentro del modal
  calendarModal: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    width: '100%',
  },

  // Cabecera del calendario: flechas + mes/año
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // Botón de navegación de mes (‹ / ›)
  calendarNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Texto de las flechas de navegación
  calendarNavText: {
    color: '#F8FAFC',
    fontSize: 22,
    lineHeight: 26,
  },

  // Etiqueta del mes y año en la cabecera
  calendarMonthLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Fila de etiquetas de días de la semana
  calendarWeekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  // Etiqueta de cada día de la semana (Do, Lu, Ma...)
  calendarWeekLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },

  // Cuadrícula de días del mes
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Celda individual de un día
  calendarCell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  // Celda del día de hoy (borde azul)
  calendarCellToday: {
    borderWidth: 1,
    borderColor: '#2563EB',
  },

  // Celda del día seleccionado (fondo azul)
  calendarCellSelected: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },

  // Celda de días pasados (deshabilitados)
  calendarCellPast: {
    opacity: 0.25,
  },

  // Texto de cada celda de día
  calendarCellText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  // Texto del día de hoy
  calendarCellTodayText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  // Texto del día seleccionado
  calendarCellSelectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Texto de días pasados
  calendarCellPastText: {
    color: '#475569',
  },

  // Botón cerrar del modal del calendario
  calendarCloseBtn: {
    marginTop: 14,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },

  // Texto del botón cerrar
  calendarCloseBtnText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  // Texto informativo sobre el manual PDF
  manualText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },

  // Enlace de descarga del manual PDF — blanco
  manualLink: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },

  // Título centrado de la sección ubicación
  locationTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Dirección centrada debajo del título
  locationAddress: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 14,
    textAlign: 'center',
  },

  // Contenedor del mapa nativo
  mapWebViewContainer: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },

  // MapView que ocupa todo el contenedor
  mapWebView: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },

  // Botón "Abrir Google Maps" — blanco en reposo
  mapsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 40,        // Espacio generoso al final de la página
  },

  // Estado presionado del botón — azul
  mapsButtonPressed: {
    backgroundColor: '#2563EB',
  },

  // Fila interior del botón: ícono + texto
  mapsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Ícono dentro del botón
  mapsButtonIcon: {
    marginRight: 10,
  },

  // Texto del botón — negro en reposo
  mapsButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // Texto del botón al presionar — blanco
  mapsButtonTextPressed: {
    color: '#FFFFFF',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',   // Blanco en reposo
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },

  // Estado presionado: fondo azul
  buttonPressed: {
    backgroundColor: '#2563EB',
  },

  // Texto del botón — estado normal: negro
  buttonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },

  // Texto del botón — estado presionado: blanco
  buttonTextPressed: {
    color: '#FFFFFF',
  },

  // --- PIE DE PÁGINA (FOOTER) ---
  footer: {
    marginTop: 30,              // Separación superior respecto al formulario
    paddingHorizontal: 16,      // Relleno horizontal
    paddingVertical: 20,        // Relleno vertical interno
    backgroundColor: '#111827', // Fondo oscuro diferenciado del resto
    borderTopColor: '#1F2937',  // Color de la línea divisoria superior
    borderTopWidth: 1,          // Línea divisoria de 1px en la parte superior
  },

  // Contenedor de cada línea de información en el footer
  footerItem: {
    marginBottom: 6, // Separación entre líneas del footer
  },

  // Texto secundario del footer (etiquetas)
  footerText: {
    color: '#94A3B8', // Gris azulado para texto de menor jerarquía
    fontSize: 13,     // Tamaño pequeño para información secundaria
  },

  // Texto de contacto del footer (correo, teléfono)
  footerContact: {
    color: '#E2E8F0',  // Blanco grisáceo para datos de contacto
    fontSize: 15,      // Tamaño un poco mayor que el footerText
    fontWeight: '600', // Semi-negrita para destacar los datos de contacto
  },
});
