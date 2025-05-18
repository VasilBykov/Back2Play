document.addEventListener('DOMContentLoaded', () => {
    // Список баннеров
    const banners = [
        {
            image: '/images/index/promo/1.webp',
            title: 'Место, чтобы найти свою любимую игру',
            desc: 'Откройте для себя тысячи новых игр c Back2Play',
        },
        {
            image: '/images/index/promo/2.jpg',
            title: 'Открой новые миры',
            desc: 'Погрузись в захватывающие приключения прямо сейчас',
        },
        {
            image: '/images/index/promo/3.jpg',
            title: 'Лучшие игры только тут',
            desc: 'От ретро до новинок - всё в одном месте',
        },
        {
            image: '/images/index/promo/4.jpg',
            title: 'Играй без границ',
            desc: 'Тысячи игр уже ждут тебя',
        },
        {
            image: '/images/index/promo/5.jpg',
            title: 'Игры, которые ты полюбишь',
            desc: 'Найди именно то, что тебе по вкусу',
        },
    ];

    let currentIndex = 0;
    let interval;

    // Элементы DOM
    const img = document.getElementById('banner-img');
    const h1 = document.querySelector('.banner-content h1');
    const p = document.querySelector('.banner-content p');
    const bannerContainer = document.querySelector('.banner-container');

    if (!img || !h1 || !p || !bannerContainer) return;

    // Обновление баннера по индексу
    function updateBanner(index) {
        const banner = banners[index];
        img.classList.remove('loaded'); // Убираем старую картинку
        img.src = banner.image;
        img.onload = () => img.classList.add('loaded'); // Как только картинка загрузится, показываем её
        h1.textContent = banner.title;
        p.textContent = banner.desc;
    }

    // Переключения
    function nextBanner() {
        currentIndex = (currentIndex + 1) % banners.length;
        updateBanner(currentIndex);
    }

    function prevBanner() {
        currentIndex = (currentIndex - 1 + banners.length) % banners.length;
        updateBanner(currentIndex);
    }

    // Перезапуск интервала
    function resetInterval() {
        if (interval) clearInterval(interval);
        interval = setInterval(nextBanner, 8000);
    }

    // Обработка кликов по кнопкам
    document.getElementById('banner-next').addEventListener('click', () => {
        nextBanner();
        resetInterval();
    });

    document.getElementById('banner-prev').addEventListener('click', () => {
        prevBanner();
        resetInterval();
    });

    // === Свайп на мобильных устройствах ===
    let touchStartX = 0;
    let touchEndX = 0;

    bannerContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    });

    bannerContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;

        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > 50) {
            deltaX > 0 ? prevBanner() : nextBanner();
            resetInterval();
        }
    });

    // === Свайп мышкой ===
    let isDragging = false;
    let startX = 0;

    bannerContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    bannerContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 50) {
            isDragging = false;
            deltaX > 0 ? prevBanner() : nextBanner();
            resetInterval();
        }
    });

    bannerContainer.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Мышь ушла за пределы блока - сброс
    bannerContainer.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Переключение банеров и первый запуск
    updateBanner(currentIndex);
    interval = setInterval(nextBanner, 8000);
});
