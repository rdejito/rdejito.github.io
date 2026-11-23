// Edit this array to change the work index.
const projectData = [
  {
    title: 'Portfolio',
    tech: 'Vanilla JS / CSS',
    description:
      'A typography-driven personal site with route-based views, custom SVG icons, a charcoal palette and an accessible responsive layout.',
  },
  {
    title: 'Little Moments',
    tech: 'React / WebRTC',
    description:
      'A browser-based group photobooth. Create a room, invite up to three guests, pick a frame and capture a shared photo — composed on canvas and sent peer-to-peer, with no backend.',
    links: [
      { label: 'View code', url: 'https://github.com/rdejito/photobooth' },
      { label: 'Live demo', url: 'https://littlemomentsphotobooth.vercel.app' },
    ],
  },
];

// Treat it as desktop when there is room and the primary pointer is not touch.
const isDesktop = () => window.innerWidth > 768 && !window.matchMedia('(pointer: coarse)').matches;

function render(list) {
  list.innerHTML = projectData
    .map(
      (project, index) => `
        <li class="project-row">
          <button
            class="project-trigger"
            type="button"
            aria-expanded="false"
            aria-controls="project-detail-${index}"
          >
            <span class="project-number">${String(index + 1).padStart(2, '0')}</span>
            <span class="project-title">${project.title}</span>
            <span class="project-tech">${project.tech}</span>
            <svg class="icon project-arrow" aria-hidden="true">
              <use href="#icon-arrow-up-right"></use>
            </svg>
          </button>
          <div class="project-detail" id="project-detail-${index}">
            <p>${project.description}</p>
            ${
              project.links
                ? `<div class="project-links">${project.links
                    .map(
                      (link) => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer">
                          ${link.label}
                          <svg class="icon" aria-hidden="true">
                            <use href="#icon-arrow-up-right"></use>
                          </svg>
                        </a>`,
                    )
                    .join('')}</div>`
                : ''
            }
          </div>
        </li>`,
    )
    .join('');
}

export function projects(root) {
  const list = root.querySelector('#project-list');
  const preview = root.querySelector('.project-preview');
  if (!list) return;

  // Move preview to body so `position: fixed` is relative to the viewport,
  // not a transformed ancestor (e.g. .view animation creates a containing block).
  if (preview && preview.parentElement !== document.body) {
    document.body.appendChild(preview);
  }

  render(list);

  const rows = Array.from(list.querySelectorAll('.project-row'));
  const triggers = Array.from(list.querySelectorAll('.project-trigger'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  rows.forEach((row) => observer.observe(row));

  function toggle(row, trigger) {
    const open = row.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
  }

  function onListClick(event) {
    const trigger = event.target.closest('.project-trigger');
    if (!trigger) return;
    toggle(trigger.closest('.project-row'), trigger);
  }

  function onMove(event) {
    if (!isDesktop() || !preview) return;
    const trigger = event.target.closest('.project-trigger');
    if (!trigger) return hidePreview();

    const index = triggers.indexOf(trigger);
    preview.querySelector('.preview-title').textContent = projectData[index].title;
    preview.querySelector('.preview-desc').textContent = projectData[index].description;
    preview.classList.add('is-active');

    const offset = 14;
    const width = 260;
    const height = preview.offsetHeight || 140;
    const x = Math.min(event.clientX + offset, window.innerWidth - width - 12);
    const y = Math.max(12, event.clientY - height - offset);
    preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function hidePreview() {
    preview?.classList.remove('is-active');
  }

  list.addEventListener('click', onListClick);
  list.addEventListener('mousemove', onMove);
  list.addEventListener('mouseleave', hidePreview);

  return () => {
    observer.disconnect();
    list.removeEventListener('click', onListClick);
    list.removeEventListener('mousemove', onMove);
    list.removeEventListener('mouseleave', hidePreview);
    preview?.remove();
  };
}
