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
    initScrollToTopButton();
    initArticleSlider();
    initArticleShare();
    initPagosModal();
    initStickyScrollMenu();
    initPlanificamosSlider();
    initComunaAccordion();
});

/* ==========================================================================
   1. MENÚS DESPLEGABLES (DROPDOWNS) FLUIDOS Y SIN SOLAPAMIENTOS
   ========================================================================== */
function initNavigationDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    function closeAllDropdowns() {
        dropdownItems.forEach((item) => {
            item.classList.remove('is-open');
            const btn = item.querySelector('.nav-btn-link');
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    dropdownItems.forEach((item) => {
        const btn = item.querySelector('.nav-btn-link');
        const menu = item.querySelector('.dropdown-menu');

        if (!btn || !menu) return;

        // Click en el boton de navegacion: abre y cierra fluidamente al presionar tanto en movil como en escritorio
        btn.addEventListener('click', (e) => {
            // Si el boton es un enlace real a otra pagina (como comuna.html) y no se hizo click en la flecha
            if (btn.tagName === 'A' && btn.getAttribute('href') && !btn.getAttribute('href').startsWith('#') && !e.target.closest('.dropdown-arrow')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();

            const isOpen = item.classList.contains('is-open');
            closeAllDropdowns();
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });

        // En escritorio: al entrar a otro elemento, cerrar los demas para evitar solapamientos
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                dropdownItems.forEach((other) => {
                    if (other !== item && other.classList.contains('is-open')) {
                        other.classList.remove('is-open');
                        const otherBtn = other.querySelector('.nav-btn-link');
                        if (otherBtn) {
                            otherBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            }
        });

        // En escritorio: al salir el mouse del boton y del menu desplegable, cerrar
        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                item.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Cerrar menus al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.has-dropdown')) {
            closeAllDropdowns();
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

/* ==========================================================================
   2. CARRUSEL HERO DE PANTALLA COMPLETA (FULL-WIDTH)
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
            title: 'Autoridades Comunales (Alcalde y Concejo Municipal)',
            type: 'Municipio',
            link: 'autoridades.html',
            keywords: 'autoridades alcalde mauricio quiroz concejo concejales municipio concejala francisco casas marta silva sebastian caldera miguel ortiz carlos gallardo mariana bravo'
        },
        {
            title: 'Pagos en Línea (Portal Central de Pagos Municipales)',
            type: 'Trámites',
            link: 'pagos-en-linea.html',
            keywords: 'pagos en linea portal de pagos tramites permiso circulacion patentes comerciales multas transito permisos construccion obras tesoreria pagar'
        },
        {
            title: 'Permiso de Circulación 2026 (Pagar en Línea)',
            type: 'Trámite en Línea',
            link: 'permiso-circulacion.html',
            keywords: 'pagos online pagos en linea permiso circulacion auto patente vehiculo pago cuota multas tramite online pagar'
        },
        {
            title: 'Patentes Comerciales (Portal de Pagos en Línea)',
            type: 'Trámite en Línea',
            link: 'pagos-en-linea.html?tramite=patentes',
            keywords: 'patentes comerciales negocios microempresa rentas pago semestral'
        },
        {
            title: 'Multas de Tránsito (Juzgado de Policía Local)',
            type: 'Trámite en Línea',
            link: 'pagos-en-linea.html?tramite=multas',
            keywords: 'multas de transito parte tag jpl juzgado policia local partes infracciones'
        },
        {
            title: 'Permisos de Construcción y Edificación (DOM)',
            type: 'Trámite en Línea',
            link: 'pagos-en-linea.html?tramite=obras',
            keywords: 'permisos de construccion dom direccion de obras recepcion definitiva ampliacion loteos'
        },
        {
            title: 'Portal de Turismo de Putaendo (4 Rutas y Mapa)',
            type: 'Turismo',
            link: 'turismo.html',
            keywords: 'turismo portal de turismo atractivo rutas cruce andes patrimonio historia sendero mapa turistico'
        },
        {
            title: 'Portal de Trámites y Servicios Municipales',
            type: 'Trámites',
            link: 'index.html#tramites',
            keywords: 'tramites portal de tramites solicitudes reclamos becas beneficios certificados pagos online'
        },
        {
            title: 'Solicitud de Audiencias (Ley del Lobby)',
            type: 'Atención Ciudadana',
            link: 'index.html#tramite-solicitudes',
            keywords: 'audiencia alcalde concejales lobby ley cita reunion'
        },
        {
            title: 'Portal de Transparencia Activa',
            type: 'Gobierno Abierto',
            link: 'https://www.portaltransparencia.cl',
            keywords: 'transparencia sueldos contrataciones gastos decretos balance'
        },
        {
            title: 'Organigrama y Estructura Municipal',
            type: 'Municipio',
            link: 'autoridades.html#organigrama',
            keywords: 'organigrama direcciones secretarias departamentos estructura cargos'
        },
        {
            title: 'Bolsa de Empleo Comunal (OMIL)',
            type: 'Informaciones',
            link: 'index.html#empleo',
            keywords: 'empleo omil trabajo ofertas laborales capacitacion curriculum'
        },
        {
            title: 'Juntos Planificamos (PLADECO y Plan Regulador)',
            type: 'Informaciones',
            link: 'juntos-planificamos.html',
            keywords: 'planificamos pladeco proyectos desarrollo plan regulador participacion'
        },
        {
            title: 'Red de Emprendedores de Putaendo',
            type: 'Otros Sitios',
            link: 'index.html#emprendedores',
            keywords: 'emprendedores red pymes artesania comercio fomento productivo ferias'
        },
        {
            title: 'Biodiversidad del Ecosistema Cordillerano (400 Posters)',
            type: 'Noticia Comunal',
            link: 'noticia-biodiversidad.html',
            keywords: 'biodiversidad cordillera poster afiche fauna flora gato andino bazar maggi reserva biosfera'
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
   5. NAVEGADOR DE MESES EN EL PORTAL DE NOTICIAS (noticias.html)
   ========================================================================== */
function initNewsMonthFilter() {
    const prevBtn = document.getElementById('month-prev-btn');
    const nextBtn = document.getElementById('month-next-btn');
    const label = document.getElementById('current-month-label');
    const cards = document.querySelectorAll('.news-portal-card');

    if (!prevBtn || !nextBtn || !label) return;

    // Listado de meses disponibles según maqueta
    const months = [
        { label: 'SEPTIEMBRE 2026', code: '09-2026' },
        { label: 'JULIO 2026', code: '07-2026' },
        { label: 'MAYO 2026', code: '05-2026' },
        { label: 'TODAS LAS NOTICIAS', code: 'todos' }
    ];

    let currentIndex = 0; // Inicia en SEPTIEMBRE 2026 como en la foto

    function updateMonthDisplay() {
        const current = months[currentIndex];
        label.textContent = current.label;

        // Filtrar tarjetas según el mes seleccionado
        cards.forEach((card) => {
            const cardMonth = card.getAttribute('data-month');
            if (current.code === 'todos' || cardMonth === current.code) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Botón mes anterior
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + months.length) % months.length;
        updateMonthDisplay();
    });

    // Botón mes siguiente
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % months.length;
        updateMonthDisplay();
    });

    // Inicializar visualización de septiembre
    updateMonthDisplay();
}


/* ==========================================================================
   6. PORTAL DE TURISMO (turismo.html) - MODALES DE RUTAS Y MAPA
   ========================================================================== */

const tourismRoutesData = {
    'cruce-andes': {
        title: "Ruta Cruce del Ejército Los Andes",
        tag: "Circuito Histórico e Hitos de la Independencia",
        image: "assets/turismo/Ruta-Cruce-del-Ejército-de-Los-Andes.webp",
        desc: "Sigue la épica huella del Ejército Libertador del General José de San Martín y el Capitán General Bernardo O'Higgins, que en febrero de 1817 ingresó a territorio nacional por los pasos cordilleranos de Putaendo, proclamando a la comuna como el Primer Pueblo Libre de Chile.",
        hitos: [
            "<strong>Monumento al Combate de Las Coimas:</strong> Escenario del histórico combate donde la vanguardia patriota liderada por Mariano Necochea derrotó a las fuerzas realistas.",
            "<strong>Hito Histórico Achupallas:</strong> Sitio del primer choque de armas del Ejército Libertador en suelo chileno.",
            "<strong>Monolito Paso de Los Patos:</strong> Hito conmemorativo en honor a la División de vanguardia comandada por el General Estanislao Soler.",
            "<strong>Miradores Cordilleranos:</strong> Panorámica sobre el Valle de Los Patos y la majestuosa cordillera de Los Andes."
        ],
        tips: "Se recomienda iniciar el recorrido temprano, vestir ropa cómoda por capas adecuada para el clima cordillerano, usar bloqueador solar y llevar hidratación. Para visitas a sectores de alta cordillera se sugiere transporte 4x4 o guías turísticos locales."
    },
    'patrimonio-arquitectura': {
        title: "Ruta Patrimonio Arquitectónico",
        tag: "Zona Típica y Casco Colonial",
        image: "assets/turismo/Ruta-Patrimonio-Arquitectónico-de-Putaendo.webp",
        desc: "Putaendo conserva uno de los conjuntos coloniales de mayor valor patrimonial de Chile central, con su trazado colonial y edificaciones continuas de adobe declaradas Monumento Nacional en la categoría de Zona Típica.",
        hitos: [
            "<strong>Calle Comercio:</strong> Arteria principal con su pavimento original de piedras de río (cantos rodados), veredas altas y casas coloniales del siglo XVIII y XIX.",
            "<strong>Parroquia San Antonio de Padua:</strong> Monumental templo frente a la Plaza Prat, fundado originalmente en la época colonial y reconstruido a fines del siglo XIX.",
            "<strong>Plaza de Armas Prat:</strong> Espacio cívico tradicional con frondosos árboles centenarios y quiosco de música de época.",
            "<strong>Zaguanes y Patios Interiores:</strong> Arquitectura tradicional con galerías de pilares de roble y techumbres de teja de arcilla cocida."
        ],
        tips: "Ideal para realizar a pie en un recorrido peatonal pausado de 2 a 3 horas. No olvides tu cámara fotográfica. Durante la mañana y al atardecer las fachadas coloniales adquieren una tonalidad cálida ideal para la fotografía."
    },
    'cultural': {
        title: "Ruta Cultural",
        tag: "Tradiciones, Artesanía y Expresiones Vivas",
        image: "assets/turismo/Ruta-Cultural.webp",
        desc: "Descubre las profundas raíces de la identidad campesina y artística de Putaendo, cuna de cantores a lo humano y lo divino, artesanos del barro y la madera, y cultores del patrimonio inmaterial.",
        hitos: [
            "<strong>Centro Cultural Bernardo Parra:</strong> Epicentro del arte y la memoria local con salas de exhibición, pinacoteca y biblioteca comunal.",
            "<strong>Ruta de los Artesanos en Rinconada de Silva:</strong> Talleres familiares donde se elaboran tradicionales vasijas de greda y tallados en madera nativa.",
            "<strong>Museo Histórico Comunal:</strong> Colección de objetos históricos, aperos huasos antiguos y testimonios de la minería histórica.",
            "<strong>Eventos y Fiestas Campesinas:</strong> Encuentros de payadores, la Fiesta de la Chilenidad y ferias de gastronomía típica."
        ],
        tips: "Puedes adquirir artesanías auténticas directamente con las familias alfareras. Consulta en la Oficina de Turismo sobre las fechas del Festival del Verano y ferias costumbristas."
    },
    'religiosa': {
        title: "Ruta Religiosa",
        tag: "Devoción, Santuarios y Fe Popular",
        image: "assets/turismo/Ruta-Religiosa.webp",
        desc: "Un circuito espiritual que fusiona la devoción popular andina, la tradición de los Bailes Chinos (Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO) y la arquitectura sacra del valle.",
        hitos: [
            "<strong>Santuario del Cristo de Madera (Rinconada de Silva):</strong> Majestuosa escultura de Cristo de más de 4 metros de altura tallada en madera de canelo por el artista Peter Horn, ubicada en un mirador natural del cerro.",
            "<strong>Capilla de Guzmanes:</strong> Histórico oratorio colonial de adobe rodeado de campos agrícolas y antiguas haciendas.",
            "<strong>Parroquia San Antonio de Padua:</strong> Sede de la devoción al patrono comunal.",
            "<strong>Gruta y Vía Crucis del Cerro de Rinconada:</strong> Sendero de recogimiento y oración con vistas panorámicas hacia todo el valle de Putaendo."
        ],
        tips: "El ascenso al Santuario del Cristo de Madera cuenta con escalinatas y estación de descanso. Se recomienda calzado con buen agarre. En Semana Santa y durante la Fiesta Patronal el santuario congrega a miles de peregrinos."
    }
};

window.abrirModalRuta = function(routeKey) {
    const data = tourismRoutesData[routeKey];
    if (!data) return;

    const modal = document.getElementById('modal-ruta');
    const titleEl = document.getElementById('modal-ruta-title');
    const descEl = document.getElementById('modal-ruta-desc');
    const imgEl = document.getElementById('modal-ruta-img');
    const tagEl = document.getElementById('modal-ruta-tag');
    const hitosEl = document.getElementById('modal-ruta-hitos');
    const tipsEl = document.getElementById('modal-ruta-tips');

    if (!modal) return;

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (imgEl) {
        imgEl.src = data.image;
        imgEl.alt = data.title;
    }
    if (tagEl) tagEl.textContent = data.tag;
    if (tipsEl) tipsEl.textContent = data.tips;

    if (hitosEl) {
        hitosEl.innerHTML = '';
        data.hitos.forEach(hito => {
            const li = document.createElement('li');
            li.innerHTML = hito;
            hitosEl.appendChild(li);
        });
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.cerrarModalRuta = function() {
    const modal = document.getElementById('modal-ruta');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

window.abrirModalMapa = function() {
    const modal = document.getElementById('modal-mapa');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.cerrarModalMapa = function() {
    const modal = document.getElementById('modal-mapa');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

// Cerrar modales con tecla Escape y click en el backdrop oscuro
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.cerrarModalRuta();
        window.cerrarModalMapa();
        if (window.cerrarModalPagoTramite) window.cerrarModalPagoTramite();
    }
});

document.addEventListener('click', (e) => {
    const modalRuta = document.getElementById('modal-ruta');
    const modalMapa = document.getElementById('modal-mapa');

    if (modalRuta && e.target === modalRuta) {
        window.cerrarModalRuta();
    }
    if (modalMapa && e.target === modalMapa) {
        window.cerrarModalMapa();
    }
    const modalTramite = document.getElementById('modal-pago-tramite');
    if (modalTramite && e.target === modalTramite) {
        window.cerrarModalPagoTramite();
    }
});

/* ==========================================================================
   7. BOTON FLOTANTE "SUBIR DEL TODO" (LADO IZQUIERDO)
   ========================================================================== */
function initScrollToTopButton() {
    let btn = document.getElementById('scroll-to-top-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'scroll-to-top-btn';
        btn.className = 'scroll-to-top-btn';
        btn.setAttribute('aria-label', 'Subir del todo');
        btn.setAttribute('title', 'Subir del todo');
        btn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
        document.body.appendChild(btn);
    }

    function checkScroll() {
        if (window.scrollY > 160) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* ==========================================================================
   8. MODAL INTERACTIVO DE TRAMITES Y PAGOS EN LINEA
   ========================================================================== */
window.abrirModalPagoTramite = function(nombreTramite) {
    const modal = document.getElementById('modal-pago-tramite');
    if (!modal) return;
    const title = document.getElementById('modal-tramite-title');
    if (title && nombreTramite) {
        title.textContent = 'Pago en L\u00ednea: ' + nombreTramite;
    }
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
};

window.cerrarModalPagoTramite = function() {
    const modal = document.getElementById('modal-pago-tramite');
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
};

window.simularConsultaTramite = function(e) {
    e.preventDefault();
    const inputPatente = document.getElementById('tramite-input-patente');
    const valor = inputPatente ? inputPatente.value.trim().toUpperCase() : '';
    const feedback = document.getElementById('tramite-feedback-box');
    
    if (!valor) {
        if (feedback) {
            feedback.innerHTML = '<div style="color: #dc2626; font-size: 14px; font-weight: 700; margin-top: 10px;">&#x26A0;&#xFE0F; Por favor ingresa una patente o RUT para consultar.</div>';
        }
        return;
    }

    if (feedback) {
        feedback.innerHTML = '<div style="background: #f0fdf4; border: 1px solid #86efac; color: #166534; padding: 14px; border-radius: 8px; font-size: 14px; margin-top: 14px; line-height: 1.6;"><strong>&#x2705; Veh&iacute;culo identificado (' + valor + ')</strong><br>Estado: Habilitado para pago Permiso de Circulaci&oacute;n 2026.<br>Monto total: $58.420 (o 2 cuotas de $29.210).<br><br><a href="#" onclick="alert(\'Simulaci&oacute;n de pasarela: Pago procesado exitosamente por Tesorer&iacute;a General / Banco Estado.\'); return false;" class="btn-tramite-action" style="padding: 10px 20px; font-size: 14px !important; display: inline-block; margin-top: 8px;">Pagar con Webpay Plus</a></div>';
    }
};

/* ==========================================================================
   9. SLIDER INTERACTIVO DE FOTOGRAFÍAS EN DETALLE DE NOTICIA
   ========================================================================== */
function initArticleSlider() {
    const sliderBoxes = document.querySelectorAll('.article-slider-box');
    sliderBoxes.forEach(box => {
        const slides = box.querySelectorAll('.article-slider-slide');
        if (!slides.length) return;

        let currentIdx = 0;
        const prevBtn = box.querySelector('.slider-arrow-prev');
        const nextBtn = box.querySelector('.slider-arrow-next');
        const caption = box.querySelector('.slider-caption-text');

        function updateSlide(index) {
            if (index < 0) {
                currentIdx = slides.length - 1;
            } else if (index >= slides.length) {
                currentIdx = 0;
            } else {
                currentIdx = index;
            }

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIdx);
            });

            if (caption) {
                const currentSlide = slides[currentIdx];
                const customCaption = currentSlide.getAttribute('data-caption');
                caption.textContent = customCaption ? customCaption : `Fotografía ${currentIdx + 1} de ${slides.length}`;
            }
        }

        prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            updateSlide(currentIdx - 1);
        });

        nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            updateSlide(currentIdx + 1);
        });

        updateSlide(0);
    });
}

/* ==========================================================================
   10. BOTONES PARA COMPARTIR Y COPIAR ENLACE
   ========================================================================== */
function initArticleShare() {
    const shareBtns = document.querySelectorAll('.share-circle-btn[data-action]');
    if (!shareBtns.length) return;

    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        toast.textContent = '¡Enlace copiado al portapapeles!';
        document.body.appendChild(toast);
    }

    function showToast(msg) {
        toast.textContent = msg || '¡Enlace copiado al portapapeles!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-action');
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);

            if (action === 'facebook') {
                e.preventDefault();
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank', 'width=620,height=440');
            } else if (action === 'whatsapp') {
                e.preventDefault();
                window.open(`https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`, '_blank');
            } else if (action === 'x') {
                e.preventDefault();
                window.open(`https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`, '_blank', 'width=620,height=440');
            } else if (action === 'print') {
                e.preventDefault();
                window.print();
            } else if (action === 'copy') {
                e.preventDefault();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        showToast('¡Enlace copiado al portapapeles!');
                    }).catch(() => {
                        showToast('Copia manual: ' + window.location.href);
                    });
                } else {
                    showToast('¡Enlace listo para compartir!');
                }
            }
        });
    });
}

