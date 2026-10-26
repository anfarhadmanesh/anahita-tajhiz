const allProducts = [
  { id: 1, name: 'فشارسنج دیجیتال بازویی عقربه ای میکرولایف', price: 3100000, img: 'DhEXrZoMbsSP7_SL.jpg', mainCat: 'تجهیزات پزشکی', category: 'فشارسنج', featured: true },
  { id: 7, name: 'فشارسنج بازویی دیجیتال بیم', price: 2800000, img: 'https://via.placeholder.com/200?text=BP', mainCat: 'تجهیزات پزشکی', category: 'فشارسنج', featured: false },
  { id: 2, name: 'ترمومتر غیرتماسی ایزولایف', price: 5600000, img: 'aE1To-tFeSR7nx6f.jpg', mainCat: 'تجهیزات پزشکی', category: 'ترمومتر', featured: true },
  { id: 9, name: 'ترمومتر دیجیتال زیر بغل', price: 450000, img: 'https://via.placeholder.com/200?text=Thermo', mainCat: 'تجهیزات پزشکی', category: 'ترمومتر', featured: false },
  { id: 3, name: 'پالس اکسیمتر یوول مدل YX301', price: 1600000, img: 'VZuwq_X6s_YP-MDr.jpg', mainCat: 'تجهیزات پزشکی', category: 'اکسیژن‌سنج', featured: true },
  { id: 4, name: 'سرنگ 5CC سها ( لوئر اسلیپ )', price: 8900, img: '560x560.webp', mainCat: 'لوازم پزشکی', category: 'سرنگ', featured: true },
  { id: 11, name: 'سرنگ 10CC سها', price: 12000, img: 'https://via.placeholder.com/200?text=Syringe', mainCat: 'لوازم پزشکی', category: 'سرنگ', featured: false },
  { id: 5, name: 'تخت معاینه ثابت یک شکن رازان', price: 12000000, img: 'w_JVdzqiulkFOa2O.jpg', mainCat: 'لوازم پزشکی', category: 'تخت معاینه', featured: true },
  { id: 6, name: 'گلوکومتر caresense + نوار تست', price: 4350000, img: '280x280.jpg', mainCat: 'محصولات بهداشتی', category: 'گلوکومتر', featured: true },
  { id: 15, name: 'ماسک سه لایه پزشکی', price: 150000, img: 'https://via.placeholder.com/200?text=Mask', mainCat: 'محصولات بهداشتی', category: 'ماسک و دستکش', featured: false }
];
const featuredProducts = allProducts.filter(p => p.featured);

let cart = JSON.parse(localStorage.getItem('anaahita_cart')) || [];

function updateCartUI() {
  localStorage.setItem('anaahita_cart', JSON.stringify(cart));
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = count;
  
  const cartContainer = document.getElementById('full-cart-container');
  if (cartContainer) {
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p style="text-align:center; padding: 40px;">سبد خرید خالی است. <br><br> <a href="index.html" style="color:#0d9488;">رفتن به فروشگاه</a></p>';
      document.getElementById('cart-checkout').style.display = 'none';
    } else {
      cartContainer.innerHTML = cart.map(i => `
        <div class="cart-item-row">
          <img src="${i.img}" width="80" style="border-radius:8px;">
          <div style="flex:1;">
            <h3 style="font-size:16px; margin-bottom:5px;">${i.name}</h3>
            <p style="color:#0d9488; font-weight:bold;">${i.price.toLocaleString('fa-IR')} تومان</p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button onclick="changeQty(${i.id}, -1)" style="width:30px; height:30px; background:#f3f4f6; font-size:18px; border-radius:5px;">−</button>
            <span style="font-weight:bold;">${i.qty}</span>
            <button onclick="changeQty(${i.id}, 1)" style="width:30px; height:30px; background:#f3f4f6; font-size:18px; border-radius:5px;">+</button>
          </div>
        </div>
      `).join('');
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      document.getElementById('cart-checkout').style.display = 'block';
      document.getElementById('full-cart-total').textContent = total.toLocaleString('fa-IR') + ' تومان';
    }
  }
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...allProducts.find(p => p.id === id), qty: 1 });
  updateCartUI();
  alert('✅ به سبد خرید اضافه شد');
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateCartUI();
  }
}

function renderProducts(list) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:40px;">محصولی یافت نشد</p>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}"></a>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="price">${p.price.toLocaleString('fa-IR')} تومان</p>
      <button onclick="addToCart(${p.id})">افزودن به سبد</button>
    </div>
  `).join('');
}

const path = window.location.pathname;
const urlParams = new URLSearchParams(window.location.search);

if (path.includes('index.html') || path === '/' || !path.includes('.html')) {
  renderProducts(featuredProducts);
}
else if (path.includes('category.html')) {
  const cat = urlParams.get('cat');
  const main = urlParams.get('main');
  const titleEl = document.getElementById('category-title');
  const countEl = document.getElementById('category-count');
  
  let filtered = [];
  if (cat) {
    if (titleEl) titleEl.textContent = cat;
    filtered = allProducts.filter(p => p.category === cat);
  } else if (main) {
    if (titleEl) titleEl.textContent = main;
    filtered = allProducts.filter(p => p.mainCat === main);
  } else {
    filtered = allProducts;
  }
  
  if (countEl) countEl.textContent = `${filtered.length} محصول یافت شد`;
  renderProducts(filtered);
}
else if (path.includes('product.html')) {
  const prodId = urlParams.get('id');
  const product = allProducts.find(p => p.id == prodId);
  const detailContainer = document.getElementById('product-detail');
  if (product && detailContainer) {
    detailContainer.innerHTML = `
      <div style="display: flex; gap: 40px; background: #fff; padding: 30px; border-radius: 12px; margin-top: 40px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;"><img src="${product.img}" style="width:100%; border-radius:12px;"></div>
        <div style="flex: 1; min-width: 300px; display:flex; flex-direction:column;">
          <h1 style="color: #1f2937;">${product.name}</h1>
          <p style="color: #6b7280; margin-bottom:20px;">دسته: ${product.category}</p>
          <p style="font-size: 24px; color: #0d9488; font-weight: bold; margin-bottom: 30px;">${product.price.toLocaleString('fa-IR')} تومان</p>
          <button onclick="addToCart(${product.id})" class="btn-primary" style="background: #0d9488; color: white; margin-top:auto;">افزودن به سبد 🛒</button>
        </div>
      </div>`;
  }
}

const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query === '') {
      if (path.includes('category.html')) window.location.reload();
      else renderProducts(featuredProducts);
      return;
    }
    const results = allProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderProducts(results);
  });
}

function toggleNews() {
  document.getElementById('news-sidebar')?.classList.toggle('open');
  document.getElementById('news-toggle')?.classList.toggle('open');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  if (tab === 'login') {
    document.querySelectorAll('.auth-tab')[0]?.classList.add('active');
    document.getElementById('form-login')?.classList.add('active');
  } else {
    document.querySelectorAll('.auth-tab')[1]?.classList.add('active');
    document.getElementById('form-register')?.classList.add('active');
  }
}
updateCartUI();