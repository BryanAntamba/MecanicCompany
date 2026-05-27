-- CreateEnum
CREATE TYPE "EstadoLaboral" AS ENUM ('Disponible', 'Ocupado', 'Inactivo');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('Pendiente', 'En_proceso', 'Completado');

-- CreateTable
CREATE TABLE "mecanicos" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "correo" TEXT NOT NULL,
    "correoEmpresarial" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "anosExperiencia" INTEGER NOT NULL,
    "estadoLaboral" "EstadoLaboral" NOT NULL DEFAULT 'Disponible',
    "cuentaActiva" BOOLEAN NOT NULL DEFAULT true,
    "contrasena" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mecanicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correoCliente" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "kilometraje" TEXT NOT NULL,
    "tipoServicio" TEXT NOT NULL,
    "otroServicio" TEXT NOT NULL DEFAULT '',
    "descripcionProblema" TEXT NOT NULL,
    "fechaCita" TEXT NOT NULL,
    "horaCita" TEXT NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'Pendiente',
    "mecanicoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mantenimientos" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "mecanicoAsignado" TEXT NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "trabajoRealizado" TEXT NOT NULL,
    "otroTrabajo" TEXT NOT NULL DEFAULT '',
    "repuestosUtilizados" TEXT NOT NULL,
    "diagnosticoRealizado" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL,
    "costoManoObra" DECIMAL(10,2) NOT NULL,
    "costoRepuestos" DECIMAL(10,2) NOT NULL,
    "fechaServicio" TEXT NOT NULL,
    "fechaInicio" TEXT NOT NULL,
    "fechaFinalizacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mantenimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codigos_verificacion" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codigos_verificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mecanicos_correo_key" ON "mecanicos"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "mecanicos_correoEmpresarial_key" ON "mecanicos"("correoEmpresarial");

-- CreateIndex
CREATE UNIQUE INDEX "mantenimientos_solicitudId_key" ON "mantenimientos"("solicitudId");

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_mecanicoId_fkey" FOREIGN KEY ("mecanicoId") REFERENCES "mecanicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimientos" ADD CONSTRAINT "mantenimientos_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
