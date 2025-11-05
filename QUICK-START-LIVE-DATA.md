# Quick Start: Connect Real Data to Social Proof

## 🚀 Fastest Path to Live Data

### Option 1: Google Reviews Only (15 minutes)
**Best for:** Getting started quickly without backend setup

### Option 2: Backend + Database (1-2 hours)
**Best for:** Complete control over all customer activities

### Option 3: Third-Party Service (30 minutes)
**Best for:** No coding, just copy-paste

---

## ⚡ OPTION 1: Google Reviews (Easiest)

### Step 1: Get Your Google Place ID (5 min)

1. Go to: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
2. Search for "Oddono's Gelato London"
3. Copy your Place ID (looks like `ChIJN1t_tDeuEmsRUsoyG83frY4`)

### Step 2: Get API Key (5 min)

1. Go to: https://console.cloud.google.com/
2. Create a project
3. Enable "Places API"
4. Create credentials → API Key
5. Restrict to your domain: `www.oddonos.com`

### Step 3: Update Your Website (5 min)

Replace your current social proof code in `index.html` with:

```html
<!-- Add before closing </body> tag -->
<script>
// Configuration - UPDATE THESE!
const GOOGLE_PLACE_ID = 'YOUR_PLACE_ID_HERE'; // From Step 1
const YOUR_BACKEND_URL = '/api/google-reviews'; // Your backend proxy

let currentReviewIndex = 0;
let reviews = [];

// Fetch reviews from backend
async function loadGoogleReviews() {
    try {
        const response = await fetch(`${YOUR_BACKEND_URL}?placeId=${GOOGLE_PLACE_ID}`);
        const data = await response.json();

        if (data.reviews && data.reviews.length > 0) {
            reviews = data.reviews;
            showNextReview();

            // Show a new review every 30 seconds
            setInterval(showNextReview, 30000);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        // Fallback to simulated data
        useFallbackSocialProof();
    }
}

function showNextReview() {
    if (reviews.length === 0) return;

    const review = reviews[currentReviewIndex];
    const socialProof = document.getElementById('socialProof');
    const textElement = socialProof.querySelector('.social-proof-text');
    const iconElement = socialProof.querySelector('.social-proof-icon');

    iconElement.textContent = '⭐';
    textElement.innerHTML = `<strong>${review.name}</strong> ${review.action}`;

    socialProof.style.display = 'block';

    // Hide after 8 seconds
    setTimeout(() => {
        socialProof.style.display = 'none';
    }, 8000);

    // Next review
    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
}

function useFallbackSocialProof() {
    // Your existing simulated social proof code
    console.warn('Using fallback social proof');
}

// Start loading reviews
loadGoogleReviews();
</script>
```

### Step 4: Create Backend Proxy

You MUST create a backend endpoint to hide your API key.

**Simple PHP example** (`api/google-reviews.php`):

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$placeId = $_GET['placeId'] ?? '';
$apiKey = 'YOUR_GOOGLE_API_KEY'; // Store securely!

if (empty($placeId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Place ID required']);
    exit;
}

$url = "https://maps.googleapis.com/maps/api/place/details/json?place_id={$placeId}&fields=reviews,rating&key={$apiKey}";

$response = file_get_contents($url);
$data = json_decode($response, true);

if ($data['status'] === 'OK') {
    $reviews = array_map(function($review) {
        $firstName = explode(' ', $review['author_name'])[0];
        return [
            'name' => $firstName,
            'action' => "left a {$review['rating']}-star review",
            'timestamp' => date('c', $review['time']),
            'verified' => true
        ];
    }, $data['result']['reviews'] ?? []);

    echo json_encode(['reviews' => $reviews]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch reviews']);
}
?>
```

**Done!** Your social proof now shows real Google reviews.

---

## 💪 OPTION 2: Full Backend Integration

### Step 1: Set Up Database (20 min)

```sql
-- Run this in your PostgreSQL/MySQL database
CREATE TABLE customer_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100),
    location VARCHAR(100),
    action_text VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    displayed BOOLEAN DEFAULT false
);
```

### Step 2: Install Backend (10 min)

```bash
# If you're using Node.js
npm install express pg cors dotenv

# Copy the backend-example.js file
# Update .env with your database credentials

# Run the server
node backend-example.js
```

### Step 3: Record Customer Activities (30 min)

Add this to your signup/purchase/review forms:

```javascript
// When customer signs up for Gelato Card
async function recordCustomerActivity(name, location, action) {
    await fetch('https://your-backend.com/api/activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_SECRET_API_KEY'
        },
        body: JSON.stringify({
            name: name,
            location: location,
            actionType: 'signup',
            actionText: action,
            verified: true
        })
    });
}

