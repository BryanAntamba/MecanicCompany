-- CreateEnum
CREATE TYPE "EstadoFinanzas" AS ENUM ('Pendiente', 'Pagado', 'Cancelado');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'OTRO');

-- CreateTable
CREATE TABLE "finanzas" (
    "id" TEXT NOT NULL,
    "numeroFactura" TEXT NOT NULL,
    "mantenimientoId" TEXT NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteTelefono" TEXT NOT NULL,
    "clienteCorreo" TEXT NOT NULL,
    "vehiculo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "anio" TEXT NOT NULL,
    "kilometraje" TEXT NOT NULL,
    "servicio" TEXT NOT NULL,
    "mecanico" TEXT NOT NULL,
    "costoManoObra" DECIMAL(12,2) NOT NULL,
    "costoRepuestos" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoFinanzas" NOT NULL DEFAULT 'Pendiente',
    "metodoPago" "MetodoPago",
    "fechaPago" TIMESTAMP(3),
    "observacion" TEXT,
    "comprobanteUri" TEXT,
    "fechaFactura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finanzas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "finanzas_numeroFactura_key" ON "finanzas"("numeroFactura");

-- CreateIndex
CREATE UNIQUE INDEX "finanzas_mantenimientoId_key" ON "finanzas"("mantenimientoId");

-- AddForeignKey
ALTER TABLE "finanzas" ADD CONSTRAINT "finanzas_mantenimientoId_fkey" FOREIGN KEY ("mantenimientoId") REFERENCES "mantenimientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
