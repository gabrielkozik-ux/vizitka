document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    
    // Pokud na stránce není galerie, skript se ukončí (aby nehlásil chyby na jiných stránkách)
    if (!gallery) return; 

    // 1. NAČTENÍ NASTAVENÍ Z HTML (To je ta magie)
    const totalImages = parseInt(gallery.getAttribute('data-count'));
    const imagePath = gallery.getAttribute('data-path');
    const altPrefix = gallery.getAttribute('data-alt-prefix') || "Fotografie z galerie";

    // 2. GENERUJEME OBRÁZKY
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement('img');
        img.src = `${imagePath}${i}.jpg`; // Předpokládá názvy 1.jpg, 2.jpg...
        img.alt = `${altPrefix} ${i}`;
        // Přidáme třídu pro stylování (pokud ji nemáš v CSS na ID #gallery)
        // img.classList.add('gallery-item'); 
        img.loading = 'lazy'; // Optimalizace rychlosti
        gallery.appendChild(img);
    }

    // 3. LIGHTBOX LOGIKA (Stejná jako dřív, jen univerzální)
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById("img01");
    const span = document.querySelector(".close");
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    
    // Musíme vybrat obrázky až PO tom, co jsme je vytvořili
    const galleryImages = gallery.querySelectorAll('img'); 
    let currentIndex;

    function openModalWithImage(index) {
        if (modal && modalImg) {
            modal.style.display = "block";
            modalImg.src = galleryImages[index].src;
            currentIndex = index;
        }
    }

    function changeImage(direction) {
        currentIndex += direction;
        if (currentIndex >= galleryImages.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = galleryImages.length - 1;
        modalImg.src = galleryImages[currentIndex].src;
    }

    // Přidání klikání na obrázky
    galleryImages.forEach((img, index) => {
        img.onclick = () => openModalWithImage(index);
    });

    // Zavírání a ovládání
    if(span) span.onclick = () => modal.style.display = "none";
    
    if(modal) {
        modal.onclick = (event) => {
            if (event.target == modal) modal.style.display = "none";
        }
    }

    if(prev) prev.onclick = (e) => { e.stopPropagation(); changeImage(-1); };
    if(next) next.onclick = (e) => { e.stopPropagation(); changeImage(1); };

    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === "block") {
            if (e.key === "ArrowLeft") changeImage(-1);
            else if (e.key === "ArrowRight") changeImage(1);
            else if (e.key === "Escape") modal.style.display = "none";
        }
    });
});