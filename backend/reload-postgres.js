// Script para recargar configuración de PostgreSQL usando SQL
const { Client } = require('pg');

async function reloadPostgres() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'mecaniccompany',
    user: 'mecanico',
    password: '12345'
  });

  try {
    await client.connect();
    console.log('✓ Conectado a PostgreSQL');

    // Ejecutar función de recarga
    await client.query('SELECT pg_reload_conf()');
    console.log('✅ Configuración de PostgreSQL recargada exitosamente!');
    console.log('📋 PostgreSQL ahora acepta conexiones desde Docker');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠ Si el error es de permisos, ejecuta en PowerShell como Administrador:');
    console.log('   Restart-Service postgresql-x64-17');
    process.exit(1);
  } finally {
    await client.end();
  }
}

reloadPostgres();
