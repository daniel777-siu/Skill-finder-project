const client = require('../models/users.model');
const { comparePassword, hashPassword } = require('../utils/auth.utils');


exports.getUsers = (req,res)=>{
    client.getAll((err, results) =>{
        if (err) throw err
        res.json(results);
    });
};

exports.getUser = (req, res) =>{
    const id = req.params.id;
    client.getOne(id,(err, results) => {
        if (err) throw err;
        res.json(results)
    })
}

exports.updateCoders = (req, res) => {
  const data = req.body;
  const id = req.params.id;
  client.update(id, data, (err) =>{
    if (err) return res.status(500).json({error : err.message});
    res.json({message : 'Informacion actualizada exitosamente'});
  });
};

exports.changePassword = async(req, res) =>{
  const id = req.params.id;
  const {password, newPassword} = req.body;
  client.getOne(id, async (err, results) => {
    if (err) {
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
    if (!validPassword) return res.status(401).json({ message: "Credenciales inválidas (password)" });
    client.changePassword(id, newPassword, (err) =>{
      if (err) res.status(500).json({error : err.message});
      res.json({message : 'Contraseña actualizada con exito'})
    })
  });
  
};


exports.updateAdmin = async (req,res) => {
  const id = req.params.id;
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
                client.updateAdmin(id, data, modifiedData, (err, result) =>{
                if (err) return res.status(500).json({error: err.message});
                res.json({message : "Usuario actualizado con exito"});
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

exports.deleteUser = (req,res) =>{
    const id = req.params.id;
    client.delete(id, (err) =>{
        if (err) return res.status(500).json({error : err.message});
        res.json({message : 'Usuario eliminado correctamente'});
    });
};