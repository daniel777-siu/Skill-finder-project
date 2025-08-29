const client = require('../models/users.model');
const { comparePassword,hashPassword } = require('../utils/auth.utils');
const generalClient = require('../models/general.model')


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
    const hashedNewPassword = await hashPassword(newPassword)
    client.changePassword(id, hashedNewPassword, (err, result) =>{
      if (err) {
        return res.status(500).json({ message: "Error al cambiar contraseña" });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "No se pudo actualizar la contraseña" });
      }

      res.json({ message: "Contraseña actualizada correctamente" });
      res.json({message : 'Contraseña actualizada con exito'})
    })
  });
  
};


exports.updateAdmin = async (req,res) => {
  const id = req.params.id;
  const data = req.body;
  generalClient.cityId(data, (err, cityResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (cityResults.length === 0) return res.status(404).json({ error: "Ciudad no encontrada" });
  
      const placeId = cityResults[0].id;
  
    
      generalClient.clanId(data, (err, clanResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (clanResults.length === 0) return res.status(404).json({ error: "Clan no encontrado" });
  
        const clanId = clanResults[0].id;
                const modifiedData = {
                  place_id : placeId,
                  clan_id : clanId
                };
                client.adminUpdate(id, data, modifiedData, (err, result) =>{
                if (err) return res.status(500).json({error: err.message});
                res.json({message : "Usuario actualizado con exito"});
              });
            }
          );
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

exports.showUserTeams = (req, res) => {
    const id = req.params.id;
    client.showUserTeams(id, (err, results) => {
        if (err) throw (err);
        res.json(results)
    });
};