/* ==========================================================================
   9. MODAL INFORMATIVO PARA PORTAL DE PAGOS EN LÍNEA
   ========================================================================== */
function initPagosModal() {
    const modal = document.getElementById('pagos-info-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('pagos-modal-title');
    const modalDesc = document.getElementById('pagos-modal-desc');
    const modalIcon = document.getElementById('pagos-modal-icon-i');
    const closeBtn = document.getElementById('pagos-modal-close');

    const modalData = {
        patentes: {
            title: 'Pago de Patentes Comerciales',
            desc: 'El pago semestral de Patentes Comerciales, Industriales, Profesionales y de Alcoholes estará habilitado próximamente en el portal digital. Para consultas o pagos presenciales, acércate al Departamento de Rentas en Prat 1 o escribe a rentas@muniputaendo.cl.',
            icon: 'fa-shop'
        },
        multas: {
            title: 'Pago de Multas de Tránsito',
            desc: 'La plataforma integrada de consulta y pago de partes del Juzgado de Policía Local de Putaendo se encuentra en etapa de sincronización técnica. Puedes realizar el pago presencial en el Juzgado de Policía Local (Prat 1) o escribir a jpl@muniputaendo.cl.',
            icon: 'fa-hand'
        },
        obras: {
            title: 'Permisos de Construcción y Edificación',
            desc: 'La cancelación de derechos municipales por permisos de edificación, subdivisión y certificados DOM se tramita directamente en la Dirección de Obras Municipales en Prat 1 o a través del correo dom@muniputaendo.cl.',
            icon: 'fa-trowel-bricks'
        }
    };

    document.querySelectorAll('[data-payment-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-payment-modal');
            const data = modalData[key];
            if (data) {
                if (modalTitle) modalTitle.textContent = data.title;
                if (modalDesc) modalDesc.textContent = data.desc;
                if (modalIcon) modalIcon.className = `fa-solid ${data.icon}`;
                modal.classList.add('is-open');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Abrir automáticamente si viene el parámetro en URL
    const urlParams = new URLSearchParams(window.location.search);
    const tramiteParam = urlParams.get('tramite');
    if (tramiteParam && modalData[tramiteParam]) {
        setTimeout(() => {
            const data = modalData[tramiteParam];
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalDesc) modalDesc.textContent = data.desc;
            if (modalIcon) modalIcon.className = `fa-solid ${data.icon}`;
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
        }, 300);
    }
}


/* ==========================================================================
   10. CABECERA COMPACTA EN SCROLL CON MENU DE 3 PUNTITOS (KEBAB)
   Diseñado según maqueta oficial (media_1792887284347.png)
   ========================================================================== */
function initStickyScrollMenu() {
    const header = document.querySelector('.header');
    if (!header) return;

    const topBarContainer = header.querySelector('.top-bar-container');
    const navList = header.querySelector('.nav-list');
    if (!topBarContainer || !navList) return;

    // 1. Boton de 3 puntitos (.scroll-dots-btn)
    let dotsBtn = header.querySelector('.scroll-dots-btn');
    if (!dotsBtn) {
        dotsBtn = document.createElement('button');
        dotsBtn.type = 'button';
        dotsBtn.className = 'scroll-dots-btn';
        dotsBtn.id = 'scroll-dots-btn';
        dotsBtn.setAttribute('aria-label', 'Abrir menú de navegación');
        dotsBtn.setAttribute('aria-expanded', 'false');
        dotsBtn.setAttribute('title', 'Menú de navegación');
        dotsBtn.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>';
        topBarContainer.appendChild(dotsBtn);
    }

    // 2. Elemento de busqueda rapida en modo scroll (lupa en capsula)
    let searchNavItem = navList.querySelector('.nav-item-scrolled-search');
    if (!searchNavItem) {
        searchNavItem = document.createElement('li');
        searchNavItem.className = 'nav-item nav-item-scrolled-search';
        searchNavItem.innerHTML = `
            <button type="button" class="scrolled-search-btn" id="scrolled-search-btn" aria-label="Buscar en el sitio" title="Buscar">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </button>
            <div class="scrolled-search-popover" id="scrolled-search-popover">
                <form class="scrolled-search-form" id="scrolled-search-form">
                    <label for="scrolled-search-input" class="visually-hidden">Buscar en el sitio web</label>
                    <input type="search" class="scrolled-search-field" id="scrolled-search-input" placeholder="Buscar en el sitio..." autocomplete="off">
                    <button type="submit" class="scrolled-search-submit" id="scrolled-search-submit" aria-label="Ejecutar búsqueda">
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </form>
                <div class="scrolled-search-results" id="scrolled-search-results"></div>
            </div>
        `;
        navList.appendChild(searchNavItem);
    }

    const scrolledSearchBtn = searchNavItem.querySelector('.scrolled-search-btn');
    const scrolledSearchPopover = searchNavItem.querySelector('.scrolled-search-popover');
    const scrolledSearchForm = searchNavItem.querySelector('.scrolled-search-form');
    const scrolledSearchInput = searchNavItem.querySelector('.scrolled-search-field');
    const scrolledSearchResults = searchNavItem.querySelector('.scrolled-search-results');

    // 3. Control de Scroll para activar/desactivar estado compacto
    const SCROLL_THRESHOLD = 80;
    let isScrolled = false;

    function handleScroll() {
        const currentScrollY = window.scrollY || window.pageYOffset;
        if (currentScrollY > SCROLL_THRESHOLD) {
            if (!isScrolled) {
                isScrolled = true;
                header.classList.add('header--scrolled');
            }
        } else {
            if (isScrolled) {
                isScrolled = false;
                header.classList.remove('header--scrolled', 'scrolled-menu-open');
                dotsBtn.setAttribute('aria-expanded', 'false');
                dotsBtn.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>';
                dotsBtn.setAttribute('title', 'Menú de navegación');
                if (scrolledSearchPopover) {
                    scrolledSearchPopover.classList.remove('is-open');
                    scrolledSearchBtn?.classList.remove('is-active');
                }
            }
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Soporte para parametro URL en pruebas y visualizacion (?scrolled=1&open=1)
    const testParams = new URLSearchParams(window.location.search);
    if (testParams.get('scrolled') === '1') {
        isScrolled = true;
        header.classList.add('header--scrolled');
        if (testParams.get('open') === '1') {
            header.classList.add('scrolled-menu-open');
            dotsBtn.setAttribute('aria-expanded', 'true');
            dotsBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
            dotsBtn.setAttribute('title', 'Cerrar menú');
            const drop = testParams.get('dropdown');
            if (drop) {
                const targetDrop = header.querySelector(`.nav-item:nth-child(${drop})`);
                if (targetDrop) {
                    targetDrop.classList.add('is-open');
                }
            }
            if (testParams.get('search') === '1' && scrolledSearchPopover) {
                scrolledSearchPopover.classList.add('is-open');
                scrolledSearchBtn?.classList.add('is-active');
            }
        }
    }

    // 4. Click en el boton de 3 puntitos: Alterna apertura/cierre de la barra
    dotsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = header.classList.toggle('scrolled-menu-open');
        dotsBtn.setAttribute('aria-expanded', isOpen.toString());
        if (isOpen) {
            dotsBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
            dotsBtn.setAttribute('title', 'Cerrar menú');
        } else {
            dotsBtn.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>';
            dotsBtn.setAttribute('title', 'Menú de navegación');
            if (scrolledSearchPopover) {
                scrolledSearchPopover.classList.remove('is-open');
                scrolledSearchBtn?.classList.remove('is-active');
            }
        }
    });

    // 5. Boton de busqueda de la barra de scroll
    if (scrolledSearchBtn && scrolledSearchPopover) {
        scrolledSearchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = scrolledSearchPopover.classList.toggle('is-open');
            scrolledSearchBtn.classList.toggle('is-active', isOpen);
            if (isOpen && scrolledSearchInput) {
                setTimeout(() => scrolledSearchInput.focus(), 100);
            }
        });

        scrolledSearchPopover.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 6. Catalogo y ejecucion de busqueda rapida en modo scroll
    if (scrolledSearchInput && scrolledSearchResults) {
        const searchCatalog = [
            { title: 'Portal de Pagos en Línea', type: 'Trámite', link: 'pagos-en-linea.html' },
            { title: 'Permiso de Circulación 2026', type: 'Trámite', link: 'permiso-circulacion.html' },
            { title: 'Patentes Comerciales', type: 'Trámite', link: 'pagos-en-linea.html?tramite=patentes' },
            { title: 'Multas de Tránsito (JPL)', type: 'Trámite', link: 'pagos-en-linea.html?tramite=multas' },
            { title: 'Permisos de Construcción (DOM)', type: 'Trámite', link: 'pagos-en-linea.html?tramite=obras' },
            { title: 'Portal de Turismo de Putaendo', type: 'Turismo', link: 'turismo.html' },
            { title: 'Autoridades Municipales y Alcalde', type: 'Municipio', link: 'autoridades.html' },
            { title: 'Conoce la Comuna (Historia y Turismo)', type: 'Comuna', link: 'comuna.html' },
            { title: 'Historia y Patrimonio', type: 'Comuna', link: 'comuna.html#historia' },
            { title: 'Organigrama Municipal', type: 'Municipio', link: 'autoridades.html#organigrama' },
            { title: 'Portal de Noticias Comunales', type: 'Noticias', link: 'noticias.html' },
            { title: 'Biodiversidad del Ecosistema Cordillerano', type: 'Noticias', link: 'noticia-biodiversidad.html' },
            { title: 'Fondo de Cultura y Turismo 2026', type: 'Noticias', link: 'noticia-fondo-cultura.html' },
            { title: 'Obras de Pavimentación Participativa', type: 'Noticias', link: 'noticia-obras.html' },
            { title: 'Bolsa de Empleo OMIL', type: 'Informaciones', link: 'index.html#empleo' },
            { title: 'Juntos Planificamos (PLADECO)', type: 'Informaciones', link: 'juntos-planificamos.html' },
            { title: 'Red de Emprendedores', type: 'Otros Sitios', link: 'index.html#emprendedores' }
        ];

        function runScrolledSearch(query) {
            const q = query.toLowerCase().trim();
            if (q.length < 2) {
                scrolledSearchResults.innerHTML = '';
                return;
            }
            const matches = searchCatalog.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q)
            );
            if (matches.length === 0) {
                scrolledSearchResults.innerHTML = '<div style="padding: 10px; font-size: 0.85rem; color: #64748b; text-align: center;">No se encontraron resultados</div>';
                return;
            }
            scrolledSearchResults.innerHTML = matches.map(item => `
                <a href="${item.link}" class="search-result-item" style="padding: 9px 12px; font-size: 0.85rem; display: block; text-decoration: none; border-bottom: 1px solid #f1f5f9;">
                    <div style="font-size: 0.72rem; font-weight: 700; color: #386f74; text-transform: uppercase;">${item.type}</div>
                    <div style="font-weight: 600; color: #1e293b;">${item.title}</div>
                </a>
            `).join('');
        }

        scrolledSearchInput.addEventListener('input', (e) => {
            runScrolledSearch(e.target.value);
        });

        if (scrolledSearchForm) {
            scrolledSearchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const q = scrolledSearchInput.value.toLowerCase().trim();
                const first = searchCatalog.find(item => item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));
                if (first) {
                    window.location.href = first.link;
                }
            });
        }
    }

    // 7. Cerrar al hacer clic fuera del header
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            if (header.classList.contains('scrolled-menu-open')) {
                header.classList.remove('scrolled-menu-open');
                dotsBtn.setAttribute('aria-expanded', 'false');
                dotsBtn.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>';
                dotsBtn.setAttribute('title', 'Menú de navegación');
            }
            if (scrolledSearchPopover && scrolledSearchPopover.classList.contains('is-open')) {
                scrolledSearchPopover.classList.remove('is-open');
                scrolledSearchBtn?.classList.remove('is-active');
            }
        }
    });

    // 8. Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (scrolledSearchPopover && scrolledSearchPopover.classList.contains('is-open')) {
                scrolledSearchPopover.classList.remove('is-open');
                scrolledSearchBtn?.classList.remove('is-active');
                return;
            }
            if (header.classList.contains('scrolled-menu-open')) {
                header.classList.remove('scrolled-menu-open');
                dotsBtn.setAttribute('aria-expanded', 'false');
                dotsBtn.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>';
                dotsBtn.setAttribute('title', 'Menú de navegación');
            }
        }
    });
}


