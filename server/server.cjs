const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = require('./database.cjs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Instagram OAuth Configuration
const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const INSTAGRAM_REDIRECT_URI = 'http://localhost:3001/api/auth/instagram/callback';

if (!INSTAGRAM_CLIENT_ID || INSTAGRAM_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
    console.log('⚠️  Instagram credentials missing. Using MOCK OAuth mode.');
} else {
    console.log('✅ Instagram credentials detected. Using REAL Instagram OAuth mode.');
}

// Redirect to Instagram Auth
app.get('/api/auth/instagram', (req, res) => {
    // Check if real credentials exist. If not, use Mock.
    if (!INSTAGRAM_CLIENT_ID || INSTAGRAM_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
        return res.redirect('/mock/instagram/auth');
    }
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    res.redirect(authUrl);
});

// Mock Instagram Auth Page
app.get('/mock/instagram/auth', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Instagram Login (Mock)</title>
                <style>
                    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #fafafa; }
                    .container { background: white; padding: 40px; border: 1px solid #dbdbdb; text-align: center; width: 350px; }
                    .logo { margin-bottom: 20px; font-size: 24px; font-weight: bold; }
                    .btn { background-color: #0095f6; color: white; border: none; padding: 5px 9px; border-radius: 4px; font-weight: 600; cursor: pointer; margin-top: 20px; width: 100%; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">Instagram (Mock)</div>
                    <p>PawsNPose requests permission to access your profile.</p>
                    <button class="btn" onclick="window.location.href='/api/auth/instagram/callback?code=MOCK_CODE'">Allow</button>
                </div>
            </body>
        </html>
    `);
});

// Callback Handler
app.get('/api/auth/instagram/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        let access_token, user_id, username;

        // MOCK PATH
        if (code === 'MOCK_CODE') {
            console.log('Using Mock Instagram OAuth');
            access_token = 'mock_access_token_' + Date.now();
            user_id = 'mock_user_id_' + Math.floor(Math.random() * 10000);
            username = 'mock_user_' + Math.floor(Math.random() * 1000);
            // Mock extra fields
            account_type = 'PERSONAL';
            media_count = Math.floor(Math.random() * 100);
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        // REAL PATH
        else {
            // Exchange code for access token
            const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
                client_id: INSTAGRAM_CLIENT_ID,
                client_secret: INSTAGRAM_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: INSTAGRAM_REDIRECT_URI,
                code: code
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            access_token = tokenResponse.data.access_token;
            user_id = tokenResponse.data.user_id;

            // Get User Profile (Optional, Basic Display API)
            // Request extra fields: account_type, media_count
            const profileResponse = await axios.get(`https://graph.instagram.com/${user_id}?fields=id,username,account_type,media_count&access_token=${access_token}`);
            username = profileResponse.data.username;
            account_type = profileResponse.data.account_type;
            media_count = profileResponse.data.media_count;
        }

        const id = user_id;

        // Check if user exists first to see if they need to complete signup (email/password)
        db.get(`SELECT * FROM users WHERE instagram_id = ?`, [id], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            const isNewUser = !row;
            const needsCompletion = !row || !row.email_or_phone || !row.password;

            // Upsert Logic (Update extra fields and conn_status)
            const sql = `INSERT INTO users (username, instagram_id, full_name, account_type, media_count, conn_status) VALUES (?, ?, ?, ?, ?, 1)
                         ON CONFLICT(instagram_id) DO UPDATE SET
                            username=excluded.username,
                            account_type=excluded.account_type,
                            media_count=excluded.media_count,
                            conn_status=1`;

            db.run(sql, [username, id, username, account_type, media_count], function (err) {
                if (err) {
                    console.error('DB Upsert Error:', err);
                    return res.status(500).send('Database error during login');
                }

                // Determine redirect URL
                const userId = row ? row.id : this.lastID || 'new'; // this.lastID might be unreliable in upsert depending on driver
                // Re-fetch ID if it was an insert
                if (!row) {
                    db.get(`SELECT id FROM users WHERE instagram_id = ?`, [id], (err, newRow) => {
                        const finalId = newRow ? newRow.id : userId;
                        const redirectBase = `http://localhost:3000/#/auth-callback`;
                        const params = new URLSearchParams({
                            login_success: 'true',
                            username: username,
                            id: finalId,
                            needs_completion: needsCompletion ? 'true' : 'false',
                            instagram_id: id // Needed for completion step
                        });
                        res.redirect(`${redirectBase}?${params.toString()}`);
                    });
                } else {
                    const redirectBase = `http://localhost:3000/#/auth-callback`;
                    const params = new URLSearchParams({
                        login_success: 'true',
                        username: username,
                        id: userId,
                        needs_completion: needsCompletion ? 'true' : 'false',
                        instagram_id: id
                    });
                    res.redirect(`${redirectBase}?${params.toString()}`);
                }
            });
        });

    } catch (error) {
        console.error('Instagram Auth Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Authentication failed');
    }
});

// Complete Signup Endpoint
app.post('/api/auth/complete-signup', (req, res) => {
    const { instagram_id, email, password } = req.body;

    if (!instagram_id || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(`UPDATE users SET email_or_phone = ?, password = ? WHERE instagram_id = ?`,
        [email, password, instagram_id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Signup completed' });
        }
    );
});

// Logout Endpoint
app.post('/api/logout', (req, res) => {
    const { id } = req.body;
    if (id) {
        db.run(`UPDATE users SET conn_status = 0 WHERE id = ?`, [id], (err) => {
            if (err) console.error('Logout status update failed:', err);
            res.json({ success: true });
        });
    } else {
        res.json({ success: true }); // Just return success even if no ID provided
    }
});

// Register Endpoint
app.post('/api/register', (req, res) => {
    const { username, password, full_name, email_or_phone } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const sql = `INSERT INTO users (username, password, full_name, email_or_phone) VALUES (?, ?, ?, ?)`;
    const params = [username, password, full_name, email_or_phone];

    db.run(sql, params, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'User registered successfully',
            userId: this.lastID
        });
    });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const sql = `SELECT * FROM users WHERE (username = ? OR email_or_phone = ?) AND password = ?`;
    const params = [username, username, password];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({
                message: 'Login successful',
                user: { id: row.id, username: row.username, full_name: row.full_name }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
