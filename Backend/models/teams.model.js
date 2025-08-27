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

    create(team, cb) {
        db.query('INSERT INTO teams ( team_name, description) VALUES ?,?', [ team.team_name, team.description],
            (err, result) => {
            if (err) return cb(err);
            cb(null, result);
        });
    },
    update(id, team, cb) {
        db.query('UPDATE teams SET team_name = ?, description = ? WHERE id = ?', [team.team_name, team.description],
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
    }
}; 