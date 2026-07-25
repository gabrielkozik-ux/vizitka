/**
 * Sdilecí tlačítka (Facebook, LinkedIn) pro stránky článků.
 * Zámerně bez oficiálních SDK (Meta/LinkedIn) — ty by tahaly trackovací
 * skripty a cookies třetích stran už při načtení stránky. Místo toho
 * jednoduché odkazy na sdílecí URL, které se otevřou v novém okně.
 * Nic se netrackuje, nic se nenačítá navíc.
 */
(function () {
    // Inline SVG: dedi barvu pres currentColor a nepotrebuje relativni cestu,
    // takze funguje ve kazde hloubce slozky. Drive to byla PNG a skript k nim
    // musel cestu dopocitavat z odkazu na favicon.
    var ICON_FB = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
    var ICON_LI = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

    document.addEventListener('DOMContentLoaded', function () {
        var article = document.querySelector('.article-content');
        if (!article) return;

        var lang = document.documentElement.lang || 'cs';
        var label = lang === 'en' ? 'Share:' : 'Sdílet:';
        var fbLabel = lang === 'en' ? 'Share on Facebook' : 'Sdílet na Facebooku';
        var liLabel = lang === 'en' ? 'Share on LinkedIn' : 'Sdílet na LinkedIn';

        var pageUrl = encodeURIComponent(window.location.href.split('#')[0]);

        // Facebook ani LinkedIn dnes uz nedovoluji webu predvyplnit text
        // uzivatelova prispevku (kdysi fungoval parametr "quote" u FB, ted
        // uz ne) — obe platformy to zamerne blokuji kvuli spamu. Jde
        // predat jen samotnou URL, nahled (titulek/popis/obrazek) se
        // dotahuje automaticky z OG tagu stranky.
        var fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
        var liUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl;

        var bar = document.createElement('div');
        bar.className = 'share-bar';
        bar.innerHTML =
            '<span class="share-label">' + label + '</span>' +
            '<a class="share-btn" target="_blank" rel="noopener noreferrer" aria-label="' + fbLabel + '" ' +
            'href="' + fbUrl + '">' +
            ICON_FB + '</a>' +
            '<a class="share-btn" target="_blank" rel="noopener noreferrer" aria-label="' + liLabel + '" ' +
            'href="' + liUrl + '">' +
            ICON_LI + '</a>';

        var backLink = article.querySelector('.back-to-blog');
        if (backLink && backLink.parentNode) {
            backLink.parentNode.insertBefore(bar, backLink);
        } else {
            article.appendChild(bar);
        }
    });
})();
