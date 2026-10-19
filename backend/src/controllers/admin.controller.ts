import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// POST /api/admin - Registrar nuevo administrador
export async function registroAdmin(req: Request, res: Response): Promise<void> {
    try {
        const { nombres, segundoNombre, apellidos, segundoApellido, edad, telefono, correo, correoEmpresarial, contrasena, fotoPerfil } = req.body;

        // Validar campos requeridos
        if (!nombres || !apellidos || !correo || !correoEmpresarial || !contrasena) {
            res.status(400).json({ message: 'Todos los campos obligatorios son requeridos' });
            return;
        }

        // Normalizar emails
        const correoNorm = correo.trim().toLowerCase();
        const correoEmpNorm = correoEmpresarial.trim().toLowerCase();

        // Verificar si el correo ya existe
        const existeCorreo = await prisma.admin.findFirst({
            where: {
                OR: [
                    { correo: correoNorm },
                    { correoEmpresarial: correoEmpNorm },
                ],
            },
        });

        if (existeCorreo) {
            res.status(400).json({ message: 'El correo ya está registrado' });
            return;
        }

        // Hash de la contraseña
        const hash = await bcrypt.hash(contrasena, 12);

        // Crear administrador
        const admin = await prisma.admin.create({
            data: {
                nombres: nombres.trim(),
                segundoNombre: segundoNombre?.trim() || null,
                apellidos: apellidos.trim(),
                segundoApellido: segundoApellido?.trim() || null,
                edad: edad ? parseInt(edad, 10) : null,
                telefono: telefono?.trim() || null,
                correo: correoNorm,
                correoEmpresarial: correoEmpNorm,
                contrasena: hash,
                cuentaActiva: true,
                fotoPerfil: fotoPerfil || null,
            },
        });

        console.log(`[REGISTRO_ADMIN] ✅ Administrador creado: ${admin.id}`);

        res.status(201).json({
            message: 'Administrador registrado exitosamente',
            admin: {
                id: admin.id,
                nombres: admin.nombres,
                segundoNombre: admin.segundoNombre,
                apellidos: admin.apellidos,
                segundoApellido: admin.segundoApellido,
                edad: admin.edad,
                telefono: admin.telefono,
                correo: admin.correo,
                correoEmpresarial: admin.correoEmpresarial,
                cuentaActiva: admin.cuentaActiva,
                fotoPerfil: admin.fotoPerfil,
                createdAt: admin.createdAt,
            },
        });
    } catch (err: any) {
        console.error('[REGISTRO_ADMIN] ❌ Error:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al registrar administrador' });
    }
}

