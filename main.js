const CONFIG = {
  products: {
    5:  { price: 45000,  shipping: 3000, label: '5kg' },
    10: { price: 85000,  shipping: 0,    label: '10kg', badge: '가성비 추천', badgeClass: 'green' },
    15: { price: 120000, shipping: 0,    label: '15kg', badge: '대용량 추천', badgeClass: 'red' }
  },
  phone: '000-0000-0000',
  kakaoLink: '#'
};

document.addEventListener('DOMContentLoaded', () => {
  // 연락처
  ['header-phone','mid-phone','footer-phone','sticky-phone','order-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = `tel:${CONFIG.phone}`;
  });
  ['mid-kakao','footer-kakao','sticky-kakao'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.kakaoLink;
  });
  const fp = document.getElementById('footer-phone');
  if (fp) fp.textContent = CONFIG.phone;

  renderProducts();

  window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', scrollY > 40);
  });

  const nav = document.getElementById('nav');
  document.getElementById('hamburger').onclick = () => nav.classList.toggle('open');
  nav.querySelectorAll('a').forEach(a => a.onclick = () => nav.classList.remove('open'));

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.onclick = () => btn.parentElement.classList.toggle('open');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  setupOrder();
});

function formatPrice(n) {
  return n.toLocaleString('ko-KR') + '원';
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const colors = {
    5:  'linear-gradient(145deg, #FFF5F0, #FFE0D6)',
    10: 'linear-gradient(145deg, #E8F5E9, #C8E6C9)',
    15: 'linear-gradient(145deg, #FFF8E1, #FFECB3)'
  };
  const emojis = { 5: '🌶️', 10: '🌶️🌶️', 15: '🌶️🌶️🌶️' };

  [5, 10, 15].forEach(size => {
    const p = CONFIG.products[size];
    const unit = Math.round(p.price / size);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${p.badge ? `<span class="badge-tag ${p.badgeClass}">${p.badge}</span>` : ''}
      <div class="product-thumb" style="background:${colors[size]}">
        <div class="emoji">${emojis[size]}</div>
        <div class="label">김가네 ${p.label}</div>
      </div>
      <div class="product-body">
        <h3>고춧가루 ${p.label}</h3>
        <div class="price">${formatPrice(p.price)}</div>
        <div class="unit">1kg당 ${formatPrice(unit)}</div>
        <div class="ship">${p.shipping === 0 ? '무료배송' : '배송비 ' + formatPrice(p.shipping)}</div>
        <button class="btn btn-primary" data-size="${size}">구매하기</button>
      </div>
    `;
    card.querySelector('button').onclick = () => openOrder(size);
    grid.appendChild(card);
  });
}

let curSize = 5, curQty = 1;

function openOrder(size = 5) {
  curSize = size; curQty = 1;
  document.getElementById('order-qty').value = 1;
  document.querySelectorAll('input[name="size"]').forEach(r => r.checked = +r.value === size);
  updateSummary();
  document.getElementById('order-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateSummary() {
  const p = CONFIG.products[curSize];
  const total = p.price * curQty;
  document.getElementById('summary-product').textContent = formatPrice(total);
  document.getElementById('summary-shipping').textContent = p.shipping === 0 ? '무료' : formatPrice(p.shipping);
  document.getElementById('summary-total').textContent = formatPrice(total + p.shipping);
}

function setupOrder() {
  document.getElementById('order-close').onclick = closeOrder;
  document.querySelector('.modal-bg').onclick = closeOrder;

  document.querySelectorAll('input[name="size"]').forEach(r => {
    r.onchange = () => { curSize = +r.value; updateSummary(); };
  });
  document.getElementById('qty-minus').onclick = () => {
    if (curQty > 1) { curQty--; document.getElementById('order-qty').value = curQty; updateSummary(); }
  };
  document.getElementById('qty-plus').onclick = () => {
    if (curQty < 20) { curQty++; document.getElementById('order-qty').value = curQty; updateSummary(); }
  };
  document.getElementById('order-qty').onchange = e => {
    curQty = Math.max(1, Math.min(20, +e.target.value || 1));
    e.target.value = curQty; updateSummary();
  };

  document.getElementById('order-form').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    alert(`주문이 접수되었습니다!\n\n김가네 고춧가루 ${curSize}kg × ${curQty}개\n총액: ${document.getElementById('summary-total').textContent}\n\n이름: ${fd.get('name')}\n연락처: ${fd.get('phone')}`);
    closeOrder();
    e.target.reset();
  };
}

function closeOrder() {
  document.getElementById('order-modal').classList.remove('open');
  document.body.style.overflow = '';
}