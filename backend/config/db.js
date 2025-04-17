const mysql = require('mysql2');
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const caPath = process.env.NODE_ENV === 'production'
  ? '/etc/secrets/ca.pem'
  : path.join(__dirname, '../certs/ca.pem');

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(caPath)
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

function handleDisconnect() {
  pool = mysql.createPool(dbConfig);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // retry after 2 seconds
    } else {
      console.log('✅ Connected to MySQL!');
      connection.release(); // release test connection
    }
  });

  pool.on('error', function (err) {
    console.error('MySQL pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = pool;
