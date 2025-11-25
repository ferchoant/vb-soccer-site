// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !expanded);
    });
}

// Google Sheets Script URL (REEMPLAZA ESTO CON TU URL GENERADA)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1TMTqwTbK9nQ7RrRfLWRt_I2tEXqFrJAdk-KE_HFuW3gumul0Ry7_E08Rv2LJgLRQ/exec';

const form = document.getElementById('sponsorForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (SCRIPT_URL === 'TU_URL_AQUI') {
            alert('⚠️ ERROR DE CONFIGURACIÓN:\n\nFalta configurar la URL del Script de Google.\nPor favor revisa el archivo SETUP_DATABASE.md');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        // Populate hidden date field
        const fechaInput = document.getElementById('fechaInput');
        if (fechaInput) {
            fechaInput.value = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando...';

        const formData = new FormData(form);

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                alert('¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto pronto.');
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Hubo un error al enviar el formulario. Por favor intenta contactarnos por WhatsApp.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
    });
}
