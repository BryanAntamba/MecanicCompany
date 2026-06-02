import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { generarCodigo, enviarCodigoEmail } from '../services/email.service';

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<void> {
    const { correoEmpresarial, contrasena } = req.body;

    if (!correoEmpresarial || !contrasena) {
        res.status(400).json({ message: 'Correo y contraseña son requeridos' });
        return;
    }

    const correoNorm = correoEmpresarial.trim().toLowerCase();

    // 1. Buscar primero en la tabla Admin
    const admin = await prisma.admin.findUnique({
        where: { correoEmpresarial: correoNorm },
    });

    if (admin) {
        const passwordValida = await bcrypt.compare(contrasena, admin.contrasena);
        if (!passwordValida) {
            res.status(401).json({ message: 'Credenciales incorrectas' });
            return;
        }

        const token = jwt.sign(
            { id: admin.id, correoEmpresarial: admin.correoEmpresarial, rol: 'admin' },
            process.env.JWT_SECRET!,
            { expiresIn: 28800 }
        );

        res.json({
            token,
            mecanico: {
                id: admin.id,
                nombres: admin.nombres,
                apellidos: admin.apellidos,
                correoEmpresarial: admin.correoEmpresarial,
                especialidad: 'Administración',
                estadoLaboral: 'Disponible',
                esAdmin: true,
            },
        });
        return;
    }

    // 2. Si no es admin, buscar en la tabla Mecanico
    const mecanico = await prisma.mecanico.findUnique({
        where: { correoEmpresarial: correoNorm },
    });

    if (!mecanico || !mecanico.cuentaActiva) {
        res.status(401).json({ message: 'Credenciales incorrectas o cuenta inactiva' });
        return;
    }

    const passwordValida = await bcrypt.compare(contrasena, mecanico.contrasena);
    if (!passwordValida) {
        res.status(401).json({ message: 'Credenciales incorrectas o cuenta inactiva' });
        return;
    }

    const token = jwt.sign(
        { id: mecanico.id, correoEmpresarial: mecanico.correoEmpresarial, rol: 'mecanico' },
        process.env.JWT_SECRET!,
        { expiresIn: 28800 }
    );

    res.json({
        token,
        mecanico: {
            id: mecanico.id,
            nombres: mecanico.nombres,
            apellidos: mecanico.apellidos,
            correoEmpresarial: mecanico.correoEmpresarial,
            especialidad: mecanico.especialidad,
            estadoLaboral: mecanico.estadoLaboral,
            esAdmin: false,
        },
    });
}

// POST /api/auth/recuperar
export async function solicitarRecuperacion(req: Request, res: Response): Promise<void> {
    const { correo } = req.body;

    if (!correo) {
        res.status(400).json({ message: 'Correo requerido' });
        return;
    }

    try {
        const mecanico = await prisma.mecanico.findUnique({
            where: { correo: correo.trim().toLowerCase() },
        });

        // Respuesta genérica para no revelar si el correo existe
        if (!mecanico) {
            res.json({ message: 'Si el correo está registrado, recibirás un código en breve' });
            return;
        }

        const codigo = generarCodigo();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await prisma.codigoVerificacion.create({
            data: { correo: correo.trim().toLowerCase(), codigo, expiresAt },
        });

        await enviarCodigoEmail(correo, codigo, 'recuperacion');

        res.json({ message: 'Si el correo está registrado, recibirás un código en breve' });
    } catch (err: any) {
        console.error('[solicitarRecuperacion]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al procesar la solicitud de recuperación' });
    }
}

