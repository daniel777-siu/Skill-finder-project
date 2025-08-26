const { generateToken, createAuthCookie, comparePassword, hashPassword } = require("../utils/auth.utils");
const client = require('../models/auth.model');
const db = require ('../config/db.js');

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
   client.getOne(email, async (err, results) => {
    if (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas (email)" });
    }

    const user = results[0];
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas (email)" });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas (password)" });
    }

    const token = generateToken(user);
    createAuthCookie(res, token);

    return res.json({
      message: "Login exitoso",
      user: { id: user.id, email: user.email, role: user.role }
    });
  });
};

exports.registerUser = async (req, res) => {
  const data = req.body;
  const hashedPassword = await hashPassword(data.password)
  db.query('SELECT id FROM places WHERE city = ?',
    [data.place],
    (err, results) => {
      if (err) return (err);
       if (results.length > 0) {
        const place_id = results[0].id; 
        db.query('SELECT id FROM clans WHERE clan_name = ?',
          [data.clan],
          (err, results) => {
            if (err) return (err);
            if (results.length > 0) {
            const clan_id = results[0].id;
              const modifiedData = {
                password : hashedPassword,
                place_id : place_id,
                clan_id : clan_id
              };
                client.create(data, modifiedData, (err, result) =>{
                if (err) return res.status(500).json({error: err.message});
                res.json({message : "User succesfully created"});
              });
              
            } else {
              console.log("No se encontró el clan");
            }
          }
        );
    } else {
      console.log("No se encontró el clan");
    }
    }
  );
  
  
};
