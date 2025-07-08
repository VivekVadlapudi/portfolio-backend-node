

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'portfolio_db',
});

module.exports = pool.promise(); // ✅ important!
