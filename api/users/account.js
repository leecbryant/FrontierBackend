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
      bcrypt.hash(req.body.Password, salt, function(err, hash) {
          mysql.query("INSERT INTO users (Username, Password, Email, AccessLevel, FirstName, LastName, CreationDate) values ('"+req.body.Username+"', '"+hash+"', '"+req.body.Email+"', '1', '"+req.body.FirstName+"', '"+req.body.LastName+"', '"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"')",
          function (err, result) { 
            if (err) {
              res.status(500).send({"success": false});
              throw err;
            } else {
              res.status(200).send({"success": true});c
            }
          });
      });
  });
});

// Login 
router.post('/login', function (req, res) {
  mysql.query("SELECT id, FirstName, LastName, Email, Password, AccessLevel, Access FROM users WHERE Username = '"+ req.body.Username +"'", function (err, rows) {
    if (err) return res.status(500).send({status: 'Server error', err:err});
    if (rows != null) {
      if(rows.length == 0) {
        return res.status(401).send({auth: false, token: null });
      } 
      bcrypt.compare(req.body.Password, rows[0].Password, function(err, result) {
        if(err)  return res.status(401).send({auth: false, token: null });
        if(result) {
          var jwt = nJwt.create({"id": rows[0].id, "FirstName": rows[0].FirstName, "LastName": req.body.LastName, "Email": rows[0].Email, "AccessLevel": rows[0].AccessLevel, "Access": rows[0].Access }, config.secret);
          jwt.setExpiration(new Date().getTime() + (8*60*60*1000));
          res.status(200).send({ auth: true, token: jwt.compact() });
        } else {
          res.status(401).send({auth: false, token: null });
        }
      });
    } else {
      res.status(401).send({auth: false, token: null });
    }
  });
});

// Forgot Password 
router.post('/forgotpassword', function (req, res) {
  mysql.query("SELECT id FROM users WHERE Email = '"+ req.body.Email +"'", function (err, rows) {
    if (err) return res.status(500).send({status: 'Server error', err:err});
      if(rows.length == 0) {
        return res.status(200).send({success: true }); // False positive - Account doesnt exist
      } 
      mysql.query("INSERT INTO users_forgot (UserID, Hash, RequestDate) values ('"+rows[0].id+"', '"+genHash(22)+"', '"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"')",
      function (err, result) { 
        if (err) es.status(500).send({"success": false});
          
        if (result) {
          return res.status(200).send({"success": true});
        }
      });
  });
});

function genHash(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = router;