#!/usr/bin/env node
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const bcrypt = require("bcrypt");
const db = require("../config/db");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--name") args.name = argv[++i];
    else if (a === "--cohort") args.cohort = argv[++i];
    else if (a === "--email") args.email = argv[++i];
    else if (a === "--phone") args.phone = argv[++i];
    else if (a === "--place_id") args.place_id = parseInt(argv[++i], 10) || 1;
    else if (a === "--disponibility")
      args.disponibility = parseInt(argv[++i], 10) || 1;
    else if (a === "--password") args.password = argv[++i];
    else if (a === "--schedule") args.schedule = argv[++i];
    else if (a === "--role") args.role = argv[++i];
    else if (a === "--clan_id") args.clan_id = parseInt(argv[++i], 10) || 1;
    else if (a === "--description") args.description = argv[++i];
    else if (a === "--english_level") args.english_level = argv[++i];
  }
  return args;
}

(async () => {
  const pool = db.promise();
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.email || !args.password || !args.name) {
      console.error(
        'Uso: node scripts/create-user.js --name "Nombre" --email "correo@dominio.com" --password "ContraseñaSegura" [--role admin|user] [--phone ...] [--cohort ...]'
      );
      process.exit(1);
    }

    const role = (args.role || "user").toLowerCase();
    const ALLOWED_ROLES = new Set(["admin", "user"]);
    const safeRole = ALLOWED_ROLES.has(role) ? role : "user";

    // Migración defensiva del ENUM de role y conversión 'team leader' -> 'user'
    try { await pool.query("ALTER TABLE users MODIFY role ENUM('admin','team leader','user') NOT NULL DEFAULT 'user'"); } catch {}
    try { await pool.query("UPDATE users SET role='user' WHERE role='team leader'"); } catch {}
    try { await pool.query("ALTER TABLE users MODIFY role ENUM('admin','user') NOT NULL DEFAULT 'user'"); } catch {}

    // Asegurar FKs mínimas (si existen esas tablas)
    try {
      await pool.query(
        "INSERT INTO places (id) VALUES (1) ON DUPLICATE KEY UPDATE id=id"
      );
    } catch {}
    try {
      await pool.query(
        "INSERT INTO clans (id) VALUES (1) ON DUPLICATE KEY UPDATE id=id"
      );
    } catch {}

    const hash = await bcrypt.hash(args.password, 15);

    const sql = `INSERT INTO users
      (name, cohort, email, phone, place_id, disponibility, password, schedule, role, clan_id, description, english_level)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = [
      args.name,
      args.cohort || null,
      args.email,
      args.phone || null,
      args.place_id || 1,
      args.disponibility || 1,
      hash,
      args.schedule || "am",
      safeRole,
      args.clan_id || 1,
      args.description || null,
      args.english_level || "A2",
    ];

    await pool.execute(sql, params);
    console.log(`Usuario creado: ${args.email} (role: ${safeRole})`);
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      console.error("Error: Ya existe un usuario con ese email.");
      process.exit(2);
    }
    console.error("Error al crear usuario:", err.message || err);
    process.exit(3);
  } finally {
    if (typeof db.end === "function") {
      db.end(() => process.exit(0));
    } else {
      process.exit(0);
    }
  }
})();
