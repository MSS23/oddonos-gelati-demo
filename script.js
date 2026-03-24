// Oddono's Gelato - Enhanced JavaScript
// Refined interactions and motion

(function() {
    'use strict';

    // Utility: Debounce
    const debounce = (func, wait = 100) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // ===================================
    // Mobile Navigation
    // ===================================
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

        navLinks.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
        });
    };

    // ===================================
    // Active Nav Link
    // ===================================
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    };

    // ===================================
    // Header Scroll Effect
    // ===================================
    const initHeaderScroll = () => {
        const header = document.querySelector('.header');
        if (!header) return;

        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.pageYOffset;
            header.classList.toggle('scrolled', scrollY > 50);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    };

    // ===================================
    // Hero Ken Burns Effect
    // ===================================
    const initHero = () => {
        const hero = document.getElementById('hero');
        if (!hero) return;

        // Trigger the loaded state after a brief delay for the Ken Burns zoom
        requestAnimationFrame(() => {
            setTimeout(() => hero.classList.add('loaded'), 100);
        });
    };

    // ===================================
    // Scroll Reveal
    // ===================================
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll(
            '.card, .feature-item, .testimonial-card, .timeline-item, .faq-item, .section-header, .cta-section, .location-card, .benefit-item'
        );

        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach((el, index) => {
            el.classList.add('reveal');
            // Stagger siblings within the same parent
            const siblings = Array.from(el.parentElement.children).filter(
                child => revealElements.length && child.classList.contains('reveal') || true
            );
            const siblingIndex = siblings.indexOf(el);
            if (siblingIndex > 0 && siblingIndex < 6) {
                el.classList.add(`reveal-delay-${Math.min(siblingIndex, 4)}`);
            }
            observer.observe(el);
        });
    };

    // ===================================
    // Smooth Parallax for Hero
    // ===================================
    const initParallax = () => {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg || window.innerWidth < 768) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const heroHeight = heroBg.parentElement.offsetHeight;
                    if (scrollY < heroHeight) {
                        heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    };

    // ===================================
    // Animated Counter
    // ===================================
    const initCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        const animateCounter = (el) => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const isDecimal = el.dataset.decimal === 'true';
            const duration = 2000;
            const startTime = performance.now();

            const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

            const tick = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutExpo(progress);
                const current = easedProgress * target;

                if (isDecimal) {
                    el.textContent = current.toFixed(1) + suffix;
                } else {
                    el.textContent = Math.floor(current) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    };

    // ===================================
    // Cursor Glow (desktop only)
    // ===================================
    const initCursorGlow = () => {
        const glow = document.getElementById('cursorGlow');
        if (!glow || window.innerWidth < 768 || 'ontouchstart' in window) return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            glow.classList.remove('active');
        });

        const updateGlow = () => {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(updateGlow);
        };

        requestAnimationFrame(updateGlow);
    };

    // ===================================
    // Scroll Progress Bar
    // ===================================
    const initScrollProgress = () => {
        const bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
                    bar.style.transform = `scaleX(${progress})`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    };

    // ===================================
    // 3D Card Tilt (desktop only)
    // ===================================
    const initCardTilt = () => {
        if (window.innerWidth < 768 || 'ontouchstart' in window) return;

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    };

    // ===================================
    // Initialize
    // ===================================
    document.addEventListener('DOMContentLoaded', () => {
        initMobileNav();
        setActiveNavLink();
        initHeaderScroll();
        initHero();
        initScrollReveal();
        initParallax();
        initCounters();
        initCursorGlow();
        initScrollProgress();
        initCardTilt();
    });

})();

