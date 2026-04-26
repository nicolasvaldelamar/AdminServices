import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🔄 Ejecutando migraciones...');

    // Ejecutar todas las migraciones en orden
    const migrations = [
      '01_initial_schema.sql',
      '02_mejoras_solicitudes.sql',
      '03_add_categoria_servicio.sql',
      '03_reportes_equipos.sql',
      '04_fix_v_servicios_completos.sql'
    ];

    for (const file of migrations) {
      const sqlFile = path.join(__dirname, file);
      if (!fs.existsSync(sqlFile)) continue;

      console.log(`➡️  ${file}`);
      const sql = fs.readFileSync(sqlFile, 'utf8');
      await pool.query(sql);
    }

    console.log('✅ Migraciones completadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  }
}

runMigrations();
