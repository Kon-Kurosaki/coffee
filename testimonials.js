var splide = new Splide('.splide', {
    type: 'loop',
    perPage: 3,
    perMove: 1,
    gap: '1.5rem',
    pagination: true,
    arrows: true,
    autoplay: true,
    interval: 4500,
    pauseOnHover: true,
    breakpoints: {
        992: { perPage: 2 },
        576: { perPage: 1 }
    }
});

splide.mount();
