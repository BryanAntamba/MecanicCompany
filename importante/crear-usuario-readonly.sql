-- ===================================================================
-- Script SQL: Crear Usuario de Solo Lectura para Metabase
-- ===================================================================
-- Base de datos: PostgreSQL
-- Propósito: Crear un usuario con permisos SOLO de lectura (SELECT)
--            para que Metabase acceda a los datos sin riesgo de 
--            modificar o eliminar información
-- ===================================================================

-- INSTRUCCIONES DE USO:
-- 1. Abrir terminal/CMD en la carpeta del proyecto
-- 2. Conectar a PostgreSQL:
--    psql -U postgres -d [nombre_de_tu_base_de_datos]
-- 3. Copiar y pegar este script completo
-- 4. Verificar que se creó: \du
-- 5. Probar conexión desde Metabase

-- ===================================================================
-- PASO 1: Crear usuario
-- ===================================================================
-- NOTA: Cambia 'password_seguro_123' por una contraseña fuerte
CREATE USER metabase_readonly WITH PASSWORD 'password_seguro_123';

-- ===================================================================
-- PASO 2: Otorgar permisos de conexión a la base de datos
-- ===================================================================
-- NOTA: Reemplaza 'mecaniccompany' con el nombre real de tu BD
GRANT CONNECT ON DATABASE mecaniccompany TO metabase_readonly;

-- ===================================================================
-- PASO 3: Otorgar uso del schema público
-- ===================================================================
GRANT USAGE ON SCHEMA public TO metabase_readonly;

-- ===================================================================
-- PASO 4: Otorgar permisos de SELECT en todas las tablas actuales
-- ===================================================================
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_readonly;

-- ===================================================================
-- PASO 5: Otorgar permisos de SELECT en tablas futuras
-- ===================================================================
-- Esto asegura que nuevas tablas también sean accesibles
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT ON TABLES TO metabase_readonly;

-- ===================================================================
-- PASO 6: Otorgar permisos en secuencias (para IDs autoincrementales)
-- ===================================================================
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO metabase_readonly;

-- ===================================================================
-- VERIFICACIÓN: Comprobar permisos
-- ===================================================================
-- Ejecuta estos comandos para verificar que todo está correcto:

-- Ver usuarios de PostgreSQL:
-- \du

-- Ver permisos del usuario en la base de datos actual:
-- \z

-- Listar tablas accesibles por el usuario:
-- SELECT table_name 
-- FROM information_schema.table_privileges 
-- WHERE grantee = 'metabase_readonly';

-- ===================================================================
-- PRUEBA DE CONEXIÓN
-- ===================================================================
-- Para probar que el usuario funciona:
-- psql -U metabase_readonly -d mecaniccompany -h localhost

-- Dentro de psql, ejecutar:
-- SELECT COUNT(*) FROM "Mantenimiento";
-- (Debe mostrar el número de registros)

-- Intentar insertar (debe fallar):
-- INSERT INTO "Admin" (id, nombres) VALUES ('test', 'Test');
-- (Debe mostrar: ERROR: permission denied for table Admin)

-- ===================================================================
-- REVOCAR PERMISOS (SI ES NECESARIO)
-- ===================================================================
-- Si necesitas eliminar el usuario en el futuro:
-- REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM metabase_readonly;
-- REVOKE ALL PRIVILEGES ON SCHEMA public FROM metabase_readonly;
-- REVOKE CONNECT ON DATABASE mecaniccompany FROM metabase_readonly;
-- DROP USER metabase_readonly;

-- ===================================================================
-- DATOS DE CONEXIÓN PARA METABASE
-- ===================================================================
-- Copia estos datos cuando configures Metabase:
--
-- Database Type:     PostgreSQL
-- Name:             MecanicCompany Production
-- Host:             host.docker.internal  (Windows/Mac)
--                   172.17.0.1            (Linux)
-- Port:             5432
-- Database name:    mecaniccompany  (o tu nombre de BD)
-- Username:         metabase_readonly
-- Password:         [la que pusiste en CREATE USER]
--
-- Opciones avanzadas:
-- SSL:              No (si es local)
-- Additional JDBC:  (dejar vacío)
-- ===================================================================

-- ===================================================================
-- SEGURIDAD ADICIONAL (OPCIONAL)
-- ===================================================================

-- Limitar conexiones solo desde localhost:
-- ALTER USER metabase_readonly CONNECTION LIMIT 5;

-- Establecer búsqueda de schema por defecto:
-- ALTER USER metabase_readonly SET search_path TO public;

-- Ver configuración del usuario:
-- SELECT * FROM pg_user WHERE usename = 'metabase_readonly';

-- ===================================================================
-- NOTAS IMPORTANTES
-- ===================================================================
-- 1. Este usuario NO puede:
--    - Insertar datos (INSERT)
--    - Actualizar datos (UPDATE)
--    - Eliminar datos (DELETE)
--    - Modificar estructura (CREATE, DROP, ALTER)
--
-- 2. Este usuario SÍ puede:
--    - Leer todas las tablas (SELECT)
--    - Hacer JOINs y agregaciones
--    - Usar funciones de PostgreSQL
--
-- 3. Seguridad:
--    - Cambia la contraseña por una fuerte
--    - Guarda las credenciales en un lugar seguro
--    - No compartas este usuario con otros sistemas
--
-- 4. Mantenimiento:
--    - Si creas nuevas tablas en el futuro, ya tendrán 
--      permisos automáticos gracias a ALTER DEFAULT PRIVILEGES
-- ===================================================================

COMMIT;
