const client = require('../models/users.model');
const db = require('../config/db');
const bcrypt = require('bcrypt');

function sanitizeUser(u) {
  if (!u) return u;
  const { password, ...safe } = u;
  return safe;
}

exports.getUsers = (req, res) => {
  client.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuarios' });
    const safe = Array.isArray(results) ? results.map(sanitizeUser) : [];
    res.json(safe);
  });
};

exports.getUser = (req, res) => {
  const id = req.params.id;
  client.getOne(id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuario' });
    const row = Array.isArray(results) && results.length ? sanitizeUser(results[0]) : null;
    if (!row) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(row);
  });
};

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      cohort = null,
      email,
      phone = null,
      place_id = 1,
      disponibility = 1,
      password,
      schedule = 'am',
      role = 'user',
      clan_id = 1,
      description = null,
      english_level = 'A2',
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email y password son obligatorios' });
    }

    const allowedRoles = new Set(['admin', 'user']);
    const safeRole = allowedRoles.has(role) ? role : 'user';

    const hash = await bcrypt.hash(password, 15);

    const sql = `INSERT INTO users
      (name, cohort, email, phone, place_id, disponibility, password, schedule, role, clan_id, description, english_level)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = [
      name,
      cohort,
      email,
      phone,
      place_id,
      disponibility,
      hash,
      schedule,
      safeRole,
      clan_id,
      description,
      english_level,
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
        }
        return res.status(500).json({ message: 'Error al crear usuario' });
      }
      return res.status(201).json({
        message: 'Usuario creado',
        id: result.insertId,
        user: sanitizeUser({
          id: result.insertId,
          name,
          cohort,
          email,
          phone,
          place_id,
          disponibility,
          schedule,
          role: safeRole,
          clan_id,
          description,
          english_level,
        }),
      });
    });
  } catch (e) {
    return res.status(500).json({ message: 'Error interno al crear usuario' });
  }
};
