document.addEventListener('DOMContentLoaded', function () {
	// Получаем ID текущей страницы из URL
	const pageId = new URLSearchParams(window.location.search).get('id');

	// Проверка на наличие параметра 'id'
	if (!pageId) {
		console.error('Ошибка! Параметр id не был найден в URL.');
		return;
	}

	// Загружаем XML
	fetch('/xml/products.xml')
		.then((response) => {
			// Проверка успешности загрузки файла
			if (!response.ok) {
				throw new Error('Ошибка! Не удалось загрузить XML файл.');
			}
			return response.text();
		})
		.then((data) => {
			const parser = new DOMParser();
			const xml = parser.parseFromString(data, 'application/xml');

			// Ищем нужную страницу по ID
			const page = xml.querySelector(`page[id="${pageId}"]`);
			if (!page) {
				console.error('Ошибка! Такая страница не была найдена в XML.');
				const container = document.querySelector('#main-info .topics');
				container.innerHTML = '<p>Страница с таким ID не найдена.</p>';
				return;
			}

			// Получаем все продукты на этой странице
			const products = page.querySelectorAll('product');
			const container = document.querySelector('#main-info .topics');

			// Проверка на наличие продуктов
			if (products.length === 0) {
				container.innerHTML =
					'<p>Продукты для этой страницы не были найдены.</p>';
				return;
			}

			products.forEach((product) => {
				const id = product.getAttribute('id');
				const cover = product.querySelector('cover')?.textContent || '';
				const name = product.querySelector('name')?.textContent || '';
				const price = product.querySelector('price')?.textContent || '';

				// Проверка на наличие необходимых данных
				if (!cover || !name || !price) {
					console.warn(
						'Внимание! Некоторые данные продукта отсутствуют.'
					);
				}

				// Создание <figure> блока для каждого продукта
				const figure = document.createElement('figure');
				figure.innerHTML = `
                    <img src="${cover}" loading="lazy">
                    <figcaption>
                        <p class="name"><a href="/pages/main/product.html?id=${id}">${name}</a></p>
                        <p class="price">Цена: ${price}</p>
                    </figcaption>
                `;

				container.appendChild(figure);
			});
		})
		.catch((error) => {
			console.error('Ошибка при загрузке или разборе XML:', error);
			// Показываем сообщение об ошибке на странице
			const container = document.querySelector('#main-info .topics');
			container.innerHTML =
				'<p>Не удалось загрузить список продуктов.</p>';
		});
});
