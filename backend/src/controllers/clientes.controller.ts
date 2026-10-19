import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { generarCodigo, enviarCodigoEmail } from '../services/email.service';

// POST /api/auth/cliente/registro
export async function registroCliente(req: Request, res: Response): Promise<void> {
    try {
        const { nombres, segundoNombre, apellidos, segundoApellido, telefono, correo, contrasena, fechaNacimiento } = req.body;

        if (!nombres || !apellidos || !telefono || !correo || !contrasena) {
            res.status(400).json({ message: 'Todos los campos obligatorios son requeridos' });
            return;
        }

        const correoNorm = correo.trim().toLowerCase();

        // Verificar si el correo ya existe
        const existeCliente = await prisma.cliente.findUnique({
            where: { correo: correoNorm },
        });

        if (existeCliente) {
            res.status(400).json({ message: 'El correo ya está registrado' });
            return;
        }

        // Hash de la contraseña
        const hash = await bcrypt.hash(contrasena, 12);

        // Parsear fecha si se proporciona
        let fechaParsed: Date | null = null;
        if (fechaNacimiento) {
            fechaParsed = new Date(fechaNacimiento);
            if (isNaN(fechaParsed.getTime())) {
                res.status(400).json({ message: 'Formato de fecha inválido' });
                return;
            }
        }

        // Crear cliente con cuentaActiva = false (hasta verificar correo)
        const cliente = await prisma.cliente.create({
            data: {
                nombres: nombres.trim(),
                segundoNombre: segundoNombre?.trim() || null,
                apellidos: apellidos.trim(),
                segundoApellido: segundoApellido?.trim() || null,
                telefono: telefono.trim(),
                correo: correoNorm,
                contrasena: hash,
                fechaNacimiento: fechaParsed,
                cuentaActiva: false, // Desactivada hasta verificar email
            },
        });

        console.error(`[REGISTRO_CLIENTE] ✅ Cliente creado: ${cliente.id}`);

        // Generar código de verificación
        const codigo = generarCodigo();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await prisma.codigoVerificacion.create({
            data: { correo: correoNorm, codigo, expiresAt },
        });

        console.error(`[REGISTRO_CLIENTE] 📧 Enviando código a: ${correo}`);

        try {
            await enviarCodigoEmail(correo, codigo, 'verificacion');
        } catch (emailErr: any) {
            console.error('[REGISTRO_CLIENTE] Error al enviar correo:', emailErr?.message);
            res.status(500).json({ message: 'Error al enviar el código de verificación' });
            return;
        }

        res.status(201).json({
            message: 'Cliente registrado. Verifica tu correo para activar la cuenta',
            clienteId: cliente.id,
            correo: cliente.correo,
        });
    } catch (err: any) {
        console.error('[REGISTRO_CLIENTE] 🔴 ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al registrar cliente' });
    }
}

// POST /api/auth/cliente/verificar-codigo
export async function verificarCodigoCliente(req: Request, res: Response): Promise<void> {
    try {
        const { correo, codigo } = req.body;

        if (!correo || !codigo) {
            res.status(400).json({ message: 'Correo y código requeridos' });
            return;
        }

        const correoNorm = correo.trim().toLowerCase();

        // Buscar código válido y no expirado
        const codigoValido = await prisma.codigoVerificacion.findFirst({
            where: {
                correo: correoNorm,
                codigo,
                expiresAt: { gt: new Date() }, // No expirado
            },
        });

        if (!codigoValido) {
            console.error(`[VERIFICAR_CODIGO_CLIENTE] ❌ Código inválido o expirado para: ${correo}`);
            res.status(401).json({ message: 'Código inválido o expirado' });
            return;
        }

        // Activar cuenta del cliente
        const cliente = await prisma.cliente.update({
            where: { correo: correoNorm },
            data: { cuentaActiva: true },
        });

        // Marcar código como usado (no eliminar, para que solicitudes pueda validarlo)
        await prisma.codigoVerificacion.update({
            where: { id: codigoValido.id },
            data: { usado: true },
        });

        console.error(`[VERIFICAR_CODIGO_CLIENTE] ✅ Cliente verificado: ${cliente.id}`);

        res.json({
            message: 'Correo verificado. Tu cuenta está activada',
            cliente: {
                id: cliente.id,
                nombres: cliente.nombres,
                apellidos: cliente.apellidos,
                correo: cliente.correo,
            },
        });
    } catch (err: any) {
        console.error('[VERIFICAR_CODIGO_CLIENTE] 🔴 ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al verificar código' });
    }
}

