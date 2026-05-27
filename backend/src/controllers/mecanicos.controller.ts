import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// GET /api/mecanicos
export async function listarMecanicos(_req: Request, res: Response): Promise<void> {
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
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    res.json(mecanicos);
}

// POST /api/mecanicos
export async function crearMecanico(req: Request, res: Response): Promise<void> {
    const {
        nombres, apellidos, edad, correo, correoEmpresarial,
        especialidad, anosExperiencia, contrasena,
    } = req.body;

    const hash = await bcrypt.hash(contrasena, 12);

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
        },
    });

    const { contrasena: _c, ...mecanicoPublico } = mecanico;
    res.status(201).json(mecanicoPublico);
}

// PUT /api/mecanicos/:id
export async function actualizarMecanico(req: Request, res: Response): Promise<void> {
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

    const mecanico = await prisma.mecanico.update({ where: { id }, data });

    const { contrasena: _c2, ...mecanicoPublico } = mecanico;
    res.json(mecanicoPublico);
}

// DELETE /api/mecanicos/:id
export async function eliminarMecanico(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await prisma.mecanico.delete({ where: { id } });

    res.json({ message: 'Mecánico eliminado correctamente' });
}

// PATCH /api/mecanicos/:id/estado
export async function cambiarEstadoCuenta(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { cuentaActiva } = req.body;

    const mecanico = await prisma.mecanico.update({
        where: { id },
        data: { cuentaActiva: Boolean(cuentaActiva) },
        select: { id: true, nombres: true, apellidos: true, cuentaActiva: true },
    });

    res.json(mecanico);
}
