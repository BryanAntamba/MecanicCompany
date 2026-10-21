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
                segundoNombre: true,
                apellidos: true,
                segundoApellido: true,
                edad: true,
                telefono: true,
                correo: true,
                correoEmpresarial: true,
                especialidad: true,
                anosExperiencia: true,
                estadoLaboral: true,
                cuentaActiva: true,
                fotoPerfil: true,
                tipoPersonal: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Mapear estadoLaboral a estadoConexion para compatibilidad con el frontend
        const mecanicosConEstado = mecanicos.map(m => ({
            ...m,
            estadoConexion: m.estadoLaboral === 'Disponible' ? 'DESCONECTADO' : 
                           m.estadoLaboral === 'Ocupado' ? 'LÍNEA' : 'DESCONECTADO'
        }));

        res.json(mecanicosConEstado);
    } catch (err: any) {
        console.error('[listarMecanicos]', err?.message);
        res.status(500).json({ message: 'Error al obtener los mecánicos' });
    }
}

// POST /api/mecanicos
export async function crearMecanico(req: Request, res: Response): Promise<void> {
    try {
        const {
            nombres, segundoNombre, apellidos, segundoApellido, edad, telefono,
            correo, correoEmpresarial, especialidad, anosExperiencia, contrasena,
        } = req.body;

        // Validar si el correoEmpresarial ya existe
        const correoEmpresarialNormalizado = correoEmpresarial.trim().toLowerCase();
        const existeCorreoEmpresarial = await prisma.mecanico.findUnique({
            where: { correoEmpresarial: correoEmpresarialNormalizado },
        });

        if (existeCorreoEmpresarial) {
            res.status(400).json({ 
                message: 'El correo empresarial ya está registrado' 
            });
            return;
        }

        // Validar si el correo personal ya existe
        const correoNormalizado = correo.trim().toLowerCase();
        const existeCorreo = await prisma.mecanico.findUnique({
            where: { correo: correoNormalizado },
        });

        if (existeCorreo) {
            res.status(400).json({ 
                message: 'El correo personal ya está registrado' 
            });
            return;
        }

        const hash = await bcrypt.hash(contrasena, 12);

        // fotoPerfil llega como string base64 (data URI) desde el frontend
        const fotoPerfil = req.body.fotoPerfil ?? null;

        const mecanico = await prisma.mecanico.create({
            data: {
                nombres,
                segundoNombre: segundoNombre || null,
                apellidos,
                segundoApellido: segundoApellido || null,
                edad: Number(edad),
                telefono: telefono || null,
                correo: correoNormalizado,
                correoEmpresarial: correoEmpresarialNormalizado,
                especialidad: especialidad || 'N/A',
                anosExperiencia: Number(anosExperiencia) || 0,
                contrasena: hash,
                tipoPersonal: tipoPersonal || 'Mecánico',
                cuentaActiva: req.body.cuentaActiva ?? true,
                estadoLaboral: 'Disponible',
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
            nombres, segundoNombre, apellidos, segundoApellido, edad, telefono,
            correo, correoEmpresarial, especialidad, anosExperiencia, estadoLaboral, contrasena,
        } = req.body;

        // Validar que el mecánico existe
        const mecanicoExistente = await prisma.mecanico.findUnique({ where: { id } });
        if (!mecanicoExistente) {
            res.status(404).json({ message: 'Mecánico no encontrado' });
            return;
        }

        // Validar que haya al menos un campo para actualizar
        if (!nombres && !segundoNombre && !apellidos && !segundoApellido && !edad && !telefono && !correo && !correoEmpresarial && !especialidad && !anosExperiencia && !estadoLaboral && !contrasena) {
            res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
            return;
        }

        // Validar si el correoEmpresarial ya existe en otro mecánico
        if (correoEmpresarial) {
            const correoNormalizado = correoEmpresarial.trim().toLowerCase();
            const mecanicoExistente = await prisma.mecanico.findUnique({
                where: { correoEmpresarial: correoNormalizado },
            });

            // Si existe y no es el mismo mecánico que estamos actualizando
            if (mecanicoExistente && mecanicoExistente.id !== id) {
                res.status(400).json({ 
                    message: 'El correo empresarial ya está registrado en otro mecánico' 
                });
                return;
            }
        }

        // Validar si el correo personal ya existe en otro mecánico
        if (correo) {
            const correoNormalizado = correo.trim().toLowerCase();
            const mecanicoExistente = await prisma.mecanico.findUnique({
                where: { correo: correoNormalizado },
            });

            // Si existe y no es el mismo mecánico que estamos actualizando
            if (mecanicoExistente && mecanicoExistente.id !== id) {
                res.status(400).json({ 
                    message: 'El correo personal ya está registrado en otro mecánico' 
                });
                return;
            }
        }

        const data: Record<string, unknown> = {
            ...(nombres !== undefined && { nombres }),
            ...(segundoNombre !== undefined && { segundoNombre: segundoNombre || null }),
            ...(apellidos !== undefined && { apellidos }),
            ...(segundoApellido !== undefined && { segundoApellido: segundoApellido || null }),
            ...(edad !== undefined && { edad: Number(edad) }),
            ...(telefono !== undefined && { telefono: telefono || null }),
            ...(correo && { correo: correo.trim().toLowerCase() }),
            ...(correoEmpresarial && { correoEmpresarial: correoEmpresarial.trim().toLowerCase() }),
            ...(especialidad !== undefined && { especialidad }),
            ...(anosExperiencia !== undefined && { anosExperiencia: Number(anosExperiencia) }),
            ...(estadoLaboral !== undefined && { estadoLaboral }),
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