// POST /api/auth/cliente/login
export async function loginCliente(req: Request, res: Response): Promise<void> {
    try {
        console.error('[LOGIN_CLIENTE] ▶️ INICIANDO LOGIN');
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            res.status(400).json({ message: 'Correo y contraseña requeridos' });
            return;
        }

        const correoNorm = correo.trim().toLowerCase();
        console.error(`[LOGIN_CLIENTE] 🔍 Buscando cliente: ${correoNorm}`);

        const cliente = await prisma.cliente.findUnique({
            where: { correo: correoNorm },
        });

        if (!cliente) {
            console.error('[LOGIN_CLIENTE] ❌ Cliente no encontrado');
            res.status(401).json({ message: 'Credenciales incorrectas' });
            return;
        }

        if (!cliente.cuentaActiva) {
            console.error('[LOGIN_CLIENTE] ❌ Cuenta NO VERIFICADA');
            res.status(401).json({ message: 'Cuenta no verificada. Revisa tu correo' });
            return;
        }

        console.error('[LOGIN_CLIENTE] 🔐 Comparando contraseña...');
        const passwordValida = await bcrypt.compare(contrasena, cliente.contrasena);

        if (!passwordValida) {
            console.error('[LOGIN_CLIENTE] ❌ Contraseña INCORRECTA');
            res.status(401).json({ message: 'Credenciales incorrectas' });
            return;
        }

        console.error('[LOGIN_CLIENTE] ✅ Contraseña CORRECTA - Generando token...');
        const token = jwt.sign(
            { id: cliente.id, correo: cliente.correo, rol: 'cliente' },
            process.env.JWT_SECRET!,
            { expiresIn: 86400 } // 24 horas
        );

        console.error('[LOGIN_CLIENTE] ✅ LOGIN EXITOSO - Cliente:', cliente.id);
        res.json({
            token,
            cliente: {
                id: cliente.id,
                nombres: cliente.nombres,
                apellidos: cliente.apellidos,
                correo: cliente.correo,
                telefono: cliente.telefono,
            },
        });
    } catch (err: any) {
        console.error('[LOGIN_CLIENTE] 🔴 ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al procesar login' });
    }
}

// POST /api/auth/cliente/reenviar-codigo
export async function reenviarCodigoCliente(req: Request, res: Response): Promise<void> {
    try {
        const { correo } = req.body;

        if (!correo) {
            res.status(400).json({ message: 'Correo requerido' });
            return;
        }

        const correoNorm = correo.trim().toLowerCase();

        // Verificar que el cliente existe y no está verificado
        const cliente = await prisma.cliente.findUnique({
            where: { correo: correoNorm },
        });

        if (!cliente) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        if (cliente.cuentaActiva) {
            res.status(400).json({ message: 'Esta cuenta ya está verificada' });
            return;
        }

        // Eliminar código anterior si existe
        await prisma.codigoVerificacion.deleteMany({
            where: { correo: correoNorm },
        });

        // Generar nuevo código
        const codigo = generarCodigo();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.codigoVerificacion.create({
            data: { correo: correoNorm, codigo, expiresAt },
        });

        try {
            await enviarCodigoEmail(correo, codigo, 'verificacion');
        } catch (emailErr: any) {
            console.error('[REENVIAR_CODIGO_CLIENTE] Error:', emailErr?.message);
            res.status(500).json({ message: 'Error al enviar el código' });
            return;
        }

        res.json({ message: 'Código reenviado a tu correo' });
    } catch (err: any) {
        console.error('[REENVIAR_CODIGO_CLIENTE] ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al reenviar código' });
    }
}

