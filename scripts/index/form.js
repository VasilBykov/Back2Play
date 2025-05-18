document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscribe-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            const name = form.querySelector('input[name="name"]').value.trim();
            const email = form
                .querySelector('input[name="email"]')
                .value.trim();
            const platform = form
                .querySelector('input[name="platform"]')
                .value.trim();

            // Проверка email
            const emailRegex =
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!name || !email || !platform) {
                showToast('Пожалуйста, заполните все поля!', 'error');
                return;
            }
            if (!emailRegex.test(email)) {
                showToast(
                    'Пожалуйста, введите корректный адрес электронной почты!',
                    'error'
                );
                return;
            }

            showToast('Спасибо за подписку!', 'success');
            form.reset();
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showToast('Произошла ошибка. Попробуйте позже.', 'error');
        }
    });

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500); // удаление после анимации
        }, 4500);
    }
});
