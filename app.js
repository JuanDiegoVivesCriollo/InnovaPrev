/**
 * InnovaPrev SPA System
 * Manages navigation and content injection
 */

class InnovaApp {
    constructor() {
        this.currentPage = '';
        this.cache = new Map();
        this.init();
    }

    async init() {
        await this.injectComponents();
        this.setupNavigation();
        this.loadPage(this.getCurrentPageFromURL());
        this.setupHamburgerMenu();
        this.schedulePrefetch(); // prefetch nuevo
        console.log('🛡️ InnovaPrev SPA initialized successfully');
    }

    async injectComponents() {
        try {
            // Inject Navbar
            const navbarResponse = await fetch('navbar.html');
            const navbarHtml = await navbarResponse.text();
            document.getElementById('navbar-container').innerHTML = navbarHtml;

            // Inject Footer
            const footerResponse = await fetch('footer.html');
            const footerHtml = await footerResponse.text();
            document.getElementById('footer-container').innerHTML = footerHtml;

        } catch (error) {
            console.error('Error injecting components:', error);
        }
    }

    getCurrentPageFromURL() {
        const path = window.location.pathname;
        
        // Extract page name from current URL
        if (path.includes('sobre-nosotros.html') || path.includes('sobre-nosotros')) return 'sobre-nosotros';
        if (path.includes('servicios.html') || path.includes('servicios')) return 'servicios';
        if (path.includes('contacto.html') || path.includes('contacto')) return 'contacto';
        
        return 'inicio'; // default to home
    }

