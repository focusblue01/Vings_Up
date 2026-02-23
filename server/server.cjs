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

            // Upsert Logic (Update extra fields, conn_status, and access_token)
            const sql = `INSERT INTO users (username, instagram_id, full_name, account_type, media_count, conn_status, access_token) VALUES (?, ?, ?, ?, ?, 1, ?)
                         ON CONFLICT(instagram_id) DO UPDATE SET
                            username=excluded.username,
                            account_type=excluded.account_type,
                            media_count=excluded.media_count,
                            conn_status=1,
                            access_token=excluded.access_token`;

            db.run(sql, [username, id, username, account_type, media_count, access_token], function (err) {
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

// ----------------------------------------------------------------------------
// Dashboard & Appointments API
// ----------------------------------------------------------------------------

app.get('/api/dashboard/:userId', (req, res) => {
    const userId = req.params.userId;

    db.all(`SELECT likes, comments, img_url FROM posts WHERE user_id = ?`, [userId], (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(`SELECT * FROM appointments WHERE user_id = ? ORDER BY time ASC`, [userId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            // Generate Dynamic Stats
            const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
            const totalPosts = posts.length;
            const newAppointments = rows.filter(r => r.status === '대기').length;

            const stats = [
                { label: '총 좋아요 수', value: totalLikes > 0 ? totalLikes + '개' : '0개', trend: '누적', icon: 'favorite', color: 'text-pink-500' },
                { label: '업로드 완료', value: totalPosts > 0 ? totalPosts + '건' : '0건', trend: '누적', icon: 'auto_awesome', color: 'text-purple-500' },
                { label: '대기중인 예약', value: newAppointments > 0 ? newAppointments + '건' : '0건', trend: '대기', icon: 'schedule', color: 'text-blue-500' },
            ];

            // Expose the most liked post for the UI "Best Post" section
            const bestPost = posts.reduce((prev, current) => (prev && prev.likes > current.likes) ? prev : current, null);

            // Seed initial data if empty for demo purposes
            if (rows.length === 0) {
                const seed = [
                    { user_id: userId, dog_name: '벨라', breed: '푸들', service: '전신 미용', time: '10:00', status: '대기' },
                    { user_id: userId, dog_name: '코코', breed: '비숑', service: '스파 & 가위컷', time: '13:30', status: '진행중' },
                    { user_id: userId, dog_name: '초코', breed: '말티즈', service: '위생 미용', time: '16:00', status: '대기' },
                ];
                const stmt = db.prepare(`INSERT INTO appointments (user_id, dog_name, breed, service, time, status) VALUES (?, ?, ?, ?, ?, ?)`);
                seed.forEach(item => {
                    stmt.run([item.user_id, item.dog_name, item.breed, item.service, item.time, item.status]);
                });
                stmt.finalize();
                return res.json({ stats, appointments: seed, bestPost });
            }

            res.json({ stats, appointments: rows, bestPost });
        });
    });
});

app.put('/api/appointments/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run(`UPDATE appointments SET status = ? WHERE id = ?`, [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id, status });
    });
});

// ----------------------------------------------------------------------------
// Posts API & Instagram Upload
// ----------------------------------------------------------------------------

app.get('/api/posts/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all(`SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Seed some history if empty
        if (rows.length === 0) {
            const seed = [
                { user_id: userId, title: '벨라의 여름맞이 미용', platform: 'instagram', status: 'sent', likes: 124, comments: 8, img_url: 'https://picsum.photos/id/100/400/300' },
                { user_id: userId, title: '스파 데이 세션', platform: 'facebook', status: 'sent', likes: 45, comments: 12, img_url: 'https://picsum.photos/id/101/400/300' }
            ];
            const stmt = db.prepare(`INSERT INTO posts (user_id, title, platform, status, likes, comments, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            seed.forEach(p => stmt.run([p.user_id, p.title, p.platform, p.status, p.likes, p.comments, p.img_url]));
            stmt.finalize();
            return res.json({ posts: seed });
        }
        res.json({ posts: rows });
    });
});

app.post('/api/posts', async (req, res) => {
    const { userId, caption, imageUrl, isDraft } = req.body;

    // First, save to database as pending/draft
    const initialStatus = isDraft ? 'draft' : 'pending';
    const insertSql = `INSERT INTO posts (user_id, title, platform, status, img_url) VALUES (?, ?, 'instagram', ?, ?)`;

    db.run(insertSql, [userId, caption.substring(0, 30) + '...', initialStatus, imageUrl], async function (err) {
        if (err) return res.status(500).json({ error: err.message });
        const postId = this.lastID;

        if (isDraft) {
            return res.json({ success: true, postId, status: 'draft' });
        }

        // Proceed to actual Instagram Upload
        try {
            db.get(`SELECT instagram_id, access_token FROM users WHERE id = ?`, [userId], async (dbErr, user) => {
                if (dbErr || !user || !user.access_token) {
                    throw new Error('User Instagram not linked or missing access token');
                }

                // If it's the mock token, bypass real API
                if (user.access_token.startsWith('mock_access_token')) {
                    db.run(`UPDATE posts SET status = 'sent' WHERE id = ?`, [postId]);
                    return res.json({ success: true, postId, status: 'sent', mock: true });
                }

                const igUserId = user.instagram_id;
                const token = user.access_token;

                console.log('Publishing to Instagram Graph API...');
                // 1. Create Media Container
                const mediaRes = await axios.post(`https://graph.facebook.com/v18.0/${igUserId}/media`, {
                    image_url: imageUrl,
                    caption: caption,
                    access_token: token
                });
                const creationId = mediaRes.data.id;

                // 2. Publish Media
                const publishRes = await axios.post(`https://graph.facebook.com/v18.0/${igUserId}/media_publish`, {
                    creation_id: creationId,
                    access_token: token
                });
                const publishedMediaId = publishRes.data.id;

                // 3. Update DB
                db.run(`UPDATE posts SET status = 'sent', ig_media_id = ? WHERE id = ?`, [publishedMediaId, postId]);
                res.json({ success: true, postId, status: 'sent', ig_media_id: publishedMediaId });
            });
        } catch (uploadError) {
            console.error('Instagram upload failed:', uploadError.message);
            // Revert status to failed
            db.run(`UPDATE posts SET status = 'failed' WHERE id = ?`, [postId]);
            res.status(500).json({ error: 'Failed to upload to Instagram', details: uploadError.message });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
