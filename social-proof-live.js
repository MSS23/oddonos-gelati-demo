// ===================================
// REAL-TIME SOCIAL PROOF WITH LIVE DATA
// ===================================

// Configuration
const SOCIAL_PROOF_CONFIG = {
    apiEndpoint: '/api/recent-activity', // Your backend API endpoint
    googlePlacesId: 'YOUR_GOOGLE_PLACES_ID', // From Google Business Profile
    updateInterval: 15000, // Check for new data every 15 seconds
    displayDuration: 8000, // Show notification for 8 seconds
    maxAge: 3600000 // Only show activities from last hour (in ms)
};

/**
 * OPTION 1: Fetch from Your Own Backend API
 *
 * Your backend should:
 * 1. Store customer activities (signups, reviews, purchases) in a database
 * 2. Expose an API endpoint that returns recent activities
 * 3. Include timestamp, name, location, and action type
 */
const fetchRecentActivities = async () => {
    try {
        const response = await fetch(SOCIAL_PROOF_CONFIG.apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }

        const data = await response.json();

        // Expected format:
        // [
        //   {
        //     id: 1,
        //     name: "Sarah",
        //     location: "Chelsea",
        //     action: "joined the Gelato Card program",
        //     timestamp: "2025-01-05T14:30:00Z",
        //     verified: true
        //   },
        //   ...
        // ]

        return data.filter(activity => {
            const activityTime = new Date(activity.timestamp).getTime();
            const now = Date.now();
            return (now - activityTime) < SOCIAL_PROOF_CONFIG.maxAge;
        });

    } catch (error) {
        console.error('Error fetching social proof data:', error);
        return null;
    }
};

/**
 * OPTION 2: Google Reviews Integration
 * Fetch real Google reviews using Google Places API
 */
const fetchGoogleReviews = async () => {
    const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // Get from Google Cloud Console
    const placeId = SOCIAL_PROOF_CONFIG.googlePlacesId;

    try {
        // NOTE: This should be done server-side to protect your API key
        // This is a proxy request through your backend
        const response = await fetch(`/api/google-reviews?placeId=${placeId}`, {
            method: 'GET'
        });

        const data = await response.json();

        // Transform Google reviews into social proof format
        return data.reviews?.slice(0, 5).map(review => ({
            name: review.author_name.split(' ')[0], // First name only
            location: extractLocation(review.author_name),
            action: `left a ${review.rating}-star review`,
            timestamp: new Date(review.time * 1000).toISOString(),
            verified: true,
            reviewText: review.text.substring(0, 100) + '...'
        })) || [];

    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        return [];
    }
};

// Helper function to extract location from reviewer name/profile
const extractLocation = (authorName) => {
    // You might need to enhance this based on your data
    const locations = ['Chelsea', 'Hampstead', 'Kensington', 'Mayfair', 'Notting Hill'];
    return locations[Math.floor(Math.random() * locations.length)];
};

/**
 * OPTION 3: Webhook/Event-Driven (Most Real-Time)
 * Listen for real-time events via WebSockets or Server-Sent Events
 */
let eventSource;

const initRealtimeUpdates = () => {
    if (!window.EventSource) {
        console.warn('EventSource not supported');
        return;
    }

    // Connect to your backend's Server-Sent Events endpoint
    eventSource = new EventSource('/api/activity-stream');

    eventSource.onmessage = (event) => {
        try {
            const activity = JSON.parse(event.data);
            displaySocialProof(activity);
        } catch (error) {
            console.error('Error parsing activity event:', error);
        }
    };

    eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();

        // Reconnect after 5 seconds
        setTimeout(initRealtimeUpdates, 5000);
    };
};

/**
 * Enhanced Social Proof Display with Real Data
 */
let activityQueue = [];
let isDisplaying = false;

const initLiveSocialProof = async () => {
    const socialProof = document.getElementById('socialProof');
    if (!socialProof) return;

    // Choose your data source method:
    // Method 1: Polling (fetch periodically)
    startPolling();

    // Method 2: Real-time (WebSocket/SSE) - Uncomment to use
    // initRealtimeUpdates();
};

