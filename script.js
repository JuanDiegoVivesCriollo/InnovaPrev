// ===== INNOVA PREV SPA - MODERN JAVASCRIPT =====

// ===== SPA CORE FUNCTIONALITY =====
class InnovaPrevSPA {
    constructor() {
        this.currentPage = 'inicio';
        this.container = document.getElementById('spa-container');
        this.navbar = document.getElementById('navbar');
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadPage(this.currentPage);
        this.initializeLoader();
    }

    // ===== SIMPLE LOADING SCREEN =====
    initializeLoader() {
        window.addEventListener('load', () => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }, 500);
                }, 1000);
            }
        });
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-page')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.loadPage(page);
                this.closeSidebar();
            }
        });

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const closeBtn = document.getElementById('close-btn');
        const overlay = document.getElementById('overlay');

        if (hamburger) hamburger.addEventListener('click', () => this.toggleSidebar());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeSidebar());
        if (overlay) overlay.addEventListener('click', () => this.closeSidebar());

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.updateNavbar());
    }

    // ===== PAGE NAVIGATION =====
    loadPage(pageName) {
        this.currentPage = pageName;
        this.updateActiveNavLink();
        
        // Smooth transition
        this.container.style.opacity = '0';
        
        setTimeout(() => {
            this.container.innerHTML = this.getPageContent(pageName);
            this.container.style.opacity = '1';
            
            // Initialize page-specific functionality
            this.initializePageFeatures();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
    }

    // ===== PAGE CONTENT =====
    getPageContent(pageName) {
        const pages = {
            'inicio': this.getInicioPage(),
            'sobre-nosotros': this.getSobreNosotrosPage(),
            'servicios': this.getServiciosPage(),
            'contacto': this.getContactoPage()
        };

        return pages[pageName] || pages['inicio'];
    }

    getInicioPage() {
        return `
            <!-- Hero Section -->
            <section class="relative min-h-screen flex items-center overflow-hidden" style="background-image: url('HeroEmergencia.svg'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div class="absolute inset-0 bg-black/60"></div>
                
                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div class="text-center lg:text-left text-white">
                        <h1 class="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg animate-fade-in">
                            PARA QUIENES QUIEREN<br>
                            <span class="text-yellow-300 drop-shadow-lg">PROTEGER LO QUE IMPORTA</span>
                        </h1>
                        <h2 class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8 text-gray-100 drop-shadow-md">
                            INDUSTRIA, EDUCACIÓN, COMERCIO Y MÁS
                        </h2>
                        <p class="text-lg sm:text-xl max-w-3xl lg:max-w-2xl mx-auto lg:mx-0 mb-12 text-gray-200 leading-relaxed drop-shadow-md">
                            En InnovaPrev prevenimos riesgos, protegemos personas y cuidamos tu operación.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                            <button data-page="servicios" class="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                                Nuestros Servicios
                            </button>
                            <button data-page="contacto" class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                Contáctanos
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Quick Info Section -->
            <section class="py-20 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl lg:text-5xl font-bold text-dark mb-6">¿Por qué InnovaPrev?</h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Especialistas en prevención y gestión de emergencias</p>
                    </div>
                    
                    <div class="grid lg:grid-cols-3 gap-8">
                        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                            <div class="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-shield-alt text-3xl text-primary"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-dark mb-4">Protección Integral</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Soluciones completas para la seguridad de tu organización, desde la prevención hasta la respuesta ante emergencias.
                            </p>
                        </div>
                        
                        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                            <div class="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-users-cog text-3xl text-primary"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-dark mb-4">Equipo Experto</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Profesionales certificados con años de experiencia en seguridad industrial y gestión de riesgos.
                            </p>
                        </div>
                        
                        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                            <div class="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-clipboard-check text-3xl text-primary"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-dark mb-4">Cumplimiento Normativo</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Garantizamos el cumplimiento de todas las regulaciones locales e internacionales de seguridad.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Stats Section -->
            <section class="py-20 bg-primary relative overflow-hidden">
                <div class="absolute inset-0 bg-black/20"></div>
                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                        <div class="glass-effect p-6 rounded-2xl">
                            <div class="stat-number text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" data-target="100">0</div>
                            <div class="text-sm sm:text-base lg:text-lg opacity-90">Proyectos Completados</div>
                        </div>
                        <div class="glass-effect p-6 rounded-2xl">
                            <div class="stat-number text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" data-target="500">0</div>
                            <div class="text-sm sm:text-base lg:text-lg opacity-90">Personas Capacitadas</div>
                        </div>
                        <div class="glass-effect p-6 rounded-2xl">
                            <div class="stat-number text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" data-target="50">0</div>
                            <div class="text-sm sm:text-base lg:text-lg opacity-90">Empresas Atendidas</div>
                        </div>
                        <div class="glass-effect p-6 rounded-2xl">
                            <div class="stat-number text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" data-target="24">0</div>
                            <div class="text-sm sm:text-base lg:text-lg opacity-90">Horas de Servicio</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getSobreNosotrosPage() {
        return `
            <!-- About Section -->
            <section class="py-20 mt-20 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl lg:text-5xl font-bold text-dark mb-6">Sobre Nosotros</h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Conoce más sobre InnovaPrev y nuestra misión</p>
                    </div>
                    
                    <div class="grid lg:grid-cols-2 gap-12 mb-20">
                        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div class="flex items-center mb-6">
                                <div class="bg-primary/10 p-4 rounded-full mr-4">
                                    <i class="fas fa-question-circle text-2xl text-primary"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-dark">¿Qué Hacemos?</h3>
                            </div>
                            <p class="text-gray-600 leading-relaxed">
                                Somos una empresa especializada en prevención y gestión de emergencias, parte del grupo OSDI.
                                Ayudamos a tu organización a anticiparse a los riesgos mediante soluciones prácticas y normativas 
                                que fortalecen la seguridad integral.
                            </p>
                        </div>
                        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div class="flex items-center mb-6">
                                <div class="bg-primary/10 p-4 rounded-full mr-4">
                                    <i class="fas fa-users text-2xl text-primary"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-dark">¿Quiénes Somos?</h3>
                            </div>
                            <p class="text-gray-600 leading-relaxed">
                                Un equipo técnico experto en seguridad, comprometido con una visión proactiva.
                                En InnovaPrev convertimos la prevención en cultura empresarial a través de 
                                planificación estratégica y ejecución profesional.
                            </p>
                        </div>
                    </div>

                    <!-- Mission, Vision, Values -->
                    <div class="grid lg:grid-cols-3 gap-8">
                        <div class="bg-primary text-white p-8 rounded-2xl shadow-xl text-center">
                            <div class="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-bullseye text-2xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-4">Misión</h3>
                            <p class="text-white/90 leading-relaxed">
                                Proporcionar soluciones integrales en prevención y gestión de emergencias, 
                                protegiendo vidas y patrimonio a través de la excelencia técnica.
                            </p>
                        </div>
                        
                        <div class="bg-white border-2 border-primary text-primary p-8 rounded-2xl shadow-xl text-center">
                            <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-eye text-2xl text-primary"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-4">Visión</h3>
                            <p class="text-gray-700 leading-relaxed">
                                Ser la empresa líder en prevención de riesgos en Perú, reconocida por 
                                nuestra innovación y compromiso con la seguridad integral.
                            </p>
                        </div>
                        
                        <div class="bg-primary text-white p-8 rounded-2xl shadow-xl text-center">
                            <div class="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-heart text-2xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-4">Valores</h3>
                            <p class="text-white/90 leading-relaxed">
                                Compromiso, integridad, excelencia técnica, innovación continua y 
                                responsabilidad social en cada proyecto que realizamos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    getContactoPage() {
        return `
            <!-- Contact Section -->
            <section class="py-20 mt-20 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl lg:text-5xl font-bold text-dark mb-6">Contacto</h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Estamos aquí para proteger lo que más te importa</p>
                    </div>
                    
                    <div class="grid lg:grid-cols-2 gap-12">
                        <div class="space-y-8">
                            <div class="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg">
                                <div class="bg-primary/10 p-3 rounded-full">
                                    <i class="fas fa-phone text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-semibold text-dark mb-2">Teléfono</h4>
                                    <p class="text-gray-600">+51 950 107 604</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg">
                                <div class="bg-primary/10 p-3 rounded-full">
                                    <i class="fas fa-envelope text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-semibold text-dark mb-2">Email</h4>
                                    <p class="text-gray-600">innovaprev9@gmail.com</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg">
                                <div class="bg-primary/10 p-3 rounded-full">
                                    <i class="fas fa-map-marker-alt text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-semibold text-dark mb-2">Dirección</h4>
                                    <p class="text-gray-600">Av. Oscar R, Benavides 3217 – Callao</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-8 rounded-2xl shadow-lg">
                            <div class="mb-8">
                                <h3 class="text-2xl font-bold text-dark mb-2">Solicita una Cotización</h3>
                                <p class="text-gray-600">Cuéntanos sobre tu proyecto y te contactaremos pronto</p>
                            </div>
                            <form id="contactForm" class="space-y-6">
                                <div class="grid sm:grid-cols-2 gap-4">
                                    <div class="relative">
                                        <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                                        <input type="text" id="nombre" placeholder="Ingresa tu nombre completo" required 
                                               class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                                        <i class="fas fa-user absolute left-4 top-11 text-gray-400"></i>
                                    </div>
                                    <div class="relative">
                                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input type="email" id="email" placeholder="tu@email.com" required 
                                               class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                                        <i class="fas fa-envelope absolute left-4 top-11 text-gray-400"></i>
                                    </div>
                                </div>
                                <div class="grid sm:grid-cols-2 gap-4">
                                    <div class="relative">
                                        <label for="telefono" class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                        <input type="tel" id="telefono" placeholder="+51 999 999 999" 
                                               class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                                        <i class="fas fa-phone absolute left-4 top-11 text-gray-400"></i>
                                    </div>
                                    <div class="relative">
                                        <label for="empresa" class="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                                        <input type="text" id="empresa" placeholder="Nombre de tu empresa" 
                                               class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                                        <i class="fas fa-building absolute left-4 top-11 text-gray-400"></i>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label for="servicio" class="block text-sm font-medium text-gray-700 mb-2">Servicio de Interés *</label>
                                    <select id="servicio" required 
                                            class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none">
                                        <option value="">Selecciona un servicio</option>
                                        <option value="planes">📋 Planes de Emergencia y Contingencia</option>
                                        <option value="simulacros">🚨 Simulacros y Capacitaciones</option>
                                        <option value="asistencia">🛠️ Asistencia Preventiva en Campo</option>
                                        <option value="diagnostico">🧭 Diagnóstico de Infraestructura</option>
                                        <option value="personal">🧑‍⚕️ Personal de Primera Respuesta</option>
                                        <option value="normativo">📑 Cumplimiento Normativo Local</option>
                                        <option value="todos">🎯 Consultoría Integral</option>
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-11 text-gray-400"></i>
                                </div>
                                <div class="relative">
                                    <label for="mensaje" class="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                                    <textarea id="mensaje" placeholder="Cuéntanos sobre tu proyecto, necesidades específicas, número de empleados, tipo de industria, etc." rows="4" 
                                              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"></textarea>
                                    <i class="fas fa-comment absolute left-4 top-11 text-gray-400"></i>
                                </div>
                                <div>
                                    <button type="submit" class="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3">
                                        <i class="fas fa-paper-plane"></i>
                                        Enviar Solicitud
                                    </button>
                                    <p class="text-sm text-gray-500 text-center mt-3">* Campos obligatorios. Responderemos en menos de 24 horas.</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // ===== UTILITY FUNCTIONS =====
    updateActiveNavLink() {
        document.querySelectorAll('[data-page]').forEach(link => {
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('text-primary');
                link.classList.remove('text-gray-700');
            } else {
                link.classList.remove('text-primary');
                link.classList.add('text-gray-700');
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const hamburger = document.getElementById('hamburger');
        
        sidebar.classList.toggle('translate-x-0');
        sidebar.classList.toggle('translate-x-full');
        overlay.classList.toggle('opacity-0');
        overlay.classList.toggle('invisible');
        document.body.style.overflow = sidebar.classList.contains('translate-x-0') ? 'hidden' : 'auto';
        
        // Animate hamburger
        const bars = hamburger.querySelectorAll('.bar');
        if (sidebar.classList.contains('translate-x-0')) {
            bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const hamburger = document.getElementById('hamburger');
        
        sidebar.classList.add('translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('opacity-0', 'invisible');
        document.body.style.overflow = 'auto';
        
        // Reset hamburger
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }

    updateNavbar() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('shadow-lg');
            this.navbar.classList.remove('shadow-sm');
        } else {
            this.navbar.classList.remove('shadow-lg');
            this.navbar.classList.add('shadow-sm');
        }
    }

    // ===== PAGE-SPECIFIC FEATURES =====
    initializePageFeatures() {
        if (this.currentPage === 'inicio') {
            this.animateStats();
        }
        
        if (this.currentPage === 'contacto') {
            this.initializeContactForm();
        }
    }

    // ===== STATS ANIMATION =====
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const start = Date.now();
            
            function updateNumber() {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(progress * target);
                
                stat.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            }
            
            updateNumber();
        });
    }

    // ===== FORM VALIDATION =====
    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const nombre = document.getElementById('nombre');
                const email = document.getElementById('email');
                const telefono = document.getElementById('telefono');
                const empresa = document.getElementById('empresa');
                const servicio = document.getElementById('servicio');
                const mensaje = document.getElementById('mensaje');
                
                let isValid = true;
                let errors = [];
                
                // Remove existing error styles
                [nombre, email, telefono, empresa, servicio, mensaje].forEach(field => {
                    if (field) {
                        field.classList.remove('border-red-500', 'ring-red-500');
                        field.classList.add('border-gray-300');
                    }
                });
                
                // Validate required fields
                if (!nombre.value.trim()) {
                    nombre.classList.add('border-red-500', 'ring-red-500');
                    errors.push('El nombre es obligatorio');
                    isValid = false;
                } else if (nombre.value.trim().length < 2) {
                    nombre.classList.add('border-red-500', 'ring-red-500');
                    errors.push('El nombre debe tener al menos 2 caracteres');
                    isValid = false;
                }
                
                if (!email.value.trim()) {
                    email.classList.add('border-red-500', 'ring-red-500');
                    errors.push('El email es obligatorio');
                    isValid = false;
                } else if (!this.isValidEmail(email.value)) {
                    email.classList.add('border-red-500', 'ring-red-500');
                    errors.push('Por favor ingresa un email válido');
                    isValid = false;
                }
                
                if (telefono.value.trim() && !this.isValidPhone(telefono.value)) {
                    telefono.classList.add('border-red-500', 'ring-red-500');
                    errors.push('El teléfono debe tener un formato válido');
                    isValid = false;
                }
                
                if (!servicio.value) {
                    servicio.classList.add('border-red-500', 'ring-red-500');
                    errors.push('Debes seleccionar un servicio');
                    isValid = false;
                }
                
                if (isValid) {
                    this.showNotification('✅ Formulario enviado correctamente. Te contactaremos pronto.', 'success');
                    contactForm.reset();
                    
                    console.log('Form data:', {
                        nombre: nombre.value,
                        email: email.value,
                        telefono: telefono.value,
                        empresa: empresa.value,
                        servicio: servicio.value,
                        mensaje: mensaje.value
                    });
                } else {
                    this.showNotification(`⚠️ ${errors[0]}`, 'error');
                }
            });
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 9 && cleanPhone.length <= 15;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// ===== INITIALIZE SPA =====
document.addEventListener('DOMContentLoaded', () => {
    new InnovaPrevSPA();
});
