-- CreateTable personal_financiero
CREATE TABLE IF NOT EXISTS "personal_financiero" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombres" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "apellidos" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "edad" INTEGER,
    "telefono" TEXT,
    "correo" TEXT NOT NULL UNIQUE,
    "correoEmpresarial" TEXT NOT NULL UNIQUE,
    "contrasena" TEXT NOT NULL,
    "cuentaActiva" BOOLEAN NOT NULL DEFAULT true,
    "fotoPerfil" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable personal_inventario
CREATE TABLE IF NOT EXISTS "personal_inventario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombres" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "apellidos" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "edad" INTEGER,
    "telefono" TEXT,
    "correo" TEXT NOT NULL UNIQUE,
    "correoEmpresarial" TEXT NOT NULL UNIQUE,
    "contrasena" TEXT NOT NULL,
    "cuentaActiva" BOOLEAN NOT NULL DEFAULT true,
    "fotoPerfil" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
