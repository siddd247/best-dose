document.addEventListener('DOMContentLoaded', () => {

    // 0. Open Now / Closed Badge
    const badge = document.getElementById('openStatusBadge');
    if (badge) {
        const now = new Date();
        const hour = now.getHours();
        const isOpen = hour >= 8 && hour < 22; // 8AM to 10PM
        badge.innerHTML = isOpen
            ? `<span style="display:inline-flex;align-items:center;gap:0.5rem;background:rgba(16,185,129,0.15);border:1.5px solid #10b981;color:#065f46;padding:0.4rem 1.1rem;border-radius:9999px;font-weight:600;font-size:0.95rem;backdrop-filter:blur(4px);">
                <span style="width:10px;height:10px;background:#10b981;border-radius:50%;display:inline-block;animation:pulse-dot 1.5s infinite;"></span>
                Open Now &bull; Closes at 10:00 PM
               </span>`
            : `<span style="display:inline-flex;align-items:center;gap:0.5rem;background:rgba(239,68,68,0.12);border:1.5px solid #ef4444;color:#7f1d1d;padding:0.4rem 1.1rem;border-radius:9999px;font-weight:600;font-size:0.95rem;">
                <span style="width:10px;height:10px;background:#ef4444;border-radius:50%;display:inline-block;"></span>
                Closed &bull; Opens at 8:00 AM
               </span>`;
    }

    // 1. Sticky Navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        // Initial check
        if (window.scrollY > 50) navbar.classList.add('scrolled');
    }

    // Toggle Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.navbar .links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Change icon
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Intersection Observer for Fade-In
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // 3. Doctors Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const docCards = document.querySelectorAll('.doc-item');

    if (filterBtns.length > 0 && docCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                docCards.forEach(card => {
                    const specialty = card.getAttribute('data-specialty');
                    if (filter === 'all' || filter === specialty) {
                        card.style.display = 'block';
                        // little animation reset
                        card.classList.remove('visible');
                        setTimeout(() => card.classList.add('visible'), 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Booking Modal
    // 4. WhatsApp Booking Redirection
    const bookBtns = document.querySelectorAll('.book-btn');
    const doctorSelect = document.getElementById('doctorSelect');
    
    // Function to handle WhatsApp redirect
    const bookViaWhatsApp = (docName) => {
        const phone = "917006630668";
        const message = `Hello, I would like to book an appointment with ${docName}.`;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phone}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    if (bookBtns.length > 0) {
        bookBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const docName = btn.getAttribute('data-doc');
                if (docName) {
                    bookViaWhatsApp(docName);
                }
            });
        });
    }

    // Check if URL specifies a doctor upon load
    const urlParams = new URLSearchParams(window.location.search);
    const docParam = urlParams.get('doc');
    if (docParam) {
        const docMap = {
            'anjali': 'Dr. Anjali Verma',
            'sunita': 'Dr. Sunita Gupta',
            'rajesh': 'Dr. Rajesh Verma',
            'anil': 'Dr. Anil Sharma',
            'amit': 'Dr. Amit Kumar',
            'vikas': 'Dr. Vikas Singh',
            'priya': 'Dr. Priya Singh'
        };
        if (docMap[docParam]) {
            // Remove parameter from URL quietly before opening WhatsApp
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({path:newUrl}, '', newUrl);
            
            bookViaWhatsApp(docMap[docParam]);
        }
    }

    // 5. Toast Notification
    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 6. Interactive Star Rating Widget
    const starWidget = document.querySelector('.star-widget');
    let selectedRating = 0;
    if (starWidget) {
        const stars = starWidget.querySelectorAll('span');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
                        s.classList.add('active');
                        s.innerHTML = '★';
                        s.style.color = '#fbbf24';
                    } else {
                        s.classList.remove('active');
                        s.innerHTML = '☆';
                        s.style.color = '#d1d5db';
                    }
                });
            });
        });
    }

    // 7. Review Form Submission
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');

    if (reviewForm && reviewsList) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewerName').value;
            const comment = document.getElementById('reviewComment').value;

            if (selectedRating === 0) {
                alert("Please select a star rating");
                return;
            }

            const starHtml = Array(5).fill(0).map((_, i) => 
                i < selectedRating ? '<svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'
                : '<svg viewBox="0 0 20 20" fill="#d1d5db"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'
            ).join('');

            const newReview = document.createElement('div');
            newReview.className = 'review-card fade-in visible';
            newReview.innerHTML = `
                <div class="stars mb-2" style="margin-bottom:0.5rem">${starHtml}</div>
                <h4 style="margin-bottom:0.5rem">${name}</h4>
                <p style="color:var(--text-light)">${comment}</p>
            `;

            reviewsList.appendChild(newReview);
            reviewForm.reset();
            selectedRating = 0;
            if(starWidget) {
                starWidget.querySelectorAll('span').forEach(s => {
                    s.classList.remove('active'); s.innerHTML = '☆'; s.style.color = '#d1d5db';
                });
            }
            showToast('Review Submitted!');
        });
    }

    // 8. Contact Form — WhatsApp redirect
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value || '';
            const phone = document.getElementById('contactPhone')?.value || '';
            const message = document.getElementById('contactMessage')?.value || '';
            const text = `Hello, my name is ${name} (${phone}). ${message}`;
            const url = `https://wa.me/917006630668?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            contactForm.reset();
        });
    }

});
