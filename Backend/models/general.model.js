const db = require ('../config/db.js')

module.exports = {
    cityId(data, cb){
        db.query('SELECT id FROM places WHERE city = ?',
            [data.place],
            (err, results) => {
                if (err) return cb(err, null);
                cb(null, results)
            }
        );
    },
    clanId(data, cb){
        db.query('SELECT id FROM clans WHERE clan_name = ?',
            [data.clan],
            (err, results) => {
                if (err) return cb(err, null);
                cb(null, results)
            }
        );
    }
}