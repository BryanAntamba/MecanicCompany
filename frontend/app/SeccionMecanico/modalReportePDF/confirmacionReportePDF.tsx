// confirmacionReportePDF.tsx
// Modal de confirmación para generar documento de autorización de mantenimiento

import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, Text, View, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import { generarPDFAutorizacion } from '@/utils/generarPDFAutorizacion';

interface ConfirmacionReportePDFProps {
  visible: boolean;
  solicitud: any | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ConfirmacionReportePDF({
  visible,
  solicitud,
  onCancelar,
  onConfirmar,
}: ConfirmacionReportePDFProps) {
  const [generando, setGenerando] = useState(false);

  // Debug log
  useEffect(() => {
    console.log('====================================');
    console.log('ConfirmacionReportePDF - visible:', visible);
    console.log('ConfirmacionReportePDF - solicitud:', solicitud);
    console.log('====================================');
  }, [visible, solicitud]);

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

  const handleGenerar = async () => {
    if (!solicitud) {
      Alert.alert('Error', 'No hay datos de solicitud disponibles');
      return;
    }

    try {
      setGenerando(true);

      // Debug: verificar datos de la solicitud
      console.log('=== DATOS DE SOLICITUD ===');
      console.log('ID:', solicitud.id);
      console.log('Nombre Cliente:', solicitud.nombreCliente);
      console.log('Teléfono:', solicitud.telefono);
      console.log('Correo:', solicitud.correo);
      console.log('Correo Cliente:', solicitud.correoCliente);
      console.log('Correo (correo):', (solicitud as any).correo);
      console.log('Correo (correoCliente):', (solicitud as any).correoCliente);
      console.log('Correo (email):', (solicitud as any).email);
      console.log('Descripción:', solicitud.descripcion);
      console.log('Descripción Problema:', solicitud.descripcionProblema);
      console.log('Objeto completo:', JSON.stringify(solicitud, null, 2));

      // Generar PDF con los datos de la solicitud
      const datosParaPDF = {
        id: solicitud.id || 'N/A',
        nombreCliente: solicitud.nombreCliente || 'Cliente',
        telefono: solicitud.telefono || 'N/A',
        correo: (solicitud as any).correoCliente || (solicitud as any).correo || (solicitud as any).email || 'N/A',
        marca: solicitud.marca || 'N/A',
        modelo: solicitud.modelo || 'N/A',
        anio: solicitud.anio || 'N/A',
        placa: solicitud.placa || 'N/A',
        kilometraje: solicitud.kilometraje || 'N/A',
        tipoServicio: solicitud.tipoServicio || 'N/A',
        descripcion: (solicitud as any).descripcionProblema || (solicitud as any).descripcion || 'Sin descripción',
        fechaCita: solicitud.fechaCita,
        horaCita: solicitud.horaCita,
        provincia: solicitud.provincia,
        ubicacionMecanica: solicitud.ubicacionMecanica,
      };

      console.log('=== DATOS ENVIADOS AL PDF ===');
      console.log('Correo que se enviará:', datosParaPDF.correo);
      console.log('Descripción que se enviará:', datosParaPDF.descripcion);

      await generarPDFAutorizacion(datosParaPDF);

      // Llamar al callback de confirmación
      onConfirmar();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el documento de autorización');
    } finally {
      setGenerando(false);
    }
  };

  console.log('ConfirmacionReportePDF - Renderizando modal');

  if (!visible) {
    console.log('Modal NO visible, retornando null');
    return null;
  }

  console.log('Modal VISIBLE, renderizando contenido');

  return (
    <Modal visible={true} transparent={true} animationType="fade" onRequestClose={onCancelar}>
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
          padding: 20,
          width: '100%',
          maxWidth: 500,
        }}>
          {/* Botón X para cerrar */}
          <Pressable 
            onPress={() => {
              console.log('Botón X presionado');
              onCancelar();
            }} 
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#DC2626',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-end',
              marginBottom: 8,
            }}
          >
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </Pressable>

          {/* Título */}
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#F1F5F9',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Generar Autorización
          </Text>
          
          <Text style={{
            fontSize: 15,
            color: '#CBD5E1',
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 22,
          }}>
            ¿Desea generar el documento de autorización del mantenimiento de la solicitud generada por el cliente{' '}
            <Text style={{ fontWeight: '700', color: '#3B82F6' }}>
              {solicitud?.nombreCliente || 'N/A'}
            </Text>{' '}listo para imprimir y firmar la autorización del proceso?
          </Text>

          {/* Descripción del documento */}
          <View style={{
            backgroundColor: '#0F172A',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            alignItems: 'center',
          }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#1E293B',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <FontAwesome name="file-text-o" size={32} color="#3B82F6" />
            </View>
            <Text style={{
              fontSize: 14,
              color: '#94A3B8',
              textAlign: 'center',
              lineHeight: 20,
            }}>
              El documento incluirá todos los detalles de la solicitud de mantenimiento y un espacio para 
              la firma de autorización del cliente.
            </Text>
          </View>

          {/* Botones */}
          <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginTop: 8 }}>
            {/* Botón Cancelar */}
            <Pressable
              onPress={onCancelar}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: pressed ? '#E2E8F0' : '#FFFFFF',
                borderRadius: 6,
                paddingVertical: 14,
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FontAwesome 
                    name="times" 
                    size={16} 
                    color={pressed ? '#1E293B' : '#000000'} 
                  />
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '800',
                    color: pressed ? '#1E293B' : '#000000',
                    letterSpacing: 1,
                  }}>
                    CANCELAR
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Botón Generar */}
            <Pressable
              onPress={handleGenerar}
              disabled={generando}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: generando ? '#94A3B8' : (pressed ? '#2563EB' : '#3B82F6'),
                borderRadius: 6,
                paddingVertical: 14,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: generando ? 0.7 : 1,
              })}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {generando ? (
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '800',
                      color: '#FFFFFF',
                      letterSpacing: 1,
                    }}>
                      GENERANDO...
                    </Text>
                  ) : (
                    <>
                      <FontAwesome 
                        name="check" 
                        size={16} 
                        color={pressed ? '#F1F5F9' : '#FFFFFF'} 
                      />
                      <Text style={{
                        fontSize: 15,
                        fontWeight: '800',
                        color: pressed ? '#F1F5F9' : '#FFFFFF',
                        letterSpacing: 1,
                      }}>
                        GENERAR
                      </Text>
                    </>
                  )}
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

