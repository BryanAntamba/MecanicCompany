SELECT 'Admins' as tabla, COUNT(*) as total FROM "admins"
UNION ALL
SELECT 'Mecanicos', COUNT(*) FROM "mecanicos"
UNION ALL
SELECT 'Solicitudes', COUNT(*) FROM "solicitudes"
UNION ALL
SELECT 'Mantenimientos', COUNT(*) FROM "mantenimientos"
UNION ALL
SELECT 'CodigosVerificacion', COUNT(*) FROM "codigos_verificacion";
