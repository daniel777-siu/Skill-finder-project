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
    client.joinTeam(data,(err) =>{
        if (err) return res.status(500).json({error : err.message});
        res.json({message : 'Te uniste al equipo con exito'});
    });

};

exports.createTeam = (req, res) =>{
    const data = req.body;
    client.create(data, (err, result) =>{
        if (err) return res.status(500).json({ error: err.message });
        const teamId = result.insertId;
        const joinData = {
            team_id : teamId,
            user_id : data.user_id,
            team_role: "leader"
        }
        client.joinTeam(joinData, (err) => {
            if (err) res.status(500).json({error : err.message});
        })
        res.json({ message: `equipo creado exitosamente`});
    });
};

exports.updateTeam = (req, res) =>{
    const data = req.body;
    const id = req.params.id;
    client.update(id, data, (err) =>{
        if (err) return res.status(500).json({error: err.message});
        res.json({message: 'equipo actualizado correctamente'});
    });
};

exports.deleteTeam = (req,res) =>{
    const id = req.params.id;
    client.delete(id, (err) =>{
        if (err) return res.status(500).json({error : err.message});
        res.json({message : 'equipo eliminado correctamente'});
    });
};

exports.showTeamUsers = (req, res) => {
    const id = req.params.id;
    client.showTeamUsers(id, (err, results) => {
        if (err) throw (err);
        res.json(results)
    });
};