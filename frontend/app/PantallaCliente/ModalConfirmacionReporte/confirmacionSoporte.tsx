// confirmacionSoporte.tsx
// Modal de confirmación que muestra los datos del reporte antes de enviarlo

import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaCliente/modalConfirmacionSoporte/confirmacionSoporte';

interface ConfirmacionSoporteProps {
  visible: boolean;
  datos: {
    nombre: string;
    segundoNombre: string;
    apellido: string;
    segundoApellido: string;
    correo: string;
    tipoAsunto: string;
    descripcion: string;
  };
  onEnviar: () => void;
  onCerrar: () => void;
  isLoading?: boolean;
}

const ConfirmacionSoporte: React.FC<ConfirmacionSoporteProps> = ({
  visible,
  datos,
  onEnviar,
  onCerrar,
  isLoading = false,
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
          <Text style={styles.title}>Confirmar Reporte</Text>
          <Text style={styles.subtitle}>
            Verifica que los datos sean correctos antes de enviar
          </Text>

          <ScrollView style={styles.dataContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre:</Text>
              <Text style={styles.dataValue}>{datos.nombre}</Text>
            </View>

            {datos.segundoNombre && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Segundo Nombre:</Text>
                <Text style={styles.dataValue}>{datos.segundoNombre}</Text>
              </View>
            )}

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Apellido:</Text>
              <Text style={styles.dataValue}>{datos.apellido}</Text>
            </View>

            {datos.segundoApellido && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Segundo Apellido:</Text>
                <Text style={styles.dataValue}>{datos.segundoApellido}</Text>
              </View>
            )}

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Correo:</Text>
              <Text style={styles.dataValue}>{datos.correo}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Tipo de Asunto:</Text>
              <Text style={styles.dataValue}>{datos.tipoAsunto}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Descripción:</Text>
              <Text style={styles.dataValue}>{datos.descripcion}</Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                pressed && !isLoading && styles.sendButtonPressed,
                isLoading && { opacity: 0.6 },
              ]}
              onPress={onEnviar}
              disabled={isLoading}
            >
              {({ pressed }) => (
                <View style={styles.buttonContent}>
                  <FontAwesome 
                    name={isLoading ? "spinner" : "paper-plane"} 
                    size={18} 
                    color={pressed && !isLoading ? '#E0E7FF' : '#FFFFFF'} 
                    style={[styles.buttonIcon, isLoading && { animation: 'spin' }]}
                  />
                  <Text style={[styles.sendButtonText, pressed && !isLoading && styles.sendButtonTextPressed]}>
                    {isLoading ? 'ENVIANDO...' : 'ENVIAR REPORTE'}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
                isLoading && { opacity: 0.6 },
              ]}
              onPress={onCerrar}
              disabled={isLoading}
            >
              {({ pressed }) => (
                <View style={styles.buttonContent}>
                  <FontAwesome 
                    name="times-circle" 
                    size={18} 
                    color={pressed ? '#CBD5E1' : '#F1F5F9'} 
                    style={styles.buttonIcon}
                  />
                  <Text style={[styles.cancelButtonText, pressed && styles.cancelButtonTextPressed]}>
                    CANCELAR
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmacionSoporte;