// POST /api/auth/verificar-codigo
export async function verificarCodigo(req: Request, res: Response): Promise<void> {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
        res.status(400).json({ message: 'Correo y código son requeridos' });
        return;
    }

    try {
        const registro = await prisma.codigoVerificacion.findFirst({
            where: {
                correo: correo.trim().toLowerCase(),
                codigo,
                usado: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!registro) {
            res.status(400).json({ message: 'Código inválido o expirado' });
            return;
        }

        await prisma.codigoVerificacion.update({
            where: { id: registro.id },
            data: { usado: true },
        });

        // Token de un solo uso válido 10 minutos — el frontend debe pasarlo a /cambiar-password
        const resetToken = jwt.sign(
            { correo: correo.trim().toLowerCase(), type: 'password-reset' },
            process.env.JWT_SECRET!,
            { expiresIn: '10m' }
        );

        res.json({ message: 'Código verificado correctamente', resetToken });
    } catch (err: any) {
        console.error('[verificarCodigo]', err?.message);
        res.status(500).json({ message: 'Error al verificar el código' });
    }
}

// POST /api/auth/enviar-codigo-cliente
// Envía un código de verificación a cualquier correo (Gmail) para validar
// que el cliente es real antes de permitirle enviar una solicitud de servicio.
export async function enviarCodigoCliente(req: Request, res: Response): Promise<void> {
    const { correo } = req.body;

    if (!correo || !String(correo).includes('@')) {
        res.status(400).json({ message: 'Correo requerido' });
        return;
    }

    const correoNorm = correo.trim().toLowerCase();

    try {
        // Elimina códigos anteriores del mismo correo para no acumular basura en la BD
        await prisma.codigoVerificacion.deleteMany({
            where: { correo: correoNorm },
        });

        const codigo = generarCodigo();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await prisma.codigoVerificacion.create({
            data: { correo: correoNorm, codigo, expiresAt },
        });

        await enviarCodigoEmail(correoNorm, codigo, 'verificacion');

        res.json({ message: 'Código enviado al correo indicado' });
    } catch (err: any) {
        console.error('[enviarCodigoCliente]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al enviar el código de verificación' });
    }
}

// POST /api/auth/verificar-codigo-cliente
// Verifica el código enviado al correo del cliente.
// Si es válido devuelve { verificado: true } para que el frontend pueda continuar.
export async function verificarCodigoCliente(req: Request, res: Response): Promise<void> {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
        res.status(400).json({ message: 'Correo y código son requeridos' });
        return;
    }

    try {
        const registro = await prisma.codigoVerificacion.findFirst({
            where: {
                correo: correo.trim().toLowerCase(),
                codigo,
                usado: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!registro) {
            res.status(400).json({ message: 'Código inválido o expirado' });
            return;
        }

        // No se marca como usado aquí — se consume al crear la solicitud.
        // Esto garantiza que la solicitud solo se guarda si el código sigue válido.

        res.json({ verificado: true, correo: correo.trim().toLowerCase() });
    } catch (err: any) {
        console.error('[verificarCodigoCliente]', err?.message);
        res.status(500).json({ message: 'Error al verificar el código' });
    }
}

// PUT /api/auth/cambiar-password
export async function cambiarPassword(req: Request, res: Response): Promise<void> {
    const { resetToken, nuevaContrasena } = req.body;

    if (!resetToken || !nuevaContrasena) {
        res.status(400).json({ message: 'Token de restablecimiento y nueva contraseña son requeridos' });
        return;
    }

    // Mínimo 8 caracteres con al menos una letra y un número
    if (
        typeof nuevaContrasena !== 'string' ||
        nuevaContrasena.length < 8 ||
        !/[a-zA-Z]/.test(nuevaContrasena) ||
        !/[0-9]/.test(nuevaContrasena)
    ) {
        res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, incluir una letra y un número' });
        return;
    }

    // Valida el resetToken — rechaza si no existe, está expirado o es de otro tipo
    let correo: string;
    try {
        const payload = jwt.verify(resetToken, process.env.JWT_SECRET!) as any;
        if (payload.type !== 'password-reset') throw new Error('Tipo de token inválido');
        correo = payload.correo;
    } catch {
        res.status(400).json({ message: 'Token de restablecimiento inválido o expirado' });
        return;
    }

    try {
        const mecanico = await prisma.mecanico.findUnique({
            where: { correo },
        });

        if (!mecanico) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        const hash = await bcrypt.hash(nuevaContrasena, 12);

        await prisma.mecanico.update({
            where: { id: mecanico.id },
            data: { contrasena: hash },
        });

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err: any) {
        console.error('[cambiarPassword]', err?.message);
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
}