// GET /api/clientes - Listar todos los clientes
export async function listarClientes(req: Request, res: Response): Promise<void> {
    try {
        const clientes = await prisma.cliente.findMany({
            select: {
                id: true,
                nombres: true,
                segundoNombre: true,
                apellidos: true,
                segundoApellido: true,
                telefono: true,
                correo: true,
                cuentaActiva: true,
                fotoPerfil: true,
                fechaNacimiento: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        console.log(`[LISTAR_CLIENTES] ✅ Se encontraron ${clientes.length} clientes`);
        res.json(clientes);
    } catch (err: any) {
        console.error('[LISTAR_CLIENTES] ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al listar clientes' });
    }
}

// PUT /api/clientes/:id - Editar cliente
export async function actualizarCliente(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { nombres, segundoNombre, apellidos, segundoApellido, telefono, correo, fechaNacimiento, contrasena } = req.body;

        // Validar que al menos un campo sea proporcionado
        if (!nombres && !segundoNombre && !apellidos && !segundoApellido && !telefono && !correo && !fechaNacimiento && !contrasena) {
            res.status(400).json({ message: 'Al menos un campo debe ser proporcionado' });
            return;
        }

        // Verificar que el cliente existe
        const cliente = await prisma.cliente.findUnique({ where: { id } });
        if (!cliente) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        // Si se proporciona un correo diferente, verificar que no esté en uso
        if (correo && correo.toLowerCase() !== cliente.correo) {
            const existeCorreo = await prisma.cliente.findUnique({
                where: { correo: correo.toLowerCase() },
            });
            if (existeCorreo) {
                res.status(400).json({ message: 'El correo ya está registrado' });
                return;
            }
        }

        // Parsear fecha si se proporciona
        let fechaParsed: Date | null = null;
        if (fechaNacimiento) {
            fechaParsed = new Date(fechaNacimiento);
            if (isNaN(fechaParsed.getTime())) {
                res.status(400).json({ message: 'Formato de fecha inválido' });
                return;
            }
        }

        // Hash de contraseña si se proporciona
        let contrasenHash: string | undefined = undefined;
        if (contrasena && contrasena.trim()) {
            contrasenHash = await bcrypt.hash(contrasena, 12);
            console.log(`[ACTUALIZAR_CLIENTE] 🔐 Contraseña actualizada`);
        }

        // Actualizar cliente
        const clienteActualizado = await prisma.cliente.update({
            where: { id },
            data: {
                ...(nombres && { nombres: nombres.trim() }),
                ...(segundoNombre !== undefined && { segundoNombre: segundoNombre?.trim() || null }),
                ...(apellidos && { apellidos: apellidos.trim() }),
                ...(segundoApellido !== undefined && { segundoApellido: segundoApellido?.trim() || null }),
                ...(telefono && { telefono: telefono.trim() }),
                ...(correo && { correo: correo.trim().toLowerCase() }),
                ...(fechaNacimiento && { fechaNacimiento: fechaParsed }),
                ...(contrasenHash && { contrasena: contrasenHash }),
            },
        });

        console.log(`[ACTUALIZAR_CLIENTE] ✅ Cliente actualizado: ${id}`);
        res.json({ message: 'Cliente actualizado correctamente', cliente: clienteActualizado });
    } catch (err: any) {
        console.error('[ACTUALIZAR_CLIENTE] ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al actualizar cliente' });
    }
}

// DELETE /api/clientes/:id - Eliminar cliente
export async function eliminarCliente(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        // Verificar que el cliente existe
        const cliente = await prisma.cliente.findUnique({ where: { id } });
        if (!cliente) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        // Eliminar cliente (Prisma manejará las restricciones de foreign keys)
        await prisma.cliente.delete({ where: { id } });

        console.log(`[ELIMINAR_CLIENTE] ✅ Cliente eliminado: ${id}`);
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (err: any) {
        console.error('[ELIMINAR_CLIENTE] ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al eliminar cliente' });
    }
}

// PATCH /api/clientes/:id/estado - Cambiar estado de la cuenta
export async function cambiarEstadoCuentaCliente(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { cuentaActiva } = req.body;

        if (typeof cuentaActiva !== 'boolean') {
            res.status(400).json({ message: 'El campo cuentaActiva debe ser booleano' });
            return;
        }

        // Verificar que el cliente existe
        const cliente = await prisma.cliente.findUnique({ where: { id } });
        if (!cliente) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        // Actualizar estado
        const clienteActualizado = await prisma.cliente.update({
            where: { id },
            data: { cuentaActiva },
        });

        console.log(`[CAMBIAR_ESTADO_CLIENTE] ✅ Estado actualizado para: ${id}`);
        res.json({ message: 'Estado de la cuenta actualizado', cuentaActiva: clienteActualizado.cuentaActiva });
    } catch (err: any) {
        console.error('[CAMBIAR_ESTADO_CLIENTE] ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al cambiar estado' });
    }
}

