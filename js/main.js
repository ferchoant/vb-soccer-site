// ===================================
// VB Soccer - Main JavaScript
// ===================================

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger to X
    const hamburgers = menuToggle.querySelectorAll('.hamburger');
    if (navMenu.classList.contains('active')) {
      hamburgers[0].style.transform = 'rotate(45deg) translateY(8px)';
      hamburgers[1].style.opacity = '0';
      hamburgers[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
      hamburgers[0].style.transform = 'none';
      hamburgers[1].style.opacity = '1';
      hamburgers[2].style.transform = 'none';
    }
  });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      const hamburgers = menuToggle.querySelectorAll('.hamburger');
      hamburgers[0].style.transform = 'none';
      hamburgers[1].style.opacity = '1';
      hamburgers[2].style.transform = 'none';
    }
  });
});

// ===================================
// Lightbox Gallery
// ===================================

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');
const galleryImages = document.querySelectorAll('.gallery-image');

let currentImageIndex = 0;
const imageData = [];

// Populate image data array
galleryImages.forEach((img, index) => {
  imageData.push({
    src: img.src,
    alt: img.alt,
    caption: img.dataset.caption || img.alt
  });
  
  img.addEventListener('click', () => {
    openLightbox(index);
  });
});

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const data = imageData[currentImageIndex];
  lightboxImage.src = data.src;
  lightboxImage.alt = data.alt;
  lightboxCaption.textContent = data.caption;
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % imageData.length;
  updateLightboxImage();
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + imageData.length) % imageData.length;
  updateLightboxImage();
}

// Event listeners
if (closeBtn) {
  closeBtn.addEventListener('click', closeLightbox);
}

if (prevBtn) {
  prevBtn.addEventListener('click', showPrevImage);
}

if (nextBtn) {
  nextBtn.addEventListener('click', showNextImage);
}

// Close lightbox when clicking outside image
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  switch(e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowRight':
      showNextImage();
      break;
    case 'ArrowLeft':
      showPrevImage();
      break;
  }
});

// ===================================
// Smooth Scroll Enhancement
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===================================
// Header Scroll Effect
// ===================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add shadow on scroll
  if (currentScroll > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.7)';
  } else {
    header.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe cards and achievement items
document.querySelectorAll('.sport-card, .achievement-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===================================
// Touch Swipe Support for Lightbox
// ===================================

let touchStartX = 0;
let touchEndX = 0;

if (lightbox) {
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next image
      showNextImage();
    } else {
      // Swipe right - previous image
      showPrevImage();
    }
  }
}

// ===================================
// Console Welcome Message
// ===================================

console.log('%c⚽ VB Soccer - Club Deportivo Jesús María', 'color: #fbbf24; font-size: 20px; font-weight: bold;');
console.log('%cIntegrando talentos, formando campeones', 'color: #dc2626; font-size: 14px; font-style: italic;');
console.log('%c🌐 Síguenos en Instagram: @club_vbsoccer', 'color: #a3a3a3; font-size: 12px;');
