const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https')
const fs = require('fs')

var AccountRouting = require('./api/users/account');
var BaseRouting = require('./api/index');

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    next();
});

app.use('/api/users/', AccountRouting);
app.use('/api/base/', BaseRouting);

app.listen(80, () => {
    console.log('App listening on port 3000');
});

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app).listen(3000, () => {
//     console.log('Listening...')
//   })
