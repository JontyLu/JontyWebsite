var mysql      = require('mysql');
var pool = mysql.createPool({
    limit    : 2,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'mywebsite'
});

module.exports = pool;