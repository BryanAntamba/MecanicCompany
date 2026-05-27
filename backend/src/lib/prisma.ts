import { PrismaClient } from '@prisma/client';

// Instancia global para evitar múltiples conexiones en desarrollo
const prisma = new PrismaClient();

export default prisma;
