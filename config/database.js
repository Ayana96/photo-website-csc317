const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'csc317db',
    password: '5555',
});

module.exports = db.promise();