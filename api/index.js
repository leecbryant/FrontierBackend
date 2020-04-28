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

// Horse Images Pull
router.get('/horseimages', function (req, res) {
    mysql.query("SELECT * FROM horses_images", function (err, halls) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": halls});
    }
    });
});

// Horse Treatment Pull
router.get('/horsetreatments', function (req, res) {
    mysql.query("SELECT * FROM horses_treatments", function (err, halls) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": halls});
    }
    });
});


// Horse Markings Pull
router.get('/horsemarkings', function (req, res) {
    mysql.query("SELECT * FROM horses_markings", function (err, halls) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": halls});
    }
    });
});

module.exports = router;