const Hasher = require('./PasswordHasher');
const sqlite3 = require('sqlite3').verbose();

exports.DeleteDetails = (params) => {

    return new Promise((resolve,reject) => {
        let db = new sqlite3.Database('./db/database.db', (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the SQlite database.');
        });

        console.log(params);

        db.get(`SELECT * FROM patients WHERE email = ?`, [params.email], (err,row) => {
            console.log(row)
            if(!row){
                console.log("NO USER");
                resolve({
                    "success": false,
                    "error":"NO-USER"
                });
            }
            else {
                let salt = row.salt;
                let hash = Hasher.generateHash(params.password, salt);
                console.log(hash);

                if(hash === row.password) {
                    // Continue with Update Process
                    let sql = `DELETE FROM patients WHERE rowid=?`;

                    db.run(sql,[row.id], (err,row) => {
                        if(err) {
                            resolve({
                                "success":false,
                                "error" : err.message
                            });
                        }
                        resolve({
                            "success": true
                        });
                    });
                } else {
                    resolve({
                        "success":false,
                        "error": "WRG-PASS"
                    });
                }
            }
        });
    })
    
}