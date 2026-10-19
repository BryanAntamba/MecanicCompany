// reporteExistoso.tsx
// Modal que confirma el envío exitoso del reporte de soporte

import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaCliente/modalConfirmacionSoporte/reporteExitoso';

interface ReporteExitosoProps {
  visible: boolean;
  onCerrar: () => void;
  message?: string;
}

const ReporteExitoso: React.FC<ReporteExitosoProps> = ({ 
  visible, 
  onCerrar, 
  message = 'Tu reporte fue enviado exitosamente. Nos pondremos en contacto contigo lo antes posible.' 
}) => {
  // Determinar si es un error o éxito por el contenido del mensaje
  const isError = message.toLowerCase().includes('error');
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <FontAwesome name={isError ? "exclamation-circle" : "check"} size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{isError ? 'Error al Enviar' : 'Reporte Enviado'}</Text>
          <Text style={styles.message}>
            {message}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
            onPress={onCerrar}
          >
            {({ pressed }) => (
              <View style={styles.buttonContent}>
                <FontAwesome 
                  name="times-circle" 
                  size={18} 
                  color={pressed ? '#FFFFFF' : '#000000'} 
                  style={styles.buttonIcon}
                />
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
};

export default ReporteExitoso;
