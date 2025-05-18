document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPageId = urlParams.get('id') || '';
    const pagePrefix = currentPageId.replace(/_\d+$/, ''); // Для того, чтобы убрать _1, _2 и т.д.

    // Проверка наличия ID в URL
    if (!currentPageId) {
        console.error('Ошибка! Параметр id не найден в URL.');
        return;
    }

    // Загрузка XML
    fetch('/xml/products.xml')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка! Не удалось загрузить XML файл.');
            }
            return response.text();
        })
        .then((data) => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');

            // Получение всех страниц с соответствующим ID
            const allPages = Array.from(xml.querySelectorAll('page'));
            const matchedPages = allPages.filter((p) =>
                p.getAttribute('id')?.startsWith(pagePrefix)
            );

            // Проверка наличия страниц
            if (matchedPages.length === 0) {
                console.error(
                    'Ошибка! Страницы для указанного id не были найдены.'
                );
                return;
            }

            // Сортировка страниц
            matchedPages.sort((a, b) => {
                const numA = parseInt(
                    a.getAttribute('id')?.split('_').pop() || 0
                );
                const numB = parseInt(
                    b.getAttribute('id')?.split('_').pop() || 0
                );
                return numA - numB;
            });

            // Контейнер для переключения страниц
            const moover = document.querySelector('.moover');
            if (!moover) return;

            moover.innerHTML = ''; // Очистка контейнера перед добавлением новых ссылок

            const firstPage = matchedPages[0];
            const lastPage = matchedPages[matchedPages.length - 1];

            // Кнопка "влево" (Первая страница)
            moover.appendChild(
                createPageLink('«', firstPage.getAttribute('id'))
            );

            // Нумерованные страницы
            matchedPages.forEach((page, index) => {
                const pageId = page.getAttribute('id');
                const pageNumber = index + 1;

                const a = createPageLink(pageNumber, pageId);
                if (pageId === currentPageId) {
                    a.classList.add('active'); // Добавление активного класса для текущей страницы
                }
                moover.appendChild(a);
            });

            // Кнопка "вправо" (Последняя страница)
            moover.appendChild(
                createPageLink('»', lastPage.getAttribute('id'))
            );
        })
        .catch((error) => {
            console.error('Ошибка при создании пагинации:', error);
            const moover = document.querySelector('.moover');
            if (moover) {
                moover.innerHTML = '<p>Не удалось загрузить пагинацию.</p>';
            }
        });

    // Создание ссылок пагинации
    function createPageLink(text, id) {
        const a = document.createElement('a');
        a.href = `/pages/main/games.html?id=${id}`;
        a.textContent = text;
        return a;
    }
});
