// Script para crear usuario readonly en PostgreSQL
const { Client } = require('pg');

async function createReadonlyUser() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    console.log('✓ Conectado a PostgreSQL');

    // Verificar si el usuario ya existe
    const checkUser = await client.query(
      "SELECT 1 FROM pg_roles WHERE rolname='metabase_readonly'"
    );

    if (checkUser.rows.length > 0) {
      console.log('⚠ Usuario metabase_readonly ya existe. Eliminando...');
      await client.query('DROP USER metabase_readonly');
    }

    // Crear usuario
    await client.query(
      "CREATE USER metabase_readonly WITH PASSWORD 'MecanicBI2026!'"
    );
    console.log('✓ Usuario metabase_readonly creado');

    // Otorgar permisos
    await client.query('GRANT CONNECT ON DATABASE mecaniccompany TO metabase_readonly');
    console.log('✓ Permiso de conexión otorgado');

    await client.query('GRANT USAGE ON SCHEMA public TO metabase_readonly');
    console.log('✓ Permiso de uso del schema otorgado');

    await client.query('GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_readonly');
    console.log('✓ Permiso de SELECT en todas las tablas otorgado');

    await client.query(
      'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_readonly'
    );
    console.log('✓ Permisos automáticos en tablas futuras configurado');

    await client.query(
      'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO metabase_readonly'
    );
    console.log('✓ Permisos en secuencias otorgados');

    // Verificar tablas accesibles
    const tables = await client.query(
      `SELECT table_name FROM information_schema.table_privileges 
       WHERE grantee = 'metabase_readonly' AND privilege_type = 'SELECT'`
    );
    
    console.log('\n✅ Usuario creado exitosamente!');
    console.log(`📊 Tablas accesibles: ${tables.rows.length}`);
    console.log('\nTablas:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));

    console.log('\n🔌 Datos para conectar Metabase:');
    console.log('  Host: host.docker.internal');
    console.log('  Port: 5432');
    console.log('  Database: mecaniccompany');
    console.log('  Username: metabase_readonly');
    console.log('  Password: MecanicBI2026!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createReadonlyUser();
