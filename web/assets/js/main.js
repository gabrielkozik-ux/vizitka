/* ==========================================================================
   main.js — nacita se na kazde strance
   --------------------------------------------------------------------------
   1. Mobilni navigace (hamburger)
   2. Prepinac jazyka
   3. Scroll reveal (.reveal -> .visible)
   4. Animovane countery v trust baru (.trust-number[data-count])

   Vsechno v jednom DOMContentLoaded. Kazdy blok si sam overi, ze jeho
   prvky na strance existuji — clanky treba hamburger nemaji.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- 1. Mobilni navigace ------------------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links-container');

    const closeMenu = () => {
        if (!navLinksContainer || !hamburger) return;
        navLinksContainer.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    if (hamburger && navLinksContainer) {
        const toggleMenu = () => {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!isOpen));
            navLinksContainer.classList.toggle('active');
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        // Zavrit po kliku na odkaz (mobil)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) closeMenu();
            });
        });
    }

    /* --- 2. Prepinac jazyka -------------------------------------------- */
    const langButton = document.querySelector('.lang-switcher-button');
    const langDropdown = document.querySelector('.lang-switcher-dropdown');

    if (langButton && langDropdown) {
        const toggleLang = () => {
            const isOpen = langButton.getAttribute('aria-expanded') === 'true';
            langButton.setAttribute('aria-expanded', String(!isOpen));
            langButton.classList.toggle('active');
            langDropdown.style.display = isOpen ? 'none' : 'block';
        };

        langButton.addEventListener('click', e => {
            e.stopPropagation();
            toggleLang();
        });

        window.addEventListener('click', e => {
            if (langButton.classList.contains('active') &&
                !langButton.parentElement.contains(e.target)) {
                toggleLang();
            }
        });
    }

    // Klik mimo menu ho zavre
    window.addEventListener('click', e => {
        if (!navLinksContainer || !hamburger) return;
        if (navLinksContainer.classList.contains('active') &&
            !navLinksContainer.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    /* --- 3. Scroll reveal ---------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length) {
        if (prefersReduced || !('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('visible'));
        } else {
            const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                });
            }, { threshold: 0.15 });
            revealEls.forEach(el => io.observe(el));
        }
    }

    /* --- 4. Countery v trust baru -------------------------------------- */
    const counters = document.querySelectorAll('.trust-number[data-count]');

    if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
        const countUp = el => {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1200;
            const start = performance.now();

            const tick = now => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const cio = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                countUp(entry.target);
                cio.unobserve(entry.target);
            });
        }, { threshold: 0.6 });

        counters.forEach(el => cio.observe(el));
    }
});
