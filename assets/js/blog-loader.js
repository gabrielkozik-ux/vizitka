document.addEventListener('DOMContentLoaded', async () => {
    const articlesContainer = document.getElementById('articles-container');
    const paginationContainer = document.querySelector('.pagination-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lang = document.documentElement.lang || 'cs'; // Detect language

    let allArticles = [];
    const articlesPerPage = 9;
    let currentPage = 1;
    let currentFilteredArticles = [];

    // Translations
    const translations = {
        cs: { readMore: "Přečíst celý článek", published: "Publikováno", prev: "&laquo; Předchozí", next: "Další &raquo;" },
        en: { readMore: "Read the full article", published: "Published", prev: "&laquo; Previous", next: "Next &raquo;" },
        hu: { readMore: "Olvassa el a teljes cikket", published: "Közzétéve", prev: "&laquo; Előző", next: "Következő &raquo;" },
        fr: { readMore: "Lire l'article complet", published: "Publié", prev: "&laquo; Précédent", next: "Suivant &raquo;" }
    };
    const t = translations[lang] || translations.en;

    try {
        const response = await fetch('assets/data/articles.json');
        if (!response.ok) throw new Error('Failed to load articles');
        let data = await response.json();

        // Filter out articles that don't have content for current language
        allArticles = data.filter(article => article[lang]);
        currentFilteredArticles = allArticles;

        // Initial render
        displayPage(1, currentFilteredArticles);

    } catch (error) {
        console.error('Error loading articles:', error);
        articlesContainer.innerHTML = '<p>Error loading articles. Please try again later.</p>';
    }

    // Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            if (filterValue === 'all' || filterValue === 'vsechny') {
                currentFilteredArticles = allArticles;
            } else {
                currentFilteredArticles = allArticles.filter(article => article.category === filterValue);
            }
            displayPage(1, currentFilteredArticles);
        });
    });

    function displayPage(page, articles) {
        currentPage = page;
        const start = (page - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const paginatedArticles = articles.slice(start, end);

        renderArticles(paginatedArticles);
        renderPagination(articles.length, page);

        // Scroll to top of articles if not first load (optional, but good UX)
        // articlesContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function renderArticles(articles) {
        articlesContainer.innerHTML = '';

        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p style="text-align:center; width:100%;">Žádné články nenalezeny. / No articles found.</p>';
            return;
        }

        articles.forEach(article => {
            const data = article[lang];

            const card = document.createElement('article');
            card.className = 'article-card';
            card.setAttribute('data-category', article.category);

            // Date formatting
            const dateObj = new Date(article.date);
            const dateStr = dateObj.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Image selection (support localized image if available)
            const imageSrc = (lang === 'en' && article.image_en) ? article.image_en : article.image;

            card.innerHTML = `
                <div class="article-image">
                    <img src="${imageSrc}" alt="${data.title}" loading="lazy">
                </div>
                <div class="article-content">
                    <p class="article-meta">${t.published}: ${dateStr}</p>
                    <h2><a href="${data.link}">${data.title}</a></h2>
                    <p class="article-excerpt">${data.excerpt}</p>
                    <a href="${data.link}" class="read-more-btn">${t.readMore}</a>
                </div>
            `;
            articlesContainer.appendChild(card);
        });
    }

    function renderPagination(totalItems, page) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(totalItems / articlesPerPage);

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        paginationContainer.style.display = 'block'; // Ensure it's visible if hidden before

        // Prev Button
        const prevButton = document.createElement('a');
        prevButton.href = '#';
        prevButton.innerHTML = t.prev;
        if (page === 1) prevButton.classList.add('disabled');
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (page > 1) displayPage(page - 1, currentFilteredArticles);
        });
        paginationContainer.appendChild(prevButton);

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('a');
            pageButton.href = '#';
            pageButton.innerText = i;
            if (i === page) pageButton.classList.add('active');
            pageButton.addEventListener('click', (e) => {
                e.preventDefault();
                displayPage(i, currentFilteredArticles);
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next Button
        const nextButton = document.createElement('a');
        nextButton.href = '#';
        nextButton.innerHTML = t.next;
        if (page === totalPages) nextButton.classList.add('disabled');
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (page < totalPages) displayPage(page + 1, currentFilteredArticles);
        });
        paginationContainer.appendChild(nextButton);
    }
});
