import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const actualizarPasswords = async () => {
  try {
    console.log('\n🔐 Actualizando contraseñas de usuarios...\n');
    
    // Generar hashes
    const hashAdmin = await bcrypt.hash('admin123', 10);
    const hashTecnico = await bcrypt.hash('tecnico123', 10);
    const hashRecepcion = await bcrypt.hash('recepcion123', 10);
    
    // Actualizar en la base de datos
    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE email = $2',
      [hashAdmin, 'admin@arnolcaicedo.com']
    );
    console.log('✅ Password actualizado: admin@arnolcaicedo.com → admin123');
    
    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE email = $2',
      [hashTecnico, 'tecnico@arnolcaicedo.com']
    );
    console.log('✅ Password actualizado: tecnico@arnolcaicedo.com → tecnico123');
    
    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE email = $2',
      [hashRecepcion, 'recepcion@arnolcaicedo.com']
    );
    console.log('✅ Password actualizado: recepcion@arnolcaicedo.com → recepcion123');
    
    console.log('\n✨ ¡Contraseñas actualizadas exitosamente!');
    console.log('\n📝 Ahora puedes iniciar sesión con:');
    console.log('   - admin@arnolcaicedo.com / admin123');
    console.log('   - tecnico@arnolcaicedo.com / tecnico123');
    console.log('   - recepcion@arnolcaicedo.com / recepcion123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error actualizando passwords:', error);
    process.exit(1);
  }
};

actualizarPasswords();
