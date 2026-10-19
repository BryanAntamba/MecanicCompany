import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// GET /api/personal-financiero
export async function listarFinanciero(_req: Request, res: Response): Promise<void> {
    try {
        const personal = await prisma.personalFinanciero.findMany({
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
        console.error('[listarFinanciero]', err?.message);
        res.status(500).json({ message: 'Error al obtener el personal financiero' });
    }
}

// POST /api/personal-financiero
export async function crearFinanciero(req: Request, res: Response): Promise<void> {
    try {
        const { nombres, apellidos, correo, correoEmpresarial, telefono, contrasena, fotoPerfil } = req.body;

        const correoNorm = correo.trim().toLowerCase();
        const correoEmpresarialNorm = correoEmpresarial.trim().toLowerCase();

        // Validar si el correo personal ya existe
        const existeCorreo = await prisma.personalFinanciero.findUnique({
            where: { correo: correoNorm },
        });

        if (existeCorreo) {
            res.status(400).json({ message: 'El correo personal ya está registrado' });
            return;
        }

        // Validar si el correo empresarial ya existe
        const existeCorreoEmpresarial = await prisma.personalFinanciero.findUnique({
            where: { correoEmpresarial: correoEmpresarialNorm },
        });

        if (existeCorreoEmpresarial) {
            res.status(400).json({ message: 'El correo empresarial ya está registrado' });
            return;
        }

        const hash = await bcrypt.hash(contrasena, 12);

        const personal = await prisma.personalFinanciero.create({
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
        console.error('[crearFinanciero]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al crear personal financiero' });
    }
}

// PUT /api/personal-financiero/:id
export async function actualizarFinanciero(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { nombres, apellidos, edad, telefono, correo, correoEmpresarial, contrasena, fotoPerfil } = req.body;

        // Validar que el personal financiero existe
        const personalExistente = await prisma.personalFinanciero.findUnique({ where: { id } });
        if (!personalExistente) {
            res.status(404).json({ message: 'Personal Financiero no encontrado' });
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
            const existe = await prisma.personalFinanciero.findUnique({
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
            const existe = await prisma.personalFinanciero.findUnique({
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

        const personal = await prisma.personalFinanciero.update({
            where: { id },
            data,
        });

        const { contrasena: _c, ...personalPublico } = personal;
        res.json(personalPublico);
    } catch (err: any) {
        console.error('[actualizarFinanciero]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al actualizar personal financiero' });
    }
}

// DELETE /api/personal-financiero/:id
export async function eliminarFinanciero(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        await prisma.personalFinanciero.delete({ where: { id } });
        res.json({ message: 'Personal financiero eliminado correctamente' });
    } catch (err: any) {
        console.error('[eliminarFinanciero]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al eliminar personal financiero' });
    }
}

// PATCH /api/personal-financiero/:id/estado
export async function cambiarEstadoFinanciero(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { cuentaActiva } = req.body;

        const personal = await prisma.personalFinanciero.update({
            where: { id },
            data: { cuentaActiva: Boolean(cuentaActiva) },
        });

        const { contrasena: _c, ...personalPublico } = personal;
        res.json(personalPublico);
    } catch (err: any) {
        console.error('[cambiarEstadoFinanciero]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al cambiar estado' });
    }
}
