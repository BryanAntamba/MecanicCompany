import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    id: string;                        // mecanicoId o adminId según el rol
    correoEmpresarial: string;
    rol: 'admin' | 'mecanico';
}

// Extiende el tipo Request para que TypeScript conozca req.user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token requerido' });
        return;
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = payload;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

// Middleware exclusivo para el administrador
export function soloAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.user?.rol !== 'admin') {
        res.status(403).json({ message: 'Acceso denegado: solo el administrador puede realizar esta acción' });
        return;
    }
    next();
}
