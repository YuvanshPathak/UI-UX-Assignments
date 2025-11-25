const packages = [
  { id: 1, destination: 'Paris, France', durationDays: 5, basePrice: 120000, season: 'regular' },
  { id: 2, destination: 'Bali, Indonesia', durationDays: 7, basePrice: 150000, season: 'off' },
  { id: 3, destination: 'Rome, Italy', durationDays: 6, basePrice: 130000, season: 'peak' },
  { id: 4, destination: 'Zurich, Switzerland', durationDays: 8, basePrice: 200000, season: 'peak' }
];

function formatRs(n) {
  return 'Rs.' + n.toLocaleString('en-IN');
}

function computeFinalPrice(pkg) {
  let multiplier = 1;
  switch ((pkg.season || '').toLowerCase()) {
    case 'peak':
      multiplier = 1.2;
      break;
    case 'off':
      multiplier = 0.9;
      break;
    default:
      multiplier = 1.0;
  }
  if (pkg.durationDays > 7) {
    multiplier += 0.05;
  }
  return Math.round(pkg.basePrice * multiplier);
}

function renderPackagesTable() {
  const table = document.getElementById('packagesTable');
  if (!table) return;
  const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
  tbody.innerHTML = '';
  packages.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.destination}</td>
      <td>${p.durationDays} Days</td>
      <td>${formatRs(p.basePrice)}</td>
      <td>${formatRs(computeFinalPrice(p))}</td>
    `;
    tbody.appendChild(tr);
  });
}

function populatePackageSelects() {
  document.querySelectorAll('select[data-packages="true"]').forEach(select => {
    select.innerHTML = '<option value="">Select Package</option>' + packages.map(p => `
      <option value="${p.id}">${p.destination} - ${p.durationDays}d</option>`).join('');
  });
}

function setupBookingEstimator() {
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const guests = document.getElementById('guests');
  const promo = document.getElementById('promo');
  const pkgSelect = document.getElementById('packageSelect');
  const estimateEl = document.getElementById('estimate');
  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;
  function nightsBetween(a, b) {
    if (!a || !b) return 0;
    const d1 = new Date(a);
    const d2 = new Date(b);
    const ms = d2 - d1;
    return ms > 0 ? Math.round(ms / (1000 * 60 * 60 * 24)) : 0;
  }
  function promoAdjustment(code) {
    if (!code) return 0;
    switch ((code || '').trim().toUpperCase()) {
      case 'EARLYBIRD': return -0.10;
      case 'FALLSALE': return -0.15;
      default: return 0;
    }
  }
  function calc() {
    const pkgId = parseInt(pkgSelect.value, 10);
    const pkg = packages.find(p => p.id === pkgId);
    const nights = nightsBetween(checkin?.value, checkout?.value);
    let base = pkg ? computeFinalPrice(pkg) : 0;
    const perNight = nights > 0 ? Math.round(base / pkg.durationDays) : Math.round(base);
    let total = perNight * Math.max(1, nights);
    const g = parseInt(guests?.value || '1', 10);
    if (g > 2) total = Math.round(total * 1.2);
    const adj = promoAdjustment(promo?.value);
    if (adj !== 0) total = Math.round(total * (1 + adj));
    estimateEl.textContent = total ? formatRs(total) : '—';
    const valid = form.checkValidity() && nights > 0 && pkgId;
    submitBtn.disabled = !valid;
    return { total, valid };
  }
  [checkin, checkout, guests, promo, pkgSelect].forEach(el => el && el.addEventListener('input', calc));
  form.addEventListener('input', calc);
  calc();
}

function setupGallery() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  let modal = document.getElementById('imageModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">×</button>
        <img src="" alt="" id="modalImg">
        <p id="modalCaption"></p>
      </div>`;
    document.body.appendChild(modal);
  }
  const modalImg = modal.querySelector('#modalImg');
  const modalCaption = modal.querySelector('#modalCaption');
  const closeBtn = modal.querySelector('.modal-close');
  gallery.querySelectorAll('.gallery-item img').forEach(img => {
    const large = img.getAttribute('data-large') || img.src;
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      modal.classList.add('open');
      modalImg.src = large;
      modalImg.alt = img.alt || '';
      modalCaption.textContent = img.getAttribute('data-title') || img.alt || '';
    });
  });
  function close() { modal.classList.remove('open'); }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  const toggle = document.getElementById('galleryToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      gallery.classList.toggle('list');
      toggle.textContent = gallery.classList.contains('list') ? 'Grid View' : 'List View';
    });
  }
}

function highlightNav() {
  const links = document.querySelectorAll('nav a');
  const page = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(page)) a.classList.add('active'); else a.classList.remove('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPackagesTable();
  populatePackageSelects();
  setupBookingEstimator();
  setupGallery();
  highlightNav();
});
