const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
function setMenu(open) {
 nav.classList.toggle('open', open);
 menu.setAttribute('aria-expanded', String(open));
 menu.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
 menu.textContent = open ? '×' : '☰';
}
menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
 if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); }
});
document.addEventListener('click', event => {
 if (!event.target.closest('header')) setMenu(false);
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
 if (event.matches) setMenu(false);
});
const content = {
 route: ['Urutan kunjungan outlet', 'Tentukan urutan outlet yang akan dikunjungi sebagai panduan perjalanan tim sales.'],
 outlet: ['Informasi outlet', 'Data identitas, lokasi, foto toko, dan catatan outlet membantu sales memahami tujuan sebelum tiba di lapangan.'],
 order: ['Transaksi langsung & stok bawaan', 'Sales membawa stok dalam kendaraan, melayani pembelian langsung di toko, lalu mencatat penjualan dan pengurangan stok sebelum melanjutkan rute.']
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

// Industry selection remains usable even when WebGL cannot load.
const categories = {
 fmcg: {title:'Produk sehari-hari, pergerakan setiap hari.',description:'Makanan kemasan, minuman, dan kebutuhan harian: hubungkan stok yang dibawa sales dengan kunjungan ke toko dan transaksi langsung.',caption:'FMCG · Makanan & minuman',colors:[0x9982cf,0xe5b584,0x8fb9bb],shapes:['bottle','box','can']},
 care: {title:'Perawatan diri hingga kosmetik.',description:'Bantu kunjungan outlet untuk produk perawatan dan kosmetik dengan konteks stok bawaan, kebutuhan toko, serta transaksi di lapangan.',caption:'Perawatan & kosmetik',colors:[0xd39cb8,0xb99ad7,0xe5c3a0],shapes:['bottle','bottle','box']},
 home: {title:'Kebutuhan rumah, distribusi yang tertata.',description:'Dari produk kebersihan hingga perlengkapan rumah tangga, susun rute outlet dan hubungkan barang yang dibawa sales dengan penjualan saat kunjungan.',caption:'Kebutuhan rumah tangga',colors:[0x8fb6b0,0xb1bcd9,0xceb08b],shapes:['bottle','box','bottle']},
 parts: {title:'Perlengkapan dan suku cadang ke outlet tujuan.',description:'Untuk distributor perlengkapan dan suku cadang, jadikan data outlet, rute sales, stok bawaan, dan transaksi sebagai satu alur kerja lapangan.',caption:'Perlengkapan & suku cadang',colors:[0x869cb9,0xb5a3cf,0xd4b394],shapes:['gear','box','gear']}
};
let category='fmcg';
const industryDemo=document.querySelector('[data-commerce="industry"]');
document.querySelectorAll('[data-industry]').forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.industry;
 document.querySelectorAll('[data-industry]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
 const info=categories[category];
 document.querySelector('[data-industry-title]').textContent=info.title;
 document.querySelector('[data-industry-description]').textContent=info.description;
 industryDemo.querySelector('[data-category-caption]').textContent=info.caption;
 industryDemo.querySelector('.commerce-canvas').setAttribute('aria-label',`Ilustrasi distribusi ${info.caption} dari gudang menuju outlet`);
 window.dispatchEvent(new CustomEvent('industrychange', {detail: info}));
}));
