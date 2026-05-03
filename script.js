/* =========================================================================
   Oddono's — Editorial gelato site
   Lenis-style smooth scroll · custom cursor · observer reveals
   FAQ · today's flavor rotator · stats counter · nav · marquee guard
   ========================================================================= */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = matchMedia('(hover: none)').matches || 'ontouchstart' in window;

    /* ---------------------------------------------------------------------
       1.  Smooth scroll  (lightweight Lenis-inspired)
       --------------------------------------------------------------------- */
    function initSmoothScroll() {
        if (prefersReducedMotion || isTouch) return;
        let current = window.scrollY;
        let target = window.scrollY;
        const ease = 0.085;
        let raf;

        function tick() {
            current += (target - current) * ease;
            if (Math.abs(target - current) < 0.4) current = target;
            window.scrollTo(0, current);
            if (Math.abs(target - current) > 0.1) {
                raf = requestAnimationFrame(tick);
            } else {
                raf = null;
            }
        }

        function onWheel(e) {
            // Don't intercept when modifier keys are pressed
            if (e.ctrlKey || e.metaKey) return;
            // Don't break form scrolling
            const path = e.composedPath ? e.composedPath() : [];
            for (const el of path) {
                if (!el || !el.tagName) continue;
                const tag = el.tagName.toLowerCase();
                if (tag === 'textarea' || tag === 'select') return;
            }
            e.preventDefault();
            target += e.deltaY;
            target = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight));
            if (!raf) raf = requestAnimationFrame(tick);
        }

        window.addEventListener('wheel', onWheel, { passive: false });

        // Anchor links — animate target update
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (ev) => {
                const id = a.getAttribute('href');
                if (id.length < 2) return;
                const el = document.querySelector(id);
                if (!el) return;
                ev.preventDefault();
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                target = top;
                if (!raf) raf = requestAnimationFrame(tick);
            });
        });

        // Keep target in sync when user uses keyboard / programmatic scroll
        window.addEventListener('scroll', () => {
            if (!raf) {
                current = window.scrollY;
                target = window.scrollY;
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            target = Math.min(target, document.documentElement.scrollHeight - window.innerHeight);
        });
    }

    /* ---------------------------------------------------------------------
       2.  Custom cursor (dot + lagging ring, magnetic on interactive)
       --------------------------------------------------------------------- */
    function initCursor() {
        if (isTouch || prefersReducedMotion) return;
        const dot = document.createElement('div');
        const ring = document.createElement('div');
        dot.className = 'cursor-dot';
        ring.className = 'cursor-ring';
        document.body.append(dot, ring);

        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let dx = mx, dy = my, rx = mx, ry = my;
        let raf;

        function tick() {
            dx += (mx - dx) * 0.55;
            dy += (my - dy) * 0.55;
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            raf = requestAnimationFrame(tick);
        }

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            if (!raf) raf = requestAnimationFrame(tick);
        });

        document.addEventListener('mouseleave', () => {
            dot.classList.add('hide');
            ring.classList.add('hide');
        });
        document.addEventListener('mouseenter', () => {
            dot.classList.remove('hide');
            ring.classList.remove('hide');
        });

        const interactive = 'a, button, input, textarea, select, [data-cursor], .faq-question, .today__nav button, .today__dot';
        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactive)) {
                ring.classList.add('is-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactive)) {
                ring.classList.remove('is-hover');
            }
        });

        tick();
    }

    /* ---------------------------------------------------------------------
       3.  Header scroll + scroll progress
       --------------------------------------------------------------------- */
    function initHeader() {
        const header = document.querySelector('.header');
        if (!header) return;
        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        document.body.appendChild(progress);

        let lastY = 0;
        function update() {
            const y = window.scrollY;
            header.classList.toggle('scrolled', y > 24);
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = max > 0 ? Math.min(1, y / max) : 0;
            progress.style.transform = `scaleX(${ratio})`;
            lastY = y;
        }
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    }

    /* ---------------------------------------------------------------------
       4.  Mobile nav
       --------------------------------------------------------------------- */
    function initNav() {
        const burger = document.querySelector('.hamburger');
        const menu = document.querySelector('.nav-menu');
        if (!burger || !menu) return;

        // index nav-link items for mobile stagger
        menu.querySelectorAll('.nav-link').forEach((el, i) => el.style.setProperty('--i', i));

        burger.addEventListener('click', () => {
            const open = menu.classList.toggle('active');
            burger.classList.toggle('active');
            burger.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        menu.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                menu.classList.remove('active');
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Mark active link by current page
        const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        menu.querySelectorAll('.nav-link').forEach((a) => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
        });
    }

    /* ---------------------------------------------------------------------
       5.  Reveal observer (line-rise, mask-reveal, reveal, reveal-words)
       --------------------------------------------------------------------- */
    function splitWords(el) {
        if (el.dataset.split === 'true') return;
        const text = el.textContent;
        const words = text.split(/\s+/).filter(Boolean);
        el.innerHTML = words.map(w =>
            `<span class="w"><i>${w}</i></span>`
        ).join(' ');
        el.dataset.split = 'true';
    }

    function initReveals() {
        // Auto-split reveal-words elements
        document.querySelectorAll('.reveal-words').forEach(splitWords);

        const targets = document.querySelectorAll(
            '.reveal, .reveal-words, .mask-reveal, .line-rise, .soft-fade'
        );

        if (!('IntersectionObserver' in window)) {
            targets.forEach(t => { t.classList.add('visible', 'in-view'); });
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        targets.forEach(t => io.observe(t));
    }

    /* ---------------------------------------------------------------------
       6.  Hero load
       --------------------------------------------------------------------- */
    function initHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        // fire after layout
        requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-loaded', 'loaded')));
    }

    /* ---------------------------------------------------------------------
       7.  Stats counter
       --------------------------------------------------------------------- */
    function initStats() {
        const nums = document.querySelectorAll('.stat-number[data-target]');
        if (!nums.length || !('IntersectionObserver' in window)) {
            nums.forEach(n => n.textContent = n.dataset.target + (n.dataset.suffix || ''));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const decimal = el.dataset.decimal === 'true';
                const dur = 1800;
                const start = performance.now();
                el.classList.add('counting');

                function step(ts) {
                    const t = Math.min(1, (ts - start) / dur);
                    const eased = 1 - Math.pow(1 - t, 3);
                    const value = decimal ? (target * eased).toFixed(1) : Math.round(target * eased);
                    el.textContent = value + suffix;
                    if (t < 1) requestAnimationFrame(step);
                    else el.classList.remove('counting');
                }
                requestAnimationFrame(step);
                io.unobserve(el);
            });
        }, { threshold: 0.4 });

        nums.forEach(n => io.observe(n));
    }

    /* ---------------------------------------------------------------------
       8.  FAQ accordion
       --------------------------------------------------------------------- */
    function initFAQ() {
        document.querySelectorAll('.faq-item').forEach((item) => {
            const q = item.querySelector('.faq-question');
            const a = item.querySelector('.faq-answer');
            if (!q || !a) return;
            q.addEventListener('click', () => {
                const open = q.getAttribute('aria-expanded') === 'true';
                q.setAttribute('aria-expanded', !open);
                a.classList.toggle('active', !open);
            });
        });
    }

    /* ---------------------------------------------------------------------
       9.  Today's selection rotator
       --------------------------------------------------------------------- */
    function initToday() {
        const root = document.querySelector('[data-today]');
        if (!root) return;

        const flavors = [
            {
                name: 'Pistachio',
                accent: 'di Bronte',
                desc: 'Pistachios from the slopes of Mount Etna, slow-roasted and stone-milled into an unrivalled paste. Two Great Taste Award gold stars and counting.',
                notes: ['Classic', 'Sicilian', 'Award winner'],
                color: '#A8B57E',
                img: 'images/PXL_20251103_214658516.jpg',
                index: '01 / 06'
            },
            {
                name: 'Stracciatella',
                accent: 'fior di latte',
                desc: 'Cold-churned Jersey milk gelato, hand-swirled with shards of single-origin dark chocolate that snap softly under the spoon.',
                notes: ['Latte', 'Cocoa', 'Hand-swirled'],
                color: '#EFE5D0',
                img: 'images/PXL_20251103_214701919.MP.jpg',
                index: '02 / 06'
            },
            {
                name: 'Nocciola',
                accent: 'del Piemonte',
                desc: 'IGP Piedmont hazelnuts, roasted in-house. Deep, aromatic, faintly toffee — the gelato every Italian asks for first.',
                notes: ['Hazelnut', 'IGP', 'Roasted'],
                color: '#B8956A',
                img: 'images/IMG-20250414-WA0008.jpg',
                index: '03 / 06'
            },
            {
                name: 'Cioccolato',
                accent: 'fondente',
                desc: 'Belgian dark chocolate folded into a low-sugar base. Velvet on the spoon, intense on the tongue, finish that lingers.',
                notes: ['Dark', 'Belgian', '70% cocoa'],
                color: '#5A3A2A',
                img: 'images/IMG_20230608_195819.jpg',
                index: '04 / 06'
            },
            {
                name: 'Limone',
                accent: 'di Sicilia',
                desc: 'A sorbetto, not a gelato. Sicilian lemons, water, sugar — that is the entire recipe. Astringent, alive, the perfect palate cleanser.',
                notes: ['Sorbetto', 'Vegan', 'Sicilian'],
                color: '#E8D77A',
                img: 'images/IMG_20230608_195820.jpg',
                index: '05 / 06'
            },
            {
                name: 'Bacio',
                accent: 'al cioccolato',
                desc: 'A nod to the famous Italian chocolate. Hazelnut gelato, dark chocolate chips, a ribbon of cocoa swirl — engineered for the indulgent.',
                notes: ['Hazelnut', 'Cocoa', 'Indulgent'],
                color: '#7B5A4A',
                img: 'images/IMG_20250821_195905.jpg',
                index: '06 / 06'
            }
        ];

        let i = 0;
        const nameEl = root.querySelector('[data-today-name]');
        const descEl = root.querySelector('[data-today-desc]');
        const notesEl = root.querySelector('[data-today-notes]');
        const idxEl = root.querySelector('[data-today-index]');
        const swatchEl = root.querySelector('[data-today-swatch]');
        const imgEl = root.querySelector('[data-today-img]');
        const dotsEl = root.querySelector('[data-today-dots]');
        const prevBtn = root.querySelector('[data-today-prev]');
        const nextBtn = root.querySelector('[data-today-next]');

        // dots
        if (dotsEl) {
            flavors.forEach((_, k) => {
                const d = document.createElement('button');
                d.className = 'today__dot';
                d.setAttribute('aria-label', `Show flavour ${k + 1}`);
                d.addEventListener('click', () => go(k));
                dotsEl.appendChild(d);
            });
        }

        function render() {
            const f = flavors[i];
            // animate fade
            if (nameEl) {
                nameEl.classList.add('fade-out');
                descEl?.classList.add('fade-out');
                imgEl?.classList.add('fade-out');
                setTimeout(() => {
                    if (nameEl) nameEl.innerHTML = `${f.name} <span class="it">${f.accent}</span>`;
                    if (descEl) descEl.textContent = f.desc;
                    if (idxEl) idxEl.textContent = f.index;
                    if (notesEl) notesEl.innerHTML = f.notes.map(n => `<span class="today__note">${n}</span>`).join('');
                    if (swatchEl) swatchEl.style.background = f.color;
                    if (imgEl) {
                        imgEl.src = f.img;
                        imgEl.alt = `${f.name} ${f.accent} gelato at Oddono's`;
                    }
                    nameEl.classList.remove('fade-out');
                    descEl?.classList.remove('fade-out');
                    imgEl?.classList.remove('fade-out');
                }, 250);
            }
            if (dotsEl) {
                dotsEl.querySelectorAll('.today__dot').forEach((d, k) => {
                    d.classList.toggle('active', k === i);
                });
            }
        }

        function go(k) {
            i = (k + flavors.length) % flavors.length;
            render();
            resetTimer();
        }

        prevBtn?.addEventListener('click', () => go(i - 1));
        nextBtn?.addEventListener('click', () => go(i + 1));

        // Keyboard support
        root.tabIndex = 0;
        root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') go(i - 1);
            if (e.key === 'ArrowRight') go(i + 1);
        });

        // Auto-rotate when in view
        let timer = null;
        function startTimer() {
            stopTimer();
            timer = setInterval(() => go(i + 1), 6000);
        }
        function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
        function resetTimer() { startTimer(); }

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => entry.isIntersecting ? startTimer() : stopTimer());
            }, { threshold: 0.4 });
            io.observe(root);
        } else { startTimer(); }

        render();
    }

    /* ---------------------------------------------------------------------
      10.  Magnetic buttons (very subtle)
       --------------------------------------------------------------------- */
    function initMagnetic() {
        if (isTouch || prefersReducedMotion) return;
        document.querySelectorAll('.btn, .magnetic, .nav-cta').forEach((el) => {
            el.classList.add('magnetic');
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    /* ---------------------------------------------------------------------
      11.  Hero parallax (subtle)
       --------------------------------------------------------------------- */
    function initParallax() {
        if (isTouch || prefersReducedMotion) return;
        const visual = document.querySelector('.hero__visual img, .hero__visual .hero-bg');
        if (!visual) return;
        let ticking = false;

        function update() {
            const y = window.scrollY;
            const scale = 1 + Math.min(y / 4000, 0.04);
            const ty = Math.min(y * 0.12, 80);
            visual.style.transform = `translateY(${ty}px) scale(${scale})`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ---------------------------------------------------------------------
      12.  Marquee — duplicate items if needed for seamless loop
       --------------------------------------------------------------------- */
    function initMarquee() {
        document.querySelectorAll('.marquee-track').forEach((track) => {
            // Already duplicated in markup? skip if track is wide enough
            if (track.scrollWidth >= window.innerWidth * 2.2) return;
            const clone = track.innerHTML;
            track.innerHTML = clone + clone;
        });
    }

    /* ---------------------------------------------------------------------
      13.  Year stamp
       --------------------------------------------------------------------- */
    function initYear() {
        document.querySelectorAll('[data-year]').forEach((el) => {
            el.textContent = new Date().getFullYear();
        });
    }

    /* ---------------------------------------------------------------------
      14.  Init all
       --------------------------------------------------------------------- */
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(() => {
        initHeader();
        initNav();
        initHero();
        initReveals();
        initFAQ();
        initStats();
        initToday();
        initMagnetic();
        initParallax();
        initMarquee();
        initYear();
        initCursor();
        // Smooth scroll runs last; only on desktop
        initSmoothScroll();
    });
})();

/* Legacy global helpers used by quiz pages */
window.showFlavorResult = function (btn) {
    const mood = btn.dataset.mood;
    const results = {
        classic: "You're a <strong>Dark Chocolate</strong> or <strong>Madagascar Vanilla</strong> kind of person — rich, velvety, timeless. Ask for a taster at any shop.",
        fresh: "Try our <strong>Mango Sorbet</strong> or <strong>Limone di Sicilia</strong> — dairy-free, bright, alive.",
        nutty: "<strong>Pistachio di Bronte</strong> or <strong>Nocciola del Piemonte</strong>. Both award-winners. Both unforgettable.",
        adventurous: "Reach for <strong>Basil</strong> or <strong>Chocolate &amp; Cognac</strong> — flavours you won't find elsewhere in London."
    };
    const r = document.getElementById('quizResult');
    if (r) {
        r.style.display = 'block';
        const t = r.querySelector('.quiz-result-text');
        if (t) t.innerHTML = results[mood];
    }
    const opts = document.querySelector('.quiz-options');
    if (opts) opts.style.display = 'none';
};

window.resetQuiz = function () {
    const r = document.getElementById('quizResult');
    if (r) r.style.display = 'none';
    const opts = document.querySelector('.quiz-options');
    if (opts) opts.style.display = 'grid';
};
