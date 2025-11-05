/* ================================================
   WHOLESALE PAGE - ENHANCED JAVASCRIPT
   Performance & Conversion Optimized
   ================================================ */

(function() {
    'use strict';

    // ============================================
    // 1. STICKY CTA BAR FUNCTIONALITY
    // ============================================
    const initStickyCTA = () => {
        const stickyTop = document.getElementById('sticky-cta-top');
        const stickyBottom = document.getElementById('sticky-cta-bottom');

        if (!stickyTop) return;

        let lastScroll = 0;
        const showScrollThreshold = 300;

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;

            // Show/hide top sticky bar after scrolling
            if (currentScroll > showScrollThreshold) {
                stickyTop.classList.add('visible');
            } else {
                stickyTop.classList.remove('visible');
            }

            // Show bottom CTA on mobile when scrolling down
            if (stickyBottom && window.innerWidth <= 768) {
                if (currentScroll > lastScroll && currentScroll > showScrollThreshold) {
                    stickyBottom.style.transform = 'translateY(0)';
                } else {
                    stickyBottom.style.transform = 'translateY(100%)';
                }
            }

            lastScroll = currentScroll;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // ============================================
    // 2. FORM VALIDATION & SUBMISSION
    // ============================================
    const initEnquiryForm = () => {
        const form = document.getElementById('wholesale-enquiry-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const formData = {
                businessName: document.getElementById('business-name')?.value.trim(),
                contactName: document.getElementById('contact-name')?.value.trim(),
                email: document.getElementById('email')?.value.trim(),
                phone: document.getElementById('phone')?.value.trim(),
                businessType: document.getElementById('business-type')?.value,
                postcode: document.getElementById('postcode')?.value.trim(),
                requirements: document.getElementById('requirements')?.value.trim(),
                consent: document.getElementById('consent')?.checked
            };

            // Validation
            if (!validateForm(formData)) {
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<svg class="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="3" opacity="0.25"/><path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg> Sending...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual endpoint)
            setTimeout(() => {
                showSuccessMessage(form, formData.contactName);
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Track conversion (Google Analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                        'value': 1.0,
                        'currency': 'GBP'
                    });
                }

                // Scroll to success message
                setTimeout(() => {
                    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }, 1500);
        });
    };

    const validateForm = (data) => {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showError('Please enter a valid email address');
            document.getElementById('email')?.focus();
            return false;
        }

        // Phone validation (UK format)
        const phoneRegex = /^(\+44|0)[0-9]{10}$/;
        const cleanPhone = data.phone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showError('Please enter a valid UK phone number');
            document.getElementById('phone')?.focus();
            return false;
        }

        // Postcode validation (basic UK format)
        const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
        if (!postcodeRegex.test(data.postcode)) {
            showError('Please enter a valid UK postcode');
            document.getElementById('postcode')?.focus();
            return false;
        }

        if (!data.consent) {
            showError('Please accept the privacy policy to continue');
            return false;
        }

        return true;
    };

    const showError = (message) => {
        // Remove existing alerts
        const existing = document.querySelector('.form-alert');
        if (existing) existing.remove();

        const alert = document.createElement('div');
        alert.className = 'form-alert form-alert-error';
        alert.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>${message}</span>
        `;
        alert.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            margin-bottom: 1.5rem;
            background: #fee;
            border-left: 4px solid #c33;
            border-radius: 8px;
            color: #c33;
            animation: slideDown 0.3s ease;
        `;

        const form = document.getElementById('wholesale-enquiry-form');
        form.insertBefore(alert, form.firstChild);

        setTimeout(() => alert.remove(), 5000);
    };

    const showSuccessMessage = (form, name) => {
        const existing = document.querySelector('.form-alert');
        if (existing) existing.remove();

        const alert = document.createElement('div');
        alert.className = 'form-alert form-alert-success';
        alert.innerHTML = `
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <div>
                <strong>Thank you, ${name}!</strong>
                <p style="margin: 0.25rem 0 0 0;">We've received your enquiry and will contact you within 24 hours with wholesale pricing and product information.</p>
            </div>
        `;
        alert.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            background: #d4edda;
            border-left: 4px solid #28a745;
            border-radius: 8px;
            color: #155724;
            animation: slideDown 0.3s ease;
        `;

        form.insertBefore(alert, form.firstChild);
    };

    // ============================================
    // 3. NEWSLETTER FORM
    // ============================================
    const initNewsletterForm = () => {
        const form = document.getElementById('newsletter-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('newsletter-email')?.value.trim();
            const name = document.getElementById('newsletter-name')?.value.trim();
            const phone = document.getElementById('newsletter-phone')?.value.trim();

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterMessage('Please enter a valid email address', 'error');
                return;
            }

            // Show loading
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showNewsletterMessage(`Welcome aboard, ${name}! Check your email for our wholesale welcome guide.`, 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Track subscription
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'engagement',
                        'event_label': 'wholesale'
                    });
                }
            }, 1000);
        });
    };

    const showNewsletterMessage = (message, type) => {
        const form = document.getElementById('newsletter-form');
        const existing = form.querySelector('.newsletter-message');
        if (existing) existing.remove();

        const alert = document.createElement('div');
        alert.className = `newsletter-message newsletter-${type}`;
        alert.textContent = message;
        alert.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            background: ${type === 'success' ? '#d4edda' : '#fee'};
            color: ${type === 'success' ? '#155724' : '#c33'};
            animation: slideDown 0.3s ease;
        `;

        form.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    };

    // ============================================
    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            });
        });
    };

    // ============================================
    // 5. LAZY LOADING OPTIMIZATION
    // ============================================
    const initLazyLoading = () => {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };

    // ============================================
    // 6. PERFORMANCE TRACKING
    // ============================================
    const trackPerformance = () => {
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Track Largest Contentful Paint (LCP)
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP tracking not supported');
            }

            // Track First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID tracking not supported');
            }
        }
    };

    // ============================================
    // 7. ACCESSIBILITY ENHANCEMENTS
    // ============================================
    const enhanceAccessibility = () => {
        // Add focus visible polyfill for older browsers
        document.body.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        document.body.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });

        // Announce dynamic content changes to screen readers
        const createLiveRegion = () => {
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0,0,0,0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(liveRegion);
            return liveRegion;
        };

        window.announceToScreenReader = (message) => {
            const liveRegion = document.querySelector('[role="status"]') || createLiveRegion();
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    };

    // ============================================
    // 8. INITIALIZE ALL FEATURES
    // ============================================
    const init = () => {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initStickyCTA();
        initEnquiryForm();
        initNewsletterForm();
        initSmoothScroll();
        initLazyLoading();
        trackPerformance();
        enhanceAccessibility();

        console.log('✅ Wholesale page enhanced and ready');
    };

    // Start initialization
    init();

})();

// ============================================
// GLOBAL UTILITIES
// ============================================

// Format phone number as user types
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.startsWith('44')) {
                    value = '+' + value;
                } else if (value.startsWith('0')) {
                    value = value.substring(0, 11);
                }
                e.target.value = value;
            }
        });
    });
});

// Add animation when elements come into view
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.benefit-card, .product-card, .testimonial-enhanced-card').forEach(el => {
        observer.observe(el);
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}
