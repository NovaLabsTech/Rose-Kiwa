/*
  Rose Kiwa content settings
  1. Add the WhatsApp number in international format, digits only (example: 2547...).
  2. Replace any "Plant 01" label with its confirmed name.
  3. Add confirmed price and availability text only when known.
*/
const SITE = {
  whatsappNumber: '254141133365',
  plants: Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Plant ${String(index + 1).padStart(2, '0')}`,
    price: '',
    availability: '',
    image: `images/plant-${String(index + 1).padStart(2, '0')}.jpeg`
  }))
};

const grid = document.querySelector('#plant-grid');
const dialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#dialog-title');
const dialogEnquire = document.querySelector('.dialog-enquire');
const dialogCount = document.querySelector('#dialog-count');
const hasWhatsApp = /^\d{8,15}$/.test(SITE.whatsappNumber);
let activePlantIndex = 0;

function enquiryUrl(plant) {
  const reference = plant.name.startsWith('Plant ') ? `${plant.name} from the Rose Kiwa gallery` : plant.name;
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hello Rose Kiwa, I’d like to ask about ${reference}.`)}`;
}

SITE.plants.forEach((plant) => {
  const card = document.createElement('article');
  card.className = 'plant-card';
  const detail = [plant.price, plant.availability].filter(Boolean).join(' · ') || 'Details available on enquiry';
  card.innerHTML = `<button class="plant-image" type="button" aria-label="View larger image of ${plant.name}"><img src="${plant.image}" alt="Rose Kiwa ${plant.name.toLowerCase()}" loading="lazy" width="900" height="1600"><span class="plant-index">${String(plant.id).padStart(2, '0')}</span></button><div class="plant-info"><div><h3>${plant.name}</h3><p>${detail}</p></div><a class="ask-link" href="${hasWhatsApp ? enquiryUrl(plant) : '#contact'}" ${hasWhatsApp ? 'target="_blank" rel="noopener"' : ''}>Ask about this plant ↗</a></div>`;
  const openButton = card.querySelector('.plant-image');
  openButton.addEventListener('click', () => openPlant(plant.id - 1));
  grid.appendChild(card);
});

function showPlant(index) {
  activePlantIndex = (index + SITE.plants.length) % SITE.plants.length;
  const plant = SITE.plants[activePlantIndex];
  dialogImage.src = plant.image;
  dialogImage.alt = `Larger view of ${plant.name}`;
  dialogTitle.textContent = plant.name;
  dialogCount.textContent = `${String(activePlantIndex + 1).padStart(2, '0')} / ${String(SITE.plants.length).padStart(2, '0')}`;
  dialogEnquire.href = hasWhatsApp ? enquiryUrl(plant) : '#contact';
  if (hasWhatsApp) { dialogEnquire.target = '_blank'; dialogEnquire.rel = 'noopener'; }
}

function openPlant(index) {
  showPlant(index);
  dialog.showModal();
}

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.dialog-prev').addEventListener('click', () => showPlant(activePlantIndex - 1));
document.querySelector('.dialog-next').addEventListener('click', () => showPlant(activePlantIndex + 1));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPlant(activePlantIndex - 1);
  if (event.key === 'ArrowRight') showPlant(activePlantIndex + 1);
});
let touchStartX = 0;
dialogImage.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
dialogImage.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 50) showPlant(activePlantIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

if (hasWhatsApp) {
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    link.href = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent('Hello Rose Kiwa, I’d like to ask about your plants.')}`;
    link.target = '_blank'; link.rel = 'noopener';
    link.classList.remove('is-disabled'); link.removeAttribute('aria-disabled');
  });
  const contactCard = document.querySelector('.contact-card');
  contactCard.querySelector('p').textContent = 'WhatsApp enquiries';
  contactCard.querySelector('strong').textContent = '+254 141 133 365';
  document.querySelector('.contact-meta > div:last-child p').textContent = '+254 141 133 365';
}

const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 48);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.getAttribute('href');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (target === '#top') {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }
    const destination = document.querySelector(target);
    if (!destination) return;
    event.preventDefault();
    destination.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  });
});

const revealTargets = document.querySelectorAll('.intro > *, .plant-card, .feature-strip > div, .about > *, .contact > *');
revealTargets.forEach((element) => element.classList.add('reveal'));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}
