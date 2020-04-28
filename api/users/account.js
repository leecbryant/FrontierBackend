var express = require('express');
var router = express.Router();
var mysql = require('../../config/config');
const bcrypt = require('bcrypt');
const nJwt = require('njwt');
const config = require('../../config/jwt_config');

const saltRounds = 10;

// Registration
router.post('/register', function(req, res) {
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.form.password, salt, function(err, hash) {
          mysql.query("INSERT INTO users (Username, Password, Name, Email, RegIP, LockoutCode, Hall, Access) values ('"+req.body.form.username+"', '"+hash+"', '"+req.body.form.name+"', '"+req.body.form.email+"',  '"+ip+"', '"+req.body.form.lockout+"', '"+req.body.form.HallId+"', '"+req.body.form.AccessLevel+"')",
          function (err, result) { 
            if (err) {
              res.status(500).send(err);
              throw err;
            } else {
              res.status(200).send(result);
            }
          });
      });
  });
});

// Login 
router.post('/login', function (req, res) {
  mysql.query("SELECT id, FirstName, LastName, Email, Password, AccessLevel, Access FROM users WHERE Username = '"+ req.body.Username +"'", function (err, rows) {
    if (err) return res.status(500).send({status: 'Server error', err:err});
    bcrypt.compare(req.body.Password, rows[0].Password, function(err, result) {
      if(result) {
        var jwt = nJwt.create({"id": rows[0].id, "FirstName": rows[0].FirstName, "LastName": req.body.LastName, "Email": rows[0].Email, "AccessLevel": rows[0].AccessLevel, "Access": rows[0].Access}, config.secret);
        jwt.setExpiration(new Date().getTime() + (8*60*60*1000));
        res.status(200).send({ auth: true, token: jwt.compact() });
      } else {
        res.status(401).send({auth: false, token: null });
      }
    });
  });
});

module.exports = router;