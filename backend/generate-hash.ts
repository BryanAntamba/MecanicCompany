import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash para usar en SQL:');
  console.log(hash);
}

generateHash();
