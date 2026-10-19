import React, { useEffect } from 'react';
import { Modal, Platform, View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaInventario/modalesInventario/confirmacionEliminacion/confirmarEliminacion';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirmar: () => void;
  producto: any | null;
}

function ConfirmarEliminacion({ visible, onClose, onConfirmar, producto }: Props) {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [visible]);

  if (!producto) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Icono de advertencia */}
          <View style={styles.iconContainer}>
            <FontAwesome name="exclamation-triangle" size={40} color="#FFFFFF" />
          </View>

          {/* Título */}
          <Text style={styles.title}>Confirmar Eliminación</Text>

          {/* Mensaje */}
          <Text style={styles.message}>
            ¿Estás seguro de eliminar el siguiente producto?{'\n'}
            <Text style={styles.nombreDestacado}>{producto.nombre}</Text>
          </Text>

          <Text style={styles.advertencia}>
            Esta acción no se puede deshacer.
          </Text>

          {/* Botones */}
          <View style={styles.botonesContainer}>
            {/* Botón Cancelar */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.btnCancelar,
                pressed && styles.btnCancelarPressed,
              ]}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesome 
                    name="times-circle" 
                    size={16} 
                    color={pressed ? '#1E293B' : '#000000'}
                  />
                  <View style={{ width: 8 }} />
                  <Text style={[styles.btnCancelarText, pressed && styles.btnCancelarTextPressed]}>
                    CANCELAR
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Botón Eliminar */}
            <Pressable
              onPress={onConfirmar}
              style={({ pressed }) => [
                styles.btnEliminar,
                pressed && styles.btnEliminarPressed,
              ]}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesome 
                    name="trash" 
                    size={16} 
                    color={pressed ? '#FCA5A5' : '#FFFFFF'}
                  />
                  <View style={{ width: 8 }} />
                  <Text style={[styles.btnEliminarText, pressed && styles.btnEliminarTextPressed]}>
                    ELIMINAR
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmarEliminacion;
