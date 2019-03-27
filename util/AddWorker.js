const Hasher = require('./PasswordHasher');
const sqlite3 = require('sqlite3').verbose();


exports.AddNewUser = function (params) {

    let db = new sqlite3.Database('./db/database.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });

    let salt = generateSalt(12);
    let uid = generateUserId();
    let hash = Hasher.generateHash(params.password, salt);

    return new Promise((resolve,reject) => {
        console.log(params);

        //check for user existence
        db.get(`SELECT email FROM patients WHERE email = ?`,[params.email], (err,row) => {
            if (!row) {
                // insert one row into the langs table
                console.log('INSERTING ROW')
                db.run(`INSERT INTO patients VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [decodeURI(params.name), params.email, params.phone, decodeURI(params.address), hash, getDateTime(), uid, salt], function(err) {
                    if (err) {
                        console.log(err.message);
                        resolve({
                            'success' : false,
                            'error' : err.message
                        });
                    }
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
                resolve({
                    'success' : true
                });
            }
            else {
                resolve({
                    'success' : false,
                    'error' : 'USER-EXIST'
                });
            }
        });
        db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    });  
}






function getDateTime() {
    var date = new Date();

    var hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var year = date.getFullYear();
    var month = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();   

    return ( `${hour}:${min}:${sec} ${day}/${month}/${year}`);
}

function generateUserId() {
    var userId = "";
    var date = new Date();

    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var mon = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();

    var dateOrder = [ mon, day, min, sec ];

        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2)].toString(); 
        }
        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2 + 2)].toString(); 
        }

    // if(){

    // } else {
        return userId;
    //}
}

function generateSalt(length) {
    var salt = "";
    for(var i=0 ; i<length ; i++){
        salt = salt + Math.floor(Math.random()*16).toString(16);
    }
    return salt;
}

function getParameters(request){
    url = request.url.split('?');
    var query = {
        "action" : url[0]
    };
    if(url.length>=2){
        url[1].split('&').forEach((q)=>{
            try{
                query[q.split('=')[0]] = q.split('=')[1];
            } catch(e) {
                query[q.split('=')[0]] = '';
            }
        })
    }
    return query;
}