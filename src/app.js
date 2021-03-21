const path = require('path');
const api1 = require('./apiUser.js');
const api2 = require('./apiFriend.js');
const api3 = require('./apiMessage.js');

//connexion à la base de données sqlite3
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');


//connexion à mongodb
var Datastore = require('nedb')
mdb = new Datastore();

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
const app = express()
api_1 = require("./apiUser.js");
api_2 = require("./apiFriend.js");
api_3 = require("./apiMessage.js");
const session = require("express-session");

app.use(session({
    secret: "technoweb rocks"
}));

app.use('/api', api1.default(db));
app.use('/apiFriend', api2.default(db));
app.use('/apiMessage', api3.default(mdb));

app.on('close', () => {
    db.close();
});


exports.default = app;

