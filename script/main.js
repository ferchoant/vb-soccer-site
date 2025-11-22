(function () {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const yearEl = document.getElementById('copyright-year');
  const navLinks = document.querySelectorAll('[data-scroll]');
  const storageSupported = (() => {
    try {
      const key = '__vb_test__';
      window.localStorage.setItem(key, '1');
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('LocalStorage no disponible:', error);
      return false;
    }
  })();
  const DB_KEYS = {
    sponsor: 'vbSponsorDB',
    familia: 'vbFamiliaDB',
  };
  const dbState = {
    sponsor: [],
    familia: [],
  };

  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.warn('No se pudo leer la base local:', error);
      return [];
    }
  };

  const loadDatabase = (key) => {
    if (!storageSupported) return [];
    const stored = window.localStorage.getItem(DB_KEYS[key]);
    return safeParse(stored);
  };

  const persistDatabase = (key) => {
    if (!storageSupported) return;
    try {
      window.localStorage.setItem(DB_KEYS[key], JSON.stringify(dbState[key]));
    } catch (error) {
      console.error('No se pudo guardar la base local:', error);
    }
  };

  Object.keys(DB_KEYS).forEach((key) => {
    dbState[key] = loadDatabase(key);
  });

  const showFeedback = (feedbackId, message, isError = false) => {
    if (!feedbackId) return;
    const feedbackEl = document.getElementById(feedbackId);
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('hidden');
    feedbackEl.classList.toggle('error', isError);
    feedbackEl.classList.toggle('success', !isError);
  };

  const registerLeadForm = ({ formId, dbKey, feedbackId, mapData }) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!storageSupported) {
        showFeedback(feedbackId, 'Activa el almacenamiento local del navegador para guardar los registros.', true);
        return;
      }

      const formData = new FormData(form);
      const payload = mapData(formData);
      payload.createdAt = new Date().toISOString();
      dbState[dbKey].push(payload);
      persistDatabase(dbKey);
      form.reset();
      showFeedback(feedbackId, 'Registro guardado localmente. Descárgalo cuando desees.', false);
    });
  };

  registerLeadForm({
    formId: 'sponsor-form',
    dbKey: 'sponsor',
    feedbackId: 'sponsor-feedback',
    mapData: (formData) => ({
      empresa: (formData.get('empresa') || '').trim(),
      contacto: (formData.get('contacto') || '').trim(),
      correo: (formData.get('correo') || '').trim(),
      telefono: (formData.get('telefono') || '').trim(),
      planInteres: formData.get('plan') || '',
      mensaje: (formData.get('mensaje') || '').trim(),
      tipo: 'sponsor',
    }),
  });

  registerLeadForm({
    formId: 'familia-form',
    dbKey: 'familia',
    feedbackId: 'familia-feedback',
    mapData: (formData) => ({
      nombre: (formData.get('nombre') || '').trim(),
      edad: (formData.get('edad') || '').trim(),
      categoria: formData.get('categoria') || '',
      correo: (formData.get('correo') || '').trim(),
      telefono: (formData.get('telefono') || '').trim(),
      tipo: 'familia',
    }),
  });

  const toCsv = (rows) => {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const escapeCell = (value) => {
      const stringValue = value == null ? '' : String(value);
      const escaped = stringValue.replace(/"/g, '""');
      return `"${escaped}"`;
    };
    const csvRows = [headers.join(',')];
    rows.forEach((row) => {
      const values = headers.map((header) => escapeCell(row[header]));
      csvRows.push(values.join(','));
    });
    return csvRows.join('\n');
  };

  const triggerDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  document.querySelectorAll('[data-export-db]').forEach((button) => {
    button.addEventListener('click', () => {
      const dbKey = button.getAttribute('data-export-db');
      const feedbackId = button.getAttribute('data-feedback-target');
      if (!dbKey) return;
      if (!storageSupported) {
        showFeedback(feedbackId, 'Tu navegador no permite guardar datos localmente.', true);
        return;
      }
      const dataset = dbState[dbKey] || [];
      if (!dataset.length) {
        showFeedback(feedbackId, 'Aún no registras datos para exportar.', true);
        return;
      }
      const csv = toCsv(dataset);
      if (!csv) {
        showFeedback(feedbackId, 'No pudimos generar el archivo CSV.', true);
        return;
      }
      const filename = button.getAttribute('data-export-filename') || `${dbKey}-leads.csv`;
      triggerDownload(csv, filename);
      showFeedback(feedbackId, 'Descarga generada correctamente.', false);
    });
  });

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
