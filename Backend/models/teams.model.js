const db = require ('../config/db.js')


module.exports = {
    getAll(cb){
        db.query('SELECT * FROM teams', (err, results) =>{
            if (err) return cb(err);
                cb(null, results);
        }
        );
    },
    getOne(id,cb){
        db.connectDataBase()
        db.query('SELECT * FROM teams WHERE id= ?', 
            [id],
            (err, results) =>{
                if (err) throw cb(err)
                    cb(null, results)
            }
        )
        
    }
}; 