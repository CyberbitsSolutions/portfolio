/**
 * ==========================================================================
 * CYBERBIX TECHNOLOGIES - PREMIUM INTERACTIVE APPLICATION CODE
 * Features: Neural Network Particle Engine, Estimator Calculations,
 *           Counter Tickers, Form Interceptors, Scroll Observers
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. NEURAL PARTICLE CANVAS ENGINE
    // ==========================================================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 180 };

        // Resize handler
        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        }

        // Particle prototype
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseSize = Math.random() * 2 + 1;
                this.size = this.baseSize;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.color = '#00f2fe';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wall boundary checking
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse affinity interaction (gravity-like pull)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.hypot(dx, dy);

                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        this.x -= dx * force * 0.03;
                        this.y -= dy * force * 0.03;
                        this.size = this.baseSize + force * 2;
                        this.color = '#e100ff'; // Shifts color closer to magenta on mouse hover
                    } else {
                        this.size = this.baseSize;
                        this.color = '#00f2fe';
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.size > 2 ? 8 : 0;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow for line render speed
            }
        }

        function initParticles() {
            particles = [];
            // Densities based on screen dimension scale
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);
            for (let i = 0; i < Math.min(numberOfParticles, 120); i++) {
                particles.push(new Particle());
            }
        }

        // Connect adjacent points
        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.hypot(dx, dy);

                    if (distance < 110) {
                        let opacity = (110 - distance) / 110 * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect to mouse pointer
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = particles[a].x - mouse.x;
                    let dy = particles[a].y - mouse.y;
                    let distance = Math.hypot(dx, dy);

                    if (distance < mouse.radius) {
                        let opacity = (mouse.radius - distance) / mouse.radius * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(225, 0, 255, ${opacity})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }
        }

        // Mouse listeners
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw subtle matrix overlay
            ctx.fillStyle = 'rgba(5, 7, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }

    // ==========================================================================
    // 2. HEADER SCROLL STATE & MOBILE MENU NAV
    // ==========================================================================
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });

        // Autoclose navigation drawer upon link clicks
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
            });
        });
    }

    // Nav active node highlighters during scrolls
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. STATS COUNT TICKER
    // ==========================================================================
    const stats = document.querySelectorAll('.stat-num');
    let countersActive = false;

    function startCounters() {
        if (countersActive) return;
        countersActive = true;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-val'));
            const speed = 2000 / target; // Ticks complete in 2 seconds
            let current = 0;

            const ticker = setInterval(() => {
                current++;
                stat.innerText = current + (stat.parentNode.innerText.includes('Success') ? '%' : '+');
                if (current >= target) {
                    stat.innerText = target + (stat.parentNode.innerText.includes('Success') ? '%' : '+');
                    clearInterval(ticker);
                }
            }, speed);
        });
    }

    // ==========================================================================
    // 4. INTERACTIVE PROJECT ESTIMATOR
    // ==========================================================================
    const featuresList = {
        web: [
            { id: 'f-accounts', name: 'User Authentication System', price: 400, days: 5 },
            { id: 'f-api', name: 'Third-Party API Integration', price: 600, days: 8 },
            { id: 'f-analytics', name: 'Admin Analytics Dashboard', price: 500, days: 6 },
            { id: 'f-security', name: 'Advanced Cryptographic Security', price: 350, days: 4 }
        ],
        ecommerce: [
            { id: 'f-gateway', name: 'Secure Payment Processor Core', price: 300, days: 4 },
            { id: 'f-inventory', name: 'Real-time Stock Management Sync', price: 500, days: 7 },
            { id: 'f-loyalty', name: 'Discounts & Coupon Engines', price: 200, days: 3 },
            { id: 'f-multivendor', name: 'Multi-Vendor Marketplace Grid', price: 900, days: 12 }
        ],
        marketing: [
            { id: 'f-seo', name: 'Comprehensive SEO Structural Setup', price: 300, days: 5 },
            { id: 'f-ads', name: 'Multi-Network Campaign Launch', price: 400, days: 4 },
            { id: 'f-branding', name: 'Digital Identity Assets Pack', price: 250, days: 3 },
            { id: 'f-analytics4', name: 'Custom Tracking & GA4 Setups', price: 150, days: 2 }
        ],
        ai: [
            { id: 'f-chat', name: 'Intelligent Conversational Bot Core', price: 600, days: 8 },
            { id: 'f-vector', name: 'RAG Pipeline & Vector DB Connect', price: 700, days: 6 },
            { id: 'f-voice', name: 'Synthetic Speech Processing System', price: 800, days: 10 },
            { id: 'f-report', name: 'Automated Analytics Report Builder', price: 400, days: 5 }
        ]
    };

    const typeOptions = document.querySelectorAll('#estimator-types .estimator-card-option');
    const featuresContainer = document.getElementById('estimator-features');
    const speedSlider = document.getElementById('speed-slider');
    const valCostDisplay = document.getElementById('val-cost');
    const valTimeDisplay = document.getElementById('val-time');
    const btnLock = document.getElementById('btn-lock-estimator');

    let currentEstimator = {
        type: 'web',
        baseCost: 1200,
        baseDays: 20,
        featuresCost: 0,
        featuresDays: 0,
        speedMultiplier: 1.0,
        speedTimeMultiplier: 1.0,
        totalCost: 1200,
        totalDays: 20
    };

    // Render features dynamically based on selection
    function renderFeatures(type) {
        if (!featuresContainer) return;
        featuresContainer.innerHTML = '';
        const list = featuresList[type] || [];
        
        list.forEach(feat => {
            const label = document.createElement('label');
            label.className = 'estimator-check-label';
            label.setAttribute('for', feat.id);
            
            label.innerHTML = `
                <input type="checkbox" id="${feat.id}" data-price="${feat.price}" data-days="${feat.days}" class="feature-checkbox">
                <div class="estimator-custom-checkbox">
                    <i class="fa-solid fa-check"></i>
                </div>
                <span>${feat.name}</span>
            `;
            
            featuresContainer.appendChild(label);

            // Change event inside checkboxes
            const input = label.querySelector('input');
            input.addEventListener('change', () => {
                if (input.checked) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
                calculateEstimates();
            });
        });
        
        calculateEstimates();
    }

    // Estimator Formulas Core
    function calculateEstimates() {
        if (!featuresContainer) return;
        
        // Sum active checkboxes
        let featCost = 0;
        let featDays = 0;
        const checked = featuresContainer.querySelectorAll('.feature-checkbox:checked');
        checked.forEach(cb => {
            featCost += parseFloat(cb.getAttribute('data-price'));
            featDays += parseFloat(cb.getAttribute('data-days'));
        });

        currentEstimator.featuresCost = featCost;
        currentEstimator.featuresDays = featDays;

        // Speed sliders multipliers
        const speedValue = parseInt(speedSlider.value);
        const labels = document.querySelectorAll('.slider-labels span');
        labels.forEach(lbl => lbl.classList.remove('active'));
        
        const activeLabel = document.querySelector(`.slider-labels span[data-speed="${speedValue}"]`);
        if (activeLabel) {
            activeLabel.classList.add('active');
            currentEstimator.speedMultiplier = parseFloat(activeLabel.getAttribute('data-mult'));
            currentEstimator.speedTimeMultiplier = parseFloat(activeLabel.getAttribute('data-timemult'));
        }

        // Calculate Totals
        const rawCost = (currentEstimator.baseCost + currentEstimator.featuresCost) * currentEstimator.speedMultiplier;
        const rawDays = (currentEstimator.baseDays + currentEstimator.featuresDays) * currentEstimator.speedTimeMultiplier;
        
        currentEstimator.totalCost = Math.round(rawCost);
        currentEstimator.totalDays = Math.round(rawDays);

        // Smooth Counter Tick Animations
        animateMetricCounter(valCostDisplay, currentEstimator.totalCost, '$');
        animateMetricCounter(valTimeDisplay, currentEstimator.totalDays, '', ' Days');
    }

    function animateMetricCounter(element, target, prefix = '', suffix = '') {
        const currentVal = parseInt(element.innerText.replace(/[^0-9]/g, '')) || 0;
        if (currentVal === target) return;
        
        let start = currentVal;
        const duration = 400; // Counter locks in 400ms
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = (target - start) / steps;
        
        let currentStep = 0;
        const ticker = setInterval(() => {
            currentStep++;
            start += increment;
            element.innerText = prefix + Math.round(start) + suffix;
            
            if (currentStep >= steps) {
                element.innerText = prefix + target + suffix;
                clearInterval(ticker);
            }
        }, stepTime);
    }

    // Bind Category switch clicks
    if (typeOptions.length > 0) {
        typeOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                typeOptions.forEach(item => item.classList.remove('active'));
                opt.classList.add('active');
                
                currentEstimator.type = opt.getAttribute('data-type');
                currentEstimator.baseCost = parseFloat(opt.getAttribute('data-base-cost'));
                currentEstimator.baseDays = parseFloat(opt.getAttribute('data-base-days'));
                
                renderFeatures(currentEstimator.type);
            });
        });
        
        // Initial setup boot
        renderFeatures('web');
    }

    if (speedSlider) {
        speedSlider.addEventListener('input', calculateEstimates);
    }

    // Estimates Locking and Form Pre-population
    if (btnLock) {
        btnLock.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Gather selected names
            const features = [];
            const checked = featuresContainer.querySelectorAll('.feature-checkbox:checked');
            checked.forEach(cb => {
                const labelText = cb.parentElement.querySelector('span').innerText;
                features.push(labelText);
            });

            const typeName = document.querySelector('#estimator-types .estimator-card-option.active span').innerText;
            const speedName = document.querySelector('.slider-labels span.active').innerText;
            
            const scopeMessage = `Hello Cyberbix! I have generated a custom estimate using your online portal:
- Project Domain: ${typeName}
- Velocity Standard: ${speedName}
- Selected Integrations: ${features.length > 0 ? features.join(', ') : 'Base Package'}
---------------------------------------------
- Locked Cost Index: ${valCostDisplay.innerText}
- Targeted Scope timeframe: ${valTimeDisplay.innerText}

I want to initialize a session to consult on this structure.`;

            // Write to form
            const formMsg = document.getElementById('form-message');
            const formSubject = document.getElementById('form-subject');
            if (formMsg) {
                formMsg.value = scopeMessage;
                // Force label upward shift
                formMsg.setAttribute('placeholder', ' ');
            }
            if (formSubject) {
                formSubject.value = `Consult Request: Custom ${typeName}`;
            }

            // Scroll to form smoothly
            const contactSec = document.getElementById('contact');
            if (contactSec) {
                contactSec.scrollIntoView({ behavior: 'smooth' });
                showToast('Scope Locked!', 'Calculator settings populated into your form below.', 'fa-solid fa-calculator');
            }
        });
    }

    // ==========================================================================
    // 5. PORTFOLIO SHOWCASE FILTERS
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(item => item.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const categories = item.getAttribute('data-category').split(' ');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        item.classList.remove('hidden');
                        // Micro CSS scaling delay
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================================================
    // 6. SCROLL REVEAL (Intersection Observer)
    // ==========================================================================
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Activate tickers once Hero enters view
                    if (entry.target.classList.contains('hero-content')) {
                        setTimeout(startCounters, 500);
                    }
                    observer.unobserve(entry.target); // Unbind once animation fires
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ==========================================================================
    // 7. SECURE CONTACT FORM INTERCEPTOR
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit-form');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inputs check
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            
            let hasErrors = false;

            [nameInput, emailInput, messageInput].forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'rgba(239, 68, 68, 0.5)'; // Error Red
                    hasErrors = true;
                } else {
                    input.style.borderColor = '';
                }
            });

            // Basic email validation regex check
            if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                emailInput.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                hasErrors = true;
            }

            if (hasErrors) {
                showToast('Input Alert', 'Please complete the red highlighted elements before secure sending.', 'fa-solid fa-triangle-exclamation');
                return;
            }

            // Lock interface and show loading state
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Encrypting Scope Data...`;

            // Simulated transmission latency (1.5 seconds)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.innerHTML = originalBtnHtml;

                // Fire success notifications
                showToast('Request Connected!', 'Your scope parameters have reached the Cyberbix engineering queue.', 'fa-solid fa-shield-halved');
                
                // Clear Form inputs
                contactForm.reset();
                
                // Reset float labels placeholders
                document.querySelectorAll('.form-control').forEach(ctrl => {
                    ctrl.style.borderColor = '';
                });

            }, 1600);
        });

        // Instant reset highlighting upon typing
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }

    // ==========================================================================
    // 8. TOAST NOTIFICATION GENERATOR
    // ==========================================================================
    const toast = document.getElementById('system-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');
    let toastTimer;

    function showToast(title, message, iconClass = 'fa-solid fa-shield-halved') {
        if (!toast) return;

        // Clear active dismiss timers
        clearTimeout(toastTimer);

        toastTitle.innerText = title;
        toastMsg.innerText = message;
        toastIcon.className = iconClass;

        toast.classList.add('show');

        // Automatically hide in 5.5 seconds
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 5500);
    }
});
