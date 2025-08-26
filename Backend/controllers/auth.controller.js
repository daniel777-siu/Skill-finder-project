const { generateToken, createAuthCookie, comparePassword } = require("../utils/auth.utils");
const client = require('../models/auth.model');

exports.loginUser = async (req, res) => {
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
