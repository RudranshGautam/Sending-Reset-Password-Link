const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rudransh@1',  // Update with your actual MySQL root password
    database: 'ww'              // Ensure this is the correct database name
});

module.exports = db;

