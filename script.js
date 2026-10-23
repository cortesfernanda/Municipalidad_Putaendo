/* ==========================================================================
   ILUSTRE MUNICIPALIDAD DE PUTAENDO — INTERACTIVIDAD (JavaScript)
   Diseño Desde el Código 2026 | Arquitectura e[ad] PUCV
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigationDropdowns();
    initHeroSlider();
    initSiteSearch();
    initMobileNav();
    initNewsMonthFilter();
});

/* ==========================================================================
   1. MENÚS DESPLEGABLES (DROPDOWNS) ACCESIBLES
   ========================================================================== */
function initNavigationDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach((item) => {
        const btn = item.querySelector('.nav-btn-link');
        const menu = item.querySelector('.dropdown-menu');

        if (!btn || !menu) return;

        // Toggle al hacer click en el botón
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = item.classList.contains('is-open');

            // Cerrar cualquier otro dropdown abierto
            dropdownItems.forEach((other) => {
                if (other !== item) {
                    other.classList.remove('is-open');
                    const otherBtn = other.querySelector('.nav-btn-link');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Alternar estado actual
            if (isOpen) {
                item.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.has-dropdown')) {
            dropdownItems.forEach((item) => {
                item.classList.remove('is-open');
                const btn = item.querySelector('.nav-btn-link');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Accesibilidad por teclado: cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdownItems.forEach((item) => {
                item.classList.remove('is-open');
                const btn = item.querySelector('.nav-btn-link');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

/* ==========================================================================
   2. CARRUSEL HERO DIVIDIDO (Visual Izquierda + Tarjeta Derecha)
   ========================================================================== */
function initHeroSlider() {
    const slider = document.getElementById('hero-slider');
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.dot-btn');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    if (!slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 6000; // 6 segundos

    // Función para mostrar una diapositiva específica
    function showSlide(index) {
        // Asegurar límites circulares
        if (index >= totalSlides) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = index;
        }

        // Actualizar diapositivas
        slides.forEach((slide, i) => {
            const isActive = i === currentIndex;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', (!isActive).toString());
            if (isActive) {
                slide.setAttribute('aria-current', 'true');
            } else {
                slide.removeAttribute('aria-current');
            }
        });

        // Actualizar dots
        dots.forEach((dot, i) => {
            const isActive = i === currentIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive.toString());
        });
    }

    // Avanzar a la siguiente diapositiva
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Retroceder a la diapositiva anterior
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Iniciar temporizador automático
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    // Detener temporizador
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // Eventos de botones
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoplay();
        });
    }

    // Eventos de los dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            startAutoplay();
        });
    });

    // Pausar rotación automática al pasar el mouse por encima
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);

        // Soporte de navegación táctil (Swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchStartX - touchEndX;

            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    nextSlide(); // Deslizar izquierda -> siguiente
                } else {
                    prevSlide(); // Deslizar derecha -> anterior
                }
            }
            startAutoplay();
        }, { passive: true });
    }

    // Soporte teclado (flechas izquierda/derecha cuando el slider está enfocado)
    slider?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        }
    });

    // Iniciar autoplay
    startAutoplay();
}

/* ==========================================================================
   3. BÚSQUEDA RÁPIDA INTERACTIVA
   ========================================================================== */
