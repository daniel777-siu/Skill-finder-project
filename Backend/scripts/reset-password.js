#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const db = require('../config/db');

function parseArgs(argv){
  const args = {};
  for(let i=0;i<argv.length;i++){
    const a = argv[i];
    if(a === '--email') args.email = argv[++i];
    else if(a === '--password') args.password = argv[++i];
  }
  return args;
}

(async () => {
  try{
    const { email, password } = parseArgs(process.argv.slice(2));
    if(!email || !password){
      console.error('Uso: node scripts/reset-password.js --email "correo@dominio.com" --password "NuevaContraseña"');
      process.exit(1);
    }

    const saltRounds = 15;
    const hash = await bcrypt.hash(password, saltRounds);

    const pool = db.promise();

    const [rows] = await pool.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    if(rows.length === 0){
      console.error(`No existe un usuario con email: ${email}`);
      await db.end?.();
      process.exit(2);
    }

    await pool.execute('UPDATE users SET password = ? WHERE email = ?', [hash, email]);

    console.log(`Contraseña actualizada correctamente para ${email}`);
  }catch(err){
    console.error('Error al resetear la contraseña:', err.message || err);
    process.exit(3);
  }finally{
    // Cerrar pool si es posible (mysql2 pool)
    if (typeof db.end === 'function') {
      db.end(() => process.exit(0));
    } else {
      process.exit(0);
    }
  }
})();
