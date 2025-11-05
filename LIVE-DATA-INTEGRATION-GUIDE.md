# Live Social Proof Integration Guide

## Overview
This guide shows you how to connect real customer data (Google Reviews, signups, purchases) to your social proof notifications.

---

## 🎯 Three Integration Methods

### Method 1: Your Own Backend + Database (Recommended)
**Best for:** Full control, real customer data from your systems

### Method 2: Google Reviews API
**Best for:** Showing real reviews without backend setup

### Method 3: Third-Party Services (Easiest)
**Best for:** Quick setup, no coding required

---

## 📊 Method 1: Backend + Database Integration

### Architecture
```
Customer Action → Your Backend → Database → API Endpoint → Website
```

### Step 1: Database Setup

Create a table to store activities:

```sql
CREATE TABLE customer_activities (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    location VARCHAR(100),
    action_type VARCHAR(50), -- 'review', 'signup', 'purchase', 'visit'
    action_text TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT false,
    displayed BOOLEAN DEFAULT false
);

-- Add index for faster queries
CREATE INDEX idx_timestamp ON customer_activities(timestamp DESC);
CREATE INDEX idx_displayed ON customer_activities(displayed, timestamp);
```

### Step 2: Backend API (Node.js Example)

**File: `backend/api/activity.js`**

```javascript
const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Your DB connection

// GET endpoint to fetch recent activities
router.get('/recent-activity', async (req, res) => {
    try {
        // Fetch activities from last hour that haven't been displayed yet
        const activities = await db.query(`
            SELECT id, customer_name as name, location, action_text as action,
                   timestamp, verified
            FROM customer_activities
            WHERE timestamp > NOW() - INTERVAL '1 hour'
            AND displayed = false
            ORDER BY timestamp DESC
            LIMIT 10
        `);

        res.json(activities.rows);

    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// POST endpoint to record new activity
router.post('/activity', async (req, res) => {
    const { name, location, actionType, actionText, verified } = req.body;

    try {
        const result = await db.query(`
            INSERT INTO customer_activities
            (customer_name, location, action_type, action_text, verified)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [name, location, actionType, actionText, verified || false]);

        res.json({ success: true, activity: result.rows[0] });

    } catch (error) {
        console.error('Error recording activity:', error);
        res.status(500).json({ error: 'Failed to record activity' });
    }
});

// Mark activities as displayed
router.post('/activity/mark-displayed', async (req, res) => {
    const { ids } = req.body;

    try {
        await db.query(`
            UPDATE customer_activities
            SET displayed = true
            WHERE id = ANY($1)
        `, [ids]);

        res.json({ success: true });

    } catch (error) {
        console.error('Error marking displayed:', error);
        res.status(500).json({ error: 'Failed to update activities' });
    }
});

module.exports = router;
```

### Step 3: Record Activities When They Happen

**When customer signs up for Gelato Card:**

```javascript
// In your signup handler
async function handleGelatoCardSignup(customerData) {
    // ... your signup logic ...

    // Record activity for social proof
    await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: customerData.firstName,
            location: customerData.city || 'London',
            actionType: 'signup',
            actionText: 'just joined the Gelato Card program',
            verified: true
        })
    });
}
```

**When customer makes a purchase:**

```javascript
// In your order completion handler
async function handleOrderComplete(orderData) {
    // ... your order logic ...

    // Record activity
    await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: orderData.customerName,
            location: orderData.deliveryCity,
            actionType: 'purchase',
            actionText: 'just ordered wholesale gelato',
            verified: true
        })
    });
}
```

---

## 🌟 Method 2: Google Reviews Integration

### Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Places API**
4. Create API credentials (API Key)
5. Restrict API key to your domain

### Step 2: Get Your Place ID

Visit: `https://developers.google.com/maps/documentation/places/web-service/place-id`

Or use this tool: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder

### Step 3: Backend Proxy for Google API

**IMPORTANT:** Never expose your Google API key in frontend JavaScript!

**File: `backend/api/google-reviews.js`**

