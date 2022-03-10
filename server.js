'use strict'

var express = require("express");
var bodyParser = require('body-parser');
var app = express();

var dbConfig = require('./config/database.config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

process.on('uncaughtException', function (err) {
    console.log('***********Common Error************');
    console.error(new Error(err));
})

const mongoose = require("mongoose");

mongoose.Promise =global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully Connected to Database")
}).catch(err => {
    console.log("DB Error-->", err)
    console.log("Unable to Connect Database right now!");
    process.exit();
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    next();
});
require('dotenv').config({path: __dirname + '/local.env'})

require('./routes')(app);
app.get('/', (req, res) => {
    res.json({"message" : "Welcome to API "});
})

app.get('/test', (req, res) => {
    res.json({"message" : "Test Working successfully "});
})
let PORT = process.env.PORT || 9020;

app.listen(PORT, () => {
    console.log("Server Started!! Listening on port - " + PORT)
})

module.exports = app;