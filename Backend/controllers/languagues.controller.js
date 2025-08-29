const client = require('../models/languagues.model');


exports.showLanguagues = (req,res) => {
    client.showLanguagues((err, results) =>{
        if (err) throw err
        res.json(results);
    });
};

exports.enrollLanguague = (req, res) =>{
    const data = req.body;
    client.enrollLanguague(data, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'lenguaje asignado exitosamente'});
    });
};

exports.userLanguagues = (req,res) =>{
    const id = req.params.id;
    client.showUserLanguagues(id, (err, results) => {
         if (err) throw err
        res.json(results);
    });
};

exports.quitLanguague = (req, res) =>{
    const data = req.body;
    client.quitLanguague(data, (err) => {
        if (err) return res.status(500).json({error : err.message});
        res.json({message : 'Usuario eliminado correctamente'});
    })
}