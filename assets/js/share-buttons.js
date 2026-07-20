/**
 * Sdilecí tlačítka (Facebook, LinkedIn) pro stránky článků.
 * Zámerně bez oficiálních SDK (Meta/LinkedIn) — ty by tahaly trackovací
 * skripty a cookies třetích stran už při načtení stránky. Místo toho
 * jednoduché odkazy na sdílecí URL, které se otevřou v novém okně.
 * Nic se netrackuje, nic se nenačítá navíc.
 */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var article = document.querySelector('.article-content');
        if (!article) return;

        var lang = document.documentElement.lang || 'cs';
        var label = lang === 'en' ? 'Share:' : 'Sdílet:';
        var fbLabel = lang === 'en' ? 'Share on Facebook' : 'Sdílet na Facebooku';
        var liLabel = lang === 'en' ? 'Share on LinkedIn' : 'Sdílet na LinkedIn';

        var pageUrl = encodeURIComponent(window.location.href.split('#')[0]);
        var iconBase = getIconBase();
        var summary = getSummary();

        // Facebook: parametr "quote" predvyplni citaci/shrnuti nad odkazem.
        // Neni to oficialne dokumentovane API, ale dlouhodobe funkcni.
        var fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
        if (summary) fbUrl += '&quote=' + encodeURIComponent(summary);

        // LinkedIn: aktualni "share-offsite" endpoint uz zadny parametr pro
        // predvyplneni textu prispevku nepodporuje (stary shareArticle s
        // title/summary LinkedIn vyradil) — tělo prispevku zůstává prazdne,
        // nahled (titulek/popis/obrazek) si LinkedIn dotahuje sam z OG tagu.
        var liUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl;

        var bar = document.createElement('div');
        bar.className = 'share-bar';
        bar.innerHTML =
            '<span class="share-label">' + label + '</span>' +
            '<a class="share-btn" target="_blank" rel="noopener noreferrer" aria-label="' + fbLabel + '" ' +
            'href="' + fbUrl + '">' +
            '<img src="' + iconBase + 'facebook.png" alt="" width="20" height="20" loading="lazy"></a>' +
            '<a class="share-btn" target="_blank" rel="noopener noreferrer" aria-label="' + liLabel + '" ' +
            'href="' + liUrl + '">' +
            '<img src="' + iconBase + 'linkedin.png" alt="" width="20" height="20" loading="lazy"></a>';

        var backLink = article.querySelector('.back-to-blog');
        if (backLink && backLink.parentNode) {
            backLink.parentNode.insertBefore(bar, backLink);
        } else {
            article.appendChild(bar);
        }
    });

    // Shrnuti clanku pro Facebook "quote" — bere se z existujiciho
    // meta description (stejny text, ktery uz pouzivame pro og:description),
    // takze neni potreba nic rucne psat ani upravovat 92 clankovych souboru.
    function getSummary() {
        var meta = document.querySelector('meta[name="description"]') ||
                   document.querySelector('meta[property="og:description"]');
        var text = meta ? (meta.getAttribute('content') || '').trim() : '';
        if (text.length > 250) text = text.slice(0, 247) + '...';
        return text;
    }

    // Odvodi relativni cestu k assets/images z existujiciho odkazu na favicon,
    // takze skript funguje spravne bez ohledu na hloubku slozky stranky.
    function getIconBase() {
        var favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            var href = favicon.getAttribute('href') || '';
            var idx = href.lastIndexOf('/');
            if (idx !== -1) return href.substring(0, idx + 1);
        }
        return 'assets/images/';
    }
})();