// POST /api/auth/cliente/cambiar-contrasena
export async function cambiarContrasenaCliente(req: Request, res: Response): Promise<void> {
    try {
        const { correo, nuevaContrasena } = req.body;

        if (!correo || !nuevaContrasena) {
            res.status(400).json({ message: 'Correo y contraseña requeridos' });
            return;
        }

        const correoNorm = correo.trim().toLowerCase();

        // Buscar cliente
        const cliente = await prisma.cliente.findUnique({
            where: { correo: correoNorm },
        });

        if (!cliente) {
            console.error(`[CAMBIAR_CONTRASENA_CLIENTE] ❌ Cliente no encontrado: ${correoNorm}`);
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        if (!cliente.cuentaActiva) {
            console.error(`[CAMBIAR_CONTRASENA_CLIENTE] ❌ Cuenta no verificada: ${correoNorm}`);
            res.status(403).json({ message: 'La cuenta debe estar verificada para cambiar contraseña' });
            return;
        }

        // Validar que la nueva contraseña no sea igual a la anterior
        const esLaMisma = await bcrypt.compare(nuevaContrasena, cliente.contrasena);
        if (esLaMisma) {
            console.error(`[CAMBIAR_CONTRASENA_CLIENTE] ❌ Nueva contraseña igual a la anterior: ${correoNorm}`);
            res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior. Por favor, elige una contraseña diferente.' });
            return;
        }

        // Hash de la nueva contraseña
        const hash = await bcrypt.hash(nuevaContrasena, 12);

        // Actualizar contraseña
        await prisma.cliente.update({
            where: { id: cliente.id },
            data: { contrasena: hash },
        });

        // Limpiar códigos de verificación (ya no serán válidos)
        await prisma.codigoVerificacion.deleteMany({
            where: { correo: correoNorm },
        });

        console.error(`[CAMBIAR_CONTRASENA_CLIENTE] ✅ Contraseña actualizada para: ${correoNorm}`);
        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (err: any) {
        console.error('[CAMBIAR_CONTRASENA_CLIENTE] ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al cambiar contraseña' });
    }
}

// POST /api/auth/cliente/recuperar-contrasena
export async function recuperarContrasenaCliente(req: Request, res: Response): Promise<void> {
    try {
        const { correo } = req.body;

        if (!correo) {
            res.status(400).json({ message: 'Correo requerido' });
            return;
        }

        const correoNorm = correo.trim().toLowerCase();

        // Verificar que el cliente existe Y está verificado
        const cliente = await prisma.cliente.findUnique({
            where: { correo: correoNorm },
        });

        if (!cliente) {
            console.error(`[RECUPERAR_CONTRASENA_CLIENTE] ❌ Cliente no encontrado: ${correoNorm}`);
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        if (!cliente.cuentaActiva) {
            console.error(`[RECUPERAR_CONTRASENA_CLIENTE] ❌ Cuenta no verificada: ${correoNorm}`);
            res.status(403).json({ message: 'Tu cuenta no está verificada. Por favor completa el registro primero.' });
            return;
        }

        // Eliminar código anterior si existe
        await prisma.codigoVerificacion.deleteMany({
            where: { correo: correoNorm },
        });

        // Generar nuevo código
        const codigo = generarCodigo();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await prisma.codigoVerificacion.create({
            data: { correo: correoNorm, codigo, expiresAt },
        });

        try {
            await enviarCodigoEmail(correo, codigo, 'recuperacion');
        } catch (emailErr: any) {
            console.error('[RECUPERAR_CONTRASENA_CLIENTE] Error al enviar correo:', emailErr?.message);
            res.status(500).json({ message: 'Error al enviar el código de recuperación' });
            return;
        }

        console.error(`[RECUPERAR_CONTRASENA_CLIENTE] ✅ Código enviado a: ${correoNorm}`);
        res.json({ 
            message: 'Código de recuperación enviado a tu correo',
            correo: cliente.correo 
        });
    } catch (err: any) {
        console.error('[RECUPERAR_CONTRASENA_CLIENTE] ERROR:', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al recuperar contraseña' });
    }
}
