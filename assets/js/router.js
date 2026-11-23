const app = document.getElementById('app');
let cleanups = [];
let lastPath = '';
let base = '',
  routes = {},
  fallback = {};

function normalize(pathname) {
  let path = pathname;
  if (base && (path === base || path.startsWith(base + '/'))) path = path.slice(base.length);
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path || '/';
}

function scrollToHash(hash) {
  const target = hash ? document.querySelector(hash) : null;
  if (!target) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

function renderCurrent() {
  const path = normalize(location.pathname);
  lastPath = path;
  const config = routes[path] || fallback;

  cleanups.forEach((fn) => fn());
  cleanups = [];

  const template = document.getElementById(config.template);
  app.replaceChildren(template.content.cloneNode(true));

  const view = app.firstElementChild;
  view.classList.add('view');
  view.setAttribute('tabindex', '-1');
  document.title = config.title;

  document.querySelectorAll('.nav-link').forEach((link) => {
    const active = normalize(new URL(link.href, location.href).pathname) === path;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  config.mount.forEach((mount) => {
    const cleanup = mount(app);
    if (typeof cleanup === 'function') cleanups.push(cleanup);
  });

  if (location.hash) scrollToHash(location.hash);
  else window.scrollTo({ top: 0, behavior: 'auto' });
  view.focus({ preventScroll: true });
}

export function initRouter(config) {
  ({ base, routes, fallback } = config);

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href]:not([target="_blank"]):not([download])');
    if (
      !link ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname.endsWith('.pdf')) return;

    event.preventDefault();

    // In-page anchors scroll smoothly without re-rendering the current view.
    if (url.hash && url.pathname === location.pathname) {
      history.pushState({}, '', url.pathname + url.search + url.hash);
      scrollToHash(url.hash);
      return;
    }

    history.pushState({}, '', url.pathname + url.search);
    renderCurrent();
  });

  window.addEventListener('popstate', () => {
    // Hash-only history entries should not rebuild the view.
    if (normalize(location.pathname) === lastPath && app.firstElementChild) {
      if (location.hash) scrollToHash(location.hash);
      else window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    renderCurrent();
  });
  renderCurrent();
}
