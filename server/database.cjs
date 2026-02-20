const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'users.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            full_name TEXT,
            email_or_phone TEXT,
            instagram_id TEXT UNIQUE,
            account_type TEXT,
            media_count INTEGER,
            conn_status INTEGER DEFAULT 0
        )`, (err) => {
            if (err) {
                console.error('Error creating table: ' + err.message);
            } else {
                console.log('Users table ready.');
                // Migration for existing tables
                const columns = ['account_type TEXT', 'media_count INTEGER', 'conn_status INTEGER DEFAULT 0'];
                columns.forEach(col => {
                    db.run(`ALTER TABLE users ADD COLUMN ${col}`, (err) => {
                        // Ignore error if column exists
                    });
                });
            }
        });
    }
});

module.exports = db;
