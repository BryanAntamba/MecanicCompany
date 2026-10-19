// producto.controller.ts
// Controlador para gestión de productos en inventario

import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Crear nuevo producto
export async function crearProducto(req: Request, res: Response) {
  try {
    const {
      nombreProducto,
      codigoSKU,
      marcaComponente,
      categoria,
      numeroParteOEM,
      descripcion,
      stockActual,
      stockMinimo,
      stockCritico,
      precioCompra,
      precioVenta,
      ubicacion,
      unidadMedida,
      compatibilidades,
    } = req.body;

    // Validar campos obligatorios
    if (!nombreProducto || !codigoSKU || !marcaComponente || !categoria || !descripcion) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: nombreProducto, codigoSKU, marcaComponente, categoria, descripcion',
      });
    }

    // Validar que codigoSKU sea único
    const productoExistente = await prisma.producto.findUnique({
      where: { codigoSKU },
    });

    if (productoExistente) {
      return res.status(400).json({
        error: 'El código SKU ya existe',
      });
    }

    // Crear producto con compatibilidades
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombreProducto,
        codigoSKU,
        marcaComponente,
        categoria,
        numeroParteOEM: numeroParteOEM || '',
        descripcion,
        stockActual: parseInt(stockActual) || 0,
        stockMinimo: parseInt(stockMinimo) || 0,
        stockCritico: parseInt(stockCritico) || 0,
        precioCompra: parseFloat(precioCompra) || 0,
        precioVenta: parseFloat(precioVenta) || 0,
        ubicacion: ubicacion || '',
        unidadMedida: unidadMedida || 'Unidad',
        compatibilidades: {
          create: (compatibilidades || []).map((comp: any) => ({
            marca: comp.marca,
            modelo: comp.modelo,
            anoDesde: parseInt(comp.anoDesde),
            anoHasta: parseInt(comp.anoHasta),
          })),
        },
      },
      include: {
        compatibilidades: true,
      },
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: nuevoProducto,
    });
  } catch (error) {
    console.error('[PRODUCTO] Error al crear producto:', error);
    res.status(500).json({
      error: 'Error al crear el producto',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

// Obtener todos los productos
export async function obtenerProductos(req: Request, res: Response) {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        compatibilidades: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      message: 'Productos obtenidos exitosamente',
      cantidad: productos.length,
      productos,
    });
  } catch (error) {
    console.error('[PRODUCTO] Error al obtener productos:', error);
    res.status(500).json({
      error: 'Error al obtener los productos',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

// Obtener producto por ID
export async function obtenerProductoPorId(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        compatibilidades: true,
      },
    });

    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    res.json({
      message: 'Producto obtenido exitosamente',
      producto,
    });
  } catch (error) {
    console.error('[PRODUCTO] Error al obtener producto:', error);
    res.status(500).json({
      error: 'Error al obtener el producto',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

// Actualizar producto
export async function actualizarProducto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      nombreProducto,
      codigoSKU,
      marcaComponente,
      categoria,
      numeroParteOEM,
      descripcion,
      stockActual,
      stockMinimo,
      stockCritico,
      precioCompra,
      precioVenta,
      ubicacion,
      unidadMedida,
      compatibilidades,
    } = req.body;

    // Verificar que el producto existe
    const productoExistente = await prisma.producto.findUnique({
      where: { id },
    });

    if (!productoExistente) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    // Si cambió el SKU, verificar que sea único
    if (codigoSKU && codigoSKU !== productoExistente.codigoSKU) {
      const skuExistente = await prisma.producto.findUnique({
        where: { codigoSKU },
      });

      if (skuExistente) {
        return res.status(400).json({
          error: 'El código SKU ya existe',
        });
      }
    }

    // Actualizar compatibilidades: eliminar las antiguas y crear las nuevas
    await prisma.compatibilidadProducto.deleteMany({
      where: { productoId: id },
    });

    // Actualizar producto
    const productoActualizado = await prisma.producto.update({
      where: { id },
      data: {
        ...(nombreProducto && { nombreProducto }),
        ...(codigoSKU && { codigoSKU }),
        ...(marcaComponente && { marcaComponente }),
        ...(categoria && { categoria }),
        ...(numeroParteOEM !== undefined && { numeroParteOEM }),
        ...(descripcion && { descripcion }),
        ...(stockActual !== undefined && { stockActual: parseInt(stockActual) }),
        ...(stockMinimo !== undefined && { stockMinimo: parseInt(stockMinimo) }),
        ...(stockCritico !== undefined && { stockCritico: parseInt(stockCritico) }),
        ...(precioCompra !== undefined && { precioCompra: parseFloat(precioCompra) }),
        ...(precioVenta !== undefined && { precioVenta: parseFloat(precioVenta) }),
        ...(ubicacion && { ubicacion }),
        ...(unidadMedida && { unidadMedida }),
        ...(compatibilidades && {
          compatibilidades: {
            create: compatibilidades.map((comp: any) => ({
              marca: comp.marca,
              modelo: comp.modelo,
              anoDesde: parseInt(comp.anoDesde),
              anoHasta: parseInt(comp.anoHasta),
            })),
          },
        }),
      },
      include: {
        compatibilidades: true,
      },
    });

    res.json({
      message: 'Producto actualizado exitosamente',
      producto: productoActualizado,
    });
  } catch (error) {
    console.error('[PRODUCTO] Error al actualizar producto:', error);
    res.status(500).json({
      error: 'Error al actualizar el producto',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}

// Eliminar producto
export async function eliminarProducto(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Verificar que el producto existe
    const productoExistente = await prisma.producto.findUnique({
      where: { id },
    });

    if (!productoExistente) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    // Eliminar el producto (las compatibilidades se eliminarán automáticamente por cascada)
    await prisma.producto.delete({
      where: { id },
    });

    res.json({
      message: 'Producto eliminado exitosamente',
      productoEliminado: {
        id: productoExistente.id,
        nombreProducto: productoExistente.nombreProducto,
      },
    });
  } catch (error) {
    console.error('[PRODUCTO] Error al eliminar producto:', error);
    res.status(500).json({
      error: 'Error al eliminar el producto',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}
