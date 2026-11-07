const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
}));
const content = {
 route: ['Urutan kunjungan outlet', 'Tentukan urutan outlet yang akan dikunjungi sebagai panduan perjalanan tim sales.'],
 outlet: ['Informasi outlet', 'Data identitas, lokasi, foto toko, dan catatan outlet membantu sales memahami tujuan sebelum tiba di lapangan.'],
 order: ['Pencatatan pesanan', 'Tempatkan pencatatan pesanan dalam alur kerja sales, agar kebutuhan outlet menjadi bagian dari proses distribusi.']
};
const tabs = [...document.querySelectorAll('[data-tab]')];
function selectTab(tab) {
 tabs.forEach(button => { const active = button === tab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
 const panel = document.querySelector('#tab-content');
 panel.setAttribute('aria-labelledby', tab.id);
 panel.querySelector('h3').textContent = content[tab.dataset.tab][0];
 panel.querySelector('p').textContent = content[tab.dataset.tab][1];
}
tabs.forEach((tab, index) => {
 tab.addEventListener('click', () => selectTab(tab));
 tab.addEventListener('keydown', event => {
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length - 1;
  if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
 });
});
document.querySelector('#replay').addEventListener('click', () => {
 const svg = document.querySelector('.map-panel svg'); svg.setCurrentTime(0);
});
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelector('.map-panel svg').pauseAnimations();
document.querySelector('#year').textContent = new Date().getFullYear();

// Content stays visible without JavaScript or when reduced motion is requested.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const targets = document.querySelectorAll('.distribution-visual, .features article, .visit-board, .flow article');
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  });
 }, { threshold: 0.12 });
 targets.forEach(target => { target.classList.add('reveal'); observer.observe(target); });
 document.documentElement.classList.add('motion-ready');
}
