/* CENTRÁLNÍ DATABÁZE ČLÁNKŮ
   Zde jsou všechny články nalezené ve struktuře webu.
   Stačí upravit texty (title, perex) a článek se aktualizuje na CZ i EN verzi blogu.
   
   Kategorie pro filtraci: "ai", "pravo", "networking"
*/

const blogArticles = [
    // --- PROSINEC 2025 ---
    {
        id: "advokati-a-ai",
        date: "12. 12. 2025",
        categories: ["ai", "pravo"],
        image: "blog/advokati-a-ai/uvodni-obrazek.jpg",
        
        cs: {
            title: "Advokáti a AI: Jak umělá inteligence mění právní praxi",
            perex: "Umělá inteligence již není jen sci-fi. Zjistěte, jak nástroje jako ChatGPT mění advokacii, kde šetří čas a jaká přináší rizika pro bezpečnost dat.",
            link: "blog/advokati-a-ai/advokati-a-ai.html",
            categoryLabel: "AI & PRÁVO"
        },
        en: {
            title: "Lawyers and AI: How Artificial Intelligence is Changing Legal Practice",
            perex: "Artificial intelligence is no longer just sci-fi. Find out how tools like ChatGPT are changing law practice, saving time, and what risks they pose to data security.",
            link: "blog/advokati-a-ai/advokati-a-ai-en.html",
            categoryLabel: "AI & LAW"
        }
    },

    // --- LISTOPAD 2025 ---
    {
        id: "ai-act",
        date: "10. 11. 2025",
        categories: ["ai", "pravo"],
        image: "assets/images/blog/ai-act-byznys/prezentace-ai.jpg",
        
        cs: {
            title: "AI Act: Co znamená nová regulace pro český byznys?",
            perex: "Evropská unie schválila první komplexní regulaci umělé inteligence. Na koho dopadne a jak se připravit na nová pravidla compliance?",
            link: "blog/ai-act-byznys/ai-act-byznys.html",
            categoryLabel: "AI REGULACE"
        },
        en: {
            title: "AI Act: What Does the New Regulation Mean for Czech Business?",
            perex: "The EU has approved the world's first comprehensive AI regulation. Who will be affected and how to prepare for new compliance rules?",
            link: "blog/ai-act-byznys/ai-act-byznys-en.html",
            categoryLabel: "AI REGULATION"
        }
    },
    {
        id: "bforb-listopad",
        date: "05. 11. 2025",
        categories: ["networking"],
        image: "assets/images/blog/bforb-listopad-2025/1.jpg",
        
        cs: {
            title: "Listopadový networking BforB Tišnov: Síla komunity",
            perex: "Reportáž z pravidelného setkání podnikatelského klubu. Jaké nové spolupráce vznikly a proč je osobní kontakt v digitální době stále nenahraditelný.",
            link: "blog/bforb-listopad-2025/bforb-listopad-2025.html",
            categoryLabel: "NETWORKING"
        },
        en: {
            title: "November BforB Tišnov Networking: Power of Community",
            perex: "Report from the regular meeting of the business club. What new collaborations emerged and why personal contact remains irreplaceable.",
            link: "blog/bforb-listopad-2025/bforb-listopad-2025-en.html",
            categoryLabel: "NETWORKING"
        }
    },

    // --- ŘÍJEN 2025 ---
    {
        id: "novela-hlaseni-zamestnancu",
        date: "28. 10. 2025",
        categories: ["pravo"],
        image: "assets/images/blog/novela-hlaseni-zamestnancu-2025/hlaseni-zamestnancu-2025.png",
        
        cs: {
            title: "Novela hlášení zaměstnanců 2025: Na co si dát pozor",
            perex: "Přehled důležitých změn v oznamovací povinnosti zaměstnavatelů. Jak se vyhnout pokutám a nastavit procesy ve firmě správně.",
            link: "blog/novela-hlaseni-zamestnancu-2025/novela-hlaseni-zamestnancu-2025.html",
            categoryLabel: "PRÁVO & HR"
        },
        en: {
            title: "Employee Reporting Amendment 2025: What to Watch Out For",
            perex: "Overview of important changes in employer reporting obligations. How to avoid fines and set up company processes correctly.",
            link: "blog/novela-hlaseni-zamestnancu-2025/novela-hlaseni-zamestnancu-2025-en.html",
            categoryLabel: "LAW & HR"
        }
    },
    {
        id: "tyden-inovaci",
        date: "15. 10. 2025",
        categories: ["ai", "networking"],
        image: "assets/images/blog/tyden-inovaci-2025/1.jpg",
        
        cs: {
            title: "Týden inovací 2025: Inspirace pro budoucnost",
            perex: "Jaké trendy hýbou světem technologií? Shrnutí mých dojmů z Týdne inovací a setkání s lídry v oblasti AI a digitalizace.",
            link: "blog/tyden-inovaci-2025/tyden-inovaci-2025.html",
            categoryLabel: "AI & INOVACE"
        },
        en: {
            title: "Innovation Week 2025: Inspiration for the Future",
            perex: "What trends are moving the tech world? Summary of my impressions from Innovation Week and meetings with AI and digitalization leaders.",
            link: "blog/tyden-inovaci-2025/tyden-inovaci-2025-en.html",
            categoryLabel: "AI & INNOVATION"
        }
    },
    {
        id: "podnikavci-kurim",
        date: "10. 10. 2025",
        categories: ["networking"],
        image: "assets/images/blog/podnikavci-kurim-rijen/1.jpg",
        
        cs: {
            title: "Podnikavci Kuřim: Říjnové setkání plné energie",
            perex: "Networking není jen o výměně vizitek, ale o sdílení zkušeností. Jak proběhlo setkání podnikatelů v Kuřimi a co jsme řešili?",
            link: "blog/podnikavci-kurim-rijen/podnikavci-kurim-rijen.html",
            categoryLabel: "NETWORKING"
        },
        en: {
            title: "Podnikavci Kuřim: October Meeting Full of Energy",
            perex: "Networking is not just about exchanging business cards, but sharing experiences. How did the entrepreneurs' meeting in Kuřim go?",
            link: "blog/podnikavci-kurim-rijen/podnikavci-kurim-rijen.html", // EN verze asi neexistuje, fallback na CS
            categoryLabel: "NETWORKING"
        }
    },
    {
        id: "reportaz-bforb-tisnov",
        date: "02. 10. 2025",
        categories: ["networking"],
        image: "assets/images/blog/reportaz-bforb-tisnov-rijen-2025/tisnov-02-10.jpg",
        
        cs: {
            title: "Reportáž: BforB Tišnov v říjnu",
            perex: "Pravidelná snídaně tišnovského klubu. Proč se vyplatí vstávat brzy ráno kvůli byznysu a jak funguje referral marketing v praxi.",
            link: "blog/reportaz-bforb-tisnov-rijen-2025/reportaz-bforb-tisnov-rijen-2025.html",
            categoryLabel: "NETWORKING"
        },
        en: {
            title: "Report: BforB Tišnov in October",
            perex: "Regular breakfast of the Tišnov club. Why it pays to get up early for business and how referral marketing works in practice.",
            link: "blog/reportaz-bforb-tisnov-rijen-2025/reportaz-bforb-tisnov-rijen-2025-en.html",
            categoryLabel: "NETWORKING"
        }
    },
    
    // --- ZÁŘÍ 2025 ---
    {
        id: "cs-tech-summit",
        date: "25. 09. 2025",
        categories: ["ai", "networking"],
        image: "assets/images/blog/cs-tech-summit-2025/1.jpg",
        
        cs: {
            title: "CS Tech Summit 2025: Budoucnost českého techu",
            perex: "Klíčové myšlenky z konference. Kyberbezpečnost, AI ve firmách a digitální transformace české ekonomiky.",
            link: "blog/cs-tech-summit-2025/cs-tech-summit-2025.html",
            categoryLabel: "TECH & AI"
        },
        en: {
            title: "CS Tech Summit 2025: Future of Czech Tech",
            perex: "Key thoughts from the conference. Cybersecurity, AI in companies, and digital transformation of the Czech economy.",
            link: "blog/cs-tech-summit-2025/cs-tech-summit-2025-en.html",
            categoryLabel: "TECH & AI"
        }
    },
    {
        id: "workshop-zari",
        date: "19. 09. 2025",
        categories: ["ai", "networking"],
        image: "assets/images/blog/reportaz-workshop-zari-2025/workshop19-9.jpg",
        
        cs: {
            title: "Reportáž: Zářijový AI workshop pro firmy",
            perex: "Praktická ukázka toho, jak jsme s účastníky implementovali AI nástroje do jejich každodenní agendy. Konkrétní use-cases.",
            link: "blog/reportaz-workshop-zari-2025/reportaz-workshop-zari-2025.html",
            categoryLabel: "AI WORKSHOP"
        },
        en: {
            title: "Report: September AI Workshop for Companies",
            perex: "Practical demonstration of how we implemented AI tools into participants' daily agendas. Specific use-cases.",
            link: "blog/reportaz-workshop-zari-2025/reportaz-workshop-zari-2025-en.html",
            categoryLabel: "AI WORKSHOP"
        }
    },

    // --- SRPEN 2025 ---
    {
        id: "workshop-srpen",
        date: "22. 08. 2025",
        categories: ["ai", "networking"],
        image: "assets/images/blog/reportaz-workshop-srpen-2025/workshop22-8.jpg",
        
        cs: {
            title: "AI Workshop srpen: Letní škola promptování",
            perex: "I v létě se vzděláváme. Srpnový workshop se zaměřil na pokročilé techniky promptování pro marketing a tvorbu obsahu.",
            link: "blog/reportaz-workshop-srpen-2025/reportaz-workshop-srpen-2025.html",
            categoryLabel: "AI WORKSHOP"
        },
        en: {
            title: "AI Workshop August: Summer School of Prompting",
            perex: "Even in summer, we learn. The August workshop focused on advanced prompting techniques for marketing and content creation.",
            link: "blog/reportaz-workshop-srpen-2025/reportaz-workshop-srpen-2025-en.html",
            categoryLabel: "AI WORKSHOP"
        }
    },

    // --- ČERVENEC 2025 ---
    {
        id: "workshop-cervenec",
        date: "18. 07. 2025",
        categories: ["ai", "networking"],
        image: "assets/images/blog/reportaz-workshop-cervenec-2025/workshop18-7.jpg",
        
        cs: {
            title: "Jak proběhl červencový AI Workshop?",
            perex: "Úvod do světa generativní umělé inteligence pro začátečníky. Podívejte se na fotoreportáž z akce a zpětnou vazbu účastníků.",
            link: "blog/reportaz-workshop-cervenec-2025/reportaz-workshop-cervenec-2025.html",
            categoryLabel: "AI WORKSHOP"
        },
        en: {
            title: "How Was the July AI Workshop?",
            perex: "Introduction to the world of generative AI for beginners. See the photo report from the event and participant feedback.",
            link: "blog/reportaz-workshop-cervenec-2025/reportaz-workshop-cervenec-2025-en.html",
            categoryLabel: "AI WORKSHOP"
        }
    },

    // --- DALŠÍ ČLÁNKY (Bez data v názvu, odhadnuto) ---
    {
        id: "ai-agenti",
        date: "15. 06. 2025",
        categories: ["ai"],
        image: "assets/images/blog/ai-act-byznys/prezentace-ai.jpg", // Použit placeholder, zkontroluj
        
        cs: {
            title: "AI Agenti: Nová éra byznysu",
            perex: "Autonomní AI agenti přicházejí. Jak se liší od běžných chatbotů a jak mohou automatizovat celé procesy ve vaší firmě?",
            link: "blog/ai-agenti-nova-era-byznysu/ai-agenti-nova-era-byznysu.html",
            categoryLabel: "AI TECHNOLOGIE"
        },
        en: {
            title: "AI Agents: A New Era of Business",
            perex: "Autonomous AI agents are coming. How do they differ from regular chatbots and how can they automate entire processes in your company?",
            link: "blog/ai-agenti-nova-era-byznysu/ai-agenti-nova-era-byznysu-en.html",
            categoryLabel: "AI TECHNOLOGY"
        }
    },
    {
        id: "prevod-podilu",
        date: "01. 06. 2025",
        categories: ["pravo"],
        image: "assets/images/blog/prevod-podilu-sro-nz/nz-podil.png",
        
        cs: {
            title: "Převod podílu v S.R.O.: Kdy je nutný notářský zápis?",
            perex: "Právní minimum pro společníky. Rozebíráme situace, kdy k převodu podílu potřebujete formu notářského zápisu a kdy stačí podpis.",
            link: "blog/prevod-podilu-sro-nz/prevod-podilu-sro-nz.html",
            categoryLabel: "KORPORÁTNÍ PRÁVO"
        },
        en: {
            title: "Transfer of Share in LLC: When is a Notarial Deed Required?",
            perex: "Legal basics for partners. Analyzing situations where you need a notarial deed form for share transfer and when a signature suffices.",
            link: "blog/prevod-podilu-sro-nz/prevod-podilu-sro-nz-en.html",
            categoryLabel: "CORPORATE LAW"
        }
    },
    {
        id: "ai-4-cesty",
        date: "20. 05. 2025",
        categories: ["ai", "byznys"], // 'byznys' mapujeme na 'networking' nebo 'ai' pro filtr? Necháme 'ai'
        image: "assets/images/blog/ai-v-byznysu-4-cesty/ai-v-byznysu-4-cesty.jpg",
        
        cs: {
            title: "AI v byznysu: 4 cesty k efektivitě",
            perex: "Praktický průvodce implementací AI. Čtyři konkrétní oblasti, kde mohou malé a střední firmy začít využívat umělou inteligenci ihned.",
            link: "blog/ai-v-byznysu/ai-v-byznysu-4-cesty.html",
            categoryLabel: "AI & BYZNYS"
        },
        en: {
            title: "AI in Business: 4 Ways to Efficiency",
            perex: "Practical guide to AI implementation. Four specific areas where SMEs can start using artificial intelligence immediately.",
            link: "blog/ai-v-byznysu/ai-v-byznysu-4-cesty-en.html",
            categoryLabel: "AI & BUSINESS"
        }
    },
    {
        id: "firemni-kultura",
        date: "10. 05. 2025",
        categories: ["networking"], // Řadím pod networking/byznys
        image: "assets/images/blog/firemni-kultura-alveno/firemni-kultura-alveno.jpg",
        
        cs: {
            title: "Firemní kultura v Alveno: Inspirace pro lídry",
            perex: "Jak budovat zdravou firemní kulturu v technologické firmě? Rozhovor a postřehy z návštěvy ve společnosti Alveno.",
            link: "blog/firemni-kultura-alveno/firemni-kultura-alveno.html",
            categoryLabel: "FIREMNÍ KULTURA"
        },
        en: {
            title: "Corporate Culture at Alveno: Inspiration for Leaders",
            perex: "How to build a healthy corporate culture in a tech company? Interview and insights from a visit to Alveno.",
            link: "blog/firemni-kultura-alveno/firemni-kultura-alveno-en.html",
            categoryLabel: "CORPORATE CULTURE"
        }
    },
    {
        id: "networking-palava-14",
        date: "14. 04. 2025", // Odhad data dle názvu
        categories: ["networking"],
        image: "assets/images/blog/networking-palava-14/1.jpg",
        
        cs: {
            title: "Networking pod Pálavou #14",
            perex: "Další úspěšné setkání podnikatelů na jižní Moravě. Fotoreportáž a shrnutí atmosféry z 14. pokračování naší akce.",
            link: "blog/networking-palava-14/networking-palava-14.html",
            categoryLabel: "POD PÁLAVOU"
        },
        en: {
            title: "Networking under Pálava #14",
            perex: "Another successful meeting of entrepreneurs in South Moravia. Photo report and summary of the atmosphere from the 14th edition.",
            link: "blog/networking-palava-14/networking-palava-14-en.html",
            categoryLabel: "POD PÁLAVOU"
        }
    },
    {
        id: "networking-palava-12",
        date: "12. 02. 2025", // Odhad data dle názvu
        categories: ["networking"],
        image: "assets/images/blog/networking-palava-12/1.jpg",
        
        cs: {
            title: "Networking pod Pálavou #12: Zimní edice",
            perex: "Ani v zimě byznys nespí. Jak proběhl dvanáctý networking a jaká témata rezonovala mezi účastníky?",
            link: "blog/networking-palava-12/networking-palava-12.html",
            categoryLabel: "POD PÁLAVOU"
        },
        en: {
            title: "Networking under Pálava #12: Winter Edition",
            perex: "Business doesn't sleep even in winter. How did the twelfth networking go and what topics resonated among participants?",
            link: "blog/networking-palava-12/networking-palava-12-en.html",
            categoryLabel: "POD PÁLAVOU"
        }
    }
];