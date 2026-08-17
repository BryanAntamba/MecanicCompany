// confirmacionSoporte.tsx
// Modal de confirmación que muestra los datos del reporte antes de enviarlo

import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
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
}

const ConfirmacionSoporte: React.FC<ConfirmacionSoporteProps> = ({
  visible,
  datos,
  onEnviar,
  onCerrar,
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
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              onPress={onCerrar}
            >
              {({ pressed }) => (
                <Text style={[styles.cancelButtonText, pressed && styles.cancelButtonTextPressed]}>
                  Cancelar
                </Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                pressed && styles.sendButtonPressed,
              ]}
              onPress={onEnviar}
            >
              {({ pressed }) => (
                <Text style={[styles.sendButtonText, pressed && styles.sendButtonTextPressed]}>
                  Enviar Reporte
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmacionSoporte;
