/**
 * MapView para Web
 * Usa Google Maps embebido via iframe en lugar de react-native-maps
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Region extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapViewProps {
  style?: any;
  region?: Region;
  initialRegion?: Region;
  onRegionChangeComplete?: (region: Region) => void;
  children?: React.ReactNode;
}

interface MarkerProps {
  coordinate: Coordinates;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

// Componente MapView para web usando iframe de Google Maps
const MapView = React.forwardRef<any, MapViewProps>((props, ref) => {
  const { style, region, initialRegion } = props;
  
  const coords = region || initialRegion;
  const lat = coords?.latitude || 0;
  const lng = coords?.longitude || 0;
  
  // URL de Google Maps embebido
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=15`;

  React.useImperativeHandle(ref, () => ({
    animateToRegion: (region: Region) => {
      // En web no hacemos nada, el iframe es estático
      console.log('animateToRegion called on web (no-op):', region);
    },
  }));

  return (
    <View style={[styles.container, style]}>
      <iframe
        src={mapUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 0,
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </View>
  );
});

MapView.displayName = 'MapView';

// Componente Marker para web (se renderiza dentro del mapa de Google)
export const Marker: React.FC<MarkerProps> = () => {
  // En web, los marcadores los maneja Google Maps automáticamente
  // Este componente no necesita renderizar nada
  return null;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default MapView;
