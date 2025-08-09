/**
 * InnovaPrev SPA System
 * Sistema de navegación de página única
 */

class InnovaApp {
    constructor() {
        this.currentPage = 'inicio';
        this.cache = new Map();
        this.isInitialized = false;
        console.log('🚀 InnovaApp creado');
    }

    // Detectar la página actual basada en la URL
    getCurrentPage() {
        const hash = window.location.hash.substring(1);
        const validPages = ['inicio', 'sobre-nosotros', 'servicios', 'contacto'];
        
        console.log('🔍 Detectando página actual - Hash:', hash);
        
        if (hash && validPages.includes(hash)) {
            console.log('✅ Página válida detectada:', hash);
            return hash;
        }
        
        console.log('📍 Usando página por defecto: inicio');
        return 'inicio';
    }

    // Inicializar la aplicación
    async init() {
        if (this.isInitialized) return;
        
        try {
            console.log('🛡️ Iniciando InnovaPrev SPA...');
            
            // Esperar a que el DOM esté listo
            await this.waitForDOM();
            
            // Cargar componentes
            await this.loadNavbar();
            await this.loadFooter();
            
            // Configurar navegación
            this.setupNavigation();
            this.setupMobileMenu();
            
            // Cargar página inicial
            const initialPage = this.getCurrentPage();
            await this.loadPage(initialPage);
            
            // Ocultar pantalla de carga
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ InnovaPrev SPA listo');
            
        } catch (error) {
            console.error('❌ Error inicializando SPA:', error);
        }
    }

    // Esperar a que el DOM esté listo
    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // Cargar navbar
    async loadNavbar() {
        try {
            console.log('📋 Cargando navbar...');
            const response = await fetch('/navbar.html');
            if (response.ok) {
                const navbarHTML = await response.text();
                const container = document.getElementById('navbar-container');
                if (container) {
                    container.innerHTML = navbarHTML;
                    console.log('✅ Navbar cargado');
                } else {
                    console.error('❌ navbar-container no encontrado');
                }
            } else {
                console.error('❌ Error cargando navbar:', response.status);
            }
        } catch (error) {
            console.error('❌ Error al cargar navbar:', error);
        }
    }

    // Cargar footer
    async loadFooter() {
        try {
            console.log('📋 Cargando footer...');
            const response = await fetch('/footer.html');
            if (response.ok) {
                const footerHTML = await response.text();
                const container = document.getElementById('footer-container');
                if (container) {
                    container.innerHTML = footerHTML;
                    console.log('✅ Footer cargado');
                } else {
                    console.error('❌ footer-container no encontrado');
                }
            } else {
                console.error('❌ Error cargando footer:', response.status);
            }
        } catch (error) {
            console.error('❌ Error al cargar footer:', error);
        }
    }

