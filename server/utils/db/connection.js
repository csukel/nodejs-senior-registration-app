const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'SeniorUserNode',
  password : '5En1or2seR',
  database : 'senior_school_registrations',
  insecureAuth: true,
  multipleStatements : true
  
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

module.exports = connection;