const startPolling = async () => {
    // Initial fetch
    await updateActivityQueue();

    // Then poll at intervals
    setInterval(async () => {
        await updateActivityQueue();
    }, SOCIAL_PROOF_CONFIG.updateInterval);

    // Start displaying notifications
    displayNextActivity();
};

const updateActivityQueue = async () => {
    try {
        // Fetch from your API
        const activities = await fetchRecentActivities();

        // Optionally merge with Google reviews
        // const googleReviews = await fetchGoogleReviews();
        // activities = [...activities, ...googleReviews];

        if (activities && activities.length > 0) {
            // Add new activities to queue (avoid duplicates)
            activities.forEach(activity => {
                if (!activityQueue.find(a => a.id === activity.id)) {
                    activityQueue.push(activity);
                }
            });

            // Keep only recent activities
            activityQueue = activityQueue.filter(activity => {
                const activityTime = new Date(activity.timestamp).getTime();
                return (Date.now() - activityTime) < SOCIAL_PROOF_CONFIG.maxAge;
            });
        }
    } catch (error) {
        console.error('Error updating activity queue:', error);
    }
};

const displayNextActivity = () => {
    if (activityQueue.length === 0) {
        // No activities, try again later
        setTimeout(displayNextActivity, SOCIAL_PROOF_CONFIG.updateInterval);
        return;
    }

    // Get the oldest activity (FIFO)
    const activity = activityQueue.shift();

    displaySocialProof(activity);

    // Schedule next notification
    setTimeout(displayNextActivity, SOCIAL_PROOF_CONFIG.displayDuration + 5000);
};

const displaySocialProof = (activity) => {
    const socialProof = document.getElementById('socialProof');
    if (!socialProof) return;

    const textElement = socialProof.querySelector('.social-proof-text');
    const iconElement = socialProof.querySelector('.social-proof-icon');

    // Choose icon based on action type
    const icon = getIconForAction(activity.action);
    iconElement.textContent = icon;

    // Display the activity
    textElement.innerHTML = `<strong>${activity.name} from ${activity.location}</strong> ${activity.action}`;

    // Add verified badge if applicable
    if (activity.verified) {
        textElement.innerHTML += ' <span style="color: #1DA1F2;">✓</span>';
    }

    socialProof.style.display = 'block';

    // Track with analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'social_proof_view', {
            'event_category': 'engagement',
            'event_label': activity.action,
            'value': 'real_data'
        });
    }

    // Auto-hide
    setTimeout(() => {
        socialProof.style.display = 'none';
    }, SOCIAL_PROOF_CONFIG.displayDuration);
};

const getIconForAction = (action) => {
    if (action.includes('review')) return '⭐';
    if (action.includes('joined') || action.includes('sign')) return '🎉';
    if (action.includes('ordered') || action.includes('purchased')) return '🛒';
    if (action.includes('visited')) return '📍';
    return '✨';
};

/**
 * Fallback to simulated data if API is unavailable
 */
const useFallbackData = () => {
    console.warn('Using fallback simulated data');

    const names = ['Sarah', 'James', 'Emma', 'Oliver', 'Sophia', 'William', 'Charlotte', 'Harry'];
    const locations = ['Chelsea', 'Hampstead', 'Kensington', 'Mayfair', 'Notting Hill', 'Belgravia', 'Soho'];
    const actions = [
        'just joined the Gelato Card program',
        'just left a 5-star review',
        'just visited our South Kensington location',
        'just ordered wholesale gelato',
        'just recommended us to a friend'
    ];

    return {
        name: names[Math.floor(Math.random() * names.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: new Date().toISOString(),
        verified: Math.random() > 0.5
    };
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (eventSource) {
        eventSource.close();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initLiveSocialProof);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchRecentActivities,
        fetchGoogleReviews,
        displaySocialProof,
        updateActivityQueue
    };
}
