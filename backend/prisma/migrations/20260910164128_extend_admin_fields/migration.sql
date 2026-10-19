-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "cuentaActiva" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "edad" INTEGER,
ADD COLUMN     "segundoApellido" TEXT,
ADD COLUMN     "segundoNombre" TEXT,
ADD COLUMN     "telefono" TEXT;
