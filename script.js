// ====================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ====================================

const state = {
    carouselIndex: 0,
    isCarouselTransitioning: false,
    darkMode: localStorage.getItem('darkMode') === 'true',
};

// ====================================
// SISTEMA DE TEMA (OSCURO/CLARO)
// ====================================

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Aplicar tema guardado al cargar
    if (state.darkMode) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            state.darkMode = !state.darkMode;
            
            if (state.darkMode) {
                document.documentElement.classList.add('dark-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.classList.remove('dark-mode');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
}

// ====================================
// BOTÓN SOLICITAR PRESUPUESTO
// ====================================

function initializePresupuestoButton() {
    const btnPresupuesto = document.getElementById('btnPresupuesto');
    
    if (btnPresupuesto) {
        btnPresupuesto.addEventListener('click', () => {
            // Scroll suave a la sección de servicios o formulario
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth' });
                // Enfocar en el primer input
                const firstInput = contactForm.querySelector('input[type="text"]');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 500);
                }
            }
        });
    }
}

// ====================================
// NAVEGACIÓN ENTRE SECCIONES
// ====================================

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Si está en la misma página, prevenir el comportamiento por defecto
            if (!href.includes('.html') && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                const section = document.getElementById(sectionId);
                
                if (section) {
                    // Smooth scroll
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Cambiar estilos del nav activo
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// ====================================
// CARRUSEL DE PROYECTOS
// ====================================

const carousel = document.querySelector('.carousel__track');
const slides = document.querySelectorAll('.carousel__slide');
const prevBtn = document.querySelector('.carousel__btn--prev');
const nextBtn = document.querySelector('.carousel__btn--next');

const SLIDE_WIDTH = slides[0]?.offsetWidth || 300;
const GAP = 24; // Basado en gap: 1.5rem

function updateCarouselPosition() {
    if (!carousel) return;
    const offset = -(state.carouselIndex * (SLIDE_WIDTH + GAP));
    carousel.style.transform = `translateX(${offset}px)`;
}

function nextSlide() {
    if (state.isCarouselTransitioning || !carousel) return;
    
    state.isCarouselTransitioning = true;
    const maxIndex = slides.length - 1;
    
    if (state.carouselIndex < maxIndex) {
        state.carouselIndex++;
    } else {
        state.carouselIndex = 0;
    }
    
    updateCarouselPosition();
    
    setTimeout(() => {
        state.isCarouselTransitioning = false;
    }, 600);
}

function prevSlide() {
    if (state.isCarouselTransitioning || !carousel) return;
    
    state.isCarouselTransitioning = true;
    const maxIndex = slides.length - 1;
    
    if (state.carouselIndex > 0) {
        state.carouselIndex--;
    } else {
        state.carouselIndex = maxIndex;
    }
    
    updateCarouselPosition();
    
    setTimeout(() => {
        state.isCarouselTransitioning = false;
    }, 600);
}

// Event listeners del carrusel
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Auto-advance carousel cada 8 segundos
let carouselInterval = setInterval(nextSlide, 8000);

// Pausar auto-advance en hover
if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 8000);
    });
}

// ====================================
// FORMULARIO DE CONTACTO (Página principal)
// ====================================

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[type="text"]');
            const phone = contactForm.querySelector('input[type="tel"]');
            const message = contactForm.querySelector('textarea');
            
            if (!name.value.trim() || !phone.value.trim() || !message.value.trim()) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'ENVIANDO...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showNotification('¡Consulta enviada con éxito! Nos contactaremos pronto.', 'success');
            }, 1500);
        });
    }
}

// ====================================
// FORMULARIO DE COTIZACIÓN (Páginas de servicio)
// ====================================

function initializeQuoteForm() {
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = quoteForm.querySelector('input[name="nombre"]');
            const email = quoteForm.querySelector('input[name="email"]');
            const telefono = quoteForm.querySelector('input[name="telefono"]');
            
            // Validación
            if (!nombre || !nombre.value.trim() || !email || !email.value.trim() || !telefono || !telefono.value.trim()) {
                showNotification('Por favor, completa todos los campos requeridos', 'error');
                return;
            }
            
            // Validar email
            if (!validarEmail(email.value)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'ENVIANDO...';
            submitBtn.disabled = true;
            
            // Simular envío
            setTimeout(() => {
                quoteForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showNotification('✓ Cotización enviada con éxito. Nos contactaremos en breve.', 'success');
            }, 1500);
        });
    }
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ====================================
// SISTEMA DE NOTIFICACIONES
// ====================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#FF6B6B' : '#2196F3'};
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        animation: slideUp 400ms ease-out;
        z-index: 2000;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 400ms ease-out forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Animación CSS para las notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ====================================
// SCROLL ANIMATIONS (Fade-in al scroll)
// ====================================

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 800ms ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos que queremos animar
    document.querySelectorAll('.service-card, .feature').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Agregar keyframe para fade-in
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyle);

observeElements();

// ====================================
// HEADER STICKY - Efecto de scroll
// ====================================

const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (header) {
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 30px rgba(26, 45, 64, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.97)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(26, 45, 64, 0.08)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ====================================
// EFECTO DE PARALLAX SUAVE EN EL HERO
// ====================================

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.shape');
    
    if (hero) {
        const heroRect = hero.getBoundingClientRect();
        const scrollProgress = 1 - (heroRect.bottom / window.innerHeight);
        
        if (scrollProgress >= 0 && scrollProgress <= 1) {
            const offset = scrollProgress * 100;
            shapes.forEach((shape, index) => {
                shape.style.transform = `translate(${offset * (index + 1) * 0.1}px, ${offset * (index + 1) * 0.15}px)`;
            });
        }
    }
});

// ====================================
// INTERACCIÓN CON BOTONES
// ====================================

document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (!this.type || this.type !== 'submit') {
            e.preventDefault();
            // Scroll a servicios
            const servicios = document.querySelector('#servicios');
            if (servicios) {
                servicios.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ====================================
// VALIDACIÓN DE INPUTS EN TIEMPO REAL
// ====================================

function setupFormValidation() {
    const inputs = document.querySelectorAll('.form__input, .form__textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderColor = '#FF6B6B';
            } else {
                input.style.borderColor = '#E0E0E0';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = '#CFAB5C';
        });
    });
}

setupFormValidation();

// ====================================
// EFECTO DE RIPPLE EN BOTONES
// ====================================

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple-animation 600ms ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
    });
});

// Agregar animación de ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ====================================
// INICIALIZACIÓN GENERAL
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando MSG Website...');
    
    initializeTheme();
    initializePresupuestoButton();
    initializeNavigation();
    initializeContactForm();
    initializeQuoteForm();
    
    console.log('✅ Tema: ' + (state.darkMode ? 'Oscuro' : 'Claro'));
    console.log('✅ Navegación: Funcional');
    console.log('✅ Formularios: Activos');
    console.log('%c🎉 MSG Website - Sistema completamente cargado', 'font-size: 16px; color: #CFAB5C; font-weight: bold;');
});

// Event listeners adicionales cuando todo carga
window.addEventListener('load', () => {
    console.log('✅ Todos los recursos cargados');
});
