// Cyber Guard Solutions - Integrated Frontend with API
class CyberGuardAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.endpoints = {
            contact: `${this.baseURL}/contact`,
            health: `${this.baseURL}/health`
        };
    }

    async makeRequest(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    async submitContact(formData) {
        return this.makeRequest(this.endpoints.contact, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    }

    async checkHealth() {
        return this.makeRequest(this.endpoints.health);
    }
}

// Main Application Class
class CyberGuardApp {
    constructor() {
        this.api = new CyberGuardAPI();
        this.init();
    }

    init() {
        this.initializeAOS();
        this.initializeEventListeners();
        this.initializePreloader();
        this.initializeNavigation();
        this.initializeFormHandling();
        this.initializeAnimations();
        this.checkBackendHealth();
    }

    initializeAOS() {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    initializeEventListeners() {
        // Mobile menu toggle
        document.querySelector('.hamburger').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScroll(anchor.getAttribute('href'));
            });
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Real-time form validation
        this.initializeFormValidation();
    }

    initializePreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.preloader').classList.add('fade-out');
                setTimeout(() => {
                    document.querySelector('.preloader').style.display = 'none';
                }, 500);
            }, 1500);
        });
    }

    initializeNavigation() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }

    smoothScroll(target) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            const offset = 80;
            const targetPosition = targetElement.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    initializeFormHandling() {
        this.contactForm = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submit-btn');
        this.formMessage = document.getElementById('form-message');
    }

    initializeFormValidation() {
        const form = document.getElementById('contactForm');
        const fields = ['name', 'email', 'message'];

        fields.forEach(field => {
            const input = document.getElementById(field);
            const error = document.getElementById(`${field}-error`);

            input.addEventListener('blur', () => {
                this.validateField(input, error);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(error);
            });
        });
    }

    validateField(input, errorElement) {
        const value = input.value.trim();
        const fieldName = input.getAttribute('name');

        this.clearFieldError(errorElement);

        if (!value) {
            this.showFieldError(errorElement, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        if (fieldName === 'email' && !this.isValidEmail(value)) {
            this.showFieldError(errorElement, 'Please enter a valid email address');
            return false;
        }

        if (fieldName === 'name' && value.length < 2) {
            this.showFieldError(errorElement, 'Name must be at least 2 characters long');
            return false;
        }

        if (fieldName === 'message' && value.length < 10) {
            this.showFieldError(errorElement, 'Message must be at least 10 characters long');
            return false;
        }

        return true;
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Full name',
            email: 'Email address',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    showFieldError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const isValid = this.validateForm(data);
        if (!isValid) return;

        // Show loading state
        this.setFormLoading(true);

        try {
            const result = await this.api.submitContact(data);
            
            this.showFormMessage('Thank you for your message! We will contact you soon.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage(
                error.message || 'Failed to send message. Please try again or contact us directly.', 
                'error'
            );
        } finally {
            this.setFormLoading(false);
        }
    }

    validateForm(data) {
        let isValid = true;
        const fields = ['name', 'email', 'message'];

        fields.forEach(field => {
            const input = document.getElementById(field);
            const error = document.getElementById(`${field}-error`);
            
            if (!this.validateField(input, error)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setFormLoading(loading) {
        const submitBtn = this.submitBtn;
        
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Security Request</span><i class="fas fa-paper-plane"></i>';
            submitBtn.style.opacity = '1';
        }
    }

    showFormMessage(message, type) {
        const messageElement = this.formMessage;
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    initializeAnimations() {
        // Counter animation for stats
        this.initializeCounterAnimation();
        
        // Parallax effect for hero section
        this.initializeParallax();
    }

    initializeCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        const statsSection = document.querySelector('.hero-stats');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters(counters);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters(counters) {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    initializeParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-background');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    async checkBackendHealth() {
        try {
            await this.api.checkHealth();
            console.log('Backend connection: ✅ Healthy');
        } catch (error) {
            console.warn('Backend connection: ❌ Unavailable - Running in offline mode');
            this.showOfflineWarning();
        }
    }

    showOfflineWarning() {
        // You can add a subtle offline indicator if needed
        const existingWarning = document.querySelector('.offline-warning');
        if (!existingWarning) {
            const warning = document.createElement('div');
            warning.className = 'offline-warning';
            warning.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ff6d00;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 10000;
                display: none;
            `;
            warning.textContent = '⚠️ Running in offline mode';
            document.body.appendChild(warning);
            
            // Show briefly then hide
            warning.style.display = 'block';
            setTimeout(() => {
                warning.style.display = 'none';
            }, 3000);
        }
    }
}

// Utility functions
const Utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberGuardApp();
});

// Error boundary for the application
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CyberGuardApp, CyberGuardAPI, Utils };
}