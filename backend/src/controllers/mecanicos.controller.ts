import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// GET /api/mecanicos
export async function listarMecanicos(_req: Request, res: Response): Promise<void> {
    try {
        const mecanicos = await prisma.mecanico.findMany({
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                edad: true,
                correo: true,
                correoEmpresarial: true,
                especialidad: true,
                anosExperiencia: true,
                estadoLaboral: true,
                cuentaActiva: true,
                fotoPerfil: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(mecanicos);
    } catch (err: any) {
        console.error('[listarMecanicos]', err?.message);
        res.status(500).json({ message: 'Error al obtener los mecánicos' });
    }
}

// POST /api/mecanicos
export async function crearMecanico(req: Request, res: Response): Promise<void> {
    try {
        const {
            nombres, apellidos, edad, correo, correoEmpresarial,
            especialidad, anosExperiencia, contrasena,
        } = req.body;

        const hash = await bcrypt.hash(contrasena, 12);

        // fotoPerfil llega como string base64 (data URI) desde el frontend
        const fotoPerfil = req.body.fotoPerfil ?? null;

        const mecanico = await prisma.mecanico.create({
            data: {
                nombres,
                apellidos,
                edad: Number(edad),
                correo: correo.trim().toLowerCase(),
                correoEmpresarial: correoEmpresarial.trim().toLowerCase(),
                especialidad,
                anosExperiencia: Number(anosExperiencia),
                contrasena: hash,
                ...(fotoPerfil && { fotoPerfil }),
            },
        });

        const { contrasena: _c, ...mecanicoPublico } = mecanico;
        res.status(201).json(mecanicoPublico);
    } catch (err: any) {
        console.error('[crearMecanico]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al crear el mecánico' });
    }
}

// PUT /api/mecanicos/:id
export async function actualizarMecanico(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const {
            nombres, apellidos, edad, correo, correoEmpresarial,
            especialidad, anosExperiencia, estadoLaboral, contrasena,
        } = req.body;

        const data: Record<string, unknown> = {
            nombres, apellidos, edad: Number(edad), correo, correoEmpresarial,
            especialidad, anosExperiencia: Number(anosExperiencia), estadoLaboral,
        };

        if (contrasena) {
            data.contrasena = await bcrypt.hash(contrasena, 12);
        }

        // fotoPerfil llega como string base64 (data URI) — si viene en el body, actualiza
        if (req.body.fotoPerfil !== undefined) {
            data.fotoPerfil = req.body.fotoPerfil || null;
        }

        const mecanico = await prisma.mecanico.update({ where: { id }, data });

        const { contrasena: _c2, ...mecanicoPublico } = mecanico;
        res.json(mecanicoPublico);
    } catch (err: any) {
        console.error('[actualizarMecanico]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al actualizar el mecánico' });
    }
}

// DELETE /api/mecanicos/:id
export async function eliminarMecanico(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        await prisma.mecanico.delete({ where: { id } });
        res.json({ message: 'Mecánico eliminado correctamente' });
    } catch (err: any) {
        console.error('[eliminarMecanico]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al eliminar el mecánico' });
    }
}

// PATCH /api/mecanicos/:id/estado
export async function cambiarEstadoCuenta(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { cuentaActiva } = req.body;

        const mecanico = await prisma.mecanico.update({
            where: { id },
            data: { cuentaActiva: Boolean(cuentaActiva) },
            select: { id: true, nombres: true, apellidos: true, cuentaActiva: true },
        });

        res.json(mecanico);
    } catch (err: any) {
        console.error('[cambiarEstadoCuenta]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al cambiar el estado de la cuenta' });
    }
}
