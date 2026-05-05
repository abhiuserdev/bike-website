/**
 * TrailRide - Premium Bike Rental & Tours
 * High-Graphics Edition
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // PAGE LOADER
    // ========================================
    const pageLoader = document.getElementById('pageLoader');
    
    setTimeout(() => {
        if (pageLoader) {
            pageLoader.classList.add('hidden');
        }
    }, 1800);

    // ========================================
    // PARTICLE CANVAS BACKGROUND
    // ========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 
                    ? '193, 120, 23' // secondary
                    : '45, 90, 61';   // primary
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create particles
        const particleCount = window.innerWidth < 768 ? 25 : 50;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(193, 120, 23, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            drawConnections();
            animationId = requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animateParticles();
            }
        });
    }

    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // DATE INPUTS
    // ========================================
    const today = new Date().toISOString().split('T')[0];
    const pickupDate = document.getElementById('pickupDate');
    const dropoffDate = document.getElementById('dropoffDate');
    
    if (pickupDate) {
        pickupDate.setAttribute('min', today);
        pickupDate.value = today;
    }
    if (dropoffDate) {
        dropoffDate.setAttribute('min', today);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dropoffDate.value = tomorrow.toISOString().split('T')[0];
    }

    const bookPickup = document.getElementById('bookPickup');
    const bookDropoff = document.getElementById('bookDropoff');
    
    if (bookPickup) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        bookPickup.value = now.toISOString().slice(0, 16);
    }
    if (bookDropoff) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
        bookDropoff.value = tomorrow.toISOString().slice(0, 16);
    }

    // ========================================
    // ANIMATED COUNTERS
    // ========================================
    function animateCounter(element, target, duration = 2000, suffix = '') {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString() + suffix;
            }
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.target);
                const suffix = element.nextElementSibling && element.nextElementSibling.textContent.includes('%') ? '%' : '+';
                
                if (suffix === '%') {
                    animateCounter(element, target, 2000, '%');
                } else if (target > 1000) {
                    animateCounter(element, target, 2500, '+');
                } else {
                    animateCounter(element, target, 2000, '');
                }
                
                counterObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.bike-card, .tour-card, .review-card, .blog-card, .policy-card, .faq-item, .timeline-step').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Stagger delay for cards
    document.querySelectorAll('.bike-categories, .tours-grid, .reviews-grid, .blog-grid, .policy-info').forEach(container => {
        const children = container.querySelectorAll('.bike-card, .tour-card, .review-card, .blog-card, .policy-card');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // ========================================
    // PARALLAX EFFECT
    // ========================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.video-background video, .cta-bg img');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Hero shapes parallax
        document.querySelectorAll('.hero-shapes .shape').forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ========================================
    // PRICING TABS
    // ========================================
    document.querySelectorAll('.bike-card').forEach(card => {
        const tabs = card.querySelectorAll('.price-tab');
        const priceAmount = card.querySelector('.price-amount');
        const pricePeriod = card.querySelector('.price-period');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const period = tab.dataset.period;
                priceAmount.style.opacity = '0';
                priceAmount.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    priceAmount.textContent = priceAmount.dataset[period];
                    priceAmount.style.opacity = '1';
                    priceAmount.style.transform = 'translateY(0)';
                }, 200);
                
                const periodText = { hourly: '/hour', daily: '/day', weekly: '/week' };
                pricePeriod.textContent = periodText[period];
            });
        });
    });

    // ========================================
    // TOUR GALLERY
    // ========================================
    document.querySelectorAll('.tour-card').forEach(card => {
        const mainImage = card.querySelector('.gallery-main img');
        const thumbs = card.querySelectorAll('.gallery-thumbs img');
        
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = thumb.dataset.full;
                    mainImage.style.opacity = '1';
                }, 200);
            });
        });
    });

    // ========================================
    // BOOKING ENGINE
    // ========================================
    const bikePrices = {
        city: { hourly: 12, daily: 35, weekly: 180 },
        mountain: { hourly: 18, daily: 55, weekly: 280 },
        ebike: { hourly: 25, daily: 75, weekly: 380 },
        tandem: { hourly: 22, daily: 65, weekly: 320 },
        kids: { hourly: 8, daily: 22, weekly: 110 },
        road: { hourly: 35, daily: 95, weekly: 450 }
    };

    let bookingData = {
        bike: null,
        period: 'hourly',
        duration: 1,
        addons: [],
        basePrice: 0,
        total: 0
    };

    // Step 1: Check Availability
    const checkAvailabilityBtn = document.getElementById('checkAvailability');
    const availabilityStatus = document.getElementById('availabilityStatus');
    
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('click', () => {
            const bikeType = document.getElementById('bookBikeType').value;
            const pickup = document.getElementById('bookPickup').value;
            const dropoff = document.getElementById('bookDropoff').value;
            
            if (!bikeType || !pickup || !dropoff) {
                availabilityStatus.className = 'availability-status unavailable';
                availabilityStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all fields';
                availabilityStatus.style.display = 'block';
                return;
            }
            
            availabilityStatus.className = 'availability-status';
            availabilityStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking availability...';
            availabilityStatus.style.display = 'block';
            
            setTimeout(() => {
                const isAvailable = Math.random() > 0.1;
                
                if (isAvailable) {
                    availabilityStatus.className = 'availability-status available';
                    availabilityStatus.innerHTML = '<i class="fas fa-check-circle"></i> Bike available! Continue to add extras.';
                    
                    const period = document.getElementById('bookPeriod').value;
                    const start = new Date(pickup);
                    const end = new Date(dropoff);
                    const hours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
                    
                    let duration = hours;
                    if (period === 'daily') duration = Math.max(1, Math.ceil(hours / 24));
                    if (period === 'weekly') duration = Math.max(1, Math.ceil(hours / (24 * 7)));
                    
                    bookingData.bike = bikeType;
                    bookingData.period = period;
                    bookingData.duration = duration;
                    bookingData.basePrice = bikePrices[bikeType][period] * duration;
                    
                    setTimeout(() => {
                        goToStep(2);
                        updateBookingTotal();
                    }, 800);
                } else {
                    availabilityStatus.className = 'availability-status unavailable';
                    availabilityStatus.innerHTML = '<i class="fas fa-times-circle"></i> Sorry, this bike is not available for the selected dates. Try different dates or another bike.';
                }
            }, 1200);
        });
    }

    // Step 2: Upsells
    document.querySelectorAll('.upsell-check').forEach(check => {
        check.addEventListener('change', updateBookingTotal);
    });

    function updateBookingTotal() {
        let addonTotal = 0;
        const selectedAddons = [];
        
        document.querySelectorAll('.upsell-check').forEach(check => {
            if (check.checked) {
                const item = check.closest('.upsell-item');
                const price = parseInt(item.dataset.price);
                addonTotal += price;
                selectedAddons.push({
                    name: item.querySelector('h4').textContent,
                    price: price
                });
            }
        });
        
        bookingData.addons = selectedAddons;
        bookingData.total = bookingData.basePrice + addonTotal;
        
        const basePriceEl = document.getElementById('basePrice');
        const addonPriceEl = document.getElementById('addonPrice');
        const totalPriceEl = document.getElementById('totalPrice');
        
        if (basePriceEl) basePriceEl.textContent = '$' + bookingData.basePrice;
        if (addonPriceEl) addonPriceEl.textContent = '$' + addonTotal;
        if (totalPriceEl) totalPriceEl.textContent = '$' + bookingData.total;
    }

    const toStep3Btn = document.getElementById('toStep3');
    const confirmBookingBtn = document.getElementById('confirmBooking');
    const newBookingBtn = document.getElementById('newBooking');
    
    if (toStep3Btn) toStep3Btn.addEventListener('click', () => goToStep(3));
    
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', () => {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const waiver = document.getElementById('waiverAgree').checked;
            
            if (!firstName || !lastName || !email) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!waiver) {
                alert('Please agree to the waiver terms to proceed.');
                return;
            }
            
            generateQRCode();
            goToStep(4);
        });
    }
    
    if (newBookingBtn) {
        newBookingBtn.addEventListener('click', () => {
            document.getElementById('bookBikeType').value = '';
            document.getElementById('bookPeriod').value = 'hourly';
            document.querySelectorAll('.upsell-check').forEach(c => c.checked = false);
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('emergency').value = '';
            document.getElementById('waiverAgree').checked = false;
            document.getElementById('uploadPreview').innerHTML = '';
            document.getElementById('uploadPreview').classList.remove('active');
            if (availabilityStatus) availabilityStatus.style.display = 'none';
            
            goToStep(1);
        });
    }

    function goToStep(step) {
        document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
        document.getElementById('step' + step).classList.add('active');
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Generate QR Code
    function generateQRCode() {
        const qrContainer = document.getElementById('qrCode');
        const details = document.getElementById('confirmationDetails');
        const bookingId = 'TR-' + Date.now().toString(36).toUpperCase();
        
        qrContainer.innerHTML = '';
        const canvasEl = document.createElement('canvas');
        canvasEl.width = 160;
        canvasEl.height = 160;
        const ctx = canvasEl.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 160, 160);
        
        const cellSize = 8;
        const pattern = generateQRPattern(20);
        
        ctx.fillStyle = '#1a1a1a';
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                if (pattern[y][x]) {
                    ctx.fillRect(x * cellSize + 8, y * cellSize + 8, cellSize, cellSize);
                }
            }
        }
        
        drawPositionMarker(ctx, 8, 8, cellSize);
        drawPositionMarker(ctx, 120, 8, cellSize);
        drawPositionMarker(ctx, 8, 120, cellSize);
        
        qrContainer.appendChild(canvasEl);
        
        const bikeNames = {
            city: 'City Bike', mountain: 'Mountain Bike', ebike: 'E-Bike',
            tandem: 'Tandem', kids: 'Kids Bike', road: 'Premium Road Bike'
        };
        
        details.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.95rem;">
                <div><strong>Booking ID:</strong> ${bookingId}</div>
                <div><strong>Bike:</strong> ${bikeNames[bookingData.bike] || 'N/A'}</div>
                <div><strong>Period:</strong> ${bookingData.period}</div>
                <div><strong>Total:</strong> $${bookingData.total}</div>
                <div><strong>Name:</strong> ${document.getElementById('firstName').value} ${document.getElementById('lastName').value}</div>
                <div><strong>Pickup:</strong> ${formatDate(document.getElementById('bookPickup').value)}</div>
            </div>
        `;
    }

    function generateQRPattern(size) {
        const pattern = [];
        const seed = Date.now();
        
        for (let y = 0; y < size; y++) {
            pattern[y] = [];
            for (let x = 0; x < size; x++) {
                if ((x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)) {
                    pattern[y][x] = false;
                    continue;
                }
                const val = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
                pattern[y][x] = (val - Math.floor(val)) > 0.5;
            }
        }
        return pattern;
    }

    function drawPositionMarker(ctx, x, y, size) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x, y, size * 7, size * 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size, y + size, size * 5, size * 5);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + size * 2, y + size * 2, size * 3, size * 3);
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // ========================================
    // FILE UPLOAD
    // ========================================
    const uploadZone = document.getElementById('uploadZone');
    const idUpload = document.getElementById('idUpload');
    const uploadPreview = document.getElementById('uploadPreview');
    
    if (uploadZone && idUpload) {
        uploadZone.addEventListener('click', () => idUpload.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--primary)';
            uploadZone.style.background = 'var(--accent)';
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.style.borderColor = '';
            uploadZone.style.background = '';
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '';
            uploadZone.style.background = '';
            const files = e.dataTransfer.files;
            if (files.length) handleFileUpload(files[0]);
        });
        
        idUpload.addEventListener('change', () => {
            if (idUpload.files.length) handleFileUpload(idUpload.files[0]);
        });
    }
    
    function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadPreview.innerHTML = `<img src="${e.target.result}" alt="ID Preview">`;
            uploadPreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ========================================
    // WEATHER WIDGET
    // ========================================
    function updateWeather() {
        const conditions = [
            { temp: 72, condition: 'Sunny', icon: 'fa-sun', wind: '8 mph', humidity: '45%', vis: '10 mi' },
            { temp: 68, condition: 'Partly Cloudy', icon: 'fa-cloud-sun', wind: '12 mph', humidity: '52%', vis: '8 mi' },
            { temp: 75, condition: 'Clear', icon: 'fa-sun', wind: '6 mph', humidity: '40%', vis: '12 mi' },
            { temp: 65, condition: 'Cloudy', icon: 'fa-cloud', wind: '10 mph', humidity: '60%', vis: '7 mi' }
        ];
        
        const hour = new Date().getHours();
        const weather = conditions[hour % conditions.length];
        
        const tempEl = document.getElementById('weatherTemp');
        const conditionEl = document.getElementById('weatherCondition');
        const windEl = document.getElementById('weatherWind');
        const humidityEl = document.getElementById('weatherHumidity');
        const visEl = document.getElementById('weatherVis');
        
        if (tempEl) tempEl.textContent = weather.temp + '°F';
        if (conditionEl) conditionEl.innerHTML = `<i class="fas ${weather.icon}"></i><span>${weather.condition}</span>`;
        if (windEl) windEl.textContent = weather.wind;
        if (humidityEl) humidityEl.textContent = weather.humidity;
        if (visEl) visEl.textContent = weather.vis;
    }
    
    updateWeather();

    // ========================================
    // SEARCH & BOOKING BUTTONS
    // ========================================
    document.getElementById('searchBikes')?.addEventListener('click', () => {
        const bikeType = document.getElementById('bikeType').value;
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        if (bikeType) {
            setTimeout(() => document.getElementById('bookBikeType').value = bikeType, 500);
        }
    });

    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', () => {
            const bikeType = btn.dataset.bike;
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => document.getElementById('bookBikeType').value = bikeType, 500);
        });
    });

    document.querySelectorAll('.btn-book-tour').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => alert('Tour booking: Our team will contact you within 24 hours to confirm your tour reservation!'), 500);
        });
    });

    // ========================================
    // LOCATION CARD INTERACTION
    // ========================================
    document.querySelectorAll('.location-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.location-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // ========================================
    // INSTAGRAM FEED INTERACTION
    // ========================================
    document.querySelectorAll('.insta-post').forEach(post => {
        post.addEventListener('click', () => {
            alert('Opening Instagram post... #TrailRideAdventures');
        });
    });

    // ========================================
    // FORM VALIDATION
    // ========================================
    document.querySelectorAll('.booking-form input, .booking-form select').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) input.style.borderColor = 'var(--primary)';
            else if (input.required) input.style.borderColor = '#dc3545';
        });
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--primary)';
        });
    });

    // ========================================
    // CHAT WIDGET
    // ========================================
    const chatToggle = document.getElementById('chatToggle');
    const chatClose = document.getElementById('chatClose');
    const chatPanel = document.getElementById('chatPanel');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const chatBadge = document.getElementById('chatBadge');

    let chatOpen = false;
    let badgeCount = 1;

    function toggleChat() {
        chatOpen = !chatOpen;
        chatPanel.classList.toggle('active', chatOpen);
        if (chatOpen) {
            chatBadge.style.display = 'none';
            badgeCount = 0;
            chatInput.focus();
        }
    }

    chatToggle?.addEventListener('click', toggleChat);
    chatClose?.addEventListener('click', toggleChat);

    document.querySelectorAll('.quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            sendUserMessage(question);
            generateBotReply(question);
        });
    });

    chatSend?.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
            sendUserMessage(text);
            generateBotReply(text);
            chatInput.value = '';
        }
    });

    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = chatInput.value.trim();
            if (text) {
                sendUserMessage(text);
                generateBotReply(text);
                chatInput.value = '';
            }
        }
    });

    function sendUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message user';
        msg.innerHTML = `
            <div class="chat-bubble"><p>${escapeHtml(text)}</p></div>
            <span class="chat-time">${formatTime()}</span>
        `;
        chatMessages.appendChild(msg);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'chat-message bot typing';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        chatMessages.appendChild(typing);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        document.getElementById('typingIndicator')?.remove();
    }

    function sendBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message bot';
        msg.innerHTML = `
            <div class="chat-bubble"><p>${text}</p></div>
            <span class="chat-time">${formatTime()}</span>
        `;
        chatMessages.appendChild(msg);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime() {
        return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    const botResponses = {
        'bike': `We have 6 types of bikes available:<br><br>• <strong>City Bikes</strong> – Comfortable cruisers ($12/hr)<br>• <strong>Mountain Bikes</strong> – Full-suspension trail bikes ($18/hr)<br>• <strong>E-Bikes</strong> – Electric assist, 80km range ($25/hr)<br>• <strong>Tandems</strong> – Perfect for couples ($22/hr)<br>• <strong>Kids Bikes</strong> – Ages 4-12 ($8/hr)<br>• <strong>Premium Road Bikes</strong> – Carbon fiber ($35/hr)<br><br>All rentals include a helmet, lock, and route map!`,

        'cost': `Our pricing is flexible:<br><br><strong>City Bikes:</strong> $12/hr | $35/day | $180/week<br><strong>Mountain:</strong> $18/hr | $55/day | $280/week<br><strong>E-Bikes:</strong> $25/hr | $75/day | $380/week<br><strong>Tandems:</strong> $22/hr | $65/day | $320/week<br><strong>Kids:</strong> $8/hr | $22/day | $110/week<br><strong>Road:</strong> $35/hr | $95/day | $450/week<br><br>Add-ons: GPS ($15), GoPro ($25), Snacks ($12), Insurance ($8+)`,

        'book': `You can book right here on our website! Walk-ins are welcome, but we <strong>strongly recommend booking ahead</strong> — especially on weekends. Our premium road bikes and e-bikes often sell out 2-3 days in advance.`,

        'advance': `Walk-ins are welcome, but we <strong>strongly recommend booking ahead</strong> — especially on weekends and holidays. Our premium road bikes and e-bikes often sell out 2-3 days in advance.`,

        'hour': `Our hours vary by location:<br><br><strong>Downtown Main Station:</strong> 7:00 AM – 9:00 PM<br><strong>Parkside Hub:</strong> 8:00 AM – 7:00 PM<br><strong>Beachfront Station:</strong> 6:00 AM – 10:00 PM<br><strong>Mountain Base Camp:</strong> 7:00 AM – 6:00 PM`,

        'tour': `Yes! We offer 3 amazing guided tours:<br><br>🌅 <strong>Coastal Sunset Cruise</strong> (Easy, 3 hrs) – $45/person<br>🌲 <strong>Forest Trail Explorer</strong> (Moderate, 4 hrs) – $65/person<br>⛰️ <strong>Mountain Summit Challenge</strong> (Advanced, 6 hrs) – $95/person<br><br>Private tours available!`,

        'rain': `We have a flexible weather policy:<br><br>🌧️ <strong>Free rescheduling or cancellation</strong> if severe weather<br>🧥 Free ponchos for light rain<br>💰 Prorated refund if you return early due to rain<br><br>Many riders love the trails in misty conditions!`,

        'insurance': `Basic liability is included. Full coverage is available:<br><br>• Covers damage, theft, and liability<br>• Prices vary by bike type ($3–$15)<br>• <strong>Highly recommended</strong> for premium bikes<br><br>You can add it during booking!`,

        'helmet': `Yes! A <strong>helmet is included free</strong> with every rental. We have helmets in all sizes from toddler to XL adult. Our staff will help you get a proper fit during pickup.`,

        'age': `Our age requirements:<br><br>• <strong>18+</strong> to rent independently<br>• <strong>16–17</strong> can rent with a parent/guardian<br>• <strong>Kids bikes</strong> for ages 4+, rented by an adult<br><br>The whole family can ride together!`,

        'location': `We have 4 convenient stations:<br><br>📍 <strong>Main Station – Downtown</strong><br>📍 <strong>Parkside Hub</strong><br>📍 <strong>Beachfront Station</strong><br>📍 <strong>Mountain Base Camp</strong><br><br>Pick up at one and return to <strong>any other for free</strong>!`,

        'return': `You can return your bike to <strong>any of our 4 stations</strong> at no extra charge. We have a 30-minute grace period, and secure after-hours drop boxes at all locations.`,

        'flat': `Don't worry — every rental includes:<br><br>🔧 Puncture repair kit and pump<br>📞 24/7 support line<br>🔄 <strong>Free bike swap</strong> at nearest station<br><br>Most flats take under 5 minutes to fix!`,

        'discount': `Ways to save:<br><br>• <strong>Weekly rates</strong> save up to 30%<br>• <strong>Group bookings</strong> of 4+ get 10% off<br>• <strong>Photo contest</strong> — win free rentals!<br>• Follow us on Instagram for promo codes<br><br>Use code <strong>TRAIL10</strong> for 10% off your first ride!`,

        'contact': `Reach us anytime:<br><br>📞 <strong>Phone:</strong> (555) 123-RIDE<br>✉️ <strong>Email:</strong> hello@trailride.com<br>💬 <strong>Chat:</strong> Right here, 24/7!`,

        'default': `Great question! I recommend checking our FAQ section, or chat with our team. You can also call <strong>(555) 123-RIDE</strong> or email <strong>hello@trailride.com</strong>.<br><br>What would you like to explore?`
    };

    function generateBotReply(userText) {
        const lower = userText.toLowerCase();
        let responseKey = 'default';
        
        if (lower.match(/bike|rental|fleet|type|ride/)) responseKey = 'bike';
        else if (lower.match(/cost|price|much\s*\$|how\s+much|fee/)) responseKey = 'cost';
        else if (lower.match(/book|reserve|availability/)) responseKey = 'book';
        else if (lower.match(/advance|ahead|early|reservation/)) responseKey = 'advance';
        else if (lower.match(/hour|open|close|time|when/)) responseKey = 'hour';
        else if (lower.match(/tour|guide|guided/)) responseKey = 'tour';
        else if (lower.match(/rain|weather|cancel/)) responseKey = 'rain';
        else if (lower.match(/insurance|cover|damage|theft/)) responseKey = 'insurance';
        else if (lower.match(/helmet|safety|gear/)) responseKey = 'helmet';
        else if (lower.match(/age|kid|child|teen|old/)) responseKey = 'age';
        else if (lower.match(/location|station|where|address|find/)) responseKey = 'location';
        else if (lower.match(/return|drop|late/)) responseKey = 'return';
        else if (lower.match(/flat|tire|puncture|break/)) responseKey = 'flat';
        else if (lower.match(/discount|deal|save|cheap|offer|promo/)) responseKey = 'discount';
        else if (lower.match(/contact|call|email|phone|reach/)) responseKey = 'contact';
        
        showTypingIndicator();
        
        const delay = Math.min(1500, 800 + botResponses[responseKey].length * 8);
        
        setTimeout(() => {
            removeTypingIndicator();
            sendBotMessage(botResponses[responseKey]);
            
            if (!chatOpen) {
                badgeCount++;
                chatBadge.textContent = badgeCount;
                chatBadge.style.display = 'flex';
            }
        }, delay);
    }

    console.log('TrailRide High-Graphics Edition initialized!');
});
