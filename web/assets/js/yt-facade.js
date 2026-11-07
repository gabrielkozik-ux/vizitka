/* ==========================================================================
   yt-facade.js — YouTube az po kliknuti
   --------------------------------------------------------------------------
   Misto prehravace je ve strance jen odkaz (.yt-facade) bez jakehokoli
   pozadavku na servery Googlu. Az po kliknuti se vlozi prehravac
   z youtube-nocookie.com a rovnou se spusti. Bez JavaScriptu odkaz otevre
   video na YouTube v nove karte. Viz zasady ochrany osobnich udaju.
   ========================================================================== */
document.addEventListener('click', e => {
    const facade = e.target.closest('.yt-facade');
    if (!facade) return;
    const id = facade.dataset.ytId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return; // neznamy format -> nechat odkaz na YouTube
    e.preventDefault();

    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = facade.dataset.ytTitle || 'YouTube';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
    iframe.focus();
});
