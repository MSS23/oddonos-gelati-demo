// Oddono's Gelato - Main JavaScript File
// Optimized for performance and accessibility

(function() {
    'use strict';

    // Utility: Debounce function for performance
    const debounce = (func, wait = 100) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Mobile Navigation Toggle
    const initMobileNav = () => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) return;

        const toggleMenu = () => {
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        const closeMenu = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.setAttribute('aria-expanded', 'false');

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    };

    // Set active nav link based on current page
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    };

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        initMobileNav();
        setActiveNavLink();
    });

})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Validation and Submission - Enhanced
const initContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const showMessage = (message, type = 'success') => {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
            animation: slideDown 0.3s ease;
        `;

        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        // Insert message
        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => messageDiv.remove(), 5000);
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        // Basic validation
        if (!name || !email || !subject || !message) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showMessage(`Thank you for your message, ${name}! We'll get back to you as soon as possible.`, 'success');
            contactForm.reset();
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }, 1000);
    });
};

// Initialize form on load
document.addEventListener('DOMContentLoaded', initContactForm);

// Testimonial Carousel (if needed)
class TestimonialCarousel {
    constructor(container) {
        this.container = container;
        this.testimonials = container.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        if (this.testimonials.length > 1) {
            this.init();
        }
    }

    init() {
        // Create navigation dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        this.testimonials.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        this.container.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.carousel-dot');

        // Show first slide
        this.showSlide(0);

        // Auto-play
        this.startAutoPlay();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    showSlide(index) {
        this.testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
    }

    goToSlide(index) {
        this.showSlide(index);
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.showSlide(nextIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize carousel if it exists
const carouselContainer = document.querySelector('.testimonials-carousel');
if (carouselContainer) {
    new TestimonialCarousel(carouselContainer);
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to cards and features
document.querySelectorAll('.card, .feature-item, .testimonial-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Header scroll effect - Optimized with debounce and RAF
const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;
    let lastScroll = 0;

    const updateHeader = (currentScroll) => {
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            header.classList.add('scrolled');
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
        ticking = false;
    };

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(() => updateHeader(currentScroll));
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
};

// Initialize on load
document.addEventListener('DOMContentLoaded', initHeaderScroll);

// ===================================
// FAQ Accordion Functionality
// ===================================
const initFAQ = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });

            // Toggle current FAQ
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');

            // Track engagement
            if (!isExpanded && typeof gtag !== 'undefined') {
                gtag('event', 'faq_open', {
                    'event_category': 'engagement',
                    'event_label': question.textContent.trim()
                });
            }
        });
    });
};

// Initialize FAQ on load
document.addEventListener('DOMContentLoaded', initFAQ);

// ===================================
// Social Proof Notification
// ===================================
const initSocialProof = () => {
    const socialProof = document.getElementById('socialProof');
    if (!socialProof) return;

    const names = ['Sarah', 'James', 'Emma', 'Oliver', 'Sophia', 'William'];
    const locations = ['Chelsea', 'Hampstead', 'Kensington', 'Mayfair', 'Notting Hill'];
    const actions = [
        'just joined the Gelato Card program',
        'just ordered wholesale gelato',
        'just visited our South Kensington location',
        'just left a 5-star review'
    ];

    const showNotification = () => {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];

        const textElement = socialProof.querySelector('.social-proof-text');
        textElement.innerHTML = `<strong>${randomName} from ${randomLocation}</strong> ${randomAction}`;

        socialProof.style.display = 'block';

        // Track engagement
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_proof_view', {
                'event_category': 'engagement'
            });
        }

        // Auto-hide after 8 seconds
        setTimeout(() => {
            socialProof.style.display = 'none';
        }, 8000);
    };

    // Show first notification after 5 seconds
    setTimeout(showNotification, 5000);

    // Show subsequent notifications every 30 seconds
    setInterval(showNotification, 30000);
};

// Initialize social proof
document.addEventListener('DOMContentLoaded', initSocialProof);

// ===================================
// CTA Click Tracking
// ===================================
const trackCTAClicks = () => {
    const ctaButtons = document.querySelectorAll('.btn, .fab-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim() || this.getAttribute('data-tooltip') || 'Unknown';
            const buttonHref = this.getAttribute('href') || 'No link';

            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText,
                    'value': buttonHref
                });
            }

            // Track with Facebook Pixel if available
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: buttonText
                });
            }
        });
    });
};

// Initialize CTA tracking
document.addEventListener('DOMContentLoaded', trackCTAClicks);

// ===================================
// Scroll Depth Tracking
// ===================================
const trackScrollDepth = () => {
    let scrollMarks = { 25: false, 50: false, 75: false, 100: false };

    const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        // Track milestones
        [25, 50, 75, 100].forEach(mark => {
            if (scrollPercent >= mark && !scrollMarks[mark]) {
                scrollMarks[mark] = true;

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': `${mark}%`,
                        'value': mark
                    });
                }
            }
        });
    };

    window.addEventListener('scroll', debounce(handleScroll, 500), { passive: true });
};

// Initialize scroll tracking
document.addEventListener('DOMContentLoaded', trackScrollDepth);

// Image lazy loading fallback for older browsers
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Map initialization helper
function initMap(elementId, locations) {
    // This would integrate with Google Maps API
    // For now, we'll just note that it should be implemented
    console.log('Map initialization for:', elementId, locations);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestimonialCarousel, initMap };
}
