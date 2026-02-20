/* ============================================
   MAIN JAVASCRIPT — Interactions & Animations
   ============================================ */

(function () {
    'use strict';

    // ----- DOM Elements -----
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('.section, .hero');
    const fadeElements = document.querySelectorAll('.fade-up');

    // ----- Navigation: Show/Hide on Scroll -----
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const currentScrollY = window.scrollY;

        // Add scrolled class for background blur
        if (currentScrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }

        // Hide/show nav based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.classList.add('nav--hidden');
        } else {
            nav.classList.remove('nav--hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // ----- Mobile Menu Toggle -----
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ----- Active Nav Link on Scroll -----
    function updateActiveLink() {
        let currentSection = '';

        sections.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom > 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ----- Scroll Reveal Animations -----
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(function (el, index) {
        // Stagger delay for siblings
        el.style.transitionDelay = (index % 4) * 0.1 + 's';
        observer.observe(el);
    });

    // ----- Smooth Scroll for Anchor Links -----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offsetTop = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ----- Hero Fade on Scroll -----
    var heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var opacity = 1 - scrollY / 600;
            var translateY = scrollY * 0.3;

            if (opacity < 0) opacity = 0;
            heroContent.style.opacity = opacity;
            heroContent.style.transform = 'translateY(' + translateY + 'px)';
        }, { passive: true });
    }

    // ----- Trigger initial hero animations -----
    window.addEventListener('load', function () {
        var heroFades = document.querySelectorAll('.hero .fade-up, .hero__scroll.fade-up');
        heroFades.forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('visible');
            }, 200 + i * 150);
        });
    });

})();
