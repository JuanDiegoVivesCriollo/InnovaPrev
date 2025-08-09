/**
 * InnovaPrev SPA System - Fixed Version
 * Soluciona problemas de recarga y CSS
 */

class InnovaApp {
    constructor() {
        this.currentPage = '';
        this.cache = new Map();
        this.componentsLoaded = false;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            // Ensure DOM is ready
            await this.waitForDOM();
            
            console.log('🛡️ Inicializando InnovaPrev SPA...');
            
            // Load components first
            await this.loadComponents();
            
            // Setup navigation
            this.setupNavigation();
            
            // Load initial page
            await this.loadPage(this.getCurrentPage());
            
            // Setup mobile menu after everything is loaded
            setTimeout(() => this.setupMobileMenu(), 200);
            
            this.isInitialized = true;
            console.log('✅ InnovaPrev SPA inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando SPA:', error);
            this.handleInitError();
        }
    }

    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
            }
        });
    }

    handleInitError() {
        // Fallback initialization after a delay
        setTimeout(() => {
            console.log('� Reintentando inicialización...');
            this.isInitialized = false;
            this.init();
        }, 1000);
    }

    async loadComponents() {
        const maxRetries = 3;
        let retries = 0;
        
        while (retries < maxRetries) {
            try {
                console.log(`📦 Cargando componentes... (intento ${retries + 1})`);
                
                // Check if containers exist
                const navbarContainer = document.getElementById('navbar-container');
                const footerContainer = document.getElementById('footer-container');
                
                if (!navbarContainer || !footerContainer) {
                    throw new Error('Contenedores no encontrados');
                }

                // Load navbar with timeout
                const navbarPromise = this.fetchWithTimeout('navbar.html', 5000);
                const footerPromise = this.fetchWithTimeout('footer.html', 5000);
                
                const [navbarResponse, footerResponse] = await Promise.all([navbarPromise, footerPromise]);
                
                if (navbarResponse.ok) {
                    navbarContainer.innerHTML = await navbarResponse.text();
                }

                if (footerResponse.ok) {
                    footerContainer.innerHTML = await footerResponse.text();
                }

                this.componentsLoaded = true;
                console.log('✅ Componentes cargados exitosamente');
                
                // Wait for DOM update and rewrite links
                await this.waitForDOMUpdate();
                this.rewriteLinks();
                
                return;
                
            } catch (error) {
                retries++;
                console.warn(`⚠️ Error cargando componentes (intento ${retries}):`, error);
                
                if (retries >= maxRetries) {
                    console.error('❌ Falló la carga de componentes después de 3 intentos');
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async fetchWithTimeout(url, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async waitForDOMUpdate() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });
    }

    getCurrentPage() {
        const hash = window.location.hash.replace('#', '').trim().toLowerCase();
        const validPages = ['inicio', 'sobre-nosotros', 'servicios', 'contacto'];
        return validPages.includes(hash) ? hash : 'inicio';
    }

    async loadPage(pageName) {
        if (!this.componentsLoaded) {
            console.warn('⚠️ Componentes no cargados aún, esperando...');
            await this.loadComponents();
        }
        
        if (this.currentPage === pageName) return;

        console.log(`📄 Cargando página: ${pageName}`);
        const container = document.getElementById('content-container');
        
        if (!container) {
            console.error('❌ Content container no encontrado');
            return;
        }
        
        try {
            let content = this.cache.get(pageName);
            
            if (!content) {
                const response = await this.fetchWithTimeout(`${pageName}.html`, 10000);
                if (response.ok) {
                    content = await response.text();
                    this.cache.set(pageName, content);
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            }
            
            // Clear container and add content
            container.innerHTML = '';
            await this.waitForDOMUpdate();
            container.innerHTML = content;
            
            this.currentPage = pageName;
            
            // Wait for content to render before executing scripts
            await this.waitForDOMUpdate();
            
            // Update UI elements
            this.updateNavigation(pageName);
            this.updateTitle(pageName);
            
            // Execute page-specific scripts
            setTimeout(() => this.executePageScripts(pageName), 100);
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log(`✅ Página ${pageName} cargada exitosamente`);
            
        } catch (error) {
            console.error(`❌ Error cargando ${pageName}:`, error);
            container.innerHTML = this.getErrorHTML();
        }
    }

    setupNavigation() {
        // Handle link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (this.isInternalLink(href)) {
                e.preventDefault();
                const page = this.getPageFromHref(href);
                window.location.hash = page === 'inicio' ? '' : `#${page}`;
                this.loadPage(page);
                this.closeMobileMenu();
            }
        });

        // Handle hash changes (back/forward)
        window.addEventListener('hashchange', () => {
            this.loadPage(this.getCurrentPage());
        });
    }

    isInternalLink(href) {
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
        
        if (href.startsWith('#')) {
            const route = href.slice(1).toLowerCase();
            return ['inicio', 'sobre-nosotros', 'servicios', 'contacto', ''].includes(route);
        }
        
        return ['index.html', 'inicio.html', 'sobre-nosotros.html', 'servicios.html', 'contacto.html']
            .some(page => href.toLowerCase().includes(page));
    }

    getPageFromHref(href) {
        if (href.startsWith('#')) {
            const route = href.slice(1).toLowerCase();
            return ['inicio', 'sobre-nosotros', 'servicios', 'contacto'].includes(route) ? route : 'inicio';
        }
        
        const h = href.toLowerCase();
        if (h.includes('sobre-nosotros')) return 'sobre-nosotros';
        if (h.includes('servicios')) return 'servicios';
        if (h.includes('contacto')) return 'contacto';
        return 'inicio';
    }

    rewriteLinks() {
        try {
            const linkMap = {
                'index.html': '#inicio',
                'inicio.html': '#inicio',
                'sobre-nosotros.html': '#sobre-nosotros',
                'servicios.html': '#servicios',
                'contacto.html': '#contacto'
            };

            let rewritten = 0;
            const links = document.querySelectorAll('a[href]');
            
            links.forEach(link => {
                if (!link) return;
                
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('http') || 
                    href.startsWith('mailto:') || href.startsWith('tel:')) return;
                
                const match = Object.keys(linkMap).find(key => 
                    href.toLowerCase().includes(key)
                );
                
                if (match) {
                    link.setAttribute('href', linkMap[match]);
                    rewritten++;
                }
            });

            if (rewritten > 0) {
                console.log(`🔗 ${rewritten} enlaces reescritos`);
            }
        } catch (error) {
            console.error('❌ Error reescribiendo enlaces:', error);
        }
    }

    updateNavigation(pageName) {
        setTimeout(() => {
            try {
                // Reset all nav links
                const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
                navLinks.forEach(link => {
                    if (link) {
                        link.classList.remove('text-primary', 'bg-gray-50');
                        link.classList.add('text-gray-700');
                    }
                });

                // Highlight current page links
                const selectors = pageName === 'inicio' ? 
                    'a[href="#inicio"], a[href="index.html"], a[href="inicio.html"]' :
                    `a[href="#${pageName}"], a[href="${pageName}.html"]`;
                    
                const activeLinks = document.querySelectorAll(selectors);
                activeLinks.forEach(link => {
                    if (link) {
                        link.classList.add('text-primary');
                        link.classList.remove('text-gray-700');
                        if (link.classList.contains('sidebar-link')) {
                            link.classList.add('bg-gray-50');
                        }
                    }
                });
                
                console.log(`🎯 Navegación actualizada para: ${pageName}`);
            } catch (error) {
                console.error('❌ Error actualizando navegación:', error);
            }
        }, 150);
    }

    updateTitle(pageName) {
        const titles = {
            'inicio': 'INNOVA PREV - Protegemos lo que Importa',
            'sobre-nosotros': 'Sobre Nosotros - INNOVA PREV',
            'servicios': 'Servicios - INNOVA PREV',
            'contacto': 'Contacto - INNOVA PREV'
        };
        document.title = titles[pageName] || titles['inicio'];
    }

    executePageScripts(pageName) {
        switch(pageName) {
            case 'inicio':
                this.initCounters();
                break;
            case 'contacto':
                this.initContactForm();
                break;
        }
    }

    initCounters() {
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

            const statsSection = document.querySelector('.counter-grid');
            if (statsSection) observer.observe(statsSection);
        }, 200);
    }

    animateCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const baseTarget = parseInt(counter.getAttribute('data-target'));
            
            // Generate realistic variations
            let finalTarget;
            switch(baseTarget) {
                case 7: finalTarget = 7 + Math.floor(Math.random() * 3); break; // 7-9
                case 322: finalTarget = 322 + Math.floor(Math.random() * 17) - 8; break; // 314-330
                case 954: finalTarget = 954 + Math.floor(Math.random() * 25) - 12; break; // 942-966
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

    initContactForm() {
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

    setupMobileMenu() {
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
                
                // Reset hamburger animation
                if (hamburger) {
                    const bars = hamburger.querySelectorAll('.bar');
                    bars.forEach((bar, i) => {
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
        setTimeout(() => {
            document.getElementById('hamburger')?.addEventListener('click', toggle);
            document.getElementById('close-btn')?.addEventListener('click', toggle);
            document.getElementById('overlay')?.addEventListener('click', toggle);
        }, 100);
    }

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

// Improved initialization system
let innovaAppInstance = null;

// Initialize app with proper error handling
const initializeApp = async () => {
    try {
        if (!innovaAppInstance) {
            console.log('🚀 Iniciando InnovaPrev...');
            innovaAppInstance = new InnovaApp();
            await innovaAppInstance.init();
            window.innovaApp = innovaAppInstance;
        }
    } catch (error) {
        console.error('❌ Error crítico inicializando app:', error);
        // Fallback initialization
        setTimeout(initializeApp, 2000);
    }
};

// Handle loading screen with improved logic
const handleLoadingScreen = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const hasVisited = sessionStorage.getItem('hasVisitedSite');
    
    if (!hasVisited) {
        sessionStorage.setItem('hasVisitedSite', 'true');
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500);
    } else if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
};

// Multiple initialization strategies for robustness
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
        handleLoadingScreen();
    });
} else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    // DOM is already ready
    initializeApp();
    handleLoadingScreen();
}

// Backup initialization after window load
window.addEventListener('load', () => {
    if (!innovaAppInstance) {
        console.log('🔄 Inicialización de respaldo activada');
        initializeApp();
    }
});

// Handle page visibility changes (for fixing reload issues)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && innovaAppInstance && !innovaAppInstance.isInitialized) {
        console.log('🔄 Reinicializando después de cambio de visibilidad');
        initializeApp();
    }
});
