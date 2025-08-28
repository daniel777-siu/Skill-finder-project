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
        db.query('SELECT * FROM teams WHERE id= ?', 
            [id],
            (err, results) =>{
                if (err) throw cb(err)
                cb(null, results)
            }
        );
        
    },

    create(data, cb) {
        db.query('INSERT INTO teams ( team_name, description) VALUES (?,?)', [ data.team_name, data.description],
            (err, result) => {
            if (err) return cb(err);
            cb(null, result);
        });
    },

    update(id, data, cb) {
        db.query('UPDATE teams SET team_name = ?, description = ? WHERE id = ?', [data.team_name, data.description, id],

            (err, result) => {
            if (err) return cb(err);
            cb(null, result);
        });
    },
    delete(id, cb) {
        db.query('DELETE FROM teams WHERE id = ?', [id], (err, result) => {
            if (err) return cb(err);
            cb(null, result);
        });
    },
    joinTeam(data, cb){
        db.query('INSERT INTO user_team(team_id,user_id,team_role) VALUES (?,?,?)',
            [data.team_id, data.user_id, data.team_role],
            (err, result) => {
                if (err) return cb(err, null);
                cb(null, result);
            }
        );
    },
    showTeamUsers(id, cb){
        db.query('SELECT u.id AS user_id, u.name, ut.team_role, t.id AS team_id, t.team_name AS project_name FROM user_team ut JOIN users u ON u.id = ut.user_id JOIN teams t ON t.id = ut.team_id WHERE t.id = ?',
            [id],
            (err, result) =>{
                if (err) return cb(err, null);
                cb(null, result);
            }
        );
    }
}; 