```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY; // Store in environment variable

router.get('/google-reviews', async (req, res) => {
    const { placeId } = req.query;

    if (!placeId) {
        return res.status(400).json({ error: 'Place ID required' });
    }

    try {
        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            {
                params: {
                    place_id: placeId,
                    fields: 'reviews,rating',
                    key: GOOGLE_API_KEY
                }
            }
        );

        if (response.data.status === 'OK') {
            // Transform reviews for social proof
            const reviews = response.data.result.reviews?.map(review => ({
                name: review.author_name.split(' ')[0], // First name only
                action: `left a ${review.rating}-star review`,
                timestamp: new Date(review.time * 1000).toISOString(),
                reviewText: review.text,
                verified: true
            })) || [];

            res.json({ reviews });
        } else {
            throw new Error('Google API error: ' + response.data.status);
        }

    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

module.exports = router;
```

### Step 4: Update Frontend to Use Google Reviews

In your `index.html`, replace the script import:

```html
<!-- Replace social-proof-live.js inclusion -->
<script>
    // Configuration
    const SOCIAL_PROOF_CONFIG = {
        googlePlacesId: 'YOUR_PLACE_ID_HERE', // e.g., 'ChIJ...'
        updateInterval: 60000, // Check every minute
    };

    async function fetchAndDisplayGoogleReviews() {
        try {
            const response = await fetch(`/api/google-reviews?placeId=${SOCIAL_PROOF_CONFIG.googlePlacesId}`);
            const data = await response.json();

            if (data.reviews && data.reviews.length > 0) {
                // Display random review from recent reviews
                const review = data.reviews[Math.floor(Math.random() * data.reviews.length)];
                displaySocialProof(review);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    // Call initially and then periodically
    fetchAndDisplayGoogleReviews();
    setInterval(fetchAndDisplayGoogleReviews, SOCIAL_PROOF_CONFIG.updateInterval);
</script>
```

---

## 🚀 Method 3: Third-Party Services (No Coding)

### Option A: Proof (https://useproof.com)
**Cost:** $79-$299/month

**Setup:**
1. Sign up at useproof.com
2. Connect your data sources (Stripe, Mailchimp, etc.)
3. Add their widget code to your site
4. Customize appearance

```html
<!-- Add to your <head> -->
<script src="https://cdn.useproof.com/proof.js?v=YOUR_ID" async></script>
```

### Option B: ProveSource (https://provesource.com)
**Cost:** $25-$99/month

**Setup:**
1. Sign up at provesource.com
2. Connect integrations (Google Reviews, Shopify, etc.)
3. Install tracking code

```html
<script>
  !function(o,i,s){/* ProveSource tracking code */}
  (window, document, 'provesource', 'YOUR_ID');
</script>
```

### Option C: Fomo (https://fomo.com)
**Cost:** $19-$199/month

**Features:**
- Google Reviews integration
- Custom event tracking
- Real-time notifications

### Option D: TrustPulse (https://trustpulse.com)
**Cost:** $5-$99/month

**Best for:** Small businesses, affordable option

---

## 📱 Real-Time Updates with WebSockets

For instant notifications (like "Sarah just purchased"), use WebSockets:

### Backend (Node.js with Socket.io)

```javascript
const io = require('socket.io')(server, {
    cors: {
        origin: "https://www.oddonos.com",
        methods: ["GET", "POST"]
    }
});

// When a customer action occurs
io.emit('newActivity', {
    name: 'Sarah',
    location: 'Chelsea',
    action: 'just joined the Gelato Card program',
    timestamp: new Date().toISOString(),
    verified: true
});
```

### Frontend

```javascript
// Connect to WebSocket
const socket = io('https://your-backend.com');

socket.on('newActivity', (activity) => {
    // Display immediately
    displaySocialProof(activity);
});
```

---

## 🔧 Implementation Checklist

### Week 1: Setup
- [ ] Choose integration method (Backend, Google API, or Third-party)
- [ ] Set up database (if using Method 1)
- [ ] Create backend API endpoints
- [ ] Get Google Places API key (if using Method 2)
- [ ] Test API connections

