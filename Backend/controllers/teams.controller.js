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
    })
}

exports.joinTeam = (req, res) => {
    const data = req.body;
    client.joinTeam(data,(err, results) =>{
        if (err) throw(err);
        res.json(results)
    })

}