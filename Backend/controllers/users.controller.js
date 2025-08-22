const client = require('../models/users.model');


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