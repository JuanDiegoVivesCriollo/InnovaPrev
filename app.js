/**
 * InnovaPrev - Funciones básicas del sitio
 * Sin sistema SPA - Páginas independientes
 */

// Configurar menú móvil
function setupMobileMenu() {
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

    document.getElementById('hamburger')?.addEventListener('click', toggle);
    document.getElementById('close-btn')?.addEventListener('click', toggle);
    document.getElementById('overlay')?.addEventListener('click', toggle);
}

// Animar contadores (solo para página de inicio)
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const baseTarget = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent) || 0;
                
                let finalTarget;
                switch(baseTarget) {
                    case 9: finalTarget = 9 + Math.floor(Math.random() * 2); break;
                    case 356: finalTarget = 356 + Math.floor(Math.random() * 17) - 8; break;
                    case 954: finalTarget = 954 + Math.floor(Math.random() * 25) - 12; break;
                    case 24: finalTarget = 24; break;
                    default: finalTarget = baseTarget;
                }

                let current = 0;
                const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
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
                observer.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// Configurar formulario de contacto
function setupContactForm() {
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

// Cargar navbar y footer en la página
async function loadComponents() {
    try {
        // Cargar navbar
        const navbarResponse = await fetch('/navbar.html');
        if (navbarResponse.ok) {
            const navbarContent = await navbarResponse.text();
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = navbarContent;
            }
        }

        // Cargar footer
        const footerResponse = await fetch('/footer.html');
        if (footerResponse.ok) {
            const footerContent = await footerResponse.text();
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = footerContent;
            }
        }
    } catch (error) {
        console.error('Error cargando componentes:', error);
    }
}

// Marcar enlace activo basado en la página actual
function markActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Limpiar estilos
            link.classList.remove('text-primary', 'bg-gray-50');
            link.classList.add('text-gray-700');
            
            // Marcar activo
            if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('text-primary');
                link.classList.remove('text-gray-700');
                if (link.classList.contains('sidebar-link')) {
                    link.classList.add('bg-gray-50');
                }
            }
        });
    }, 100);
}

// Inicializar página
async function initPage() {
    console.log('Inicializando InnovaPrev...');
    
    // Cargar componentes
    await loadComponents();
    
    // Configurar funcionalidades
    setTimeout(() => {
        setupMobileMenu();
        markActiveNavigation();
        
        // Solo animar contadores en la página de inicio
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            animateCounters();
        }
        
        // Solo configurar formulario en la página de contacto
        if (window.location.pathname.endsWith('contacto.html')) {
            setupContactForm();
        }
        
        console.log('InnovaPrev listo');
    }, 200);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
