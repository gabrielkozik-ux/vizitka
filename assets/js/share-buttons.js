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

        var bar = document.createElement('div');
        bar.className = 'share-bar';
        bar.innerHTML =
            '<span class="share-label">' + label + '</span>' +
            '<a class="share-btn" target="_blank" rel="noopener noreferrer" aria-label="' + fbLabel + '" ' +
            'href="https://www.facebook.com/sharer/sharer.php?u=' + pageUrl + '">' +
            '<img src="' + iconBase + 'facebook.png" alt="" width="20" height="20" loading="lazy"></a>' +
            '<a class="share-btn" target="_blank" rel="noopener noreferrer" aria-label="' + liLabel + '" ' +
            'href="https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl + '">' +
            '<img src="' + iconBase + 'linkedin.png" alt="" width="20" height="20" loading="lazy"></a>';

        var backLink = article.querySelector('.back-to-blog');
        if (backLink && backLink.parentNode) {
            backLink.parentNode.insertBefore(bar, backLink);
        } else {
            article.appendChild(bar);
        }
    });

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
