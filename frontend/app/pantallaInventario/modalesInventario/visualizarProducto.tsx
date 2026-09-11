import React, { useEffect } from 'react';
import {
  Modal, Platform, View, Text, ScrollView, Pressable
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaInventario/modalesInventario/visualizarProducto';
import { formatearNumeroConPuntos, formatearPrecioEspanol } from '@/utils/formatNumbers';
import { Producto } from '@/utils/datosSimulados';

interface Props {
  visible: boolean;
  onClose: () => void;
  producto: Producto;
}

function VisualizarProducto({ visible, onClose, producto }: Props) {
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
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Botón X para cerrar */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </Pressable>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={true}
          >
            {/* Título */}
            <Text style={styles.title}>Detalles del Producto</Text>

            {/* Badge del Estado */}
            <View style={[
              styles.estadoBadge,
              producto.activo ? styles.estadoBadgeActivo : styles.estadoBadgeInactivo,
            ]}>
              <Text style={styles.estadoBadgeText}>
                {producto.activo ? 'Activo' : 'Inactivo'}
              </Text>
            </View>

            {/* SECCIÓN: INFORMACIÓN DEL PRODUCTO */}
            <Text style={styles.sectionTitle}>Información del Producto</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre del Producto:</Text>
              <Text style={styles.value}>{producto.nombre}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Código / SKU:</Text>
              <Text style={styles.value}>{producto.codigoSKU}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Marca del Componente/Repuesto:</Text>
              <Text style={styles.value}>{producto.marcaComponente}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Categoría:</Text>
              <Text style={styles.value}>{producto.categoria}</Text>
            </View>

            {producto.numeroParteOEM && (
              <View style={styles.field}>
                <Text style={styles.label}>Número de Parte / OEM:</Text>
                <Text style={styles.value}>{producto.numeroParteOEM}</Text>
              </View>
            )}

            {producto.descripcion && (
              <View style={styles.field}>
                <Text style={styles.label}>Descripción:</Text>
                <Text style={styles.value}>{producto.descripcion}</Text>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Stock Actual:</Text>
              <Text style={[
                styles.value,
                producto.stockActual <= producto.stockCritico && styles.valueStockCritico,
                producto.stockActual <= producto.stockMinimo && producto.stockActual > producto.stockCritico && styles.valueStockBajo,
              ]}>
                {formatearNumeroConPuntos(producto.stockActual.toString())} {producto.unidadMedida}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Stock Mínimo:</Text>
              <Text style={styles.value}>{formatearNumeroConPuntos(producto.stockMinimo.toString())} {producto.unidadMedida}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Stock Crítico:</Text>
              <Text style={styles.value}>{formatearNumeroConPuntos(producto.stockCritico.toString())} {producto.unidadMedida}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Precio de Compra:</Text>
              <Text style={styles.value}>${formatearPrecioEspanol(producto.precioCompra)}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Precio de Venta:</Text>
              <Text style={styles.value}>${formatearPrecioEspanol(producto.precioVenta)}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Unidad de Medida:</Text>
              <Text style={styles.value}>{producto.unidadMedida}</Text>
            </View>

            {producto.ubicacionInventario && (
              <View style={styles.field}>
                <Text style={styles.label}>Ubicación en Inventario:</Text>
                <Text style={styles.value}>{producto.ubicacionInventario}</Text>
              </View>
            )}

            {/* SECCIÓN: COMPATIBILIDAD VEHICULAR */}
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Compatibilidad Vehicular</Text>

            {producto.compatibilidades && producto.compatibilidades.length > 0 ? (
              producto.compatibilidades.map((comp, index) => (
                <View key={comp.id || index} style={styles.compatibilidadCard}>
                  <View style={styles.compatibilidadRow}>
                    <Text style={styles.compatibilidadLabel}>Marca:</Text>
                    <Text style={styles.compatibilidadValue}>{comp.marca}</Text>
                  </View>
                  <View style={styles.compatibilidadRow}>
                    <Text style={styles.compatibilidadLabel}>Modelo:</Text>
                    <Text style={styles.compatibilidadValue}>{comp.modelo}</Text>
                  </View>
                  <View style={styles.compatibilidadRow}>
                    <Text style={styles.compatibilidadLabel}>Años:</Text>
                    <Text style={styles.compatibilidadValue}>
                      {comp.anoDesde} - {comp.anoHasta}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>Sin compatibilidades registradas</Text>
            )}

            {/* Botón CERRAR */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.closeBtnText, pressed && styles.closeBtnTextPressed]}>
                  CERRAR
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default VisualizarProducto;