/* ==========================================================================
   11. CARRUSEL HERO DE JUNTOS PLANIFICAMOS
   ========================================================================== */
function initPlanificamosSlider() {
    const sliderContainer = document.getElementById('planificamos-slider-container');
    if (!sliderContainer) return;

    const track = sliderContainer.querySelector('.planificamos-slider-track');
    const slides = sliderContainer.querySelectorAll('.planificamos-slide');
    const prevBtn = document.getElementById('planificamos-slider-prev');
    const nextBtn = document.getElementById('planificamos-slider-next');
    const dots = document.querySelectorAll('.planificamos-dot');

    if (!slides.length || !track) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    const INTERVAL = 5500;

    // Configurar pista y diapositivas
    track.style.display = 'flex';
    track.style.width = (totalSlides * 100) + '%';
    slides.forEach(slide => {
        slide.style.width = (100 / totalSlides) + '%';
        slide.style.flex = '0 0 ' + (100 / totalSlides) + '%';
    });

    function goToSlide(index) {
        if (index >= totalSlides) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = index;
        }
        track.style.transform = 'translateX(-' + (currentIndex * (100 / totalSlides)) + '%)';
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
            dot.setAttribute('aria-selected', (i === currentIndex).toString());
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, INTERVAL);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            startAutoplay();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(i);
            startAutoplay();
        });
    });

    sliderContainer.addEventListener('mouseenter', stopAutoplay);
    sliderContainer.addEventListener('mouseleave', startAutoplay);

    // Touch swipe
    let touchStartX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAutoplay();
    }, { passive: true });

    startAutoplay();
}


