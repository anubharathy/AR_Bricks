// AR Chamber Bricks Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Logo click functionality
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Update active nav link to home
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            const homeLink = document.querySelector('a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active link
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Button clicks for internal navigation
    const internalButtons = document.querySelectorAll('a[href^="#"]');
    internalButtons.forEach(button => {
        if (!button.classList.contains('nav__link') && !button.classList.contains('logo-link')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 80;
                        const targetPosition = targetSection.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Update active nav link
                        navLinks.forEach(navLink => navLink.classList.remove('active'));
                        const correspondingNavLink = document.querySelector(`.nav__link[href="${targetId}"]`);
                        if (correspondingNavLink) {
                            correspondingNavLink.classList.add('active');
                        }
                    }
                }
            });
        }
    });

    // Active Navigation Link Highlighting based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Header Background on Scroll
    function updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'var(--color-surface)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = 'none';
            }
        }
    }

    // Scroll Event Listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                updateActiveNavLink();
                updateHeaderBackground();
                animateOnScroll();
                scrollTimeout = null;
            }, 10);
        }
    });

    // Scroll Animation
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature__card, .process__step, .product__card, .application__item, .gallery__item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible && !element.classList.contains('fade-in')) {
                element.classList.add('fade-in');
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // Clear previous errors
            clearAllErrors();

            // Validate form
            if (validateForm(formData)) {
                setLoading(true);
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Thank you for your message! We will contact you soon.', 'success');
                    contactForm.reset();
                    setLoading(false);
                    console.log('Form submitted:', formData);
                }, 1000);
            } else {
                setLoading(false);
            }
        });
    }

    // Form Validation
    function validateForm(data) {
        let isValid = true;
        const errors = [];

        // Name validation
        if (!data.name || data.name.length < 2) {
            errors.push('Please enter a valid name (at least 2 characters)');
            highlightError('name');
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            errors.push('Please enter a valid phone number');
            highlightError('phone');
            isValid = false;
        }

        // Email validation (if provided)
        if (data.email && data.email.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push('Please enter a valid email address');
                highlightError('email');
                isValid = false;
            }
        }

        // Message validation
        if (!data.message || data.message.length < 10) {
            errors.push('Please enter a message (at least 10 characters)');
            highlightError('message');
            isValid = false;
        }

        // Show errors if any
        if (!isValid && errors.length > 0) {
            showNotification(errors.join('<br>'), 'error');
        }

        return isValid;
    }

    // Highlight form field errors
    function highlightError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = 'var(--color-error)';
            field.style.boxShadow = '0 0 0 3px rgba(192, 21, 47, 0.1)';
            field.classList.add('error');
        }
    }

    // Clear form field errors
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = 'var(--color-border)';
            field.style.boxShadow = 'none';
            field.classList.remove('error');
        }
    }

    // Clear all form errors
    function clearAllErrors() {
        const formFields = ['name', 'phone', 'email', 'message'];
        formFields.forEach(fieldId => clearError(fieldId));
    }

    // Show notification messages
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        let backgroundColor, borderColor, textColor;
        
        switch(type) {
            case 'success':
                backgroundColor = 'rgba(33, 128, 141, 0.1)';
                borderColor = 'rgba(33, 128, 141, 0.3)';
                textColor = 'var(--color-success)';
                break;
            case 'error':
                backgroundColor = 'rgba(192, 21, 47, 0.1)';
                borderColor = 'rgba(192, 21, 47, 0.3)';
                textColor = 'var(--color-error)';
                break;
            default:
                backgroundColor = 'rgba(98, 108, 113, 0.1)';
                borderColor = 'rgba(98, 108, 113, 0.3)';
                textColor = 'var(--color-info)';
        }

        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            background: ${backgroundColor};
            border: 1px solid ${borderColor};
            color: ${textColor};
        `;

        // Style the content
        const content = notification.querySelector('.notification__content');
        content.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
        `;

        // Style the close button
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: inherit;
            line-height: 1;
            padding: 0;
            margin-left: auto;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Close button functionality
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Loading state for contact form
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';

    function setLoading(loading) {
        if (submitButton) {
            if (loading) {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
            } else {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }
        }
    }

    // Gallery Placeholder Modal Functionality
    const galleryPlaceholders = document.querySelectorAll('.gallery-placeholder');
    
    galleryPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const imageName = this.getAttribute('data-image');
            const altText = this.querySelector('p').textContent;
            createPlaceholderModal(imageName, altText);
        });
    });

    // Create Placeholder Modal for Gallery
    function createPlaceholderModal(imageName, description) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal__backdrop">
                <div class="image-modal__content">
                    <div class="placeholder-modal-content">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                        </svg>
                        <h3>${description}</h3>
                        <p>Image: <strong>${imageName}</strong></p>
                        <p class="modal-note">This is a placeholder for the actual business photo that would be uploaded to the website.</p>
                    </div>
                    <button class="image-modal__close" aria-label="Close modal">&times;</button>
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1002;
            animation: fadeIn 0.3s ease-out;
            cursor: pointer;
            padding: 20px;
            box-sizing: border-box;
        `;

        const content = modal.querySelector('.image-modal__content');
        content.style.cssText = `
            position: relative;
            cursor: default;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        const placeholderContent = modal.querySelector('.placeholder-modal-content');
        placeholderContent.style.cssText = `
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            padding: 40px;
            text-align: center;
            color: var(--color-text);
            max-width: 500px;
            box-shadow: var(--shadow-lg);
        `;

        const svg = placeholderContent.querySelector('svg');
        svg.style.cssText = `
            color: var(--color-primary);
            margin-bottom: 20px;
        `;

        const heading = placeholderContent.querySelector('h3');
        heading.style.cssText = `
            color: var(--color-text);
            margin-bottom: 16px;
            font-size: var(--font-size-xl);
        `;

        const paragraphs = placeholderContent.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.cssText = `
                color: var(--color-text-secondary);
                margin: 8px 0;
                line-height: 1.5;
            `;
        });

        const note = placeholderContent.querySelector('.modal-note');
        note.style.cssText = `
            font-size: var(--font-size-sm);
            font-style: italic;
            color: var(--color-text-secondary);
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--color-border);
        `;

        const closeBtn = modal.querySelector('.image-modal__close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -15px;
            right: -15px;
            background: var(--color-error);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            color: white;
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, background-color 0.2s ease;
        `;

        document.body.appendChild(modal);

        // Close functionality
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.remove();
            document.body.style.overflow = 'auto';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });

        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Hover effect for close button
        closeBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = 'var(--color-red-500)';
        });

        closeBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = 'var(--color-error)';
        });
    }

    // Phone number click tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.textContent.trim();
            console.log(`Phone call initiated: ${phoneNumber}`);
            showNotification(`Calling ${phoneNumber}...`, 'info');
        });
    });

    // Intersection Observer for better scroll animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature__card, .process__step, .product__card, .application__item, .gallery__item');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Logo fallback handling
    const logoImg = document.querySelector('.logo');
    const logoFallback = document.querySelector('.logo-fallback');
    
    if (logoImg && logoFallback) {
        logoImg.addEventListener('error', function() {
            this.style.display = 'none';
            logoFallback.style.display = 'block';
        });
        
        // Check if logo loads successfully
        if (logoImg.complete && logoImg.naturalHeight === 0) {
            logoImg.style.display = 'none';
            logoFallback.style.display = 'block';
        }
    }

    // Initialize functions
    setTimeout(() => {
        animateOnScroll();
        updateActiveNavLink();
        updateHeaderBackground();
        
        // Set initial active nav link
        if (window.scrollY < 100) {
            const homeLink = document.querySelector('a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }, 100);

    // Performance optimization: Preload critical placeholders
    function setupImagePlaceholders() {
        const placeholders = document.querySelectorAll('.image-placeholder');
        placeholders.forEach(placeholder => {
            // Add interaction feedback
            placeholder.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--color-primary)';
                this.style.backgroundColor = 'var(--color-bg-1)';
            });
            
            placeholder.addEventListener('mouseleave', function() {
                this.style.borderColor = '';
                this.style.backgroundColor = '';
            });
        });
    }

    setupImagePlaceholders();

    console.log('AR Chamber Bricks website loaded successfully!');
    console.log('Features initialized:');
    console.log('- Logo with fallback text');
    console.log('- Mobile navigation');
    console.log('- Smooth scrolling navigation');
    console.log('- Form validation and submission');
    console.log('- Gallery placeholders with modal functionality');
    console.log('- YouTube video embed');
    console.log('- Updated contact information');
    console.log('- Image placeholders for business photos');
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if service worker is needed
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}