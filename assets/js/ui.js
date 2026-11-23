const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-nav');

function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open menu');
  navigation?.classList.remove('is-open');
}

export function initUI() {
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    navigation.classList.toggle('is-open', !isOpen);
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('.nav-link, .logo')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}
