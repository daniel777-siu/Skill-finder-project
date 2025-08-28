const db = require ('../config/db.js')

module.exports = {
    getAll(cb){
        db.query('SELECT * FROM users', (err, results) =>{
            if (err) return cb(err);
                cb(null, results);
        }
        );
    },
    getOne(id,cb){
        db.query('SELECT * FROM users WHERE id= ?', 
            [id],
            (err, results) =>{
                if (err) throw cb(err)
                    cb(null, results)
            }
        );
    },
    update (id, data, cb){
        db.query("UPDATE users SET name =?, email = ?, phone = ?, disponibility = ? , description = ? WHERE id = ?",
            [data.name,data.email,data.phone ?? null,data.disponibility,data.description ?? null,id],
            (err, results) =>{
                if (err) return cb(err, null);
                cb(null, results);
            }
        );
    },
    changePassword(id,newPassword, cb){
        db.query('UPDATE users SET password = ? WHERE id =',
            [newPassword, id],
            (err, results) =>{
                if (err) return cb(err, null);
                cb(null, results)
            }
        )
    },
    adminUpdate(id, data, modifiedData, cb){
        db.query('UPDATE users SET name =?, cohort = ?, email = ?, phone = ?, place_id = ?, disponibility = ? , schedule = ?, role = ?, clan_id = ?, description = ?, english_level = ? WHERE id = ?',
            [data.name, data.cohort, data.email, data.phone, modifiedData.place_id, data.disponibility, data.schedule, data.role, modifiedData.clan_id, data.description, data.english_level, id],
            (err, result) => {
                if (err) return cb(err);
                cb(null, result);
            }
        );
    },
    delete(id, cb){
        db.query('DELETE FROM users WHERE id = ?',
            [id],
            (err, result) => {
                if (err) return cb(err, null);
                cb(null, result)
            }
        )
    },
    showUserTeams(id, cb){
        db.query('SELECT u.id AS user_id, u.name, ut.team_role, t.id AS team_id, t.team_name AS project_name FROM user_team ut JOIN users u ON u.id = ut.user_id JOIN teams t ON t.id = ut.team_id WHERE u.id = ?',
            [id],
            (err, result) => {
                if (err) return cb(err, null);
                cb(null, result);
            }
        );
    }
}; 