// ===================================
// Smooth scroll for anchor links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===================================
// Contact Form
// ===================================
const initContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const showMessage = (message, type = 'success') => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem 1.25rem;
            margin: 1rem 0;
            border-radius: 12px;
            text-align: center;
            font-weight: 500;
            font-size: 0.925rem;
            background: ${type === 'success' ? '#EBF5EE' : '#FDF0F0'};
            color: ${type === 'success' ? '#1B7A3D' : '#C53030'};
            border: 1px solid ${type === 'success' ? '#C6E6D0' : '#FCD5D5'};
            animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        const existing = contactForm.querySelector('.form-message');
        if (existing) existing.remove();

        contactForm.insertBefore(messageDiv, contactForm.firstChild);
        setTimeout(() => messageDiv.remove(), 5000);
    };

    contactForm.addEventListener('submit', async (e) => {
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !subject || !message) {
            e.preventDefault();
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.preventDefault();
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
    });
};

document.addEventListener('DOMContentLoaded', initContactForm);

// ===================================
// Testimonial Carousel
// ===================================
class TestimonialCarousel {
    constructor(container) {
        this.container = container;
        this.testimonials = container.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        if (this.testimonials.length > 1) this.init();
    }

    init() {
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
        this.showSlide(0);
        this.startAutoPlay();

        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    showSlide(index) {
        this.testimonials.forEach((t, i) => t.style.display = i === index ? 'block' : 'none');
        this.dots.forEach((d, i) => d.classList.toggle('active', i === index));
        this.currentIndex = index;
    }

    goToSlide(index) {
        this.showSlide(index);
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    nextSlide() {
        this.showSlide((this.currentIndex + 1) % this.testimonials.length);
    }

    startAutoPlay() { this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000); }
    stopAutoPlay() { clearInterval(this.autoPlayInterval); }
}

const carouselContainer = document.querySelector('.testimonials-carousel');
if (carouselContainer) new TestimonialCarousel(carouselContainer);

// ===================================
// FAQ Accordion
// ===================================
const initFAQ = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all others
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });

            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');

            if (!isExpanded && typeof gtag !== 'undefined') {
                gtag('event', 'faq_open', {
                    'event_category': 'engagement',
                    'event_label': question.textContent.trim()
                });
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', initFAQ);

// ===================================
// Social Proof
// ===================================
const initSocialProof = () => {
    const socialProof = document.getElementById('socialProof');
    if (!socialProof) return;

    const names = ['Sarah', 'James', 'Emma', 'Oliver', 'Sophia', 'William', 'Charlotte', 'Leo'];
    const locations = ['Chelsea', 'Hampstead', 'Kensington', 'Mayfair', 'Notting Hill', 'Dulwich'];
    const actions = [
        'just joined the Gelato Card program',
        'just ordered wholesale gelato',
        'just visited our South Kensington shop',
        'just left a 5-star review'
    ];

    const showNotification = () => {
        const name = names[Math.floor(Math.random() * names.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];

        socialProof.querySelector('.social-proof-text').innerHTML =
            `<strong>${name} from ${location}</strong> ${action}`;

        socialProof.style.display = 'block';
        setTimeout(() => { socialProof.style.display = 'none'; }, 8000);
    };

    setTimeout(showNotification, 6000);
    setInterval(showNotification, 35000);
};

document.addEventListener('DOMContentLoaded', initSocialProof);

// ===================================
// CTA & Scroll Tracking
// ===================================
const trackCTAClicks = () => {
    document.querySelectorAll('.btn, .fab-button').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.trim() || this.getAttribute('data-tooltip') || 'Unknown';
            const href = this.getAttribute('href') || '';

            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': text,
                    'value': href
                });
            }

            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', { content_name: text });
            }
        });
    });
};

const trackScrollDepth = () => {
    const marks = { 25: false, 50: false, 75: false, 100: false };

    window.addEventListener('scroll', debounce(() => {
        const percent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        [25, 50, 75, 100].forEach(mark => {
            if (percent >= mark && !marks[mark]) {
                marks[mark] = true;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': `${mark}%`
                    });
                }
            }
        });
    }, 500), { passive: true });
};

document.addEventListener('DOMContentLoaded', () => {
    trackCTAClicks();
    trackScrollDepth();
});

// Lazy loading fallback
if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.src = img.dataset.src || img.src;
    });
}

// Map helper
function initMap(elementId, locations) {
    if (typeof google !== 'undefined' && google.maps) return true;
    return false;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestimonialCarousel, initMap };
}