// GET /api/admin - Listar todos los administradores
export async function listarAdmins(req: Request, res: Response): Promise<void> {
    try {
        const admins = await prisma.admin.findMany({
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
                cuentaActiva: true,
                fotoPerfil: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        console.log(`[LISTAR_ADMINS] ✅ Se encontraron ${admins.length} administradores`);
        res.json(admins);
    } catch (err: any) {
        console.error('[LISTAR_ADMINS] ❌ Error:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al listar administradores' });
    }
}

// PUT /api/admin/:id - Editar administrador
export async function actualizarAdmin(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { nombres, segundoNombre, apellidos, segundoApellido, edad, telefono, correo, correoEmpresarial, contrasena, fotoPerfil } = req.body;

        // Validar que el administrador existe
        const adminExistente = await prisma.admin.findUnique({ where: { id } });
        if (!adminExistente) {
            res.status(404).json({ message: 'Administrador no encontrado' });
            return;
        }

        // Validar que haya al menos un campo para actualizar
        if (!nombres && !apellidos && !telefono && !correo && !correoEmpresarial && !edad && !segundoNombre && !segundoApellido && !contrasena && !fotoPerfil) {
            res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
            return;
        }

        // Verificar que los emails no estén duplicados
        if (correo || correoEmpresarial) {
            const correoNorm = correo?.trim().toLowerCase();
            const correoEmpNorm = correoEmpresarial?.trim().toLowerCase();

            const existeCorreo = await prisma.admin.findFirst({
                where: {
                    id: { not: id },
                    OR: [
                        ...(correoNorm ? [{ correo: correoNorm }] : []),
                        ...(correoEmpNorm ? [{ correoEmpresarial: correoEmpNorm }] : []),
                    ],
                },
            });

            if (existeCorreo) {
                res.status(400).json({ message: 'El correo ya está en uso por otro administrador' });
                return;
            }
        }

        // Hash de contraseña si se proporciona
        let contrasenHash: string | undefined = undefined;
        if (contrasena && contrasena.trim()) {
            contrasenHash = await bcrypt.hash(contrasena, 12);
            console.log(`[ACTUALIZAR_ADMIN] 🔐 Contraseña actualizada`);
        }

        // Actualizar administrador
        const adminActualizado = await prisma.admin.update({
            where: { id },
            data: {
                ...(nombres && { nombres: nombres.trim() }),
                ...(segundoNombre !== undefined && { segundoNombre: segundoNombre?.trim() || null }),
                ...(apellidos && { apellidos: apellidos.trim() }),
                ...(segundoApellido !== undefined && { segundoApellido: segundoApellido?.trim() || null }),
                ...(edad !== undefined && { edad: edad ? parseInt(edad, 10) : null }),
                ...(telefono !== undefined && { telefono: telefono?.trim() || null }),
                ...(correo && { correo: correo.trim().toLowerCase() }),
                ...(correoEmpresarial && { correoEmpresarial: correoEmpresarial.trim().toLowerCase() }),
                ...(contrasenHash && { contrasena: contrasenHash }),
                ...(fotoPerfil !== undefined && { fotoPerfil: fotoPerfil || null }),
            },
        });

        console.log(`[ACTUALIZAR_ADMIN] ✅ Administrador actualizado: ${id}`);

        res.json({
            message: 'Administrador actualizado correctamente',
            admin: adminActualizado,
        });
    } catch (err: any) {
        console.error('[ACTUALIZAR_ADMIN] ❌ Error:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al actualizar administrador' });
    }
}

// DELETE /api/admin/:id - Eliminar administrador
export async function eliminarAdmin(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        // Verificar que el administrador existe
        const admin = await prisma.admin.findUnique({ where: { id } });
        if (!admin) {
            res.status(404).json({ message: 'Administrador no encontrado' });
            return;
        }

        // Eliminar administrador
        await prisma.admin.delete({ where: { id } });

        console.log(`[ELIMINAR_ADMIN] ✅ Administrador eliminado: ${id}`);

        res.json({ message: 'Administrador eliminado correctamente' });
    } catch (err: any) {
        console.error('[ELIMINAR_ADMIN] ❌ Error:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al eliminar administrador' });
    }
}

// PATCH /api/admin/:id/estado - Cambiar estado de cuenta
export async function cambiarEstadoAdmin(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { cuentaActiva } = req.body;

        if (typeof cuentaActiva !== 'boolean') {
            res.status(400).json({ message: 'El campo cuentaActiva debe ser un booleano' });
            return;
        }

        // Verificar que el administrador existe
        const admin = await prisma.admin.findUnique({ where: { id } });
        if (!admin) {
            res.status(404).json({ message: 'Administrador no encontrado' });
            return;
        }

        // Actualizar estado
        const adminActualizado = await prisma.admin.update({
            where: { id },
            data: { cuentaActiva },
        });

        console.log(`[CAMBIAR_ESTADO_ADMIN] ✅ Estado actualizado: ${id} → ${cuentaActiva}`);

        res.json({
            message: `Cuenta ${cuentaActiva ? 'activada' : 'desactivada'} correctamente`,
            admin: adminActualizado,
        });
    } catch (err: any) {
        console.error('[CAMBIAR_ESTADO_ADMIN] ❌ Error:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al cambiar estado de administrador' });
    }
}
