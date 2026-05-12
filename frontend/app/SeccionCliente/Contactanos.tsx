// Pantalla de contacto de la sección cliente
// Muestra información de contacto, horarios y mapa embebido del taller
import { useRef, useEffect } from 'react';
import {
  Animated,   // API de animaciones de React Native
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
import NavbarCliente from '@/components/nadvarCliente/nadvarCliente';
import styles from '@/Styles/Contactanos';

// Coordenadas exactas del taller SM Quality Tires en Quito
const TALLER_LAT = -0.1632772;
const TALLER_LNG = -78.4766773;

// URL de Google Maps con la ruta al taller para el botón "Abrir Google Maps"
const MAPS_URL =
  'https://www.google.com/maps/dir//SM+QUALITY+TIRES,+Av.+R%C3%ADo+Coca+y+Isla+Pinz%C3%B3n+E10-100,+170138+Quito/@-0.1632772,-78.4766773,15z';

export default function ContactanosScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const router    = useRouter();

  // Valores animados para la entrada del logotipo:
  // - logoOpacity: de 0 (invisible) a 1 (visible)
  // - logoScale: de 0.6 (pequeño) a 1.0 (tamaño real) con efecto spring
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.6)).current;

  // Dispara la animación del logo al montar el componente
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale,   { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  // Navega al index pasando el parámetro scrollTo='cards' para ir directo a las cards del carrusel
  const handleScrollToAbout = () => {
    router.push({ pathname: '/(tabs)' as any, params: { scrollTo: 'cards' } });
  };

  // Navega al inicio del index (scroll al top)
  const handleScrollToTop = () => {
    router.push('/(tabs)' as any);
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
            source={require('../../assets/images/logotipo.jpeg')}
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

        {/*UBICACIÓN DEL TALLER */}
        <View style={styles.section}>
          <Text style={styles.locationTitle}>Ubicación Mecánica</Text>
          <Text style={styles.locationAddress}>
            SM Quality Tires{'\n'}
            Av. Río Coca y Isla Pinzón E10-100{'\n'}
            Quito, Ecuador
          </Text>

          {/* Mapa nativo embebido con react-native-maps
              scrollEnabled/zoomEnabled/pitchEnabled/rotateEnabled permiten manipular el mapa */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: TALLER_LAT,
              longitude: TALLER_LNG,
              latitudeDelta: 0.008,  // Zoom cercano
              longitudeDelta: 0.008,
            }}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            zoomControlEnabled={true}
          >
            {/* Marcador en la ubicación exacta del taller */}
            <Marker
              coordinate={{ latitude: TALLER_LAT, longitude: TALLER_LNG }}
              title="SM Quality Tires"
              description="Av. Río Coca y Isla Pinzón E10-100, Quito"
            />
          </MapView>

          {/* Botón que abre Google Maps con la ruta al taller
              Blanco en reposo → azul al presionar */}
          <Pressable
            style={({ pressed }) => [styles.mapsButton, pressed && styles.mapsButtonPressed]}
            onPress={() => Linking.openURL(MAPS_URL)}
          >
            {({ pressed }) => (
              <View style={styles.mapsButtonContent}>
                <FontAwesome
                  name="map-marker"
                  size={20}
                  color={pressed ? '#000000' : '#FFFFFF'}
                  style={styles.mapsButtonIcon}
                />
                <Text style={[styles.mapsButtonText, pressed && styles.mapsButtonTextPressed]}>
                  Abrir Google Maps
                </Text>
              </View>
            )}
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}
