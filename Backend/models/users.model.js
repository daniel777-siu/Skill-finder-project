const db = require ('../config/db.js')

module.exports = {
    getAll(cb){
        const sql = `SELECT id, name, cohort, email, phone, place_id, disponibility, schedule, role, clan_id, description, english_level FROM users`;
        db.query(sql, (err, results) =>{
            if (err) return cb(err);
            cb(null, results);
        });
    },
    getOne(id,cb){
        const sql = `SELECT id, name, cohort, email, phone, place_id, disponibility, schedule, role, clan_id, description, english_level FROM users WHERE id = ?`;
        db.query(sql, [id], (err, results) =>{
            if (err) return cb(err);
            cb(null, results);
        });
    },

    create(user, cb){
    db.query('INSERT INTO users ( name, cohort, email, phone, disponibility, password, schedule, role) VALUES ?,?,?,?,?,?,?,?', [ user.name, user.cohort, user.email, user.phone, user.disponibility, user.password, user.schedule, user.password],
        (err, result) => {
        if (err) return cb(err);
        cb(null, result);
    });
},

    update(id, user, cb) {
    db.query('UPDATE users SET name = ?, cohort = ?, email = ?, phone = ?, disponibility = ?, password = ?, schedule = ?, role = ? WHERE id = ?', [user.name, user.cohort, user.email, user.phone, user.disponibility, user.password, user.schedule, user.password],
        (err, result) => {
        if (err) return cb(err);
        cb(null, result);
    });
    },

    delete(id, cb) {
        db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
            if (err) return cb(err);
            cb(null, result);
        });
    }

}; 