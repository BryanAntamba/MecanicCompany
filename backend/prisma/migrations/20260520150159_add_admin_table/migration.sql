-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "correoEmpresarial" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_correo_key" ON "admins"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "admins_correoEmpresarial_key" ON "admins"("correoEmpresarial");