### Week 2: Integration
- [ ] Include `social-proof-live.js` in your website
- [ ] Update configuration with your API endpoints
- [ ] Connect to your customer database
- [ ] Test with real data

### Week 3: Optimization
- [ ] Add error handling and fallbacks
- [ ] Implement caching for better performance
- [ ] Add analytics tracking
- [ ] Monitor API usage and costs

---

## 💡 Best Practices

### 1. Privacy & Consent
- ✅ Only show first names (e.g., "Sarah" not "Sarah Johnson")
- ✅ Get customer consent in your terms of service
- ✅ Allow customers to opt-out
- ✅ Don't show sensitive purchase details

### 2. Data Freshness
- ✅ Show activities from last 1-4 hours only
- ✅ Update every 15-60 seconds
- ✅ Mix different activity types for variety
- ✅ Don't repeat the same notification too quickly

### 3. Credibility
- ✅ Only show verified activities
- ✅ Use real names (first names only)
- ✅ Match locations to actual customer data
- ✅ Be honest - fake data hurts trust

### 4. Performance
- ✅ Cache API responses
- ✅ Limit database queries
- ✅ Use pagination for large datasets
- ✅ Implement rate limiting on APIs

---

## 🔐 Security Considerations

### API Security
```javascript
// Add authentication to your API endpoints
const authenticateRequest = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

router.get('/recent-activity', authenticateRequest, async (req, res) => {
    // ... your code ...
});
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10 // limit each IP to 10 requests per minute
});

router.use('/api/', limiter);
```

### Data Validation
```javascript
const validateActivity = (data) => {
    if (!data.name || data.name.length > 50) {
        throw new Error('Invalid name');
    }

    if (!data.action || data.action.length > 200) {
        throw new Error('Invalid action');
    }

    // Sanitize HTML
    data.name = sanitizeHtml(data.name);
    data.action = sanitizeHtml(data.action);

    return data;
};
```

---

## 📊 Monitoring & Analytics

### Track Social Proof Performance

```javascript
// In your analytics
gtag('event', 'social_proof_impact', {
    'event_category': 'conversion',
    'event_label': 'after_social_proof_view',
    'conversion_value': 1
});

// Track conversion rate
// Compare users who saw social proof vs those who didn't
```

### Key Metrics to Monitor
- Impressions (how many see the notifications)
- Interaction rate (clicks on notifications)
- Conversion lift (sales before/after)
- API response times
- Error rates

---

## 🆘 Troubleshooting

### Issue: No notifications appearing
**Solution:**
1. Check browser console for JavaScript errors
2. Verify API endpoint is responding: `curl https://yoursite.com/api/recent-activity`
3. Check if activities exist in database
4. Ensure social proof element exists: `document.getElementById('socialProof')`

### Issue: Old/stale data showing
**Solution:**
1. Reduce `maxAge` in config (currently 1 hour)
2. Check database query filters
3. Clear browser cache

### Issue: Too many API calls
**Solution:**
1. Increase `updateInterval` (e.g., from 15s to 60s)
2. Implement caching on backend
3. Use Server-Sent Events instead of polling

---

## 📝 Example: Complete Integration

Here's a minimal complete example:

**1. Database activity recorded when customer signs up:**
```sql
INSERT INTO customer_activities (customer_name, location, action_text)
VALUES ('Emma', 'Hampstead', 'just joined the Gelato Card program');
```

**2. API returns this data:**
```json
[
  {
    "id": 123,
    "name": "Emma",
    "location": "Hampstead",
    "action": "just joined the Gelato Card program",
    "timestamp": "2025-01-05T15:30:00Z",
    "verified": true
  }
]
```

**3. Frontend displays:**
```
🎉 Emma from Hampstead just joined the Gelato Card program ✓
```

---

## 🎯 Next Steps

1. **Choose your method** based on your technical capability and budget
2. **Start with Method 2** (Google Reviews) for quick wins
3. **Upgrade to Method 1** (Backend) as you scale
4. **Test thoroughly** before going live
5. **Monitor performance** and iterate

---

*Need help? Check the implementation examples in `social-proof-live.js`*
