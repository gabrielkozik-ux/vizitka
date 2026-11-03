/* Kontaktni formular -> Google Apps Script (Google Workspace) -> Google tabulka + e-mail.
   Jedine misto, ktere je potreba vyplnit: ENDPOINT = URL nasazene webove aplikace (konci na /exec). */
(function () {
    'use strict';

    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwTK_oLtYEF2ZG-P-YT4r2m4TdSmAV2dL6k9LXaICbVOdPIe1d9g-xWCgBJr3qE1QY/exec';

    var form = document.getElementById('contact-form');
    if (!form) return;

    var lang = document.documentElement.lang === 'en' ? 'en' : 'cs';
    var TEXTS = {
        cs: {
            sending: 'Odesílám…',
            success: '<strong>Děkuji, zpráva dorazila.</strong><br>Ozvu se vám obvykle do dvou pracovních dnů. Pokud spěcháte, zavolejte mi na <a href="tel:+420720265713">+420 720 265 713</a>.',
            error: 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo mi napište přímo na <a href="mailto:info@gabrielkozik.cz">info@gabrielkozik.cz</a>.'
        },
        en: {
            sending: 'Sending…',
            success: '<strong>Thank you, your message has arrived.</strong><br>I usually reply within two business days. If it is urgent, call me at <a href="tel:+420720265713">+420 720 265 713</a>.',
            error: 'Your message could not be sent. Please try again, or email me directly at <a href="mailto:info@gabrielkozik.cz">info@gabrielkozik.cz</a>.'
        }
    };
    var t = TEXTS[lang];

    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonLabel = button.textContent;

    form.elements.lang.value = lang;
    form.elements.page.value = window.location.pathname;
    form.elements.ts.value = String(Date.now());

    function showStatus(kind, html) {
        status.className = 'form-status is-' + kind;
        status.innerHTML = html;
        status.hidden = false;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;

        status.hidden = true;
        button.disabled = true;
        button.textContent = t.sending;

        var request = ENDPOINT
            ? fetch(ENDPOINT, { method: 'POST', body: new URLSearchParams(new FormData(form)) })
                .then(function (response) { return response.json(); })
            : Promise.reject(new Error('ENDPOINT neni nastaven'));

        request
            .then(function (data) {
                if (!data || !data.ok) throw new Error((data && data.error) || 'error');
                form.reset();
                form.classList.add('is-sent');
                showStatus('success', t.success);
                status.focus();
            })
            .catch(function () {
                showStatus('error', t.error);
            })
            .then(function () {
                button.disabled = false;
                button.textContent = buttonLabel;
                form.elements.ts.value = String(Date.now());
            });
    });
})();
