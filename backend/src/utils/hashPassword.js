import bcrypt from 'bcryptjs';

// Script para generar hash de contraseñas
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log('---');
  return hash;
};

// Generar hashes para los usuarios por defecto
const generarHashesDefecto = async () => {
  console.log('Generando hashes para usuarios por defecto:\n');
  
  await hashPassword('admin123');
  await hashPassword('tecnico123');
  await hashPassword('recepcion123');
  
  process.exit(0);
};

generarHashesDefecto();
