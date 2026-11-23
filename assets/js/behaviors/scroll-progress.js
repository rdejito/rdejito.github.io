export function scrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  return () => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}
