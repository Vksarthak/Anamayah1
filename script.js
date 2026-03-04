/* ========================================
   ANAMAYAH — Interactive Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar Scroll Effect ──
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.hero');

    const handleNavScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ── Mobile Menu Toggle ──
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ── Dropdown Toggle (Mobile) ──
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                trigger.closest('.nav-dropdown').classList.toggle('active');
            }
        });
    });

    // ── Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Scroll-Triggered Fade-In (Intersection Observer) ──
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for grid children
                const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                const delay = siblingIndex * 100;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ── Hero Particles ──
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = (50 + Math.random() * 50) + '%';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);

            // Remove after animation
            setTimeout(() => {
                particle.remove();
            }, 10000);
        };

        // Create initial burst
        for (let i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 200);
        }
        // Continuously create new particles
        setInterval(createParticle, 800);
    }

    // ── Contact Form Handling ──
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // Show loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            // Add Formspree-specific fields
            formData.append('_subject', 'New Inquiry from Anamayah Website — ' + (formData.get('service') || 'General'));
            formData.append('_replyto', formData.get('email'));

            try {
                const action = contactForm.getAttribute('action');
                const response = await fetch(action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showFormStatus('success', '✨ Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    if (result.errors) {
                        throw new Error(result.errors.map(e => e.message).join(', '));
                    }
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showFormStatus('error', '⚠️ Something went wrong. Please try again or email us directly at anamayah99@gmail.com.');
            } finally {
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    function showFormStatus(type, message) {
        formStatus.className = 'form-status ' + type;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 6000);
    }

    // ── Active Nav Highlight on Scroll ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

});
