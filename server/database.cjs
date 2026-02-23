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
            conn_status INTEGER DEFAULT 0,
            access_token TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating users table: ' + err.message);
            } else {
                console.log('Users table ready.');
                // Migration for existing users table
                const columns = ['account_type TEXT', 'media_count INTEGER', 'conn_status INTEGER DEFAULT 0', 'access_token TEXT'];
                columns.forEach(col => {
                    db.run(`ALTER TABLE users ADD COLUMN ${col}`, (err) => {
                        // Ignore error if column exists
                    });
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            dog_name TEXT,
            breed TEXT,
            service TEXT,
            time TEXT,
            status TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) console.error('Error creating appointments table: ' + err.message);
            else console.log('Appointments table ready.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            ig_media_id TEXT,
            title TEXT,
            platform TEXT,
            status TEXT,
            likes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            img_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) console.error('Error creating posts table: ' + err.message);
            else console.log('Posts table ready.');
        });
    }
});

module.exports = db;
