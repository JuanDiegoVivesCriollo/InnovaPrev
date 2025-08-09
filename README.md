# 🛡️ INNOVA PREV - Sitio Web Profesional

## Descripción
Página web profesional moderna y responsive para InnovaPrev, empresa especializada en prevención y gestión de emergencias.

## ⚡ Optimizaciones Implementadas
- **CSS Optimizado**: Tailwind CSS compilado y minificado (23KB vs 3.5MB del CDN)
- **Performance**: CSS sin dependencias externas + imágenes precargadas
- **Responsive Design**: Compatible con mobile, tablet y desktop

## Características
- **Diseño Moderno**: SPA (Single Page Application) con diseño contemporáneo
- **Responsive**: Totalmente adaptado para dispositivos móviles, tablets y desktop
- **Animaciones**: Implementación de anime.js para animaciones fluidas y atractivas
- **Navegación**: Navbar fijo con menú hamburguesa deslizante para móviles
- **Paleta de Colores**: Naranja (#E85A33) y blanco según la identidad corporativa
- **Secciones Interactivas**: Hero, Sobre Nosotros, Servicios, Estadísticas y Contacto

## Estructura del Proyecto
```
InnovaPrev/
├── index.html          # Estructura principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidad JavaScript
└── README.md           # Documentación
```

## Secciones Principales

### 1. Hero Section
- Fondo con gradiente naranja
- Títulos animados con anime.js
- Botones de call-to-action
- Indicador de scroll animado

### 2. Sobre Nosotros
- Grid responsive con tarjetas informativas
- Iconos animados
- Efectos hover suaves

### 3. Servicios
- Carrusel de servicios (6 servicios principales)
- Tarjetas con iconos representativos
- Navegación del carrusel

### 4. Estadísticas
- Contadores animados
- Fondo naranja corporativo
- Grid responsive

### 5. Contacto
- Información de contacto con iconos
- Formulario funcional con validación
- Grid de dos columnas

### 6. Footer
- Enlaces rápidos
- Información de contacto
- Diseño limpio y profesional

## Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS, Grid y Flexbox
- **JavaScript ES6+**: Funcionalidad interactiva
- **Anime.js**: Librería de animaciones
- **Font Awesome**: Iconos vectoriales
- **Google Fonts**: Tipografía Poppins

## Características Técnicas

### Responsive Design
- Breakpoints optimizados para móviles y tablets
- Grid adaptativo
- Menú hamburguesa para dispositivos móviles

### Animaciones
- Entrada progresiva de elementos con Intersection Observer
- Animaciones de hover y focus
- Contadores animados
- Efectos de parallax en el hero

### Performance
- CSS optimizado con variables
- JavaScript modular
- Carga diferida de animaciones
- Imágenes placeholder optimizadas

## Instalación y Uso

1. **Clonar o descargar** los archivos en una carpeta
2. **Reemplazar el logo**: Cambiar `logo-placeholder.png` por el logo real de InnovaPrev
3. **Personalizar imágenes**: Añadir imagen de fondo para el hero si se desea
4. **Abrir** `index.html` en un navegador web

## Personalización

### Colores
Los colores principales están definidos en variables CSS en `styles.css`:
```css
:root {
    --primary-color: #E85A33;    /* Naranja corporativo */
    --primary-dark: #C4482A;     /* Naranja oscuro */
    --secondary-color: #FFFFFF;   /* Blanco */
}
```

### Contenido
El contenido se puede modificar directamente en `index.html` manteniendo la estructura de clases CSS.

### Animaciones
Las animaciones se pueden personalizar en `script.js` modificando los parámetros de anime.js.

## Navegación
- **Inicio**: Hero section con presentación principal
- **Sobre Nosotros**: ¿Qué hacemos? y ¿Quiénes somos?
- **Servicios**: Los 6 servicios principales de InnovaPrev
- **Contacto**: Información de contacto y formulario

## Datos de Contacto Incluidos
- **Teléfono**: +51 950 107 604
- **Email**: innovaprev9@gmail.com
- **Dirección**: Av. Oscar R, Benavides 3217 – Callao

## Funcionalidades JavaScript
- Navegación suave entre secciones
- Menú hamburguesa animado
- Carrusel de servicios
- Contadores animados
- Validación de formulario
- Efectos de scroll
- Animaciones de entrada de elementos

## Compatibilidad
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Dispositivos móviles iOS y Android

## Próximas Mejoras
- [ ] Integración con servicio de email para el formulario
- [ ] Galería de proyectos
- [ ] Blog/noticias
- [ ] Certificaciones y acreditaciones
- [ ] Testimonios de clientes

## 🔧 Optimización Adicional (2025)
- Fuentes Poppins autohospedadas (fonts.css) con subset WOFF2 + font-display:swap.
- Eliminado CDN de Font Awesome / Anime.js → versiones locales (fa.min.css, anime.min.js).
- Preload estratégico: CSS crítico, fuentes e imágenes LCP.
- Prefetch en reposo de páginas internas (SPA) con requestIdleCallback.
- Service Worker (sw.js) cache-first para assets estáticos y SWR para páginas HTML.
- Consolidación de scripts repetidos en assets/js/site-common.js.
- Lazy loading imágenes no críticas + width/height para evitar CLS.

---

**Desarrollado para InnovaPrev** - Empresa especializada en prevención y gestión de emergencias, parte del grupo OSDI.
