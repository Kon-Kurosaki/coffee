// Phana Coffee — shared behaviour across pages

document.addEventListener('DOMContentLoaded', function () {
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
});
