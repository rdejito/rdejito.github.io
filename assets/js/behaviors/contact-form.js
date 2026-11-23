export function contactForm(root) {
  const form = root.querySelector('form');
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const status = root.querySelector('#form-status');

  function submit(event) {
    event.preventDefault();

    const data = new FormData(form);
    button.disabled = true;
    status.textContent = 'Sending…';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: data.get('access_key'),
        full_name: data.get('full_name'),
        email: data.get('email'),
        message: data.get('message'),
      }),
    })
      .then((response) => response.json().then((body) => ({ ok: response.ok, body })))
      .then(({ ok, body }) => {
        status.textContent = ok
          ? 'Thanks! Your message was sent.'
          : body.message || 'Something went wrong.';
        if (ok) form.reset();
      })
      .catch(() => {
        status.textContent = 'Network error. Please try again.';
      })
      .finally(() => {
        button.disabled = false;
      });
  }

  form.addEventListener('submit', submit);

  return () => form.removeEventListener('submit', submit);
}
