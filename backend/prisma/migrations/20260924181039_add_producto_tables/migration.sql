-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "codigoSKU" TEXT NOT NULL,
    "marcaComponente" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "numeroParteOEM" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL,
    "stockActual" INTEGER NOT NULL,
    "stockMinimo" INTEGER NOT NULL,
    "stockCritico" INTEGER NOT NULL,
    "precioCompra" DECIMAL(12,2) NOT NULL,
    "precioVenta" DECIMAL(12,2) NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "unidadMedida" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compatibilidades_productos" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoDesde" INTEGER NOT NULL,
    "anoHasta" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compatibilidades_productos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigoSKU_key" ON "productos"("codigoSKU");

-- AddForeignKey
ALTER TABLE "compatibilidades_productos" ADD CONSTRAINT "compatibilidades_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
