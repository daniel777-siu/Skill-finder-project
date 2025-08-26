const db = require ('../config/db.js');

module.exports = {
    getOne(email, cb){
        db.query('SELECT id, email, password, role FROM users WHERE email = ?', 
            [email],
        (err, results) => {
            if (err) throw cb(err, null)
            cb(null, results)
        });
    }
};