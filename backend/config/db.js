const mysql = require('mysql2');
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, '../certs/ca.pem'))
      }
});

db.connect((err) => {
    if(err) {
        console.error('Database Connection Failed:', err.stack );
        return;
    }
    console.log('Connected to MySQL Database.');
});

module.exports = db;