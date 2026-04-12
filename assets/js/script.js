'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ── NAVIGATION LOGIC ──
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');
    const navTriggers = document.querySelectorAll('[data-nav-trigger]');

    const navigateTo = (pageName) => {
        // Update Nav Links UI
        navLinks.forEach(link => {
            if (link.textContent.toLowerCase() === pageName.toLowerCase() || 
                (pageName === 'more' && link.textContent.toLowerCase() === 'more')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Toggle Pages
        pages.forEach(page => {
            if (page.dataset.page === pageName.toLowerCase()) {
                page.classList.add('active');
                window.scrollTo(0, 0); // Scroll to top of new section
            } else {
                page.classList.remove('active');
            }
        });
    };

    // Add click event to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.textContent.trim().toLowerCase();
            navigateTo(targetPage);
            
            // Update URL hash without jumping
            history.pushState(null, null, `#${targetPage}`);
        });
    });

    // Add click event to functional buttons (like Hero buttons)
    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const target = trigger.getAttribute('data-nav-trigger');
            navigateTo(target);
            history.pushState(null, null, `#${target}`);
        });
    });

    // ── CONTACT MODAL LOGIC ──
    const contactTriggers = document.querySelectorAll('.contact-trigger');
    const contactModal = document.getElementById('contactModal');
    const modalClose = contactModal.querySelector('.modal-close');

    const openModal = () => {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeModal = () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };

    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    modalClose.addEventListener('click', closeModal);

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });

    // Handle initial load based on hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        const validPages = Array.from(pages).map(p => p.dataset.page);
        if (validPages.includes(initialHash)) {
            navigateTo(initialHash);
        }
    }

    // ── INTERACTIVE HOVER EFFECTS ──
    // Add subtle parallax-ish tilt to cards based on mouse position
    const cards = document.querySelectorAll('.project-card, .cert-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
});
