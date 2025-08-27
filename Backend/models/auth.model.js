const db = require ('../config/db.js');

module.exports = {
    getOne(email, cb){
        db.query('SELECT id, email, password, role FROM users WHERE email = ?', 
            [email],
        (err, results) => {
            if (err) throw cb(err, null)
            cb(null, results)
        });
    },
    create(data,modifiedData, cb){
        db.query('INSERT INTO users(name, cohort, email, phone, place_id, disponibility, password, schedule, role, clan_id, description, english_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [data.name, data.cohort, data.email, data.phone, modifiedData.place_id, data.disponibility, modifiedData.password, data.schedule, data.role, modifiedData.clan_id, data.description, data.english_level],
            (err, result) => {
                if (err) return cb(err);
                cb(null, result);
            }
        );
    }
};