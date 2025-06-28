(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();

// Enhanced Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add smooth scrolling to all links with proper validation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Validate href is not empty or just "#"
            if (href && href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Enhanced button hover effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Card hover effects
    document.querySelectorAll('.card, .listing-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Form input focus effects
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .listing-card, .section').forEach(el => {
        observer.observe(el);
    });

    // Enhanced dropdown animations
    document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            const menu = this.nextElementSibling;
            if (menu.classList.contains('show')) {
                menu.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    menu.classList.remove('show');
                }, 300);
            } else {
                menu.classList.add('show');
                menu.style.animation = 'slideDown 0.3s ease-out';
            }
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax effect for hero sections
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add loading animations
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate elements in sequence
        const animatedElements = document.querySelectorAll('.animate-on-load');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 100);
        });
    });
});

// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    .focused .form-label {
        color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .animate-on-load {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }
    
    .animate-on-load.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .loaded .fade-in {
        animation: fadeIn 0.8s ease-out;
    }
    
    .parallax {
        transition: transform 0.1s ease-out;
    }
`;
document.head.appendChild(style);

// ===== ANIMATION SYSTEM =====
function initAnimations() {
    // Initialize scroll-triggered animations
    const scrollTriggers = document.querySelectorAll('.scroll-trigger');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    scrollTriggers.forEach(trigger => observer.observe(trigger));
    
    // Initialize hover animations
    const hoverElements = document.querySelectorAll('.hover-animate');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    });
    
    // Initialize click animations
    const clickElements = document.querySelectorAll('.click-animate');
    clickElements.forEach(element => {
        element.addEventListener('click', function(e) {
            createRipple(e, this);
            this.classList.add('click-active');
            setTimeout(() => {
                this.classList.remove('click-active');
            }, 300);
        });
    });
}

// ===== BASIC LOADER SYSTEM =====
function initLoader() {
    const loaderContainer = document.querySelector('.loader-container');
    
    if (loaderContainer) {
        // Show loader for minimum time
        setTimeout(() => {
            loaderContainer.classList.add('fade-out');
            setTimeout(() => {
                loaderContainer.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500);
        }, 1000);
    }
}

// ===== BASIC SCROLL EFFECTS =====
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== BASIC INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Add ripple effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                showLoading(submitBtn);
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== LOADING STATES =====
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// ===== SIMPLE DROPDOWN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DOM loaded, setting up dropdowns...');
    
    // Find the user dropdown
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    
    if (userDropdown && userDropdownMenu) {
        console.log('✅ User dropdown elements found');
        
        // Simple click handler for dropdown toggle
        userDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔍 User dropdown clicked!');
            
            // Toggle dropdown visibility
            const isVisible = userDropdownMenu.style.display === 'block';
            userDropdownMenu.style.display = isVisible ? 'none' : 'block';
            userDropdown.setAttribute('aria-expanded', !isVisible);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                userDropdownMenu.style.display = 'none';
                userDropdown.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Make dropdown items work
        const dropdownItems = userDropdownMenu.querySelectorAll('.dropdown-item');
        console.log('🔍 Found', dropdownItems.length, 'dropdown items');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                console.log('🔍 Dropdown item clicked:', this.textContent.trim());
                // Close dropdown
                userDropdownMenu.style.display = 'none';
                userDropdown.setAttribute('aria-expanded', 'false');
            });
        });
        
    } else {
        console.log('❌ User dropdown elements not found');
    }
    
    // Initialize all systems
    initLoader();
    initAnimations();
    initScrollEffects();
    initInteractiveElements();
    
    // Add loading class to body
    document.body.classList.add('loaded');
}); 