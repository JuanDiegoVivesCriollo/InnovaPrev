// Simple script for multi-page website
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen - only show on first visit
    const loadingScreen = document.getElementById('loading-screen');
    const hasVisited = sessionStorage.getItem('hasVisitedSite');
    
    if (!hasVisited) {
        // First visit - show loading screen
        sessionStorage.setItem('hasVisitedSite', 'true');
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    } else {
        // Already visited - hide loading screen immediately
        loadingScreen.style.display = 'none';
    }

    // Mobile navigation
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');
    
    let sidebarOpen = false;

    // Debug: Check if elements exist
    console.log('Elements found:', {
        hamburger: !!hamburger,
        sidebar: !!sidebar,
        overlay: !!overlay,
        closeBtn: !!closeBtn
    });

    // Asegurar que el sidebar esté cerrado al cargar la página
    function initializeSidebar() {
        if (sidebar) {
            // Limpiar cualquier estilo inline conflictivo
            sidebar.style.transform = '';
            sidebar.classList.remove('translate-x-0', 'opacity-100', 'visible');
            sidebar.classList.add('translate-x-full', 'opacity-0', 'invisible');
        }
        if (overlay) {
            overlay.classList.remove('opacity-100', 'visible');
            overlay.classList.add('invisible', 'opacity-0');
        }
        document.body.style.overflow = '';
        sidebarOpen = false;
        
        // Reset hamburger animation
        if (hamburger) {
            const bars = hamburger.querySelectorAll('.bar');
            if (bars.length >= 3) {
                bars[0].style.transform = '';
                bars[1].style.opacity = '1';
                bars[2].style.transform = '';
            }
        }
        
        console.log('Sidebar initialized as closed');
    }

    // Inicializar sidebar cerrado inmediatamente
    initializeSidebar();

    // También asegurar que esté cerrado en cualquier evento de carga de página
    window.addEventListener('load', function() {
        console.log('Window loaded, ensuring sidebar is closed');
        initializeSidebar();
    });

    window.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, ensuring sidebar is closed');
        initializeSidebar();
    });

    function openSidebar() {
        console.log('Opening sidebar');
        if (sidebar) {
            sidebar.style.transform = '';
            sidebar.classList.remove('translate-x-full', 'opacity-0', 'invisible');
            sidebar.classList.add('translate-x-0', 'opacity-100', 'visible');
        }
        if (overlay) {
            overlay.classList.remove('invisible', 'opacity-0');
            overlay.classList.add('opacity-100', 'visible');
        }
        document.body.style.overflow = 'hidden';
        sidebarOpen = true;
        
        // Animate hamburger to X
        if (hamburger) {
            const bars = hamburger.querySelectorAll('.bar');
            if (bars.length >= 3) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            }
        }
        
        console.log('Sidebar opened, sidebarOpen:', sidebarOpen);
    }

    function closeSidebar() {
        console.log('Closing sidebar');
        if (sidebar) {
            sidebar.style.transform = '';
            sidebar.classList.remove('translate-x-0', 'opacity-100', 'visible');
            sidebar.classList.add('translate-x-full', 'opacity-0', 'invisible');
        }
        if (overlay) {
            overlay.classList.remove('opacity-100', 'visible');
            overlay.classList.add('invisible', 'opacity-0');
        }
        document.body.style.overflow = '';
        sidebarOpen = false;
        
        // Reset hamburger
        if (hamburger) {
            const bars = hamburger.querySelectorAll('.bar');
            if (bars.length >= 3) {
                bars[0].style.transform = '';
                bars[1].style.opacity = '1';
                bars[2].style.transform = '';
            }
        }
        
        console.log('Sidebar closed, sidebarOpen:', sidebarOpen);
    }

    function toggleSidebar() {
        console.log('Toggle sidebar called, current state:', sidebarOpen);
        if (sidebarOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // Event listeners - only add if elements exist
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked, sidebarOpen:', sidebarOpen);
            toggleSidebar();
        });
        console.log('Hamburger event listener added');
    } else {
        console.warn('Hamburger button not found');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            closeSidebar();
        });
        console.log('Close button event listener added');
    } else {
        console.warn('Close button not found');
    }
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Overlay clicked');
            closeSidebar();
        });
        console.log('Overlay event listener added');
    } else {
        console.warn('Overlay not found');
    }

    // Close sidebar when clicking on links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Sidebar link clicked:', link.href);
            
            // Cerrar sidebar inmediatamente
            closeSidebar();
            
            // Permitir navegación normal sin delays
            // El evento continúa normalmente para navegar a la nueva página
        });
    });

    // Close sidebar with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebarOpen) {
            console.log('Escape key pressed, closing sidebar');
            closeSidebar();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation for contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('border-red-500')) {
                    validateInput(this);
                }
            });
        });
        
        function validateInput(input) {
            const isValid = input.checkValidity();
            
            if (isValid) {
                input.classList.remove('border-red-500');
                input.classList.add('border-green-500');
            } else {
                input.classList.remove('border-green-500');
                input.classList.add('border-red-500');
            }
        }
    }

    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections for animation
    const animatedElements = document.querySelectorAll('.bg-primary, .bg-white, .border-2');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const start = 0;
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = start;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counter.textContent = '0';
            observer.observe(counter);
        });
    }
    
    // Initialize counter animation
    animateCounters();

    // Navbar scroll effect - SOLO para la página de inicio
    function handleNavbarScroll() {
        // Verificar si estamos en la página de inicio
        const isIndexPage = window.location.pathname === '/' || 
                           window.location.pathname.endsWith('/index.html') || 
                           window.location.pathname === '/index.html' ||
                           window.location.href.endsWith('index.html');
        
        // Solo aplicar el efecto de scroll en la página de inicio
        if (!isIndexPage) return;
        
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!navbar) return;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const heroHeight = window.innerHeight; // Altura de la ventana
            
            if (scrolled > heroHeight * 0.9) {
                // Cuando está fuera del hero - fondo blanco, texto oscuro
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === 'index.html') {
                        link.classList.remove('text-white');
                        link.classList.add('text-primary');
                    } else {
                        link.classList.remove('text-white');
                        link.classList.add('text-gray-700');
                    }
                });
            } else {
                // Cuando está en el hero - fondo transparente/oscuro, texto blanco
                navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                navLinks.forEach(link => {
                    link.classList.remove('text-primary', 'text-gray-700');
                    link.classList.add('text-white');
                });
            }
        });
    }
    
    // Initialize navbar scroll effect (solo en index.html)
    handleNavbarScroll();

    console.log('🛡️ InnovaPrev website loaded successfully!');
});
