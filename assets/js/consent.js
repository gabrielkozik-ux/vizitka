/* Cookie lista + Google Analytics 4 jen po souhlasu.
   Bez souhlasu se skript Googlu vubec nestahne (zadny Consent Mode "bez cookies").
   Udalosti: window.gkTrack('nazev', {parametry}) — posle se jen pri udelenem souhlasu. */
(function () {
    'use strict';

    var GA_ID = 'G-CZPB9XY796';
    var STORAGE_KEY = 'gk-consent';
    var MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182; // cca 6 mesicu

    var lang = document.documentElement.lang === 'en' ? 'en' : 'cs';
    var T = {
        cs: {
            label: 'Souhlas s cookies',
            text: 'Tento web používá analytické cookies Google Analytics, abych věděl, které články a stránky vás zajímají. Bez vašeho souhlasu je nespustím. Podrobnosti v <a href="/ochrana-osobnich-udaju">Ochraně osobních údajů</a>.',
            decline: 'Odmítnout',
            accept: 'Přijmout'
        },
        en: {
            label: 'Cookie consent',
            text: 'This website uses Google Analytics cookies so I can see which articles and pages interest you. I will not start them without your consent. Details in the <a href="/ochrana-osobnich-udaju-en">Privacy Policy</a>.',
            decline: 'Decline',
            accept: 'Accept'
        }
    }[lang];

    var gaLoaded = false;

    function readConsent() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            if (!data || !data.t || Date.now() - data.t > MAX_AGE_MS) return null;
            return data.v === 'granted' || data.v === 'denied' ? data.v : null;
        } catch (e) {
            return null;
        }
    }

    function saveConsent(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: value, t: Date.now() }));
        } catch (e) { /* bez ulozeni se lista zobrazi pri dalsi navsteve znovu */ }
    }

    function loadGA() {
        if (gaLoaded) return;
        gaLoaded = true;
        window['ga-disable-' + GA_ID] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    // Odvolani souhlasu: vypnout sber a smazat cookies _ga* na teto domene.
    function stopGA() {
        window['ga-disable-' + GA_ID] = true;
        if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
        var host = window.location.hostname.replace(/^www\./, '');
        document.cookie.split(';').forEach(function (c) {
            var name = c.split('=')[0].trim();
            if (/^_ga/.test(name)) {
                ['', host, '.' + host].forEach(function (domain) {
                    document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
                });
            }
        });
    }

    window.gkTrack = function (name, params) {
        if (readConsent() === 'granted' && window.gtag) window.gtag('event', name, params || {});
    };

    var banner = null;

    function hideBanner() {
        if (banner) banner.hidden = true;
    }

    function showBanner() {
        if (!banner) {
            banner = document.createElement('div');
            banner.className = 'cookie-banner';
            banner.setAttribute('role', 'region');
            banner.setAttribute('aria-label', T.label);
            banner.innerHTML =
                '<p class="cookie-banner-text">' + T.text + '</p>' +
                '<div class="cookie-banner-actions">' +
                '<button type="button" class="cookie-btn" data-consent="denied">' + T.decline + '</button>' +
                '<button type="button" class="cookie-btn" data-consent="granted">' + T.accept + '</button>' +
                '</div>';
            banner.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-consent]');
                if (!btn) return;
                var value = btn.getAttribute('data-consent');
                saveConsent(value);
                if (value === 'granted') loadGA(); else stopGA();
                hideBanner();
            });
            document.body.appendChild(banner);
        }
        banner.hidden = false;
    }

    // Mereni kliku na kontakty (posle se jen se souhlasem).
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        if (a.hasAttribute('data-cookie-settings')) {
            e.preventDefault();
            showBanner();
            return;
        }
        var href = a.getAttribute('href');
        if (/^tel:/i.test(href)) window.gkTrack('phone_click');
        else if (/^mailto:/i.test(href)) window.gkTrack('email_click');
        else if (/calendar\.google\.com\/calendar\/appointments/.test(href)) window.gkTrack('booking_click');
    });

    function init() {
        var consent = readConsent();
        if (consent === 'granted') loadGA();
        else if (consent === null) showBanner();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
