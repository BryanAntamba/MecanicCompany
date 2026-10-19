-- CreateTable
CREATE TABLE "reportes_soporte" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "apellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "correo" TEXT NOT NULL,
    "tipoAsunto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reportes_soporte_pkey" PRIMARY KEY ("id")
);
