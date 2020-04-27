var express = require('express');
var router = express.Router();
var mysql = require('../config/config');
const nJwt = require('njwt');
const config = require('../config/jwt_config');

// Horse Data Pull
router.get('/horses', function (req, res) {
    mysql.query("SELECT * FROM horses", function (err, halls) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": halls});
    }
    });
});

module.exports = router;