/* ==========================================================================
   12. ACORDEÃ“N DE LA PÃGINA COMUNA (comuna.html)
   ========================================================================== */
function initComunaAccordion() {
    const accordionItems = document.querySelectorAll('.comuna-accordion-item');
    if (!accordionItems.length) return;

    function toggleItem(item, forceState) {
        const header = item.querySelector('.comuna-accordion-header');
        const collapse = item.querySelector('.comuna-accordion-collapse');
        if (!header || !collapse) return;

        const isCurrentlyOpen = item.classList.contains('is-open');
        const shouldOpen = (typeof forceState === 'boolean') ? forceState : !isCurrentlyOpen;

        if (shouldOpen) {
            item.classList.add('is-open');
            header.setAttribute('aria-expanded', 'true');
            collapse.style.maxHeight = collapse.scrollHeight + 'px';
        } else {
            item.classList.remove('is-open');
            header.setAttribute('aria-expanded', 'false');
            collapse.style.maxHeight = '0px';
        }
    }

    accordionItems.forEach(item => {
        const header = item.querySelector('.comuna-accordion-header');
        const collapse = item.querySelector('.comuna-accordion-collapse');
        if (!header || !collapse) return;

        header.addEventListener('click', () => {
            toggleItem(item);
        });

        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleItem(item);
            }
        });
    });

    // Soporte para abrir directo con hash en URL (ej. #historia o #turismo)
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target && target.classList.contains('comuna-accordion-item')) {
            setTimeout(() => {
                toggleItem(target, true);
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 250);
        }
    }

    // Parametros de prueba en URL: ?open=all o ?open=historia
    const urlParams = new URLSearchParams(window.location.search);
    if (window.location.href.indexOf('open-all') !== -1 || (window.location.search && window.location.search.indexOf('open=all') !== -1)) {
        accordionItems.forEach(item => toggleItem(item, true));
    } else if (urlParams.get('open') === 'historia') {
        const hist = document.getElementById('historia');
        if (hist) toggleItem(hist, true);
    } else if (urlParams.get('open') === 'turismo') {
        const tur = document.getElementById('turismo');
        if (tur) toggleItem(tur, true);
    }
}