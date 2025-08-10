// Simplified Contact Form - WhatsApp Only
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.whatsappBtn = document.getElementById('whatsapp-btn');
        this.whatsappBtnText = document.getElementById('whatsapp-btn-text');
        this.whatsappBtnLoading = document.getElementById('whatsapp-btn-loading');
        
        this.phoneRegex = /^(\+51|51)?[9][0-9]{8}$/;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        this.init();
    }

    init() {
        // Bind events
        this.setupRealTimeValidation();
        this.setupCharacterCounter();
        this.setupWhatsAppButton();
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
        emailInput.addEventListener('input', (e) => {
            this.validateField(emailInput);
            this.updateWhatsAppButtonState();
        });

        // Name validation
        const nameInput = document.getElementById('name');
        nameInput.addEventListener('input', (e) => {
            this.validateField(nameInput);
            this.updateWhatsAppButtonState();
        });

        // Company validation (optional)
        const companyInput = document.getElementById('company');
        if (companyInput) {
            companyInput.addEventListener('input', () => {
                this.updateWhatsAppButtonState();
            });
        }

        // Message validation
        const messageInput = document.getElementById('message');
        messageInput.addEventListener('input', (e) => {
            this.validateField(messageInput);
            this.updateWhatsAppButtonState();
        });
    }

    setupCharacterCounter() {
        const messageInput = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        
        messageInput.addEventListener('input', (e) => {
            const count = e.target.value.length;
            charCount.textContent = count;
            
            // Visual feedback for character count
            if (count > 450) {
                charCount.classList.add('text-red-500');
                charCount.classList.remove('text-gray-400');
            } else {
                charCount.classList.remove('text-red-500');
                charCount.classList.add('text-gray-400');
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const errorDiv = field.parentNode.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Reset error state
        field.classList.remove('border-red-500', 'border-green-500');
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio.';
        } else if (value) {
            switch (field.type) {
                case 'email':
                    if (!this.emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingresa un email válido.';
                    }
                    break;
                case 'tel':
                    if (!this.phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingresa un número peruano válido (+51 9XXXXXXXX).';
                    }
                    break;
                case 'text':
                case 'textarea':
                    if (field.name === 'name' && value.length < 2) {
                        isValid = false;
                        errorMessage = 'El nombre debe tener al menos 2 caracteres.';
                    }
                    break;
            }
        }

        // Apply visual feedback
        if (!isValid && value) {
            field.classList.add('border-red-500');
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
        } else if (isValid && value && field.hasAttribute('required')) {
            field.classList.add('border-green-500');
        }

        return isValid;
    }

    setupWhatsAppButton() {
        this.whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleWhatsAppSubmit();
        });
    }

    updateWhatsAppButtonState() {
        const isFormValid = this.validateForm();
        this.whatsappBtn.disabled = !isFormValid;
        
        if (isFormValid) {
            this.whatsappBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            this.whatsappBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            const isFieldValid = this.validateField(field);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    async handleWhatsAppSubmit() {
        if (!this.validateForm()) {
            this.showValidationMessage();
            return;
        }

        // Show loading state
        this.whatsappBtnText.classList.add('hidden');
        this.whatsappBtnLoading.classList.remove('hidden');
        this.whatsappBtn.disabled = true;

        // Collect form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Format WhatsApp message
        const whatsappMessage = this.formatWhatsAppMessage(data);
        
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Open WhatsApp
        this.openWhatsApp(whatsappMessage);
        
        // Reset button state
        this.resetWhatsAppButton();
        
        // Reset form
        this.form.reset();
        this.updateWhatsAppButtonState();
        
        // Show success message
        this.showSuccessMessage();
    }

    formatWhatsAppMessage(data) {
        const lines = [
            "🏢 *Nueva Consulta - InnovaPrev*",
            "",
            `👤 *Nombre:* ${data.name}`,
            `🏢 *Empresa:* ${data.company || 'No especificada'}`,
            `📧 *Email:* ${data.email}`,
            `📱 *Teléfono:* ${data.phone}`,
        ];

        if (data.service) {
            lines.push(`🔧 *Servicio:* ${data.service}`);
        }

        lines.push(
            "",
            `💬 *Mensaje:*`,
            data.message,
            "",
            "---",
            "Enviado desde www.innovaprev.site"
        );

        return lines.join('\n');
    }

    openWhatsApp(message) {
        const phoneNumber = '51950107604';
        const encodedMessage = encodeURIComponent(message);
        
        // Detect device type
        const isMobile = this.isMobileDevice();
        
        let whatsappURL;
        if (isMobile) {
            // Mobile: Try to open WhatsApp app directly
            whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
            
            // Fallback to web version if app is not available
            setTimeout(() => {
                window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
            }, 1000);
        } else {
            // Desktop: Use WhatsApp Web
            whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        }
        
        window.open(whatsappURL, '_blank');
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    resetWhatsAppButton() {
        this.whatsappBtnText.classList.remove('hidden');
        this.whatsappBtnLoading.classList.add('hidden');
        this.whatsappBtn.disabled = false;
    }

    showValidationMessage() {
        // Create temporary validation message
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm';
        message.innerHTML = `
            <div class="flex items-start">
                <i class="fa-solid fa-exclamation-triangle mr-3 mt-0.5 text-red-500"></i>
                <div>
                    <strong>Formulario incompleto</strong><br>
                    <span class="text-sm">Por favor completa todos los campos obligatorios.</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 4000);
    }

    showSuccessMessage() {
        // Create temporary success message
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm';
        message.innerHTML = `
            <div class="flex items-start">
                <i class="fa-solid fa-check-circle mr-3 mt-0.5 text-green-500"></i>
                <div>
                    <strong>¡Mensaje preparado!</strong><br>
                    <span class="text-sm">WhatsApp se abrirá con tu consulta lista para enviar.</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});
