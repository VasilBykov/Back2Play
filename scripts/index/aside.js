document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('#aside-info div > div');
    if (!container) {
        console.error('Контейнер для вывода продуктов не был найден!');
        return;
    }

    fetch('/xml/products.xml')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке XML!');
            }
            return response.text();
        })
        .then((data) => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');

            // Находим все продукты
            const allProducts = Array.from(xml.querySelectorAll('product'));
            if (allProducts.length === 0) {
                console.warn('Продукты не были найдены в XML!');
                return;
            }

            // Перемешиваем массив случайным образом
            const shuffled = allProducts.sort(() => 0.5 - Math.random());

            // Берём первые 3 продукта
            const selected = shuffled.slice(0, 3);

            // Добавляем продукты в контейнер
            selected.forEach((product) => {
                const id = product.getAttribute('id');
                const name = product.querySelector('name')
                    ? product.querySelector('name').textContent
                    : 'Ошибка чтеня названия!';
                const cover = product.querySelector('cover')
                    ? product.querySelector('cover').textContent
                    : '/images/products/covers/default.jpg';

                const article = document.createElement('article');
                article.innerHTML = `
					<a href="/pages/main/product.html?id=${id}">
						<p>${name}</p>
						<img src="${cover}" alt="${name}">
					</a>
				`;

                container.appendChild(article);
            });
        })
        .catch((error) => {
            console.error('Ошибка загрузки или обработки XML:', error);
        });
});