// Example: After Gelato Card signup form submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;

    // Your normal signup logic...
    await submitSignupForm();

    // Record for social proof
    await recordCustomerActivity(
        name.split(' ')[0], // First name only
        city,
        'just joined the Gelato Card program'
    );
});
```

### Step 4: Update Frontend (10 min)

Replace the script in `index.html` with:

```html
<script src="social-proof-live.js"></script>
<script>
// Configure your API endpoint
window.SOCIAL_PROOF_CONFIG = {
    apiEndpoint: 'https://your-backend.com/api/recent-activity',
    updateInterval: 15000, // Check every 15 seconds
    displayDuration: 8000
};
</script>
```

**Done!** Your social proof shows real customer activities.

---

## 🎯 OPTION 3: Third-Party Service (No Code)

### Recommended: ProveSource

1. **Sign up:** https://provesource.com (free trial)

2. **Connect Google Reviews:**
   - Dashboard → Integrations → Google Reviews
   - Enter your Place ID
   - Authorize access

3. **Install tracking code:**
   ```html
   <!-- Add to <head> in index.html -->
   <script>
     (function(p,r,o,v,e){/* ProveSource code */})
     (window,document,'provesource','YOUR_ID');
   </script>
   ```

4. **Customize appearance:**
   - Match your brand colors
   - Choose notification position
   - Set display rules

**Done!** Notifications appear automatically from Google Reviews.

---

## 🔄 Which Option Should You Choose?

| Feature | Option 1: Google | Option 2: Backend | Option 3: Third-Party |
|---------|-----------------|-------------------|----------------------|
| **Setup Time** | 15 min | 1-2 hours | 30 min |
| **Technical Skill** | Low | Medium-High | None |
| **Cost** | Free (API) | Free (DIY) | $25-99/month |
| **Data Source** | Google Reviews | All activities | Multiple sources |
| **Customization** | Limited | Full control | Medium |
| **Real-time** | No (cached) | Yes | Yes |

### Recommendation:
- **Just starting?** → Option 1 (Google Reviews)
- **Have developers?** → Option 2 (Backend)
- **Want it done?** → Option 3 (Third-party)

---

## 📝 Testing Your Setup

### Test Google Reviews Integration

```javascript
// Open browser console and run:
fetch('/api/google-reviews?placeId=YOUR_PLACE_ID')
    .then(r => r.json())
    .then(data => console.log('Reviews:', data));

// Should show your recent Google reviews
```

### Test Backend API

```bash
# Test fetching activities
curl http://localhost:3000/api/recent-activity

# Test adding activity
curl -X POST http://localhost:3000/api/activity \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "name": "Test User",
    "location": "London",
    "actionType": "test",
    "actionText": "just tested the social proof",
    "verified": true
  }'
```

---

## ⚠️ Important Notes

### Privacy & GDPR Compliance

**You MUST:**
- ✅ Get consent in your privacy policy to show customer activity
- ✅ Only use first names (never full names)
- ✅ Allow customers to opt-out
- ✅ Don't show sensitive information (order values, addresses)

**Privacy Policy Addition:**
```
We may display anonymized customer activity (such as "Sarah from
Chelsea just joined") on our website to build trust. Only first
names and general locations are shown. You can opt-out by emailing
privacy@oddonos.com.
```

### API Rate Limits

**Google Places API:**
- Free tier: 0-100,000 requests/month
- After that: $17 per 1,000 requests
- **Solution:** Cache responses for 1 hour

**Recommended Caching:**
```javascript
let cachedReviews = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function getCachedReviews() {
    const now = Date.now();

    if (cachedReviews && (now - cacheTimestamp) < CACHE_DURATION) {
        return cachedReviews;
    }

    // Fetch fresh data
    cachedReviews = await fetchGoogleReviews();
    cacheTimestamp = now;

    return cachedReviews;
}
```

---

## 🆘 Common Issues & Solutions

### Issue: "Failed to fetch reviews"
**Solution:**
1. Check API key is valid
2. Verify Place ID is correct
3. Check CORS headers on backend
4. Look for errors in browser console

### Issue: Reviews are showing but very old
**Solution:**
- Google API returns last 5 reviews
- These might be old if you don't get many reviews
- **Fix:** Mix with other activity types (signups, orders)

### Issue: Same review keeps repeating
**Solution:**
```javascript
// Add this to track shown reviews
let shownReviewIds = new Set();

function getNextUniqueReview() {
    let attempts = 0;
    let review;

    do {
        review = reviews[Math.floor(Math.random() * reviews.length)];
        attempts++;
    } while (shownReviewIds.has(review.id) && attempts < 10);

    shownReviewIds.add(review.id);

    // Clear set after showing all reviews
    if (shownReviewIds.size >= reviews.length) {
        shownReviewIds.clear();
    }

    return review;
}
```

---

## 🚀 Next Steps After Setup

1. **Monitor Performance**
   - Check analytics for conversion rate changes
   - Track social proof impressions
   - A/B test different messages

2. **Expand Data Sources**
   - Add Gelato Card signups
   - Include wholesale orders
   - Show shop visits (from booking system)

3. **Optimize Display**
   - Test different timing (5s vs 30s intervals)
   - Try different positions on page
   - Experiment with notification styles

4. **Scale Up**
   - Add multiple locations' data
   - Show real-time purchase notifications
   - Create urgency ("3 people viewing this page")

---

## 📚 Additional Resources

- **Files to use:**
  - `social-proof-live.js` - Frontend implementation
  - `backend-example.js` - Complete backend API
  - `LIVE-DATA-INTEGRATION-GUIDE.md` - Detailed documentation

- **Documentation:**
  - [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service/overview)
  - [Express.js Guide](https://expressjs.com/en/starter/installing.html)
  - [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

**Need help? The setup is working when you see real customer names and recent reviews appearing on your site!**
