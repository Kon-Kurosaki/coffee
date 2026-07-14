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
                // small icon animation
                if (icon) {
                    icon.classList.add('pc-theme-anim');
                    setTimeout(function () { icon.classList.remove('pc-theme-anim'); }, 420);
                }
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

    // Menu category filter
    (function () {
        var catWrap = document.getElementById('menu-categories');
        if (!catWrap) return;
        var buttons = Array.from(catWrap.querySelectorAll('button[data-cat]'));
        var cards = Array.from(document.querySelectorAll('.pc-menu-card'));

        function applyFilter(cat) {
            cards.forEach(function (card) {
                var c = card.getAttribute('data-category') || card.parentElement.getAttribute('data-category') || 'all';
                if (cat === 'all' || c === cat) {
                    card.parentElement && (card.parentElement.style.display = '');
                } else {
                    card.parentElement && (card.parentElement.style.display = 'none');
                }
            });
        }

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (ev) {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                applyFilter(btn.getAttribute('data-cat'));
            });
        });
        // apply initial filter state
        applyFilter('all');
    })();

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

    // Lightbox: simple, dependency-free image-only overlay for gallery
    // Expose window.showImage so inline onclick handlers in gallery.html can call it
    (function () {
        var overlayId = 'pc-lightbox-overlay';
        var boxClass = 'pc-lightbox-box';
        var imgClass = 'pc-lightbox-img';
        var HIDE_DELAY = 200; // must match the CSS opacity transition duration

        function createOverlay() {
            var o = document.createElement('div');
            o.id = overlayId;
            o.setAttribute('aria-hidden', 'true');
            o.style.display = 'none';

            var box = document.createElement('div');
            box.className = boxClass;
            var img = document.createElement('img');
            img.className = imgClass;
            img.alt = '';
            box.appendChild(img);
            o.appendChild(box);
            document.body.appendChild(o);

            // Close on any click that isn't directly on the enlarged image
            // (covers clicks on the background AND on the box wrapper around it)
            o.addEventListener('click', function (ev) {
                if (!ev.target.classList.contains(imgClass)) hideOverlay();
            });

            // Close on Escape
            document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') hideOverlay(); });
            return o;
        }

        function getOverlay() {
            return document.getElementById(overlayId) || createOverlay();
        }

        function showOverlay(src, alt) {
            var o = getOverlay();
            var img = o.querySelector('img.' + imgClass);
            if (!img) return window.open(src, '_blank');
            img.src = src;
            img.alt = alt || '';
            o.style.display = 'flex';
            // trigger repaint then set visible class so the fade-in transition runs
            requestAnimationFrame(function () { o.classList.add('is-visible'); });
            document.body.classList.add('pc-lightbox-open');
        }

        function hideOverlay() {
            var o = document.getElementById(overlayId);
            if (!o) return;
            // remove the class first so the CSS opacity transition can play...
            o.classList.remove('is-visible');
            // ...then hide it for real and clear the image once the fade finishes
            setTimeout(function () {
                o.style.display = 'none';
                document.body.classList.remove('pc-lightbox-open');
                var img = o.querySelector('img.' + imgClass);
                if (img) img.src = '';
            }, HIDE_DELAY);
        }

        window.showImage = function (src, alt) {
            try { showOverlay(src, alt); } catch (e) { window.open(src, '_blank'); }
        };
    })();
});