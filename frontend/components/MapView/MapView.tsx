/**
 * MapView para móvil (iOS/Android)
 * Re-exporta react-native-maps sin modificaciones
 */

import RNMapView, { Marker as RNMarker } from 'react-native-maps';

export const Marker = RNMarker;
export default RNMapView;
