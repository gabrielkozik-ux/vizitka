document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links-container');

    if (hamburger && navLinksContainer) {
        function toggleMenu() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            navLinksContainer.classList.toggle('active');
        }

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', e => {
            if (e.key === 'Enter') { toggleMenu(); }
        });

        // Close menu when a link is clicked (mobile)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Language switcher
    const langButton = document.querySelector('.lang-switcher-button');
    const langDropdown = document.querySelector('.lang-switcher-dropdown');

    if (langButton && langDropdown) {
        function toggleLangDropdown() {
            const isExpanded = langButton.getAttribute('aria-expanded') === 'true';
            langButton.setAttribute('aria-expanded', !isExpanded);
            langButton.classList.toggle('active');
            langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
        }

        langButton.addEventListener('click', e => {
            e.stopPropagation();
            toggleLangDropdown();
        });

        // Close dropdowns when clicking outside
        window.addEventListener('click', e => {
            if (navLinksContainer && navLinksContainer.classList.contains('active') &&
                !navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            if (langButton.classList.contains('active') && !langButton.parentElement.contains(e.target)) {
                toggleLangDropdown();
            }
        });
    }

    // Vercel Analytics stub
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

    // Smsticket widget loader
    (function () {
        var po = document.createElement('script');
        po.async = true;
        po.src = 'https://www.smsticket.cz/static/scripts/widgets/SaleAnchorMini.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();
});
