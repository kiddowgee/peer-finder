const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allows frontend running on live-server/localhost to talk to the backend
app.use(express.json()); // Parses incoming JSON payloads

// PostgreSQL Database Connection Config
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'gym_peer_finder',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || 5432,
});

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Fetch Peer Matches (GET /api/peers)
app.get('/api/peers', async (req, res) => {
    try {
        const { focus, level, time } = req.query;

        let query = `SELECT user_id, full_name, home_gym, workout_focus, experience_level, preferred_time, bio, avatar_src FROM users WHERE 1=1`;
        const params = [];

        if (focus && focus !== 'all') {
            params.push(focus);
            query += ` AND workout_focus = $${params.length}`;
        }
        if (level && level !== 'any') {
            params.push(level);
            query += ` AND experience_level = $${params.length}`;
        }
        if (time && time !== 'any') {
            params.push(time);
            query += ` AND preferred_time = $${params.length}`;
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// 2. Register New User (POST /api/register)
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, age, email, password, homeGym, location, preferredTime, preferredDays, focusGoal, experience, bio } = req.body;

        const insertQuery = `
            INSERT INTO users (full_name, age, email, password_hash, home_gym, location, preferred_time, preferred_days, workout_focus, experience_level, bio)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING user_id, full_name, email;
        `;

        const values = [fullName, age, email, password, homeGym, location, preferredTime, preferredDays, focusGoal, experience, bio];
        const result = await pool.query(insertQuery, values);

        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});