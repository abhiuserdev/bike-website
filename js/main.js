/**
 * TrailRide - Bike Rental & Tours
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
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
    // DATE INPUTS - Set min date to today
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

    // Set booking form dates
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
    // PRICING TABS
    // ========================================
    const bikeCards = document.querySelectorAll('.bike-card');
    
    bikeCards.forEach(card => {
        const tabs = card.querySelectorAll('.price-tab');
        const priceAmount = card.querySelector('.price-amount');
        const pricePeriod = card.querySelector('.price-period');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                tab.classList.add('active');
                
                // Update price
                const period = tab.dataset.period;
                priceAmount.textContent = priceAmount.dataset[period];
                
                // Update period text
                const periodText = {
                    'hourly': '/hour',
                    'daily': '/day',
                    'weekly': '/week'
                };
                pricePeriod.textContent = periodText[period];
            });
        });
    });

    // ========================================
    // TOUR GALLERY
    // ========================================
    const tourCards = document.querySelectorAll('.tour-card');
    
    tourCards.forEach(card => {
        const mainImage = card.querySelector('.gallery-main img');
        const thumbs = card.querySelectorAll('.gallery-thumbs img');
        
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active from all thumbs
                thumbs.forEach(t => t.classList.remove('active'));
                // Add active to clicked thumb
                thumb.classList.add('active');
                // Update main image
                mainImage.src = thumb.dataset.full;
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
                return;
            }
            
            // Simulate availability check
            availabilityStatus.className = 'availability-status';
            availabilityStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking availability...';
            availabilityStatus.style.display = 'block';
            
            setTimeout(() => {
                const isAvailable = Math.random() > 0.1; // 90% availability
                
                if (isAvailable) {
                    availabilityStatus.className = 'availability-status available';
                    availabilityStatus.innerHTML = '<i class="fas fa-check-circle"></i> Bike available! Continue to add extras.';
                    
                    // Calculate duration and base price
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
                    
                    // Move to step 2 after short delay
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
    const upsellChecks = document.querySelectorAll('.upsell-check');
    
    upsellChecks.forEach(check => {
        check.addEventListener('change', updateBookingTotal);
    });

    function updateBookingTotal() {
        let addonTotal = 0;
        const selectedAddons = [];
        
        upsellChecks.forEach(check => {
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
        
        // Update display
        const basePriceEl = document.getElementById('basePrice');
        const addonPriceEl = document.getElementById('addonPrice');
        const totalPriceEl = document.getElementById('totalPrice');
        
        if (basePriceEl) basePriceEl.textContent = '$' + bookingData.basePrice;
        if (addonPriceEl) addonPriceEl.textContent = '$' + addonTotal;
        if (totalPriceEl) totalPriceEl.textContent = '$' + bookingData.total;
    }

    // Navigation between steps
    const toStep3Btn = document.getElementById('toStep3');
    const confirmBookingBtn = document.getElementById('confirmBooking');
    const newBookingBtn = document.getElementById('newBooking');
    
    if (toStep3Btn) {
        toStep3Btn.addEventListener('click', () => goToStep(3));
    }
    
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
            // Reset form
            document.getElementById('bookBikeType').value = '';
            document.getElementById('bookPeriod').value = 'hourly';
            upsellChecks.forEach(c => c.checked = false);
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('emergency').value = '';
            document.getElementById('waiverAgree').checked = false;
            document.getElementById('uploadPreview').innerHTML = '';
            document.getElementById('uploadPreview').classList.remove('active');
            availabilityStatus.style.display = 'none';
            
            goToStep(1);
        });
    }

    function goToStep(step) {
        document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
        document.getElementById('step' + step).classList.add('active');
        
        // Scroll to booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Generate QR Code (using canvas)
    function generateQRCode() {
        const qrContainer = document.getElementById('qrCode');
        const details = document.getElementById('confirmationDetails');
        const bookingId = 'TR-' + Date.now().toString(36).toUpperCase();
        
        // Create canvas-based QR pattern
        qrContainer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 160, 160);
        
        // Generate pseudo-random QR pattern
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
        
        // Add position markers (corners)
        drawPositionMarker(ctx, 8, 8, cellSize);
        drawPositionMarker(ctx, 120, 8, cellSize);
        drawPositionMarker(ctx, 8, 120, cellSize);
        
        qrContainer.appendChild(canvas);
        
        // Booking details
        const bikeNames = {
            city: 'City Bike',
            mountain: 'Mountain Bike',
            ebike: 'E-Bike',
            tandem: 'Tandem',
            kids: 'Kids Bike',
            road: 'Premium Road Bike'
        };
        
        details.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.9rem;">
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
                // Position markers (corners) - leave empty
                if ((x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)) {
                    pattern[y][x] = false;
                    continue;
                }
                
                // Pseudo-random based on position
                const val = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
                pattern[y][x] = (val - Math.floor(val)) > 0.5;
            }
        }
        
        return pattern;
    }

    function drawPositionMarker(ctx, x, y, size) {
        ctx.fillStyle = '#1a1a1a';
        // Outer square
        ctx.fillRect(x, y, size * 7, size * 7);
        // Inner white square
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size, y + size, size * 5, size * 5);
        // Center square
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
            if (files.length) {
                handleFileUpload(files[0]);
            }
        });
        
        idUpload.addEventListener('change', () => {
            if (idUpload.files.length) {
                handleFileUpload(idUpload.files[0]);
            }
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
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ========================================
    // WEATHER WIDGET
    // ========================================
    function updateWeather() {
        const conditions = [
            { temp: 72, condition: 'Sunny', icon: 'fa-sun', wind: '8 mph', humidity: '45%' },
            { temp: 68, condition: 'Partly Cloudy', icon: 'fa-cloud-sun', wind: '12 mph', humidity: '52%' },
            { temp: 75, condition: 'Clear', icon: 'fa-sun', wind: '6 mph', humidity: '40%' },
            { temp: 65, condition: 'Cloudy', icon: 'fa-cloud', wind: '10 mph', humidity: '60%' }
        ];
        
        // Simulate different weather based on time of day
        const hour = new Date().getHours();
        const weather = conditions[hour % conditions.length];
        
        const tempEl = document.getElementById('weatherTemp');
        const conditionEl = document.getElementById('weatherCondition');
        const windEl = document.getElementById('weatherWind');
        const humidityEl = document.getElementById('weatherHumidity');
        
        if (tempEl) tempEl.textContent = weather.temp + '°F';
        if (conditionEl) {
            conditionEl.innerHTML = `<i class="fas ${weather.icon}"></i><span>${weather.condition}</span>`;
        }
        if (windEl) windEl.textContent = weather.wind;
        if (humidityEl) humidityEl.textContent = weather.humidity;
    }
    
    updateWeather();

    // ========================================
    // SEARCH WIDGET - "Book Now" buttons
    // ========================================
    const searchBikesBtn = document.getElementById('searchBikes');
    
    if (searchBikesBtn) {
        searchBikesBtn.addEventListener('click', () => {
            const bikeType = document.getElementById('bikeType').value;
            const height = document.getElementById('riderHeight').value;
            
            // Scroll to booking section with pre-selected bike
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            // Pre-select bike type if chosen
            if (bikeType) {
                setTimeout(() => {
                    document.getElementById('bookBikeType').value = bikeType;
                }, 500);
            }
        });
    }

    // Bike card "Book Now" buttons
    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', () => {
            const bikeType = btn.dataset.bike;
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                document.getElementById('bookBikeType').value = bikeType;
            }, 500);
        });
    });

    // Tour "Book This Tour" buttons
    document.querySelectorAll('.btn-book-tour').forEach(btn => {
        btn.addEventListener('click', () => {
            const tour = btn.dataset.tour;
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            // Could pre-populate tour-specific info here
            setTimeout(() => {
                alert('Tour booking: Our team will contact you within 24 hours to confirm your tour reservation!');
            }, 500);
        });
    });

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for fade-in animation
    document.querySelectorAll('.bike-card, .tour-card, .review-card, .blog-card, .policy-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========================================
    // INSTAGRAM FEED INTERACTION
    // ========================================
    document.querySelectorAll('.insta-post').forEach(post => {
        post.addEventListener('click', () => {
            // Simulate opening Instagram
            alert('Opening Instagram post... #TrailRideAdventures');
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
    // FORM VALIDATION VISUAL FEEDBACK
    // ========================================
    document.querySelectorAll('.booking-form input, .booking-form select').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) {
                input.style.borderColor = 'var(--primary)';
            } else if (input.required) {
                input.style.borderColor = '#dc3545';
            }
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
    const quickReplies = document.querySelectorAll('.quick-reply');

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

    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (chatClose) chatClose.addEventListener('click', toggleChat);

    // Quick reply buttons
    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            sendUserMessage(question);
            generateBotReply(question);
        });
    });

    // Send on button click
    if (chatSend) {
        chatSend.addEventListener('click', () => {
            const text = chatInput.value.trim();
            if (text) {
                sendUserMessage(text);
                generateBotReply(text);
                chatInput.value = '';
            }
        });
    }

    // Send on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = chatInput.value.trim();
                if (text) {
                    sendUserMessage(text);
                    generateBotReply(text);
                    chatInput.value = '';
                }
            }
        });
    }

    function sendUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message user';
        msg.innerHTML = `
            <div class="chat-bubble">
                <p>${escapeHtml(text)}</p>
            </div>
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
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typing);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    function sendBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message bot';
        msg.innerHTML = `
            <div class="chat-bubble">
                <p>${text}</p>
            </div>
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
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    // Bot reply logic
    const botResponses = {
        'bike': `We have 6 types of bikes available:
• <strong>City Bikes</strong> – Comfortable cruisers for urban exploring ($12/hr)
• <strong>Mountain Bikes</strong> – Full-suspension trail bikes ($18/hr)
• <strong>E-Bikes</strong> – Electric assist, up to 80km range ($25/hr)
• <strong>Tandems</strong> – Perfect for couples ($22/hr)
• <strong>Kids Bikes</strong> – Ages 4-12, multiple sizes ($8/hr)
• <strong>Premium Road Bikes</strong> – Carbon fiber racing machines ($35/hr)

All rentals include a helmet, lock, and route map. Want help picking one?`,

        'cost': `Our pricing is flexible based on how long you ride:

<strong>City Bikes:</strong> $12/hr | $35/day | $180/week
<strong>Mountain Bikes:</strong> $18/hr | $55/day | $280/week
<strong>E-Bikes:</strong> $25/hr | $75/day | $380/week
<strong>Tandems:</strong> $22/hr | $65/day | $320/week
<strong>Kids Bikes:</strong> $8/hr | $22/day | $110/week
<strong>Road Bikes:</strong> $35/hr | $95/day | $450/week

We also offer add-ons like GPS ($15), GoPro rental ($25), snack packs ($12), and full insurance. Check our booking section for exact totals!`,

        'book': `You can book right here on our website! No reservation is required for walk-ins, but we <strong>strongly recommend booking ahead</strong> — especially on weekends and holidays.

Our premium road bikes and e-bikes often sell out 2-3 days in advance. You can check real-time availability in our booking engine above. Want me to scroll you there?`,

        'advance': `Walk-ins are welcome, but we <strong>strongly recommend booking ahead</strong> — especially on weekends and holidays. Our premium road bikes and e-bikes often sell out 2-3 days in advance. You can check real-time availability in our booking engine!`,

        'hour': `Our hours vary by location:

<strong>Downtown Main Station:</strong> 7:00 AM – 9:00 PM
<strong>Parkside Hub:</strong> 8:00 AM – 7:00 PM
<strong>Beachfront Station:</strong> 6:00 AM – 10:00 PM
<strong>Mountain Base Camp:</strong> 7:00 AM – 6:00 PM

You can check the exact status of each location on our map above — it shows whether they're currently open or closed.`,

        'tour': `Yes! We offer 3 amazing guided tours:

🌅 <strong>Coastal Sunset Cruise</strong> (Easy, 3 hrs, 15 mi) – $45/person
🌲 <strong>Forest Trail Explorer</strong> (Moderate, 4 hrs, 22 mi) – $65/person
⛰️ <strong>Mountain Summit Challenge</strong> (Advanced, 6 hrs, 35 mi) – $95/person

Private tours are also available! All tours include an expert guide, bike rental, and refreshments.`,

        'rain': `Great question! We have a flexible weather policy:

🌧️ <strong>Free rescheduling or cancellation</strong> if severe weather is forecasted
🧥 We provide <strong>free ponchos</strong> for light rain
🚴 Many riders actually love the trails in misty conditions — fewer crowds and everything looks magical!

If you return early due to rain, we'll <strong>prorate your rental</strong>. Your adventure shouldn't be ruined by a little water!`,

        'insurance': `Basic liability coverage is included with every rental. For extra peace of mind, we offer <strong>Full Coverage Insurance</strong> as an add-on:

• Covers damage, theft, and liability
• Prices vary by bike type ($3–$15)
• <strong>Highly recommended</strong> for premium road bikes

You can add it during the booking flow!`,

        'helmet': `Yes! A helmet is <strong>included free</strong> with every rental. We have helmets in all sizes from toddler to XL adult. Our staff will help you get a proper fit during pickup.

Safety first — helmets are required for all riders under 18 and strongly recommended for everyone!`,

        'age': `Our age requirements:

• <strong>18+</strong> to rent independently
• <strong>16–17</strong> can rent with a parent/guardian present
• <strong>Kids bikes</strong> available for ages 4+, rented by an adult
• Tandems are great for riding with younger children who aren't ready to pedal alone!

We have bikes and helmets in all sizes, so the whole family can ride together.`,

        'location': `We have 4 convenient rental stations:

📍 <strong>Main Station – Downtown</strong> (123 Bike Lane)
📍 <strong>Parkside Hub</strong> (456 Trail Head Rd)
📍 <strong>Beachfront Station</strong> (789 Ocean Drive)
📍 <strong>Mountain Base Camp</strong> (321 Summit Way)

You can pick up at one station and return to <strong>any other for free</strong>! Check our interactive map above for exact locations and current hours.`,

        'return': `You can return your bike to <strong>any of our 4 stations</strong> at no extra charge — just let us know at pickup if you plan to return elsewhere.

We have a 30-minute grace period, but returns after closing time incur next-day charges. All stations have secure after-hours drop boxes if you have an early flight!`,

        'flat': `Don't worry — we've got you covered! Every rental includes:

🔧 A <strong>puncture repair kit</strong> and pump
📞 24/7 support line — we'll dispatch help or direct you to the nearest station for a <strong>free bike swap</strong>

Most flats take under 5 minutes to fix with our kit. Our trails are well-maintained, but nature happens!`,

        'discount': `We offer several ways to save:

• <strong>Weekly rates</strong> save up to 30% vs daily
• <strong>Group bookings</strong> of 4+ bikes get 10% off
• <strong>Photo contest</strong> — share with #TrailRideAdventures for a chance to win a free weekend rental
• Follow us on Instagram for seasonal promo codes!

Tours also have group pricing that gets cheaper per person with larger groups.`,

        'contact': `You can reach us anytime:

📞 <strong>Phone:</strong> (555) 123-RIDE
✉️ <strong>Email:</strong> hello@trailride.com
📍 <strong>Visit:</strong> 123 Bike Lane, City Center

Or just keep chatting here — I'm available 24/7 to help with bookings, recommendations, or any questions!`,

        'default': `That's a great question! I'd recommend checking our FAQ section above, or if you'd like to speak with a human, call us at <strong>(555) 123-RIDE</strong> or email <strong>hello@trailride.com</strong>.

You can also browse our bike catalog, guided tours, or start a booking right here on the site. What would you like to explore?`
    };

    function generateBotReply(userText) {
        const lower = userText.toLowerCase();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Determine response based on keywords
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
        
        // Simulate typing delay based on message length
        const delay = Math.min(1500, 800 + botResponses[responseKey].length * 8);
        
        setTimeout(() => {
            removeTypingIndicator();
            sendBotMessage(botResponses[responseKey]);
            
            // Show badge if chat is closed
            if (!chatOpen) {
                badgeCount++;
                chatBadge.textContent = badgeCount;
                chatBadge.style.display = 'flex';
            }
        }, delay);
    }

    console.log('TrailRide initialized successfully!');
});
