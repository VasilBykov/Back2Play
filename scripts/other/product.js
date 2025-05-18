document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) return;

    window.images = [];

    fetch('/xml/products.xml')
        .then((res) => res.text())
        .then((str) => new DOMParser().parseFromString(str, 'text/xml'))
        .then((xml) => {
            const product = xml.querySelector(`product[id="${productId}"]`);
            if (!product) return;

            renderMainInfo(product);
            renderGallery(product);
            renderDescription(product);
            renderFeatures(product);
            renderRequirements(product);
        })
        .catch((err) => console.error('Ошибка загрузки данных:', err));

    setupThumbnailScroll();
    setupTabs();
});

// Рендер информации
function renderMainInfo(product) {
    const infoContainer = document.querySelector('#info');
    const name = product.querySelector('name');
    const price = product.querySelector('price');
    const art = product.querySelector('art');
    const publisher = product.querySelector('publisher');
    const developer = product.querySelector('developer');
    const languages = product.querySelector('languages');
    const edition = product.querySelector('edition');
    const date = product.querySelector('date');

    if (
        name &&
        price &&
        art &&
        publisher &&
        developer &&
        languages &&
        edition &&
        date
    ) {
        infoContainer.querySelector('h2').textContent = name.textContent;
        infoContainer.querySelector(
            'h3'
        ).innerHTML = `<strong>Цена:</strong> ${price.textContent}`;
        infoContainer.querySelector('ul').innerHTML = `
			<li><strong>Артикул:</strong> ${art.textContent}</li>
			<li><strong>Издатель:</strong> ${publisher.textContent}</li>
			<li><strong>Разработчик:</strong> ${developer.textContent}</li>
			<li><strong>Поддерживаемые языки:</strong> ${languages.textContent}</li>
			<li><strong>Тип издания:</strong> ${edition.textContent}</li>
			<li><strong>Дата релиза:</strong> ${date.textContent}</li>
		`;
    }
}

function renderGallery(product) {
    const thumbnails = document.getElementById('thumbnail-column');
    const mainImageContainer = document.getElementById('main-image');
    mainImageContainer.innerHTML = '';

    // Создание основновного изображения
    const mainImage = document.createElement('img');
    mainImage.loading = 'lazy';
    mainImage.alt = 'Основное изображение товара';
    mainImageContainer.appendChild(mainImage);

    thumbnails.innerHTML = '';
    const images = product.querySelectorAll('images > image');
    window.images = Array.from(images).map((img) => img.textContent);

    window.images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.loading = 'lazy';
        thumb.alt = `Миниатюра изображения ${index + 1}`;
        thumb.addEventListener('click', () => updateMainImage(index));
        thumbnails.appendChild(thumb);
    });

    let currentIndex = 0;
    updateMainImage(currentIndex);

    document.getElementById('prev-btn').addEventListener('click', () => {
        currentIndex =
            (currentIndex - 1 + window.images.length) % window.images.length;
        updateMainImage(currentIndex);
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % window.images.length;
        updateMainImage(currentIndex);
    });

    function updateMainImage(index) {
        if (window.images[index]) {
            mainImage.src = window.images[index];
        }
    }
}

function renderDescription(product) {
    const descContainer = document.querySelector('#description');
    const paragraphs = product.querySelectorAll('description > par');

    descContainer.innerHTML = '<h3>Описание игры:</h3>';
    paragraphs.forEach((par) => {
        const p = document.createElement('p');
        p.textContent = par.textContent.trim();
        descContainer.appendChild(p);
    });
}

function renderFeatures(product) {
    const featureContainer = document.querySelector('#set');
    const features = product.querySelectorAll('set > element');

    const list = document.createElement('ul');
    features.forEach((el) => {
        const li = document.createElement('li');
        li.textContent = el.textContent;
        list.appendChild(li);
    });

    featureContainer.innerHTML = '<h3>Ключевые особенности:</h3>';
    featureContainer.appendChild(list);
}

function renderRequirements(product) {
    const reqTab = document.querySelector('#requirements');
    const min = product.querySelector('requirements > minimum');
    const rec = product.querySelector('requirements > recommended');

    const createList = (req) => `
		<ul>
			<li><strong>ОС:</strong> ${req.querySelector('os').textContent}</li>
			<li><strong>Процессор:</strong> ${req.querySelector('cpu').textContent}</li>
			<li><strong>RAM:</strong> ${req.querySelector('ram').textContent}</li>
			<li><strong>Видеокарта:</strong> ${req.querySelector('gpu').textContent}</li>
			<li><strong>DirectX:</strong> ${req.querySelector('directx').textContent}</li>
		</ul>
	`;

    reqTab.innerHTML = `
		<h3>Системные требования</h3>
		<h4>Минимальные:</h4>
		${createList(min)}
		<h4>Рекомендуемые:</h4>
		${createList(rec)}
	`;
}

// Скроллинг миниатюр
function setupThumbnailScroll() {
    const scrollAmount = 100;
    document.getElementById('up-btn').addEventListener('click', () => {
        document
            .getElementById('thumbnail-column')
            .scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    });
    document.getElementById('bottom-btn').addEventListener('click', () => {
        document
            .getElementById('thumbnail-column')
            .scrollBy({ top: scrollAmount, behavior: 'smooth' });
    });
}

// Переключение вкладок
function setupTabs() {
    const buttons = document.querySelectorAll('#product-bottom nav button');
    const tabs = document.querySelectorAll('#tab-content .tab');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            buttons.forEach((b) => b.classList.remove('active'));
            tabs.forEach((tab) => tab.classList.remove('active'));

            const target = document.getElementById(tabId);
            if (target) {
                target.classList.add('active');
                button.classList.add('active');
            }
        });
    });
}
