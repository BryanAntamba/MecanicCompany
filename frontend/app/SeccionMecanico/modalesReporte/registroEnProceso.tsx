// registroEnProceso.tsx
// Modal que confirma el guardado exitoso del registro de mantenimiento

import React, { useState } from 'react';
import { Modal, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaMecanico/modalesReporte/registroEnProceso';

interface RegistroEnProcesoProps {
  visible: boolean;
  onCerrar: () => void;
  onEnviarReporte?: () => void;
  isEnviando?: boolean;
}

const RegistroEnProceso: React.FC<RegistroEnProcesoProps> = ({ 
  visible, 
  onCerrar,
  onEnviarReporte,
  isEnviando = false 
}) => {
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
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Registro Guardado</Text>
          <Text style={styles.message}>
            Se guardaron los cambios del registro de mantenimiento exitosamente.
          </Text>
          
          {/* Botón ENVIAR REPORTE (si se proporciona callback) */}
          {onEnviarReporte && (
            <Pressable
              disabled={isEnviando}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: '#10B981', marginBottom: 8 },
                isEnviando && { opacity: 0.6 },
                pressed && !isEnviando && styles.closeButtonPressed,
              ]}
              onPress={onEnviarReporte}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {isEnviando ? (
                    <>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={[styles.closeButtonText, { color: '#FFFFFF' }]}>
                        ENVIANDO...
                      </Text>
                    </>
                  ) : (
                    <>
                      <FontAwesome name="send" size={16} color="#FFFFFF" />
                      <Text style={[styles.closeButtonText, { color: '#FFFFFF' }]}>
                        ENVIAR REPORTE
                      </Text>
                    </>
                  )}
                </View>
              )}
            </Pressable>
          )}

          {/* Botón CERRAR */}
          <Pressable
            disabled={isEnviando}
            style={({ pressed }) => [
              styles.closeButton,
              isEnviando && { opacity: 0.6 },
              pressed && !isEnviando && styles.closeButtonPressed,
            ]}
            onPress={onCerrar}
          >
            {({ pressed }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FontAwesome name="times-circle" size={16} color={pressed ? '#FFFFFF' : '#000000'} />
                <Text style={[styles.closeButtonText, pressed && !isEnviando && styles.closeButtonTextPressed]}>
                  {onEnviarReporte ? 'CERRAR SIN ENVIAR' : 'CERRAR'}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RegistroEnProceso;
