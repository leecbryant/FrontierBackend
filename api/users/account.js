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
  mysql.query("SELECT id, Name, Username, Password, Hall, Access, Header, SideNav, RTL FROM users WHERE Username = '"+ req.body.name +"'", function (err, rows) {
    if (err) return res.status(500).send({status: 'Server error', err:err});
    bcrypt.compare(req.body.pword, rows[0].Password, function(err, result) {
      if(result) {
        var jwt = nJwt.create({"id": rows[0].id, "Name": rows[0].Name, "SessionHall": req.body.hall, "Hall": rows[0].Hall, "Access": rows[0].Access, "Header": rows[0].Header, "SideNav": rows[0].SideNav, "RTL": rows[0].RTL}, config.secret);
        jwt.setExpiration(new Date().getTime() + (8*60*60*1000));
        res.status(200).send({ auth: true, token: jwt.compact() });
      } else {
        res.status(401).send({auth: false, token: null });
      }
    });
  });
});

module.exports = router;