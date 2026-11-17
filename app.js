const grid = document.getElementById('productGrid');
const filters = document.getElementById('filters');
const money = value => `${STORE.currency} ${Number(value).toFixed(2)}`;
const waUrl = (message='Hola, Grec Mind. Quisiera información sobre sus prendas.') => {
  const phone = (STORE.whatsapp || '').replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
['navWhatsapp','heroWhatsapp','catalogWhatsapp','aboutWhatsapp','footerWhatsapp'].forEach(id => {
  const link = document.getElementById(id);
  link.href = waUrl(); link.target = '_blank'; link.rel = 'noopener';
});
document.getElementById('year').textContent = new Date().getFullYear();

function renderFilters(active='Todos') {
  const categories = ['Todos', ...new Set(PRODUCTS.map(p => p.category).filter(Boolean))];
  filters.innerHTML = categories.map(c => `<button class="filter ${c===active?'active':''}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
  filters.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    renderFilters(btn.dataset.category); renderProducts(btn.dataset.category);
  }));
}
function renderProducts(category='Todos') {
  const list = category === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><strong>Tu próxima prenda favorita estará aquí.</strong>Estamos preparando la colección. Vuelve pronto o escríbenos por WhatsApp para consultar novedades.</div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const message = `Hola, Grec Mind. Me interesa ${p.name}${p.description ? ' - '+p.description : ''}. ¿Me brindan más información?`;
    const photo = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=&quot;photo-placeholder&quot;>Agrega la foto<br>del producto</span>'">`
      : `<span class="photo-placeholder">Grec Mind<br>Foto del producto</span>`;
    return `<article class="product-card"><div class="product-photo">${photo}</div><div class="product-info"><span class="product-category">${escapeHtml(p.category||'Colección')}</span><h3 class="product-name">${escapeHtml(p.name)}</h3><div class="product-price">${money(p.price)}</div><a class="product-buy" href="${waUrl(message)}" target="_blank" rel="noopener">Consultar por WhatsApp ↗</a></div></article>`;
  }).join('');
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
renderFilters(); renderProducts();
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.topbar nav');
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