function initSiteSearch() {
    const searchInput = document.getElementById('site-search');
    const resultsContainer = document.getElementById('search-results-dropdown');
    if (!searchInput || !resultsContainer) return;

    // Catálogo de búsqueda indexado del sitio de Putaendo
    const searchCatalog = [
        {
            title: 'Permiso de Circulación 2026',
            type: 'Trámite en Línea',
            link: '#tramite-permiso',
            keywords: 'permiso circulacion auto patente vehiculo pago cuota multas'
        },
        {
            title: 'Solicitud de Audiencias (Ley del Lobby)',
            type: 'Atención Ciudadana',
            link: '#tramite-audiencias',
            keywords: 'audiencia alcalde concejales lobby ley cita reunion'
        },
        {
            title: 'Portal de Servicios & Certificados',
            type: 'Ventanilla Municipal',
            link: '#tramite-servicios',
            keywords: 'servicios certificados residencia patentes obras comerciales ficha social'
        },
        {
            title: 'Comunidad recibe posters de biodiversidad cordillerana',
            type: 'Noticia Comunal',
            link: '#noticia-1',
            keywords: 'posters biodiversidad cordillera fauna flora ecosistema colegios'
        },
        {
            title: 'Red Local de Solidaridad',
            type: 'Desarrollo Comunitario',
            link: '#noticia-2',
            keywords: 'solidaridad ayuda voluntariado adultos mayores familias rural'
        },
        {
            title: 'Rutas patrimoniales: Primer Pueblo Libre de Chile',
            type: 'Turismo & Cultura',
            link: '#noticia-3',
            keywords: 'patrimonio historia calle comercio rutas turismo pueblo libre'
        },
        {
            title: 'Portal de Transparencia Activa',
            type: 'Gobierno Abierto',
            link: 'https://www.portaltransparencia.cl',
            keywords: 'transparencia sueldos contrataciones gastos decretos balance'
        }
    ];

    function renderResults(query) {
        const cleanQuery = query.toLowerCase().trim();
        if (cleanQuery.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.classList.remove('is-open');
            return;
        }

        const matches = searchCatalog.filter(item => {
            return item.title.toLowerCase().includes(cleanQuery) ||
                   item.keywords.toLowerCase().includes(cleanQuery) ||
                   item.type.toLowerCase().includes(cleanQuery);
        });

        if (matches.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-result-item" style="color: #64748b; font-style: italic;">
                    No se encontraron resultados para "${query}"
                </div>
            `;
        } else {
            resultsContainer.innerHTML = matches.map(m => `
                <a href="${m.link}" class="search-result-item">
                    <div class="search-result-type">${m.type}</div>
                    <strong>${m.title}</strong>
                </a>
            `).join('');
        }

        resultsContainer.classList.add('is-open');
    }

    searchInput.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });

    // Cerrar resultados al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            resultsContainer.classList.remove('is-open');
        }
    });

    // Función global para cuando envían el formulario
    window.ejecutarBusqueda = function() {
        const val = searchInput.value.trim();
        if (val) {
            renderResults(val);
        }
    };
}

/* ==========================================================================
   4. MENÚ MÓVIL (DRAWER RESPONSIVE)
   ========================================================================== */
function initMobileNav() {
    const mobileBtn = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    if (!mobileBtn || !mainNav) return;

    mobileBtn.addEventListener('click', () => {
        const isOpen = mainNav.classList.contains('is-open');
        if (isOpen) {
            mainNav.classList.remove('is-open');
            mobileBtn.classList.remove('is-active');
            mobileBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        } else {
            mainNav.classList.add('is-open');
            mobileBtn.classList.add('is-active');
            mobileBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
    });

    // Cerrar al hacer click en un enlace interno
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('is-open');
                mobileBtn.classList.remove('is-active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });
}

/* ==========================================================================
   5. FILTRO DE MESES EN EL PORTAL DE NOTICIAS (noticias.html)
   ========================================================================== */
function initNewsMonthFilter() {
    const dropdownBtn = document.getElementById('month-dropdown-btn');
    const selectedText = document.getElementById('selected-month-text');
    const options = document.querySelectorAll('.month-option');
    const cards = document.querySelectorAll('.news-portal-card');

    if (!dropdownBtn || !selectedText) return;

    // Abrir/cerrar dropdown al hacer clic
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownBtn.classList.contains('is-open');
        dropdownBtn.classList.toggle('is-open', !isOpen);
        dropdownBtn.setAttribute('aria-expanded', (!isOpen).toString());
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#month-dropdown-btn')) {
            dropdownBtn.classList.remove('is-open');
            dropdownBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Selección de mes
    options.forEach((opt) => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const monthVal = opt.getAttribute('data-month');
            const monthLabel = opt.textContent.trim();

            // Actualizar texto
            selectedText.textContent = monthLabel;

            // Actualizar clase activa en opciones
            options.forEach((o) => o.classList.remove('active'));
            opt.classList.add('active');

            // Cerrar menú
            dropdownBtn.classList.remove('is-open');
            dropdownBtn.setAttribute('aria-expanded', 'false');

            // Filtrar tarjetas
            cards.forEach((card) => {
                const cardMonth = card.getAttribute('data-month');
                if (monthVal === 'todos' || cardMonth === monthVal) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

