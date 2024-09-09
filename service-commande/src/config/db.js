const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connexion MySQL réussie : OK');
        connection.release(); // Libère la connexion
    } catch (error) {
        console.error('Erreur de connexion MySQL :', error.message);
    }
}

module.exports = { pool, testConnection };