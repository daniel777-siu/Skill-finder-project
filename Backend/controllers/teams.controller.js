const client = require('../models/teams.model');


exports.getTeams = (req,res)=>{
    client.getAll((err, results) =>{
        if (err) throw err
        res.json(results);
    });
};

exports.getTeam = (req, res) =>{
    const id = req.params.id;
    client.getOne(id,(err, results) => {
        if (err) throw err;
        res.json(results)
    });
};

exports.joinTeam = (req, res) => {
    const data = req.body;
    client.joinTeam(data,(err, results) =>{
        if (err) throw(err);
        res.json(results)
    });

};

exports.createTeam = (req, res) =>{
    const data = req.body;
    client.create(data, (err) =>{
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'equipo creado exitosamente'});
    });
};

exports.updateTeam = (req, res) =>{
    const data = req.body;
    const id = req.params;
    client.update(id, data, (err) =>{
        if (err) return res.status(500).json({error: err.message});
        res.json({message: 'equipo actualizado correctamente'});
    });
};

exports.deleteTeam = (req,res) =>{
    const id = req.params;
    client.delete(id, (err) =>{
        if (err) return res.status(500).json({error : err.message});
        res.json({message : 'equipo eliminado correctamente'});
    });
};
