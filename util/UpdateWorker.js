const Hasher = require('./PasswordHasher');
const sqlite3 = require('sqlite3').verbose();

exports.UpdateDetails = (params) => {

    return new Promise((resolve,reject) => {
        let db = new sqlite3.Database('./db/database.db', (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the SQlite database.');
        });

        console.log(params.email);

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
                
                if(hash === row.passsword) {
                    // Continue with Update Process
                    let sql = `UPDATE patients
                                SET 
                                    name = ?,
                                    phone = ?,
                                    address = ?
                                WHERE email = ?`;

                    db.run(sql,[params.name,params.phone,params.address,params.email], (err,row) => {
                        if(err) {
                            resolve({
                                "success":false,
                                "error" : err.message
                            });
                        }
                        resolve({
                            "success": true,
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