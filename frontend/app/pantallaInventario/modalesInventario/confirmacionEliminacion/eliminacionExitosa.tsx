import React, { useEffect } from 'react';
import { Modal, Platform, View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaInventario/modalesInventario/confirmacionEliminacion/eliminacionExitosa';

interface Props {
  visible: boolean;
  onClose: () => void;
  nombreProducto: string;
}

function EliminacionExitosa({ visible, onClose, nombreProducto }: Props) {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Icono de éxito */}
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>

          {/* Título */}
          <Text style={styles.title}>Producto Eliminado</Text>
          
          {/* Mensaje */}
          <Text style={styles.message}>
            El producto{'\n'}
            <Text style={styles.nombreDestacado}>{nombreProducto}</Text>
            {'\n'}fue eliminado exitosamente del inventario.
          </Text>

          {/* Botón */}
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed
            ]}
            onPress={onClose}
          >
            {({ pressed }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome 
                  name="times-circle" 
                  size={18} 
                  color={pressed ? '#FFFFFF' : '#000000'}
                />
                <View style={{ width: 8 }} />
                <Text style={[styles.closeButtonText, pressed && styles.closeButtonTextPressed]}>
                  CERRAR
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default EliminacionExitosa;
