// visualizarPago.tsx
// Modal para visualizar detalles de un pago registrado (basado en registrarPago.tsx)

import { useEffect } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, View, Alert, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import * as FileSystem from '@/utils/fileSystem';
import * as Sharing from '@/utils/sharing';
import * as Print from 'expo-print';
import styles from '@/Styles/pantallaFinanciero/modalesHistorial/visualizarPago';

interface VisualizarPagoProps {
  visible: boolean;
  pago: any | null;
  onClose: () => void;
}

export default function VisualizarPago({
  visible,
  pago,
  onClose,
}: VisualizarPagoProps) {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [visible]);

  if (!pago) return null;

  const handleDescargarComprobante = async () => {
    if (!pago.comprobanteUri) {
      Alert.alert('Error', 'No hay comprobante disponible');
      return;
    }

    try {
      if (Platform.OS === 'web') {
        // En web, convertir la imagen a PDF antes de descargar
        if (pago.comprobanteUri.startsWith('data:image')) {
          // Cargar jsPDF dinámicamente desde CDN solo cuando se necesita
          if (!(window as any).jspdf) {
            // Cargar jsPDF desde CDN
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('No se pudo cargar jsPDF'));
              document.head.appendChild(script);
            });
          }
          
          const { jsPDF } = (window as any).jspdf;
          
          // Cargar la imagen para obtener dimensiones
          const img = new Image();
          img.src = pago.comprobanteUri;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Crear PDF con orientación automática
          const orientation = img.width > img.height ? 'landscape' : 'portrait';
          const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [img.width, img.height]
          });

          // Agregar la imagen al PDF
          pdf.addImage(
            pago.comprobanteUri,
            'JPEG',
            0,
            0,
            img.width,
            img.height
          );

          // Descargar el PDF
          pdf.save(`Comprobante_${pago.clienteNombre.replace(/\s+/g, '_')}_${pago.id || 'pago'}.pdf`);
          
          Alert.alert('Éxito', 'Comprobante descargado correctamente');
        } else {
          // Es un PDF existente, descargar directamente
          const link = document.createElement('a');
          link.href = pago.comprobanteUri;
          link.download = `Comprobante_${pago.clienteNombre.replace(/\s+/g, '_')}_${pago.id || 'pago'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          Alert.alert('Éxito', 'Comprobante descargado correctamente');
        }
      } else {
        // En móvil, compartir el comprobante (PDF o imagen)
        await Sharing.shareAsync(pago.comprobanteUri, {
          mimeType: pago.comprobanteUri.startsWith('data:image') ? 'image/jpeg' : 'application/pdf',
          dialogTitle: 'Compartir Comprobante de Pago',
          UTI: pago.comprobanteUri.startsWith('data:image') ? 'public.jpeg' : 'com.adobe.pdf'
        });
      }
    } catch (error) {
      console.error('Error al descargar comprobante:', error);
      Alert.alert('Error', 'No se pudo descargar el comprobante');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>DETALLE DEL PAGO</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              hitSlop={8}
            >
              <FontAwesome name="times" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* INFORMACIÓN DEL CLIENTE */}
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>INFORMACIÓN DEL CLIENTE</Text>

            <Text style={styles.pagoNombre}>{pago.clienteNombre}</Text>
            <Text style={styles.pagoMeta}>Tel: {pago.clienteTelefono}</Text>
            <Text style={styles.pagoMeta}>{pago.clienteCorreo}</Text>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>INFORMACIÓN DEL VEHÍCULO</Text>
            <Text style={styles.pagoMeta}>
              {pago.marca} {pago.modelo} - Placa: {pago.placa}
            </Text>
            <Text style={styles.pagoMeta}>Año: {pago.anio}</Text>
            <Text style={styles.pagoMeta}>Kilometraje: {pago.kilometraje} km</Text>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>INFORMACIÓN DEL SERVICIO</Text>
            <Text style={styles.pagoMeta}>Servicio: {pago.servicio}</Text>
            <Text style={styles.pagoMeta}>Mecánico: {pago.mecanico}</Text>

            {/* DETALLE DEL MANTENIMIENTO */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>DETALLE DEL MANTENIMIENTO</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Repuestos</Text>
              <Text style={styles.detailValue}>${pago.costoRepuestos.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mano de obra</Text>
              <Text style={styles.detailValue}>${pago.costoManoObra.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            {/* TOTAL */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL PAGADO</Text>
              <Text style={styles.totalValue}>${pago.total.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            {/* INFORMACIÓN DEL PAGO */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>INFORMACIÓN DEL PAGO</Text>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Método de pago:</Text>
              <Text style={styles.infoValue}>{pago.metodoPago}</Text>
            </View>

            {/* Botón para descargar comprobante (solo si es TRANSFERENCIA y tiene comprobante) */}
            {pago.metodoPago === 'TRANSFERENCIA' && pago.comprobanteUri && (
              <Pressable
                style={({ pressed }) => [
                  styles.downloadButton,
                  pressed && styles.downloadButtonPressed
                ]}
                onPress={handleDescargarComprobante}
              >
                <FontAwesome name="download" size={16} color="#FFFFFF" />
                <Text style={styles.downloadButtonText}>Descargar Comprobante</Text>
              </Pressable>
            )}

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Fecha de pago:</Text>
              <Text style={styles.infoValue}>{pago.fechaPago || pago.fecha}</Text>
            </View>

            {pago.observacion && (
              <View style={styles.infoField}>
                <Text style={styles.infoLabel}>Observación:</Text>
                <Text style={styles.infoValue}>{pago.observacion}</Text>
              </View>
            )}

            {/* Botón CERRAR */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtnBottom, pressed && styles.closeBtnBottomPressed]}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FontAwesome name="times-circle" size={16} color={pressed ? '#FFFFFF' : '#000000'} />
                  <Text style={[styles.closeBtnBottomText, pressed && styles.closeBtnBottomTextPressed]}>
                    CERRAR
                  </Text>
                </View>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
