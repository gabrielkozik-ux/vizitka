document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('upcoming-events-list');
    const archiveContainer = document.getElementById('archive-events-list');
    const currentLang = document.documentElement.lang || 'cs'; // Zjistí jazyk z <html> tagu

    // Texty pro tlačítka podle jazyka
    const translations = {
        cs: { moreInfo: "Více info", soldOut: "Vyprodáno" },
        en: { moreInfo: "More Info", soldOut: "Sold Out" },
        hu: { moreInfo: "Több infó", soldOut: "Eladva" },
        fr: { moreInfo: "Plus d'info", soldOut: "Complet" }
    };

    const t = translations[currentLang] || translations['cs'];

    fetch('assets/data/events.json')
        .then(response => response.json())
        .then(events => {
            // Seřadíme akce podle data (od nejbližší po nejvzdálenější)
            events.sort((a, b) => new Date(a.date) - new Date(b.date));

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Ignorujeme čas, porovnáváme dny

            events.forEach(event => {
                const eventDate = new Date(event.date);
                const isPast = eventDate < today;

                // Formátování data (např. 6. 1. 2026)
                const dateString = eventDate.toLocaleDateString(currentLang, {
                    day: 'numeric', month: 'numeric', year: 'numeric'
                });

                // Vybereme správný jazyk titulku, pokud neexistuje, použijeme CS
                const title = event.title[currentLang] || event.title['cs'];

                // HTML šablona jedné akce
                const html = `
                    <li>
                        <div class="event-date-time">
                            <span class="date">${dateString}</span>
                            <span class="time">${event.time}</span>
                        </div>
                        <div class="event-details-new">
                            <h4>${title}</h4>
                            <p>${event.place}</p>
                        </div>
                        <div class="event-actions">
                            ${event.isSoldOut 
                                ? `<span class="cta-button event-button disabled" style="background:grey;cursor:default">${t.soldOut}</span>`
                                : `<a href="${event.link}" target="_blank" rel="noopener noreferrer" class="cta-button event-button">${t.moreInfo}</a>`
                            }
                            ${event.calendarLink && !event.isSoldOut ? `
                                <a href="${event.calendarLink}" target="_blank" class="calendar-button">
                                    <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1m-1 11h-5v5h5v-5Z"/></svg>
                                </a>` : ''
                            }
                        </div>
                    </li>
                `;

                // Rozřazení do Aktuální / Archiv
                if (isPast) {
                    // Do archivu dáváme akce na začátek (nejnovější proběhlé nahoře)
                    archiveContainer.insertAdjacentHTML('afterbegin', html);
                } else {
                    eventsContainer.insertAdjacentHTML('beforeend', html);
                }
            });
            
            // Pokud je archiv prázdný, skryjeme ho (volitelné)
            if (!archiveContainer.innerHTML.trim()) {
                document.getElementById('archiv-sekce').style.display = 'none';
            }
        })
        .catch(error => console.error('Chyba při načítání akcí:', error));
});