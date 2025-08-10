// Contact Form Handler with EmailJS
class ContactFormHandler {
    constructor() {
        // EmailJS Configuration from external config
        this.emailjsConfig = {
            serviceID: EMAILJS_CONFIG.serviceID,
            templateID: EMAILJS_CONFIG.templateID,
            userID: EMAILJS_CONFIG.userID
        };

        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.btnText = document.getElementById('btn-text');
        this.btnLoading = document.getElementById('btn-loading');
        this.formMessages = document.getElementById('form-messages');
        this.phoneRegex = /^(\+51|51)?[9][0-9]{8}$/;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        this.init();
    }

    init() {
        // Initialize EmailJS
        emailjs.init(this.emailjsConfig.userID);
        
        // Bind events
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupRealTimeValidation();
        this.setupCharacterCounter();
        this.setupWhatsAppButton();
        
        // Initialize WhatsApp button state
        this.updateWhatsAppButtonState();
    }

    setupRealTimeValidation() {
        // Phone validation
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^\d+]/g, '');
            
            // Auto-format phone number
            if (value && !value.startsWith('+51') && !value.startsWith('51')) {
                if (value.startsWith('9')) {
                    value = '+51' + value;
                }
            }
            
            e.target.value = value;
            this.validateField(phoneInput);
            this.updateWhatsAppButtonState();
        });

        // Email validation
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('blur', () => {
            this.validateField(emailInput);
        });

        // Name validation
        const nameInput = document.getElementById('name');
        nameInput.addEventListener('input', () => {
            this.validateField(nameInput);
            this.updateWhatsAppButtonState();
        });

        // Company validation
        const companyInput = document.getElementById('company');
        companyInput.addEventListener('input', () => {
            this.validateField(companyInput);
            this.updateWhatsAppButtonState();
        });

        // Message validation
        const messageInput = document.getElementById('message');
        messageInput.addEventListener('input', () => {
            this.validateField(messageInput);
            this.updateWhatsAppButtonState();
        });
    }

    updateWhatsAppButtonState() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const isWhatsAppReady = this.validateRequiredFieldsForWhatsApp();
        const isMobile = this.isMobileDevice();
        
        if (isWhatsAppReady) {
            whatsappBtn.classList.remove('opacity-75');
            whatsappBtn.classList.add('opacity-100');
            
            // Update text based on device type
            const deviceText = isMobile ? '📱 App' : '💻 Web';
            whatsappBtn.querySelector('span').textContent = `Enviar por WhatsApp ${deviceText} ✓`;
        } else {
            whatsappBtn.classList.add('opacity-75');
            whatsappBtn.classList.remove('opacity-100');
            
            const deviceText = isMobile ? '📱 App' : '💻 Web';
            whatsappBtn.querySelector('span').textContent = `Enviar por WhatsApp ${deviceText}`;
        }
    }

    setupCharacterCounter() {
        const messageInput = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        
        messageInput.addEventListener('input', () => {
            const currentLength = messageInput.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 450) {
                charCount.classList.add('text-red-500');
                charCount.classList.remove('text-gray-400');
            } else {
                charCount.classList.remove('text-red-500');
                charCount.classList.add('text-gray-400');
            }
        });
    }

    setupWhatsAppButton() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        
        whatsappBtn.addEventListener('click', () => {
            // Get current form data
            const formData = this.getCurrentFormData();
            
            // Validate required fields before sending to WhatsApp
            if (!this.validateRequiredFieldsForWhatsApp()) {
                this.showMessage('Por favor completa al menos el nombre, empresa y mensaje para enviar por WhatsApp', 'error');
                return;
            }
            
            // Generate WhatsApp message
            const whatsappMessage = this.generateWhatsAppMessage(formData);
            
            // Open WhatsApp (Web or App depending on device)
            this.openWhatsApp(whatsappMessage);
            
            // Show confirmation message with device info
            const deviceType = isMobile ? 'app móvil' : 'WhatsApp Web';
            this.showMessage(`¡Abriendo WhatsApp ${deviceType}! Tu mensaje se ha preparado automáticamente.`, 'success');
        });
    }

    // Detect device type and open appropriate WhatsApp
    openWhatsApp(message) {
        const phoneNumber = '51950107604';
        const isMobile = this.isMobileDevice();
        
        let whatsappURL;
        
        if (isMobile) {
            // Mobile: Open WhatsApp app directly
            whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
            
            // Fallback to web if app is not installed
            const fallbackURL = `https://wa.me/${phoneNumber}?text=${message}`;
            
            // Try to open app, fallback to web after 2 seconds
            window.location.href = whatsappURL;
            
            setTimeout(() => {
                if (document.hasFocus()) {
                    // If still on page, app probably not installed, open web version
                    window.open(fallbackURL, '_blank');
                }
            }, 2000);
            
        } else {
            // Desktop: Open WhatsApp Web
            whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
            window.open(whatsappURL, '_blank');
        }
    }

    // Enhanced mobile detection
    isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for mobile user agents
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
        const isMobileUA = mobileRegex.test(userAgent);
        
        // Check for touch capability
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check screen size (mobile-like)
        const isSmallScreen = window.innerWidth <= 768;
        
        // Consider it mobile if any of these conditions are true
        const isMobile = isMobileUA || (isTouchDevice && isSmallScreen);
        
        // Debug info (optional - remove in production)
        console.log('Device Detection:', {
            userAgent: userAgent,
            isMobileUA: isMobileUA,
            isTouchDevice: isTouchDevice,
            isSmallScreen: isSmallScreen,
            screenWidth: window.innerWidth,
            finalDecision: isMobile
        });
        
        return isMobile;
    }

    getCurrentFormData() {
        return {
            from_name: document.getElementById('name').value.trim(),
            company: document.getElementById('company').value.trim(),
            from_email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value || 'No especificado',
            message: document.getElementById('message').value.trim()
        };
    }

    validateRequiredFieldsForWhatsApp() {
        const formData = this.getCurrentFormData();
        return formData.from_name && formData.company && formData.message;
    }

    validateField(field) {
        const errorDiv = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Remove previous error styling
        field.classList.remove('border-red-500', 'border-green-500');
        errorDiv.classList.add('hidden');

        switch (field.id) {
            case 'name':
                if (!field.value.trim()) {
                    errorMessage = 'El nombre es obligatorio';
                    isValid = false;
                } else if (field.value.trim().length < 2) {
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;

            case 'company':
                if (!field.value.trim()) {
                    errorMessage = 'El nombre de la empresa es obligatorio';
                    isValid = false;
                } else if (field.value.trim().length < 2) {
                    errorMessage = 'El nombre de la empresa debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;

            case 'email':
                if (!field.value.trim()) {
                    errorMessage = 'El email es obligatorio';
                    isValid = false;
                } else if (!this.emailRegex.test(field.value)) {
                    errorMessage = 'Ingresa un email válido';
                    isValid = false;
                }
                break;

            case 'phone':
                if (!field.value.trim()) {
                    errorMessage = 'El teléfono es obligatorio';
                    isValid = false;
                } else if (!this.phoneRegex.test(field.value)) {
                    errorMessage = 'Ingresa un número peruano válido (+51 9xxxxxxxx)';
                    isValid = false;
                }
                break;

            case 'message':
                if (!field.value.trim()) {
                    errorMessage = 'El mensaje es obligatorio';
                    isValid = false;
                } else if (field.value.trim().length < 10) {
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                    isValid = false;
                } else if (field.value.length > 500) {
                    errorMessage = 'El mensaje no debe exceder 500 caracteres';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            field.classList.add('border-red-500');
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
        } else {
            field.classList.add('border-green-500');
        }

        return isValid;
    }

    validateForm() {
        const requiredFields = ['name', 'company', 'email', 'phone', 'message'];
        let isFormValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const fieldValid = this.validateField(field);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Por favor corrige los errores antes de enviar', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Prepare form data for EmailJS
            const formData = new FormData(this.form);
            const templateParams = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                company: formData.get('company'),
                phone: formData.get('phone'),
                service: formData.get('service') || 'No especificado',
                message: formData.get('message'),
                to_name: 'InnovaPrev',
                reply_to: formData.get('from_email')
            };

            // Check if EmailJS is configured
            const isEmailJSConfigured = this.emailjsConfig.userID && 
                                       this.emailjsConfig.serviceID && 
                                       this.emailjsConfig.templateID &&
                                       this.emailjsConfig.userID !== 'YOUR_USER_ID_HERE';

            if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
                // Send email via EmailJS
                const response = await emailjs.send(
                    this.emailjsConfig.serviceID,
                    this.emailjsConfig.templateID,
                    templateParams
                );

                if (response.status === 200) {
                    this.showMessage('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
                    this.form.reset();
                    this.clearValidationStyles();
                    
                    // Show WhatsApp option after 2 seconds
                    setTimeout(() => {
                        this.showWhatsAppOption(templateParams);
                    }, 2000);
                } else {
                    throw new Error('Error en el envío');
                }
            } else {
                // For testing or if EmailJS is not configured, show success message and WhatsApp option
                console.warn('EmailJS no está configurado. Mostrando solo la opción de WhatsApp.');
                this.showMessage('Formulario enviado (modo demo). Te mostraremos la opción de WhatsApp.', 'success');
                this.form.reset();
                this.clearValidationStyles();
                
                // Show WhatsApp option after 1 second for demo
                setTimeout(() => {
                    this.showWhatsAppOption(templateParams);
                }, 1000);
            }

        } catch (error) {
            console.error('Error sending email:', error);
            this.showMessage('Hubo un error al enviar el mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp.', 'error');
            
            // Even on error, show WhatsApp option as fallback
            const formData = new FormData(this.form);
            const templateParams = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                company: formData.get('company'),
                phone: formData.get('phone'),
                service: formData.get('service') || 'No especificado',
                message: formData.get('message')
            };
            
            setTimeout(() => {
                this.showWhatsAppOption(templateParams);
            }, 3000);
        } finally {
            this.setLoadingState(false);
        }
    }

    showWhatsAppOption(formData) {
        // Create WhatsApp message for post-email scenario
        const whatsappMessage = this.generatePostEmailWhatsAppMessage(formData);
        
        // Create and show modal
        this.createWhatsAppModal(whatsappMessage);
    }

    generatePostEmailWhatsAppMessage(formData) {
        const message = 
            `¡Hola InnovaPrev! 👋\n\n` +
            `Acabo de enviar un email desde su página web y quería contactarlos también por WhatsApp para una respuesta más rápida.\n\n` +
            `📋 *Información enviada por email:*\n` +
            `• Nombre: ${formData.from_name}\n` +
            `• Empresa: ${formData.company}\n` +
            `• Email: ${formData.from_email}\n` +
            `• Teléfono: ${formData.phone}\n` +
            `• Servicio: ${formData.service}\n\n` +
            `💬 *Consulta:*\n${formData.message}\n\n` +
            `¡Espero su pronta respuesta por cualquiera de los dos medios! 🙏`;
        
        return encodeURIComponent(message);
    }

    generateWhatsAppMessage(formData) {
        const message = 
            `¡Hola InnovaPrev! 👋\n\n` +
            `Me interesa conocer más sobre sus servicios de seguridad laboral y prevención de riesgos.\n\n` +
            `📋 *Mis datos de contacto:*\n` +
            `• Nombre: ${formData.from_name}\n` +
            `• Empresa: ${formData.company}\n` +
            (formData.from_email ? `• Email: ${formData.from_email}\n` : '') +
            (formData.phone ? `• Teléfono: ${formData.phone}\n` : '') +
            `• Servicio de interés: ${formData.service}\n\n` +
            `💬 *Mi consulta:*\n${formData.message}\n\n` +
            `¿Podrían proporcionarme más información y una cotización?\n\n` +
            `¡Gracias por su atención! 🙏`;
        
        return encodeURIComponent(message);
    }

    createWhatsAppModal(whatsappMessage) {
        // Remove any existing modal
        const existingModal = document.querySelector('.whatsapp-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal backdrop
        const modal = document.createElement('div');
        modal.className = 'whatsapp-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 transition-all duration-500';
        modal.style.backdropFilter = 'blur(4px)';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white rounded-3xl p-8 max-w-md mx-4 transform scale-75 transition-all duration-500 shadow-2xl';
        
        modalContent.innerHTML = `
            <div class="text-center">
                <!-- WhatsApp Icon Animation -->
                <div class="relative mb-6">
                    <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
                        <i class="fa-brands fa-whatsapp text-white text-4xl"></i>
                    </div>
                    <!-- Pulse animation -->
                    <div class="absolute inset-0 w-20 h-20 bg-green-400 rounded-full mx-auto animate-ping opacity-25"></div>
                </div>
                
                <!-- Title -->
                <h3 class="text-2xl font-bold text-gray-800 mb-3">¡Mensaje enviado! 🎉</h3>
                <p class="text-gray-600 mb-6 leading-relaxed">
                    ¿Te gustaría enviar tu consulta también por <strong class="text-green-600">WhatsApp</strong> 
                    para una respuesta más rápida?
                </p>
                
                <!-- Buttons -->
                <div class="space-y-3">
                    <button onclick="this.openWhatsAppFromModal('${whatsappMessage}')" 
                           class="whatsapp-btn w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                        <i class="fa-brands fa-whatsapp mr-3 text-xl"></i>
                        <span>Enviar por WhatsApp</span>
                    </button>
                    
                    <button onclick="this.closest('.whatsapp-modal').remove()" 
                            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
                        <i class="fa-solid fa-times mr-2"></i>
                        No, gracias
                    </button>
                </div>
                
                <!-- Phone number display -->
                <div class="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                    <div class="flex items-center justify-center text-green-700">
                        <i class="fa-solid fa-phone mr-2"></i>
                        <span class="font-semibold">+51 950 107 604</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            modalContent.classList.remove('scale-75');
            modalContent.classList.add('scale-100');
        }, 100);
        
        // Close modal when clicking backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // Close modal with Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Auto close after 30 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                this.closeModal(modal);
            }
        }, 30000);

        // Add global function for modal WhatsApp button
        window.openWhatsAppFromModal = (message) => {
            this.openWhatsApp(message);
            this.closeModal(modal);
        };
    }
    
    closeModal(modal) {
        modal.classList.add('opacity-0');
        const content = modal.querySelector('div');
        content.classList.add('scale-75');
        
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 500);
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.btnText.classList.add('hidden');
            this.btnLoading.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            this.btnText.classList.remove('hidden');
            this.btnLoading.classList.add('hidden');
        }
    }

    showMessage(message, type) {
        this.formMessages.innerHTML = `
            <div class="form-message p-4 rounded-lg ${type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}">
                <div class="flex items-center">
                    <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} mr-3 ${type === 'success' ? 'success-checkmark' : ''}"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;
        this.formMessages.classList.remove('hidden');
        
        // Scroll to message
        this.formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide message after 10 seconds for success, 8 seconds for error
        setTimeout(() => {
            this.formMessages.classList.add('hidden');
        }, type === 'success' ? 10000 : 8000);
    }

    clearValidationStyles() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('border-red-500', 'border-green-500');
        });

        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.classList.add('hidden');
        });

        // Reset character counter
        document.getElementById('char-count').textContent = '0';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});
