-- ===================================================================
-- CREAR USUARIO DE SOLO LECTURA PARA METABASE
-- Base de datos: mecaniccompany
-- ===================================================================

-- 1. Crear usuario
CREATE USER metabase_readonly WITH PASSWORD 'MecanicBI2026!';

-- 2. Permitir conexión a la base de datos
GRANT CONNECT ON DATABASE mecaniccompany TO metabase_readonly;

-- 3. Permitir uso del schema público
GRANT USAGE ON SCHEMA public TO metabase_readonly;

-- 4. Otorgar permisos de SELECT en todas las tablas actuales
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_readonly;

-- 5. Otorgar permisos de SELECT en tablas futuras (auto)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT ON TABLES TO metabase_readonly;

-- 6. Permisos en secuencias (para IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO metabase_readonly;

-- ===================================================================
-- VERIFICACIÓN
-- ===================================================================
-- Listar usuarios (ejecutar después):
-- \du

-- Ver permisos del usuario:
-- SELECT table_name FROM information_schema.table_privileges 
-- WHERE grantee = 'metabase_readonly';

-- ===================================================================
-- DATOS PARA METABASE
-- ===================================================================
-- Host: host.docker.internal
-- Port: 5432
-- Database: mecaniccompany
-- Username: metabase_readonly
-- Password: MecanicBI2026!
-- ===================================================================
