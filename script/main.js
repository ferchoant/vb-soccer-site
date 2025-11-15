(function () {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const yearEl = document.getElementById('copyright-year');
  const navLinks = document.querySelectorAll('[data-scroll]');
  const sponsorForm = document.getElementById('sponsor-form');
  const familiaForm = document.getElementById('familia-form');
  const sponsorSuccess = document.getElementById('sponsor-success');
  const familiaSuccess = document.getElementById('familia-success');
  const sponsorCountEl = document.getElementById('sponsor-count');
  const familiaCountEl = document.getElementById('familia-count');
  const exportButtons = document.querySelectorAll('[data-export]');
  const storageKeys = {
    sponsor: 'vbSponsorLeads',
    familia: 'vbFamiliaLeads',
  };

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

  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.warn('No se pudieron leer los registros', error);
      return [];
    }
  };

  const loadRecords = (type) => {
    const raw = localStorage.getItem(storageKeys[type]);
    return safeParse(raw);
  };

  const updateCount = (type, value) => {
    if (type === 'sponsor' && sponsorCountEl) {
      sponsorCountEl.textContent = value.toString();
    }
    if (type === 'familia' && familiaCountEl) {
      familiaCountEl.textContent = value.toString();
    }
  };

  const saveRecords = (type, records) => {
    localStorage.setItem(storageKeys[type], JSON.stringify(records));
    updateCount(type, records.length);
  };

  ['sponsor', 'familia'].forEach((type) => {
    updateCount(type, loadRecords(type).length);
  });

  const showMessage = (element, message) => {
    if (!element) return;
    element.textContent = message;
    setTimeout(() => {
      element.textContent = '';
    }, 5000);
  };

  const serializeForm = (form) => {
    const formData = new FormData(form);
    return Array.from(formData.entries()).reduce((acc, [key, value]) => {
      acc[key] = value.trim();
      return acc;
    }, {});
  };

  const handleForm = (form, type, successElement) => {
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = serializeForm(form);
      data.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${type}-${Date.now()}`;
      data.timestamp = new Date().toISOString();
      const records = loadRecords(type);
      records.push(data);
      saveRecords(type, records);
      form.reset();
      showMessage(successElement, 'Registro guardado en la base local.');
    });
  };

  handleForm(sponsorForm, 'sponsor', sponsorSuccess);
  handleForm(familiaForm, 'familia', familiaSuccess);

  const buildCSV = (records) => {
    if (!records.length) return '';
    const columns = Array.from(
      records.reduce((acc, item) => {
        Object.keys(item).forEach((key) => acc.add(key));
        return acc;
      }, new Set())
    );
    const header = columns.join(',');
    const rows = records.map((item) =>
      columns
        .map((key) => {
          const cell = item[key] ?? '';
          return `"${cell.toString().replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    return [header, ...rows].join('\n');
  };

  exportButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-export');
      if (!type) return;
      const records = loadRecords(type);
      if (!records.length) {
        alert('No hay registros todavía en esta base.');
        return;
      }
      const csv = buildCSV(records);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'sponsor' ? 'registros-sponsors.csv' : 'registros-familia.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  });
})();
