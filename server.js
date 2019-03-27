const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const handle = require('express-handlebars');

const ServerConfig = require('./config.json');
const ServerState = ServerConfig.ServerState;
const PORT = process.env.PORT || ServerConfig.PORT


const app = express();




const AddWorker = require('./util/AddWorker');
const UpdateWorker = require('./util/UpdateWorker');
const DeleteWorker = require('./util/DeleteWorker');
const ConsoleScreen = require('./util/ConsoleScreen');


//------------------------------------------------------------------------------------------------------//
// S E R V E R ============================== E X P R E S S =============================== S E R V E R //
//------------------------------------------------------------------------------------------------------//

app.listen(PORT, () => {
    ConsoleScreen.StartupScreen({
        "PORT": PORT,
        "ServerState": ServerState
    });
});

app.set('views', path.join(__dirname, 'user'));

app.engine('hbs', handle({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/user/layouts',
    partialsDir  : [
        __dirname + '/user/partials',
    ]
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'user')));

//--------------------------------------------------------------------------//
// R O U T E R ================ E X P R E S S ================= R O U T E R //
//--------------------------------------------------------------------------//

app.get('/', (req,res) => {
    res.render('index', { title: 'Home'});
});


app.get('/addnew', (req,res) => {
    res.render('addnew', {title: 'Add New'});
});

app.get('/update', (req,res)=> {
    res.render('update', {title: 'Update'});
});

app.get('/delete', (req,res) => {
    res.render('delete', {title: 'Delete'});
});


app.post('/addnewWorker', (req,res) => {
    let params = getParameters(req);

    AddWorker.AddNewUser({
        "name": params.name,
        "email": params.email,
        "phone": params.phone,
        "address": params.address,
        "password":params.password,
        "verify": params.verify
    }).then((_res) => {
        console.log(_res);
        if(_res.success){
            res.status(200).json({"state": "SUCCESS"});
        }
        else {
            res.status(200).json({"state" : _res.error});
        }
    });
});


app.post('/updateWorker', (req,res) => {
    let params = getParameters(req);

    UpdateWorker.UpdateDetails({
        "name": params.name,
        "email": params.email,
        "phone": params.phone,
        "address" : params.address,
        "password" : params.password
    }).then((_res) => {
        console.log(_res);

        if(_res.success){
            res.status(200).json({"state": "SUCCESS"});
        }
        else {
            res.status(200).json({"state": _res.error});
        }
    });
});

app.post('/deleteWorker', (req,res) => {
    let params = getParameters(req);

    UpdateWorker.UpdateDetails({
        "email": params.email,
        "password" : params.password
    }).then((_res) => {
        console.log(_res);

        if(_res.success){
            res.status(200).json({"state": "SUCCESS"});
        }
        else {
            res.status(200).json({"state": _res.error});
        }
    });
});





//===============================================================================================================//
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