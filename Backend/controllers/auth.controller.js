const { generateToken, createAuthCookie, comparePassword, hashPassword } = require("../utils/auth.utils");
const client = require('../models/auth.model');
const generalClient = require('../models/general.model')

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
  generalClient.cityId(data, (err, cityResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (cityResults.length === 0) return res.status(404).json({ error: "Ciudad no encontrada" });

    const placeId = cityResults[0].id;

  
    generalClient.clanId(data, (err, clanResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (clanResults.length === 0) return res.status(404).json({ error: "Clan no encontrado" });

      const clanId = clanResults[0].id;
              const modifiedData = {
                password : hashedPassword,
                place_id : placeId,
                clan_id : clanId
              };
                client.create(data, modifiedData, (err, result) =>{
                if (err) return res.status(500).json({error: err.message});
                res.json({message : "User succesfully created"});
              });
            }
          );
        }
      );
    };
