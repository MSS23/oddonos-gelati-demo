// ===================================
// BACKEND API EXAMPLE FOR SOCIAL PROOF
// Node.js + Express + PostgreSQL
// ===================================

/**
 * SETUP INSTRUCTIONS:
 *
 * 1. Install dependencies:
 *    npm install express pg cors dotenv
 *
 * 2. Create .env file with:
 *    DATABASE_URL=postgresql://user:password@localhost:5432/oddonos
 *    PORT=3000
 *    API_KEY=your-secret-api-key
 *
 * 3. Run:
 *    node backend-example.js
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors({
    origin: ['https://www.oddonos.com', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// API Key authentication middleware
const authenticateAPI = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

// ===================================
// ENDPOINTS
// ===================================

/**
 * GET /api/recent-activity
 * Fetch recent customer activities for social proof
 */
app.get('/api/recent-activity', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                customer_name as name,
                location,
                action_text as action,
                timestamp,
                verified
            FROM customer_activities
            WHERE
                timestamp > NOW() - INTERVAL '1 hour'
                AND displayed = false
            ORDER BY timestamp DESC
            LIMIT 10
        `);

        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

/**
 * POST /api/activity
 * Record a new customer activity
 *
 * Body: {
 *   name: "Sarah",
 *   location: "Chelsea",
 *   actionType: "signup",
 *   actionText: "just joined the Gelato Card program",
 *   verified: true
 * }
 */
app.post('/api/activity', authenticateAPI, async (req, res) => {
    const { name, location, actionType, actionText, verified } = req.body;

    // Validation
    if (!name || !location || !actionType || !actionText) {
        return res.status(400).json({
            error: 'Missing required fields: name, location, actionType, actionText'
        });
    }

    try {
        const result = await pool.query(`
            INSERT INTO customer_activities
            (customer_name, location, action_type, action_text, verified, displayed)
            VALUES ($1, $2, $3, $4, $5, false)
            RETURNING *
        `, [name, location, actionType, actionText, verified || false]);

        res.json({
            success: true,
            activity: result.rows[0]
        });

    } catch (error) {
        console.error('Error recording activity:', error);
        res.status(500).json({ error: 'Failed to record activity' });
    }
});

/**
 * POST /api/activity/mark-displayed
 * Mark activities as displayed so they don't show again
 *
 * Body: { ids: [1, 2, 3] }
 */
app.post('/api/activity/mark-displayed', authenticateAPI, async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty ids array' });
    }

    try {
        await pool.query(`
            UPDATE customer_activities
            SET displayed = true
            WHERE id = ANY($1)
        `, [ids]);

        res.json({ success: true, updated: ids.length });

    } catch (error) {
        console.error('Error marking displayed:', error);
        res.status(500).json({ error: 'Failed to update activities' });
    }
});

/**
 * GET /api/google-reviews
 * Proxy for Google Places API (keeps API key secret)
 */
app.get('/api/google-reviews', async (req, res) => {
    const { placeId } = req.query;
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId) {
        return res.status(400).json({ error: 'Place ID required' });
    }

    if (!GOOGLE_API_KEY) {
        return res.status(500).json({ error: 'Google API key not configured' });
    }

    try {
        const axios = require('axios');

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            {
                params: {
                    place_id: placeId,
                    fields: 'reviews,rating,user_ratings_total',
                    key: GOOGLE_API_KEY
                }
            }
        );

        if (response.data.status === 'OK') {
            const reviews = response.data.result.reviews?.map(review => ({
                name: review.author_name.split(' ')[0], // First name only
                action: `left a ${review.rating}-star review`,
                timestamp: new Date(review.time * 1000).toISOString(),
                reviewText: review.text.substring(0, 100) + '...',
                verified: true
            })) || [];

            res.json({
                reviews,
                totalReviews: response.data.result.user_ratings_total,
                averageRating: response.data.result.rating
            });
        } else {
            throw new Error('Google API error: ' + response.data.status);
        }

    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

/**
 * GET /api/stats
 * Get social proof statistics
 */
app.get('/api/stats', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) as total_activities,
                COUNT(CASE WHEN action_type = 'signup' THEN 1 END) as signups,
                COUNT(CASE WHEN action_type = 'review' THEN 1 END) as reviews,
                COUNT(CASE WHEN action_type = 'purchase' THEN 1 END) as purchases,
                COUNT(CASE WHEN displayed = true THEN 1 END) as displayed
            FROM customer_activities
            WHERE timestamp > NOW() - INTERVAL '24 hours'
        `);

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// ===================================
// WEBHOOKS (for integrations)
// ===================================

