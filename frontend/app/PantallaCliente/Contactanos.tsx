// Pantalla de contacto de la sección cliente
// Muestra información de contacto, horarios y mapa embebido del taller
import { useRef, useEffect, useState } from 'react';
import {
  Animated,   // API de animaciones de React Native
  BackHandler, // Control del botón back del teléfono
  Linking,    // Abre URLs externas (tel:, mailto:, https:)
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps'; // Mapa nativo embebido
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import NavbarCliente from '@/components/navbarCliente/navbarCliente';
// Sistema de provincias y mecánicas de Ecuador
import { PROVINCIAS_ECUADOR, obtenerMecanicasPorProvincia, type ProvinciaEcuador } from '@/utils/provinciasEcuador';
import styles from '@/Styles/pantallaCliente/Contactanos';

// Coordenadas exactas del taller SM Quality Tires en Quito
const TALLER_LAT = -0.1632772;
const TALLER_LNG = -78.4766773;

// URL de Google Maps con la ruta al taller para el botón "Abrir Google Maps"
const MAPS_URL =
  'https://www.google.com/maps/dir//SM+QUALITY+TIRES,+Av.+R%C3%ADo+Coca+y+Isla+Pinz%C3%B3n+E10-100,+170138+Quito/@-0.1632772,-78.4766773,15z';

export default function ContactanosScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // BackHandler: regresa a index (PantallaCliente)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.push('/PantallaCliente' as any);
      return true;
    });
    return () => backHandler.remove();
  }, [router]);
  
  const scrollRef = useRef<ScrollView>(null);

  // Valores animados para la entrada del logotipo:
  // - logoOpacity: de 0 (invisible) a 1 (visible)
  // - logoScale: de 0.6 (pequeño) a 1.0 (tamaño real) con efecto spring
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.6)).current;

  // Estados para el selector de ubicación
  const [selectedProvincia, setSelectedProvincia] = useState<ProvinciaEcuador>('Pichincha');
  const [selectedUbicacion, setSelectedUbicacion] = useState(obtenerMecanicasPorProvincia('Pichincha')[0]);
  const [provinciaDropdownOpen, setProvinciaDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Dispara la animación del logo al montar el componente
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale,   { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  // Actualiza la región del mapa cuando cambia la ubicación seleccionada
  useEffect(() => {
    if (mapRef.current && selectedUbicacion) {
      mapRef.current.animateToRegion({
        latitude: selectedUbicacion.latitud,
        longitude: selectedUbicacion.longitud,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }, 500);
    }
  }, [selectedUbicacion]);

  // Navega al index pasando el parámetro scrollTo='cards' para ir directo a las cards del carrusel
  const handleScrollToAbout = () => {
    router.push({ pathname: '/PantallaCliente' as any, params: { scrollTo: 'cards' } });
  };

  // Navega al inicio del index (scroll al top)
  const handleScrollToTop = () => {
    router.push('/PantallaCliente' as any);
  };

  return (
    <View style={styles.page}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]} // La navbar queda fija al hacer scroll
      >
        {/* Navbar sticky del cliente */}
        <NavbarCliente
          onScrollToAbout={handleScrollToAbout}
          onScrollToTop={handleScrollToTop}
        />

        {/* ── LOGOTIPO ANIMADO ──
            Aparece con fade-in + spring scale al montar la pantalla */}
        <Animated.View
          style={[
            styles.logoSection,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require('../../assets/images/logotipoTransparente.png')}
            contentFit="contain"
            style={styles.logo}
          />
        </Animated.View>

        {/* ── INFORMACIÓN DE CONTACTO ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACTANOS</Text>
          <Text style={styles.sectionSubtitle}>
            Estamos aquí para ayudarte. Comunícate con nosotros por cualquiera de estos medios.
          </Text>

          {/* Tarjeta Teléfono: abre la app de llamadas al presionar */}
          <Pressable
            style={styles.contactCard}
            onPress={() => Linking.openURL('tel:+593999999999')}
          >
            <View style={styles.contactIconBox}>
              <FontAwesome name="phone" size={20} color="#2563EB" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>+593 99 999 9999</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#475569" />
          </Pressable>

          {/* Tarjeta WhatsApp: abre WhatsApp con el número del taller */}
          <Pressable
            style={styles.contactCard}
            onPress={() => Linking.openURL('https://wa.me/593999999999')}
          >
            <View style={styles.contactIconBox}>
              <FontAwesome name="whatsapp" size={20} color="#25D366" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>+593 99 999 9999</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#475569" />
          </Pressable>

          {/* Tarjeta Correo: abre el cliente de email con el correo del taller */}
          <Pressable
            style={styles.contactCard}
            onPress={() => Linking.openURL('mailto:Mecanic@gmail.com')}
          >
            <View style={styles.contactIconBox}>
              <FontAwesome name="envelope" size={18} color="#2563EB" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Correo electrónico</Text>
              <Text style={styles.contactValue}>Mecanic@gmail.com</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#475569" />
          </Pressable>

          {/* Tarjeta Horario: no es presionable, solo informativa */}
          <View style={styles.contactCard}>
            <View style={styles.contactIconBox}>
              <FontAwesome name="clock-o" size={20} color="#2563EB" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Horario de atención</Text>
              <Text style={styles.contactValue}>Lun – Vie: 07:00 – 22:00</Text>
              <Text style={styles.contactValue}>Sáb – Dom: 07:00 – 22:00</Text>
            </View>
          </View>
        </View>

        {/* SELECTOR DE UBICACIONES */}
        <View style={styles.section}>
          <Text style={styles.locationTitle}>Nuestras Mecánicas</Text>
          <Text style={styles.locationSubtitle}>
            ¿Interesado en visitarnos? Contamos con mecánicas en todas las provincias de Ecuador. Selecciona la más cercana a ti.
          </Text>

          {/* Selector de provincia */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Selecciona una provincia</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setProvinciaDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownSelected}>{selectedProvincia}</Text>
              <Text style={styles.dropdownArrow}>{provinciaDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>

            {/* Lista de opciones de provincias */}
            {provinciaDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView 
                  style={styles.dropdownScrollView}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  {PROVINCIAS_ECUADOR.map((provincia) => (
                    <Pressable
                      key={provincia}
                      style={[
                        styles.dropdownItem,
                        selectedProvincia === provincia && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setSelectedProvincia(provincia);
                        const mecanicas = obtenerMecanicasPorProvincia(provincia);
                        setSelectedUbicacion(mecanicas[0]);
                        setProvinciaDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>
                        {selectedProvincia === provincia ? '✓ ' : '    '}
                      </Text>
                      <Text style={styles.dropdownItemText}>{provincia}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Selector de ubicación */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Selecciona una mecánica de {selectedProvincia}</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownSelected}>{selectedUbicacion.nombre}</Text>
              <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>

            {/* Lista de opciones del dropdown (filtrada por provincia) */}
            {dropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView 
                  style={styles.dropdownScrollView}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  {obtenerMecanicasPorProvincia(selectedProvincia).map((mecanica) => (
                    <Pressable
                      key={mecanica.id}
                      style={[
                        styles.dropdownItem,
                        selectedUbicacion.id === mecanica.id && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setSelectedUbicacion(mecanica);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>
                        {selectedUbicacion.id === mecanica.id ? '✓ ' : '    '}
                      </Text>
                      <Text style={styles.dropdownItemText}>{mecanica.nombre}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Información de la ubicación seleccionada */}
          <Text style={styles.locationAddress}>
            {selectedUbicacion.nombre}{'\n'}
            {selectedUbicacion.direccion}
          </Text>

          {/* Mapa nativo embebido con react-native-maps */}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: selectedUbicacion.latitud,
              longitude: selectedUbicacion.longitud,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            zoomControlEnabled={true}
          >
            {/* Marcador en la ubicación seleccionada */}
            <Marker
              coordinate={{ 
                latitude: selectedUbicacion.latitud, 
                longitude: selectedUbicacion.longitud 
              }}
              title={selectedUbicacion.nombre}
              description={selectedUbicacion.direccion}
            />
          </MapView>

          {/* Botón que abre Google Maps con la ubicación seleccionada */}
          <Pressable
            style={({ pressed }) => [styles.mapsButton, pressed && styles.mapsButtonPressed]}
            onPress={() => {
              const url = `https://www.google.com/maps/dir//${selectedUbicacion.latitud},${selectedUbicacion.longitud}`;
              Linking.openURL(url);
            }}
          >
            {({ pressed }) => (
              <View style={styles.mapsButtonContent}>
                <FontAwesome
                  name="map-marker"
                  size={20}
                  color={pressed ? '#FFFFFF' : '#000000'}
                  style={styles.mapsButtonIcon}
                />
                <Text style={[styles.mapsButtonText, pressed && styles.mapsButtonTextPressed]}>
                  ABRIR GOOGLE MAPS
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} Mecanic Company. Todos los derechos reservados.{'\n'}
            Proporcionamos servicios automotrices de calidad con mecánicos certificados.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.scrollTopButton,
              pressed && styles.scrollTopButtonPressed,
            ]}
            onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          >
            {({ pressed }) => (
              <>
                <Text style={[
                  styles.scrollTopText,
                  pressed && styles.scrollTopTextPressed
                ]}>
                  REGRESAR ARRIBA
                </Text>
                <FontAwesome 
                  name="arrow-up" 
                  size={18} 
                  color={pressed ? '#FFFFFF' : '#000000'} 
                  style={styles.scrollTopIcon}
                />
              </>
            )}
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}
