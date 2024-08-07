const mysql = require('mysql2/promise');

let db;

async function initializeDatabase() {
    if (!db) {
        try {
            db = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'Anu1',
                database: 'code_editor'
            });
            console.log('MySQL Connected...');
        } catch (err) {
            console.error('MySQL connection error:', err);
            throw err;
        }
    }
    return db;
}

module.exports = initializeDatabase;
