// EmailJS Configuration
// Instructions to set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Create an email service (Gmail, Outlook, etc.)
// 4. Create an email template
// 5. Replace the values below with your actual IDs

const EMAILJS_CONFIG = {
    // Your EmailJS User ID (found in your EmailJS dashboard)
    userID: 'YOUR_USER_ID_HERE',
    
    // Your EmailJS Service ID (created when you add an email service)
    serviceID: 'YOUR_SERVICE_ID_HERE',
    
    // Your EmailJS Template ID (created when you create a template)
    templateID: 'YOUR_TEMPLATE_ID_HERE'
};

// Example template variables you can use in your EmailJS template:
// {{from_name}} - Name of the person sending
// {{from_email}} - Email of the person sending  
// {{company}} - Company name
// {{phone}} - Phone number
// {{service}} - Selected service
// {{message}} - Message content
// {{to_name}} - Your company name (InnovaPrev)
// {{reply_to}} - Email to reply to

// Example email template content:
/*
Subject: Nueva consulta desde InnovaPrev - {{from_name}}

Hola {{to_name}},

Has recibido una nueva consulta desde tu página web:

Información del contacto:
- Nombre: {{from_name}}
- Empresa: {{company}}
- Email: {{from_email}}
- Teléfono: {{phone}}
- Servicio de interés: {{service}}

Mensaje:
{{message}}

---
Este mensaje fue enviado automáticamente desde el formulario de contacto de InnovaPrev.
*/
