const db = require ('../config/db.js')

module.exports = {
     enrollLanguague(data, cb){
        db.query('INSERT INTO user_languague VALUES (?, ?)',
            [data.user_id,data.languague_id],
            (err, result) => {
                if (err) return cb(err, null);
                cb(null, result);
            }
        );
    },
    showUserLanguagues(id, cb){
        db.query('SELECT u.id,u.name,l.languague FROM user_languague ul JOIN users u ON u.id = ul.user_id JOIN languagues l ON l.id = ul.languague_id WHERE id = ?',
            [id],
            (err, results) =>{
                if(err) return cb(err, null);
                cb(null, results)
            }
        );
    },
    showLanguagues(cb){
        db.query('SELECT * FROM languagues',
            (err, results) => {
                if (err) return cb(err, null);
                cb(null, results)
            }
        );
    },
    quitLanguague(data, cb){
        db.query('DELETE FROM user_languague WHERE user_id = ? AND languague_id = ?',
            [data.user_id, data.languague_id],
            (err, result) => {
                if (err) return cb(err, null);
                cb(null, result)
            }
        );
    }
}