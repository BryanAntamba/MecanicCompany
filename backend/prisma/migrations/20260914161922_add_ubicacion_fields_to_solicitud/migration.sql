-- AlterTable
ALTER TABLE "solicitudes" ADD COLUMN     "provincia" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ubicacionMecanicaDireccion" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ubicacionMecanicaId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ubicacionMecanicaNombre" TEXT NOT NULL DEFAULT '';
