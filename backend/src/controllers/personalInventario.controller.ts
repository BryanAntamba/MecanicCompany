import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// GET /api/personal-inventario
export async function listarInventario(_req: Request, res: Response): Promise<void> {
    try {
        const personal = await prisma.personalInventario.findMany({
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                correoEmpresarial: true,
                telefono: true,
                cuentaActiva: true,
                fotoPerfil: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(personal);
    } catch (err: any) {
        console.error('[listarInventario]', err?.message);
        res.status(500).json({ message: 'Error al obtener el personal de inventario' });
    }
}

// POST /api/personal-inventario
export async function crearInventario(req: Request, res: Response): Promise<void> {
    try {
        const { nombres, apellidos, correo, correoEmpresarial, telefono, contrasena, fotoPerfil } = req.body;

        const correoNorm = correo.trim().toLowerCase();
        const correoEmpresarialNorm = correoEmpresarial.trim().toLowerCase();

        // Validar si el correo personal ya existe
        const existeCorreo = await prisma.personalInventario.findUnique({
            where: { correo: correoNorm },
        });

        if (existeCorreo) {
            res.status(400).json({ message: 'El correo personal ya está registrado' });
            return;
        }

        // Validar si el correo empresarial ya existe
        const existeCorreoEmpresarial = await prisma.personalInventario.findUnique({
            where: { correoEmpresarial: correoEmpresarialNorm },
        });

        if (existeCorreoEmpresarial) {
            res.status(400).json({ message: 'El correo empresarial ya está registrado' });
            return;
        }

        const hash = await bcrypt.hash(contrasena, 12);

        const personal = await prisma.personalInventario.create({
            data: {
                nombres,
                apellidos,
                correo: correoNorm,
                correoEmpresarial: correoEmpresarialNorm,
                telefono: telefono || null,
                contrasena: hash,
                fotoPerfil: fotoPerfil || null,
            },
        });

        const { contrasena: _c, ...personalPublico } = personal;
        res.status(201).json(personalPublico);
    } catch (err: any) {
        console.error('[crearInventario]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al crear personal de inventario' });
    }
}

// PUT /api/personal-inventario/:id
export async function actualizarInventario(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { nombres, apellidos, edad, telefono, correo, correoEmpresarial, contrasena, fotoPerfil } = req.body;

        // Validar que el personal inventario existe
        const personalExistente = await prisma.personalInventario.findUnique({ where: { id } });
        if (!personalExistente) {
            res.status(404).json({ message: 'Personal Inventario no encontrado' });
            return;
        }

        // Validar que haya al menos un campo para actualizar
        if (!nombres && !apellidos && !edad && !telefono && !correo && !correoEmpresarial && !contrasena && !fotoPerfil) {
            res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
            return;
        }

        // Validar si el correo personal ya existe en otro
        if (correo) {
            const correoNorm = correo.trim().toLowerCase();
            const existe = await prisma.personalInventario.findUnique({
                where: { correo: correoNorm },
            });
            if (existe && existe.id !== id) {
                res.status(400).json({ message: 'El correo personal ya está registrado en otro usuario' });
                return;
            }
        }

        // Validar si el correo empresarial ya existe en otro
        if (correoEmpresarial) {
            const correoEmpNorm = correoEmpresarial.trim().toLowerCase();
            const existe = await prisma.personalInventario.findUnique({
                where: { correoEmpresarial: correoEmpNorm },
            });
            if (existe && existe.id !== id) {
                res.status(400).json({ message: 'El correo empresarial ya está registrado en otro usuario' });
                return;
            }
        }

        const data: Record<string, unknown> = {
            ...(nombres && { nombres }),
            ...(apellidos && { apellidos }),
            ...(edad !== undefined && { edad: edad ? Number(edad) : null }),
            ...(telefono !== undefined && { telefono: telefono || null }),
            ...(correo && { correo: correo.trim().toLowerCase() }),
            ...(correoEmpresarial && { correoEmpresarial: correoEmpresarial.trim().toLowerCase() }),
        };

        if (contrasena && contrasena.trim()) {
            data.contrasena = await bcrypt.hash(contrasena, 12);
        }

        if (fotoPerfil !== undefined) {
            data.fotoPerfil = fotoPerfil || null;
        }

        const personal = await prisma.personalInventario.update({
            where: { id },
            data,
        });

        const { contrasena: _c, ...personalPublico } = personal;
        res.json(personalPublico);
    } catch (err: any) {
        console.error('[actualizarInventario]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al actualizar personal de inventario' });
    }
}

// DELETE /api/personal-inventario/:id
export async function eliminarInventario(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        await prisma.personalInventario.delete({ where: { id } });
        res.json({ message: 'Personal de inventario eliminado correctamente' });
    } catch (err: any) {
        console.error('[eliminarInventario]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al eliminar personal de inventario' });
    }
}

// PATCH /api/personal-inventario/:id/estado
export async function cambiarEstadoInventario(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { cuentaActiva } = req.body;

        const personal = await prisma.personalInventario.update({
            where: { id },
            data: { cuentaActiva: Boolean(cuentaActiva) },
        });

        const { contrasena: _c, ...personalPublico } = personal;
        res.json(personalPublico);
    } catch (err: any) {
        console.error('[cambiarEstadoInventario]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al cambiar estado' });
    }
}
