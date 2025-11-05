// Cookie Consent Banner
(function() {
    'use strict';

    // Check if user has already consented
    function hasConsented() {
        return localStorage.getItem('oddono-cookie-consent') === 'true';
    }

    // Set consent
    function setConsent() {
        localStorage.setItem('oddono-cookie-consent', 'true');
    }

    // Create and show cookie banner
    function showCookieBanner() {
        if (hasConsented()) {
            return;
        }

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(26, 26, 46, 0.98);
            color: white;
            padding: 1.5rem;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
            animation: slideUp 0.4s ease;
        `;

        banner.innerHTML = `
            <div style="flex: 1;">
                <p style="margin: 0; font-size: 0.95rem; line-height: 1.6;">
                    We use cookies to enhance your experience on our site. By continuing to browse, you agree to our use of cookies.
                    <a href="privacy.html" style="color: #D4AF37; text-decoration: underline;">Learn more</a>
                </p>
            </div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button id="cookie-accept" style="
                    background: #D4AF37;
                    color: #1a1a2e;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                ">
                    Accept
                </button>
                <button id="cookie-decline" style="
                    background: transparent;
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 0.75rem 2rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                ">
                    Decline
                </button>
            </div>
        `;

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            #cookie-accept:hover {
                background: #c59d2f !important;
                transform: translateY(-2px);
            }
            #cookie-decline:hover {
                border-color: white !important;
                background: rgba(255,255,255,0.1) !important;
            }
            @media (max-width: 768px) {
                #cookie-consent-banner {
                    flex-direction: column !important;
                    text-align: center;
                }
                #cookie-consent-banner > div:last-child {
                    justify-content: center;
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Event listeners
        document.getElementById('cookie-accept').addEventListener('click', function() {
            setConsent();
            banner.style.animation = 'slideUp 0.4s ease reverse';
            setTimeout(() => banner.remove(), 400);
        });

        document.getElementById('cookie-decline').addEventListener('click', function() {
            banner.style.animation = 'slideUp 0.4s ease reverse';
            setTimeout(() => banner.remove(), 400);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showCookieBanner);
    } else {
        showCookieBanner();
    }
})();
