#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const db = require('../config/db');


const users = [
  // usuario (rol básico sin permisos)
  {
    name: 'Usuario Demo',
    cohort: 'cohorte 1',
    email: 'usuario@example.com',
    phone: '3000000001',
    place_id: 1,
    disponibility: 1,
    password: 'Usuario123*',
    schedule: 'am',
    role: 'user',
    clan_id: 1,
    description: 'Rol usuario sin permisos',
    english_level: 'A2',
  },
  // team leader (sin permisos en backend)
  {
    name: 'Team Leader Demo',
    cohort: 'cohorte 1',
    email: 'tl@example.com',
    phone: '3000000002',
    place_id: 1,
    disponibility: 1,
    password: 'TeamLeader123*',
    schedule: 'am',
    role: 'user',
    clan_id: 1,
    description: 'Rol team leader sin permisos en backend',
    english_level: 'B1',
  },
  {
    name: 'Ana Martínez',
    cohort: 'cohorte 5',
    email: 'ana@example.com',
    phone: '3001112222',
    place_id: 1,
    disponibility: 1, 
    password: 'Ana123*', 
    schedule: 'am',
    role: 'user',
    clan_id: 1,
    description: 'Interesada en frontend y UX',
    english_level: 'A2',
  },
  {
    name: 'Carlos Ruiz',
    cohort: 'cohorte 4',
    email: 'carlos@example.com',
    phone: '3002223333',
    place_id: 2,
    disponibility: 2,
    password: 'Carlos123*',
    schedule: 'pm',
    role: 'user',
    clan_id: 2,
    description: 'Backend con Node.js',
    english_level: 'B1',
  },
  {
    name: 'Laura Gómez',
    cohort: 'cohorte 3',
    email: 'laura@example.com',
    phone: '3003334444',
    place_id: 1,
    disponibility: 1,
    password: 'Laura123*',
    schedule: 'am',
    role: 'user',
    clan_id: 1,
    description: 'Data y SQL',
    english_level: 'A2',
  },
  {
    name: 'Admin 2',
    cohort: 'cohorte 2',
    email: 'admin2@example.com',
    phone: '3004445555',
    place_id: 1,
    disponibility: 1,
    password: 'Admin2*123',
    schedule: 'am',
    role: 'admin',
    clan_id: 1,
    description: 'Administrador secundario',
    english_level: 'B1',
  },
  {
    name: 'Team Leader 2',
    cohort: 'cohorte 3',
    email: 'tl2@example.com',
    phone: '3005556666',
    place_id: 1,
    disponibility: 2,
    password: 'Tl2*12345',
    schedule: 'pm',
    role: 'user',
    clan_id: 2,
    description: 'Coordina equipo de backend',
    english_level: 'B1',
  },
];

async function run(){
  const pool = db.promise();
  try{
    console.log('Sembrando usuarios...');

    // Asegurar filas referenciadas por FKs (places y clans)
    try {
      await pool.query(
        "INSERT INTO places (id) VALUES (1),(2) ON DUPLICATE KEY UPDATE id=id"
      );
    } catch (e) {
      console.warn('Aviso: No se pudieron insertar places (continuando):', e.message);
    }
    try {
      await pool.query(
        "INSERT INTO clans (id) VALUES (1),(2) ON DUPLICATE KEY UPDATE id=id"
      );
    } catch (e) {
      console.warn('Aviso: No se pudieron insertar clans (continuando):', e.message);
    }

    // Migra roles existentes: asegurar 'user' en ENUM si aplica, convertir 'team leader' -> 'user', y dejar ENUM ('admin','user')
    try {
      await pool.query("ALTER TABLE users MODIFY role ENUM('admin','team leader','user') NOT NULL DEFAULT 'user'");
    } catch (e) {
      console.warn('Aviso: No se pudo ampliar ENUM de role (continuando):', e.message);
    }
    try {
      await pool.query("UPDATE users SET role='user' WHERE role='team leader'");
    } catch (e) {
      console.warn('Aviso: No se pudo actualizar roles existentes (continuando):', e.message);
    }
    try {
      await pool.query("ALTER TABLE users MODIFY role ENUM('admin','user') NOT NULL DEFAULT 'user'");
    } catch (e) {
      console.warn('Aviso: No se pudo reducir ENUM de role (continuando):', e.message);
    }

    // Pre-hashear contraseñas y normalizar roles a valores aceptados por la tabla ('admin' | 'user')
    const saltRounds = 15;
    const toInsert = [];
    const ALLOWED_ROLES = new Set(['admin', 'user']);
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, saltRounds);
      const safeRole = ALLOWED_ROLES.has(u.role) ? u.role : 'user';
      toInsert.push({ ...u, password: hash, role: safeRole, place_id: 1, clan_id: 1 });
    }

    // Inserción con columnas explícitas y upsert por email
    const sql = `
      INSERT INTO users
      (name, cohort, email, phone, place_id, disponibility, password, schedule, role, clan_id, description, english_level)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        cohort = VALUES(cohort),
        phone = VALUES(phone),
        place_id = VALUES(place_id),
        disponibility = VALUES(disponibility),
        password = VALUES(password),
        schedule = VALUES(schedule),
        role = VALUES(role),
        clan_id = VALUES(clan_id),
        description = VALUES(description),
        english_level = VALUES(english_level)
    `;

    const values = toInsert.map(u => [
      u.name,
      u.cohort,
      u.email,
      u.phone,
      u.place_id,
      u.disponibility,
      u.password, // hash
      u.schedule,
      u.role,
      u.clan_id,
      u.description,
      u.english_level,
    ]);

    const [result] = await pool.query(sql, [values]);
    console.log('Insert/Update completado. Filas afectadas:', result.affectedRows);
    console.log('Usuarios procesados:', toInsert.map(u => u.email).join(', '));
  } catch(err){
    console.error('Error en seed-users:', err.message || err);
    process.exitCode = 1;
  } finally {
    // Cerrar pool correctamente
    if (typeof db.end === 'function') {
      db.end(() => process.exit());
    } else {
      process.exit();
    }
  }
}

run();
