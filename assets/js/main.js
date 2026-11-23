import { initRouter } from './router.js';
import { initUI } from './ui.js';
import { projects } from './behaviors/projects.js';
import { scrollProgress } from './behaviors/scroll-progress.js';
import { contactForm } from './behaviors/contact-form.js';

// Derived from the stylesheet path so this works on a root domain
// and at username.github.io/<repo>/ without manual changes.
function detectBase() {
  const stylesheet = document.querySelector('link[rel="stylesheet"][href*="assets/"]');
  if (!stylesheet) return '';

  const path = new URL(stylesheet.href, location.href).pathname;
  const marker = '/assets/';
  const index = path.indexOf(marker);

  return index > 0 ? path.slice(0, index) : '';
}

const BASE = detectBase();

const about = {
  template: 'view-about',
  title: 'About | Rainiel Dejito',
  mount: [],
};

const routes = {
  '/': {
    template: 'view-home',
    title: 'Rainiel Dejito | Digital Builder',
    mount: [projects],
  },
  '/about': about,
  '/experience': about,
  '/contact': {
    template: 'view-contact',
    title: 'Contact | Rainiel Dejito',
    mount: [contactForm],
  },
};

const fallback = {
  template: 'view-404',
  title: 'Page Not Found | Rainiel Dejito',
  mount: [],
};

history.scrollRestoration = 'manual';

if (BASE) sessionStorage.setItem('spa-base', BASE);

const redirected = new URLSearchParams(location.search).get('route');
if (redirected) history.replaceState({}, '', redirected);

scrollProgress();
initUI();
initRouter({ base: BASE, routes, fallback });
