// reporteExitoso.tsx
// Modal de éxito tras generar el documento de autorización

import { useEffect } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';

interface ReporteExitosoProps {
  visible: boolean;
  nombreCliente: string;
  onCerrar: () => void;
}

export default function ReporteExitoso({
  visible,
  nombreCliente,
  onCerrar,
}: ReporteExitosoProps) {
  // Debug log
  useEffect(() => {
    console.log('ReporteExitoso - visible:', visible);
    console.log('ReporteExitoso - nombreCliente:', nombreCliente);
  }, [visible, nombreCliente]);

  // Bloquear capturas de pantalla cuando el modal está visible (solo en móvil)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    
    if (visible) {
      const preventCapture = async () => {
        await ScreenCapture.preventScreenCaptureAsync();
      };
      preventCapture();
    }
  }, [visible]);

  console.log('ReporteExitoso - Renderizando modal');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: '#1E293B',
          borderRadius: 16,
          padding: 32,
          width: '100%',
          maxWidth: 400,
          alignItems: 'center',
        }}>
          {/* Icono de éxito */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#10B981',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>

          {/* Título */}
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Autorización Generada
          </Text>

          {/* Mensaje */}
          <Text style={{
            fontSize: 16,
            color: '#CBD5E1',
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 24,
          }}>
            El documento de autorización de mantenimiento{'\n'}
            fue generado exitosamente para:
          </Text>

          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {nombreCliente}
          </Text>

          <Text style={{
            fontSize: 14,
            color: '#94A3B8',
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20,
          }}>
            El documento está listo para ser impreso y firmado por el cliente.
          </Text>

          {/* Botón Cerrar */}
          <Pressable
            onPress={onCerrar}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#2563EB' : '#FFFFFF',
              borderRadius: 6,
              paddingVertical: 14,
              paddingHorizontal: 32,
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            })}
          >
            {({ pressed }) => (
              <>
                <FontAwesome name="times-circle" size={16} color={pressed ? '#FFFFFF' : '#000000'} />
                <Text style={{
                  fontSize: 15,
                  fontWeight: '800',
                  color: pressed ? '#FFFFFF' : '#000000',
                  letterSpacing: 1,
                }}>
                  CERRAR
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
