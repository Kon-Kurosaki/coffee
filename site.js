// Phana Coffee — shared behaviour across pages

document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle + persistence
    (function () {
        var themeToggle = document.getElementById('theme-toggle');

        function setTheme(theme, persist) {
            document.documentElement.setAttribute('data-theme', theme);
            // small transition hint
            document.documentElement.classList.add('theme-transition');
            window.setTimeout(function () { document.documentElement.classList.remove('theme-transition'); }, 300);
            if (themeToggle) {
                var icon = themeToggle.querySelector('.material-icons');
                if (icon) icon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
                themeToggle.setAttribute('aria-pressed', theme === 'dark');
                // invert text color for navbar button when on dark
                themeToggle.classList.toggle('text-light', theme === 'dark');
                themeToggle.classList.toggle('text-dark', theme !== 'dark');
            }
            if (persist) localStorage.setItem('theme', theme);
        }

        function toggleTheme() {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(current === 'dark' ? 'light' : 'dark', true);
        }

        // init
        var saved = localStorage.getItem('theme');
        if (!saved) {
            saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        setTheme(saved, false);

        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    })();

    // Navbar gains a solid background + shadow once the page scrolls
    var navbar = document.querySelector('.pc-navbar');
    if (navbar) {
        var onScroll = function () {
            navbar.classList.toggle('is-scrolled', window.scrollY > 24);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Fade + rise elements into view as they enter the viewport
    var revealEls = document.querySelectorAll('.pc-reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    var heroFigure = document.querySelector('.pc-hero-figure');
    if (heroFigure) {
        heroFigure.addEventListener('pointermove', function (event) {
            var rect = heroFigure.getBoundingClientRect();
            var x = (event.clientX - rect.left) / rect.width - 0.5;
            var y = (event.clientY - rect.top) / rect.height - 0.5;
            heroFigure.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (y * -8) + 'deg)';
        });
        heroFigure.addEventListener('pointerleave', function () {
            heroFigure.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
        });
    }

    // Lightbox: show larger image when gallery thumbnail is clicked
    // Expose window.showImage so inline onclick handlers in gallery.html can call it
    (function () {
        var modal = document.getElementById('lightboxModal');
        var img = document.getElementById('lightbox-img');

        function closeModal() {
            if (!modal) return;
            modal.classList.remove('open');
            // small delay to allow fade-out if desired
            setTimeout(function () {
                if (modal) modal.style.display = 'none';
                document.body.classList.remove('pc-lightbox-open');
                if (img) img.src = '';
            }, 200);
        }

        window.showImage = function (src, alt) {
            if (!modal || !img) {
                // fallback: alert
                window.open(src, '_blank');
                return;
            }
            img.src = src;
            img.alt = alt || '';
            // make modal visible and center image
            modal.style.display = 'flex';
            // ensure repaint then add class for potential transition
            requestAnimationFrame(function () { modal.classList.add('open'); });
            document.body.classList.add('pc-lightbox-open');
        };

        // Close when clicking outside the image or pressing Escape
        if (modal) {
            modal.addEventListener('click', function (ev) {
                // if click target is the modal background (not the image), close
                if (ev.target === modal || ev.target === img === false) closeModal();
            });
            document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeModal(); });
        }
    })();
});
