(() => {
  'use strict';
  const config = window.PENSE_ARTE_CONFIG || {};
  const number = String(config.whatsapp || '551152827200').replace(/\D/g, '');
  const whatsapp = text => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  document.querySelectorAll('[data-wa]').forEach(link => {
    link.href = whatsapp(link.dataset.wa || 'Olá, Pense Arte Marcenaria! Gostaria de conversar sobre um projeto.');
  });
  document.querySelectorAll('[data-phone]').forEach(link => { link.href = `tel:+${String(config.phone || number).replace(/\D/g, '')}`; });
  document.querySelectorAll('[data-phone-label]').forEach(el => { el.textContent = config.phoneLabel || '(11) 5282-7200'; });
  document.querySelectorAll('[data-map]').forEach(link => { if (config.mapsUrl) link.href = config.mapsUrl; });
  const mapFrame = document.querySelector('.map-band iframe');
  if (config.mapEmbedUrl && mapFrame.src !== config.mapEmbedUrl) mapFrame.src = config.mapEmbedUrl;
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 720) closeMenu(); }, { passive: true });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.gallery-card')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(other => {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) card.classList.add('visible');
    });
  }));

  const gallery = document.querySelector('#gallery-dialog');
  const galleryImage = document.querySelector('#gallery-image');
  const galleryTitle = document.querySelector('#gallery-title');
  const galleryCount = document.querySelector('#gallery-count');
  const imageButtons = [...document.querySelectorAll('.gallery-open')];
  let currentImages = imageButtons;
  let currentIndex = 0;
  const showImage = index => {
    currentIndex = (index + currentImages.length) % currentImages.length;
    const button = currentImages[currentIndex];
    galleryImage.src = button.dataset.image;
    galleryImage.alt = button.querySelector('img').alt;
    galleryTitle.textContent = button.dataset.title;
    galleryCount.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    document.querySelector('#gallery-prev').hidden = currentImages.length < 2;
    document.querySelector('#gallery-next').hidden = currentImages.length < 2;
  };
  imageButtons.forEach(button => button.addEventListener('click', () => {
    currentImages = imageButtons.filter(item => !item.closest('.gallery-card').hidden);
    showImage(currentImages.indexOf(button));
    gallery.showModal();
    document.body.classList.add('locked');
  }));
  document.querySelector('#gallery-prev').addEventListener('click', () => showImage(currentIndex - 1));
  document.querySelector('#gallery-next').addEventListener('click', () => showImage(currentIndex + 1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentIndex - 1); }
  });

  const messageDialog = document.querySelector('#message-dialog');
  const messageText = document.querySelector('#message-text');
  const messageLink = document.querySelector('#message-whatsapp');
  const updateMessage = () => { messageLink.href = whatsapp(messageText.value); };
  messageText.addEventListener('input', updateMessage);
  document.querySelector('#quote-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    messageText.value = `Olá, Pense Arte Marcenaria! Gostaria de conversar sobre um orçamento.\n\nNome: ${String(data.get('name')).trim()}\nCidade: ${String(data.get('city')).trim()}\nAmbiente: ${String(data.get('room')).trim()}\nMinha ideia: ${String(data.get('idea')).trim()}`;
    updateMessage();
    messageDialog.showModal();
    document.body.classList.add('locked');
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) document.body.classList.remove('locked'); });
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
