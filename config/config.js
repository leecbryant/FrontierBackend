var mysql = require('mysql');

var connection = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  port: 3306
});

// connection.connect(function(err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + connection.threadId);
// });

module.exports = connection;