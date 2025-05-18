document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('burger-toggle');
    const menu = document.getElementById('menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isActive = menu.classList.toggle('active');
            toggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('no-scroll', isActive);
        });
    }
});