    // Cargar página
    async loadPage(pageName) {
        console.log(`📄 Cargando página: ${pageName}`);
        
        if (this.currentPage === pageName && this.isInitialized) {
            console.log(`⚠️ Página ${pageName} ya está cargada`);
            return;
        }

        const container = document.getElementById('content-container');
        if (!container) {
            console.error('❌ Content container no encontrado');
            return;
        }

        // Mostrar loading
        this.showLoading();

        try {
            let content = this.cache.get(pageName);
            
            if (!content) {
                console.log(`🌐 Fetching ${pageName}.html...`);
                const response = await fetch(`/${pageName}.html`);
                
                if (response.ok) {
                    content = await response.text();
                    this.cache.set(pageName, content);
                    console.log(`✅ ${pageName}.html cargado (${content.length} chars)`);
                } else {
                    console.log(`❌ Error fetch: ${response.status} ${response.statusText}`);
                    throw new Error(`No se pudo cargar ${pageName}.html - Status: ${response.status}`);
                }
            } else {
                console.log(`🗂️ Usando contenido en caché para ${pageName}`);
            }

            // Actualizar contenido con fade
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = content;
                container.style.opacity = '1';
                
                // Actualizar estado
                this.currentPage = pageName;
                this.updateNavigation(pageName);
                this.updateTitle(pageName);
                this.executePageScripts(pageName);
                this.hideLoading();
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                console.log(`✅ Página ${pageName} mostrada`);
                
            }, 150);

        } catch (error) {
            console.error(`❌ Error cargando ${pageName}:`, error);
            container.innerHTML = this.getErrorHTML();
            this.hideLoading();
        }
    }

    // Configurar navegación
    setupNavigation() {
        console.log('🔧 Configurando navegación SPA...');
        
        // Pequeño delay para asegurar que los componentes estén cargados
        setTimeout(() => {
            // Escuchar clicks en enlaces hash
            document.body.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (link) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    const page = href.substring(1) || 'inicio';
                    console.log('🔗 Click en enlace:', href, '→', page);
                    console.log('🔗 Link element:', link);
                    console.log('🔗 Event target:', e.target);
                    
                    // Cerrar menú móvil si está abierto
                    this.closeMobileMenu && this.closeMobileMenu();
                    
                    // Navegar a la página
                    this.navigateToPage(page);
                } else {
                    console.log('🚫 Click no es en enlace hash:', e.target);
                }
            });
            
            console.log('✅ Event listeners configurados');
        }, 500);

        // Manejar cambios de hash
        window.addEventListener('hashchange', () => {
            const page = this.getCurrentPage();
            console.log('🔄 Hash cambió a:', page);
            this.loadPage(page);
        });

        // Manejar navegación del navegador
        window.addEventListener('popstate', () => {
            const page = this.getCurrentPage();
            console.log('🔄 Popstate a:', page);
            this.loadPage(page);
        });
        
        console.log('✅ Navegación configurada');
    }

    // Navegar a una página específica
    async navigateToPage(pageName) {
        if (pageName === this.currentPage) {
            console.log(`⚠️ Ya estás en ${pageName}`);
            return;
        }

        console.log('🧭 Navegando a:', pageName);
        
        // Actualizar hash
        window.location.hash = pageName;
        
        // Cargar página
        await this.loadPage(pageName);
    }

    // Actualizar navegación activa
    updateNavigation(pageName) {
        setTimeout(() => {
            try {
                // Reset all nav links
                const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
                navLinks.forEach(link => {
                    link.classList.remove('text-primary', 'bg-gray-50');
                    link.classList.add('text-gray-700');
                });

                // Highlight current page links
                const activeLinks = document.querySelectorAll(`a[href="#${pageName}"]`);
                activeLinks.forEach(link => {
                    link.classList.add('text-primary');
                    link.classList.remove('text-gray-700');
                    if (link.classList.contains('sidebar-link')) {
                        link.classList.add('bg-gray-50');
                    }
                });
                
                console.log(`🎯 Navegación actualizada para: ${pageName}`);
            } catch (error) {
                console.error('❌ Error actualizando navegación:', error);
            }
        }, 100);
    }

    // Actualizar título de página
    updateTitle(pageName) {
        const titles = {
            'inicio': 'INNOVA PREV - Protegemos lo que Importa',
            'sobre-nosotros': 'Sobre Nosotros - INNOVA PREV',
            'servicios': 'Servicios - INNOVA PREV',
            'contacto': 'Contacto - INNOVA PREV'
        };
        document.title = titles[pageName] || titles['inicio'];
    }

    // Mostrar loading
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';
    }

    // Ocultar loading
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    // Ocultar pantalla de carga inicial
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    // Ejecutar scripts específicos de página
    executePageScripts(pageName) {
        switch(pageName) {
            case 'inicio':
                this.initInicioScripts();
                break;
            case 'contacto':
                this.initContactoScripts();
                break;
        }
    }

    // Scripts específicos de inicio
    initInicioScripts() {
        console.log('🎬 Inicializando scripts de inicio...');
        
        // Inicializar contadores
        setTimeout(() => {
            const counters = document.querySelectorAll('.counter');
            if (counters.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounters();
                        observer.disconnect();
                    }
                });
            });

            const statsSection = document.querySelector('.counter-grid, .stats-section');
            if (statsSection) observer.observe(statsSection);
        }, 500);
    }

    // Animar contadores
    animateCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const baseTarget = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent) || 0;
            
            let finalTarget;
            switch(baseTarget) {
                case 7: finalTarget = 7 + Math.floor(Math.random() * 3); break;
                case 322: finalTarget = 322 + Math.floor(Math.random() * 17) - 8; break;
                case 954: finalTarget = 954 + Math.floor(Math.random() * 25) - 12; break;
                default: finalTarget = baseTarget;
            }

            let current = 0;
            const duration = 2000;
            const increment = finalTarget / (duration / 16);

            const animate = () => {
                if (current < finalTarget) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = finalTarget;
                }
            };
            animate();
        });
    }

    // Scripts específicos de contacto
    initContactoScripts() {
        console.log('📞 Inicializando scripts de contacto...');
        
        const form = document.querySelector('#contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Enviando...';
                btn.disabled = true;
                
                setTimeout(() => {
                    alert('¡Gracias! Nos pondremos en contacto pronto.');
                    form.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);
            });
        }
    }

    // Configurar menú móvil
    setupMobileMenu() {
        setTimeout(() => {
            let isOpen = false;

            const toggle = () => {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('overlay');
                const hamburger = document.getElementById('hamburger');

                if (isOpen) {
                    sidebar?.classList.add('translate-x-full');
                    sidebar?.classList.remove('translate-x-0');
                    overlay?.classList.add('invisible', 'opacity-0');
                    overlay?.classList.remove('opacity-100');
                    document.body.style.overflow = '';
                    
                    // Reset hamburger
                    if (hamburger) {
                        const bars = hamburger.querySelectorAll('.bar');
                        bars.forEach(bar => {
                            bar.style.transform = '';
                            bar.style.opacity = '1';
                        });
                    }
                    isOpen = false;
                } else {
                    sidebar?.classList.remove('translate-x-full');
                    sidebar?.classList.add('translate-x-0');
                    overlay?.classList.remove('invisible', 'opacity-0');
                    overlay?.classList.add('opacity-100');
                    document.body.style.overflow = 'hidden';
                    
                    // Animate hamburger to X
                    if (hamburger) {
                        const bars = hamburger.querySelectorAll('.bar');
                        if (bars.length >= 3) {
                            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                            bars[1].style.opacity = '0';
                            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                        }
                    }
                    isOpen = true;
                }
            };

            this.closeMobileMenu = () => isOpen && toggle();

            // Event listeners
            document.getElementById('hamburger')?.addEventListener('click', toggle);
            document.getElementById('close-btn')?.addEventListener('click', toggle);
            document.getElementById('overlay')?.addEventListener('click', toggle);
        }, 500);
    }

    // HTML de error
    getErrorHTML() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center p-8">
                    <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fa-solid fa-triangle-exclamation text-primary text-2xl"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Error de Carga</h2>
                    <p class="text-gray-600 mb-6">No se pudo cargar el contenido.</p>
                    <button onclick="location.reload()" class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        <i class="fa-solid fa-arrows-rotate mr-2"></i>
                        Recargar
                    </button>
                </div>
            </div>
        `;
    }
}

// Sistema de inicialización
let innovaAppInstance = null;

const initializeApp = () => {
    if (!innovaAppInstance) {
        console.log('🌟 Creando instancia de InnovaPrev...');
        innovaAppInstance = new InnovaApp();
        window.innovaApp = innovaAppInstance;
        innovaAppInstance.init();
    }
};

// Manejo de pantalla de carga
const handleLoadingScreen = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const hasVisited = sessionStorage.getItem('hasVisitedSite');
    
    // Verificar si venimos de una URL directa con hash
    const currentHash = window.location.hash;
    if (currentHash) {
        console.log('🔗 URL directa con hash detectada:', currentHash);
    }
    
    if (!hasVisited && loadingScreen) {
        sessionStorage.setItem('hasVisitedSite', 'true');
        setTimeout(() => {
            initializeApp();
        }, 1500);
    } else {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        initializeApp();
    }
};

// Inicialización principal
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleLoadingScreen);
} else {
    handleLoadingScreen();
}

// Backup initialization
window.addEventListener('load', () => {
    if (!innovaAppInstance) {
        console.log('🔄 Inicialización de respaldo...');
        handleLoadingScreen();
    }
});