    async loadPage(pageName) {
        if (this.currentPage === pageName) return;

        const contentContainer = document.getElementById('content-container');
        const loadingIndicator = document.getElementById('loading');
        
        // Show loading
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        
        try {
            let content = '';
            
            // Check cache first
            if (this.cache.has(pageName)) {
                content = this.cache.get(pageName);
            } else {
                // Load content based on page
                switch(pageName) {
                    case 'inicio':
                        content = await this.fetchContent('inicio.html');
                        break;
                    case 'sobre-nosotros':
                        content = await this.fetchContent('sobre-nosotros.html');
                        break;
                    case 'servicios':
                        content = await this.fetchContent('servicios.html');
                        break;
                    case 'contacto':
                        content = await this.fetchContent('contacto.html');
                        break;
                    default:
                        content = await this.fetchContent('inicio.html');
                        pageName = 'inicio';
                }
                
                // Cache the content
                this.cache.set(pageName, content);
            }
            
            // Update content
            contentContainer.innerHTML = content;
            this.currentPage = pageName;
            
            // Update navigation state
            this.updateNavigation(pageName);
            
            // Run page-specific scripts
            this.executePageScripts(pageName);
            
            // Update page title
            this.updatePageTitle(pageName);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error);
            contentContainer.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center text-red-600">
                        <div class="mx-auto mb-4" style="width:56px;height:56px;">
                          <div style="width:56px;height:56px;border:6px solid #fecaca;border-top-color:#dc2626;border-radius:50%;animation:spin 1s linear infinite"></div>
                        </div>
                        <h2 class="text-2xl font-bold mb-2">Error al cargar la página</h2>
                        <p>Por favor, intente nuevamente.</p>
                        <button onclick="location.reload()" class="mt-4 bg-primary text-white px-6 py-2 rounded-lg">
                            Recargar
                        </button>
                    </div>
                </div>
            `;
        } finally {
            // Hide loading
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }

    async fetchContent(filename) {
        if (filename.endsWith('.html')) {
            // For full HTML files, extract only the main content
            const response = await fetch(filename);
            const html = await response.text();
            
            // Extract content between main tags or body content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainElement = doc.querySelector('main') || doc.querySelector('body');
            
            return mainElement ? mainElement.innerHTML : html;
        } else {
            // For content-only files
            const response = await fetch(filename);
            return await response.text();
        }
    }

    setupNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Check if it's a page navigation (not external links)
            if (this.isPageNavigation(href)) {
                e.preventDefault();
                
                const pageName = this.getPageNameFromHref(href);
                this.loadPage(pageName);
                
                // Update URL without full page reload
                history.pushState({ page: pageName }, '', href);
                
                // Close mobile menu if open
                this.closeMobileMenu();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const pageName = e.state?.page || this.getCurrentPageFromURL();
            this.loadPage(pageName);
        });
    }

    isPageNavigation(href) {
        if (!href) return false;
        if (href.startsWith('#')) return false;
        if (href.startsWith('http')) return false;
        if (href.startsWith('mailto:')) return false;
        if (href.startsWith('tel:')) return false;
        
        const pageFiles = ['index.html', 'inicio.html', 'sobre-nosotros.html', 'servicios.html', 'contacto.html'];
        return pageFiles.some(page => href.includes(page)) || href === 'index.html';
    }

    getPageNameFromHref(href) {
        if (href.includes('sobre-nosotros')) return 'sobre-nosotros';
        if (href.includes('servicios')) return 'servicios';
        if (href.includes('contacto')) return 'contacto';
        return 'inicio';
    }

    updateNavigation(pageName) {
        // Update desktop navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-primary');
            link.classList.add('text-gray-700');
        });

        // Update sidebar navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('text-primary', 'bg-gray-50');
            link.classList.add('text-gray-700');
        });

        // Highlight current page
        const currentLinks = document.querySelectorAll(`a[href*="${pageName}"], a[href="index.html"]`);
        currentLinks.forEach(link => {
            if (pageName === 'inicio' && link.href.includes('index.html')) {
                link.classList.add('text-primary');
                link.classList.remove('text-gray-700');
                if (link.classList.contains('sidebar-link')) {
                    link.classList.add('bg-gray-50');
                }
            } else if (link.href.includes(pageName) && pageName !== 'inicio') {
                link.classList.add('text-primary');
                link.classList.remove('text-gray-700');
                if (link.classList.contains('sidebar-link')) {
                    link.classList.add('bg-gray-50');
                }
            }
        });
    }

    updatePageTitle(pageName) {
        const titles = {
            'inicio': 'INNOVA PREV - Protegemos lo que Importa',
            'sobre-nosotros': 'Sobre Nosotros - INNOVA PREV',
            'servicios': 'Servicios - INNOVA PREV',
            'contacto': 'Contacto - INNOVA PREV'
        };
        
        document.title = titles[pageName] || titles['inicio'];
    }

    executePageScripts(pageName) {
        // Execute page-specific JavaScript
        switch(pageName) {
            case 'inicio':
                this.executeInicioScripts();
                break;
            case 'contacto':
                this.executeContactoScripts();
                break;
            // Add more page-specific scripts as needed
        }
    }

    executeInicioScripts() {
        // Counter animation for stats section
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
            if (statsSection) {
                observer.observe(statsSection);
            }
        }, 100);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            let current = 0;
            const increment = target / (duration / 16);
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }

    executeContactoScripts() {
        // Contact form validation and handling
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Add form handling logic here
                console.log('Form submitted');
            });
        }
    }

    setupHamburgerMenu() {
        let sidebarOpen = false;
        
        const toggleSidebar = () => {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            const hamburger = document.getElementById('hamburger');
            
            if (sidebarOpen) {
                // Close sidebar
                if (sidebar) {
                    sidebar.classList.add('translate-x-full');
                    sidebar.classList.remove('translate-x-0');
                }
                if (overlay) {
                    overlay.classList.add('invisible', 'opacity-0');
                    overlay.classList.remove('opacity-100');
                }
                document.body.style.overflow = '';
                
                // Animate hamburger back to normal
                if (hamburger) {
                    const bars = hamburger.querySelectorAll('.bar');
                    if (bars.length >= 3) {
                        bars[0].style.transform = '';
                        bars[0].style.opacity = '1';
                        bars[1].style.opacity = '1';
                        bars[2].style.transform = '';
                    }
                }
                sidebarOpen = false;
            } else {
                // Open sidebar
                if (sidebar) {
                    sidebar.classList.remove('translate-x-full');
                    sidebar.classList.add('translate-x-0');
                }
                if (overlay) {
                    overlay.classList.remove('invisible', 'opacity-0');
                    overlay.classList.add('opacity-100');
                }
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
                sidebarOpen = true;
            }
            
            // Update aria-expanded
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', sidebarOpen ? 'true' : 'false');
            }
        };

        this.closeMobileMenu = () => {
            if (sidebarOpen) {
                toggleSidebar();
            }
        };
        
        // Event Listeners for Hamburger Menu
        setTimeout(() => {
            const hamburger = document.getElementById('hamburger');
            const closeBtn = document.getElementById('close-btn');
            const overlay = document.getElementById('overlay');
            
            if (hamburger) {
                hamburger.addEventListener('click', toggleSidebar);
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', toggleSidebar);
            }
            
            if (overlay) {
                overlay.addEventListener('click', toggleSidebar);
            }
        }, 100);
    }

    schedulePrefetch(){
        const pages=['inicio','sobre-nosotros','servicios','contacto'].filter(p=>p!==this.currentPage);
        const runner=()=>pages.forEach(p=>this.fetchPageToCache(p));
        (window.requestIdleCallback||function(cb){setTimeout(cb,500)})(runner);
    }
    async fetchPageToCache(page){
        if(this.cache.has(page)) return;
        try{
            let file= page==='inicio'?'inicio.html':`${page}.html`;
            const content=await this.fetchContent(file);
            this.cache.set(page,content);
        }catch(e){console.warn('Prefetch fail',page,e);}
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.innovaApp = new InnovaApp();
});

// Handle loading screen
document.addEventListener('DOMContentLoaded', function() {
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
    } else {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
});