/**
 * POST /webhook/gelato-card-signup
 * Called when someone signs up for Gelato Card
 *
 * Body: {
 *   firstName: "Sarah",
 *   city: "Chelsea",
 *   email: "sarah@example.com"
 * }
 */
app.post('/webhook/gelato-card-signup', authenticateAPI, async (req, res) => {
    const { firstName, city, email } = req.body;

    try {
        await pool.query(`
            INSERT INTO customer_activities
            (customer_name, location, action_type, action_text, verified)
            VALUES ($1, $2, 'signup', 'just joined the Gelato Card program', true)
        `, [firstName, city || 'London']);

        res.json({ success: true });

    } catch (error) {
        console.error('Error recording signup:', error);
        res.status(500).json({ error: 'Failed to record signup' });
    }
});

/**
 * POST /webhook/wholesale-order
 * Called when someone places a wholesale order
 */
app.post('/webhook/wholesale-order', authenticateAPI, async (req, res) => {
    const { customerName, city, orderValue } = req.body;

    try {
        await pool.query(`
            INSERT INTO customer_activities
            (customer_name, location, action_type, action_text, verified)
            VALUES ($1, $2, 'purchase', 'just ordered wholesale gelato', true)
        `, [customerName, city || 'London']);

        res.json({ success: true });

    } catch (error) {
        console.error('Error recording order:', error);
        res.status(500).json({ error: 'Failed to record order' });
    }
});

// ===================================
// SERVER-SENT EVENTS (Real-time)
// ===================================

const clients = new Set();

app.get('/api/activity-stream', (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add client to set
    clients.add(res);

    // Remove client when connection closes
    req.on('close', () => {
        clients.delete(res);
    });

    // Send keep-alive ping every 30 seconds
    const keepAlive = setInterval(() => {
        res.write(': ping\n\n');
    }, 30000);

    req.on('close', () => {
        clearInterval(keepAlive);
    });
});

// Function to broadcast new activity to all connected clients
function broadcastActivity(activity) {
    const data = `data: ${JSON.stringify(activity)}\n\n`;

    clients.forEach(client => {
        client.write(data);
    });
}

// Call this when new activity is added
app.post('/api/activity-broadcast', authenticateAPI, async (req, res) => {
    const activity = req.body;

    // First save to database
    const result = await pool.query(`
        INSERT INTO customer_activities
        (customer_name, location, action_type, action_text, verified)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [activity.name, activity.location, activity.actionType, activity.actionText, activity.verified]);

    // Then broadcast to all connected clients
    broadcastActivity(result.rows[0]);

    res.json({ success: true, clients: clients.size });
});

// ===================================
// DATABASE INITIALIZATION
// ===================================

async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS customer_activities (
                id SERIAL PRIMARY KEY,
                customer_name VARCHAR(100) NOT NULL,
                location VARCHAR(100) NOT NULL,
                action_type VARCHAR(50) NOT NULL,
                action_text TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                verified BOOLEAN DEFAULT false,
                displayed BOOLEAN DEFAULT false
            );

            CREATE INDEX IF NOT EXISTS idx_timestamp
            ON customer_activities(timestamp DESC);

            CREATE INDEX IF NOT EXISTS idx_displayed
            ON customer_activities(displayed, timestamp);
        `);

        console.log('✓ Database tables initialized');

    } catch (error) {
        console.error('✗ Database initialization error:', error);
    }
}

// ===================================
// START SERVER
// ===================================

app.listen(port, async () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║  Oddono's Social Proof API Server    ║
    ╚═══════════════════════════════════════╝

    🚀 Server running on port ${port}
    📊 Recent activities: http://localhost:${port}/api/recent-activity
    📈 Statistics: http://localhost:${port}/api/stats

    API Endpoints:
    • GET  /api/recent-activity
    • POST /api/activity
    • POST /api/activity/mark-displayed
    • GET  /api/google-reviews
    • GET  /api/stats
    • GET  /api/activity-stream (SSE)

    Webhooks:
    • POST /webhook/gelato-card-signup
    • POST /webhook/wholesale-order
    `);

    // Initialize database
    await initDatabase();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    pool.end();
    process.exit(0);
});

// Export for testing
module.exports = { app, broadcastActivity };
