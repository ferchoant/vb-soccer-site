(function () {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const yearEl = document.getElementById('copyright-year');
  const navLinks = document.querySelectorAll('[data-scroll]');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function closeMenu() {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  }

  toggle?.addEventListener('click', () => {
    if (!mobileMenu) return;
    const isHidden = mobileMenu.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', (!isHidden).toString());
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId?.startsWith('#')) return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    });
  });

  const setHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
})();
