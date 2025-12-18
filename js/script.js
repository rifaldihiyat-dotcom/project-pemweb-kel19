// ==========================================
// 1. DATA PRODUK (DATABASE LOKAL)
// ==========================================
const products = [
    // --- Kategori: Buah ---
    // Path: foto produk/buah buahan/
    { id: 1, name: "Alpukat Mentega 1kg", category: "buah", price: 37000, image: "foto produk/buah buahan/Alpucado.jpg", desc: "Alpukat mentega pilihan, daging tebal dan legit." },
    { id: 2, name: "Apel Merah 1kg", category: "buah", price: 6055, image: "foto produk/buah buahan/Apel.jpg", desc: "Apel merah segar dengan rasa manis alami." },
    { id: 3, name: "Semangka Non-Biji", category: "buah", price: 47000, image: "foto produk/buah buahan/Semangka.jpg", desc: "Semangka segar tanpa biji, cocok untuk cuaca panas." },
    { id: 4, name: "Strawberry Pack", category: "buah", price: 42800, image: "foto produk/buah buahan/Strawbery.jpg", desc: "Strawberry organik hasil petik pagi hari." },
    { id: 5, name: "Anggur Segar", category: "buah", price: 25000, image: "foto produk/buah buahan/Anggur.jpg", desc: "Anggur manis segar." },

    // --- Kategori: Snack ---
    // Path: foto produk/makanan ringan organik/
    { id: 6, name: "Raspberry Dried", category: "snack", price: 35000, image: "foto produk/makanan ringan organik/Raspberry.jpeg", desc: "Camilan raspberry kering yang sehat." },
    { id: 7, name: "Clover Mix", category: "snack", price: 35000, image: "foto produk/makanan ringan organik/Four-leaf clover.jpeg", desc: "Campuran kacang dan buah kering." },
    { id: 8, name: "Tropicana Mix", category: "snack", price: 35000, image: "foto produk/makanan ringan organik/Tropicana.jpeg", desc: "Buah tropis kering rasa eksotis." },

    // --- Kategori: Minuman ---
    // Path: foto produk/minuman organik/
    { id: 9, name: "Juice Watermelon", category: "minuman", price: 10000, image: "foto produk/minuman organik/jus semangka.jpeg", desc: "Jus semangka murni tanpa gula." },
    { id: 10, name: "Juice Dragonfruit", category: "minuman", price: 15000, image: "foto produk/minuman organik/jus naga.jpeg", desc: "Jus naga merah segar." },

    // --- Kategori: Sayur ---
    // Path: foto produk/sayur sayuran/
    { id: 11, name: "Tomat Merah 1kg", category: "sayur", price: 10000, image: "foto produk/sayur sayuran/tomat.jpeg", desc: "Tomat merah segar untuk masakan." },
    { id: 12, name: "Kol Organik 1kg", category: "sayur", price: 9000, image: "foto produk/sayur sayuran/kol.jpeg", desc: "Kol segar renyah bebas pestisida." },
    { id: 13, name: "Wortel Brastagi 1kg", category: "sayur", price: 15000, image: "foto produk/sayur sayuran/wortel.jpeg", desc: "Wortel pilihan kaya vitamin A." },
    { id: 14, name: "Kentang Dieng 1kg", category: "sayur", price: 30000, image: "foto produk/sayur sayuran/kentang.jpeg", desc: "Kentang pulen cocok untuk segala masakan." },
    { id: 15, name: "Bayam Hijau 1 Ikat", category: "sayur", price: 8000, image: "foto produk/sayur sayuran/bayam.jpeg", desc: "Bayam hijau segar langsung dari petani." }
];

// Ambil data keranjang dari LocalStorage (Memory Browser)
let cartData = JSON.parse(localStorage.getItem('myOrganicCart')) || [];
let currentModalProductId = null;
let currentModalQty = 1;
let productModalInstance;

// Helper: Format Rupiah
const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // A. Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // B. Dark Mode Setup
    initDarkMode();

    // C. Halaman Home (Index)
    if(document.getElementById('product-list')) {
        renderProducts('all');
        productModalInstance = new bootstrap.Modal(document.getElementById('productModal'));
    }

    // D. Halaman Keranjang
    if(document.getElementById('cart-table-body')) {
        initCartPage();
    }
    
    // E. Checkout
    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm) {
        document.getElementById('courierSelect').addEventListener('change', calculateTotalCheckout);
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // F. Setup Forms (Login/Reg/Contact)
    setupForms();

    // G. Update Badge
    updateCartBadge();
});

// ==========================================
// 3. DARK MODE
// ==========================================
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const icon = darkModeBtn ? darkModeBtn.querySelector('i') : null;

    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if(icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            icon.style.color = "gold";
        }
    }

    if(darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if(isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                icon.style.color = "gold";
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                icon.style.color = "";
            }
        });
    }
}

// ==========================================
// 4. RENDER PRODUK
// ==========================================
function renderProducts(filterCategory) {
    const productList = document.getElementById('product-list');
    if(!productList) return;

    productList.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-success"></div><p class="mt-2 text-muted">Mengambil produk segar...</p></div>';

    setTimeout(() => {
        productList.innerHTML = '';
        const filtered = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);

        if(filtered.length === 0) {
            productList.innerHTML = '<div class="col-12 text-center py-5 text-muted"><h4>Produk kategori ini sedang kosong.</h4></div>';
            return;
        }

        filtered.forEach(p => {
            // Gambar fallback jika path salah
            const fallbackImg = 'https://dummyimage.com/500x500/dee2e6/6c757d.jpg&text=No+Image';
            
            const html = `
                <div class="col-6 col-md-3 fade-in">
                    <div class="product-card h-100 position-relative" onclick="openModal(${p.id})">
                        <div class="overflow-hidden">
                            <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height: 200px; object-fit: cover;" onerror="this.src='${fallbackImg}'">
                        </div>
                        <span class="badge bg-success position-absolute top-0 end-0 m-2 shadow-sm text-uppercase">${p.category}</span>
                        <div class="card-body p-3 d-flex flex-column">
                            <h6 class="card-title fw-bold text-truncate">${p.name}</h6>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fw-bold text-success">${formatRupiah(p.price)}</span>
                                <button class="btn btn-sm btn-outline-success rounded-circle shadow-sm">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += html;
        });
    }, 400);
}

function filterProducts(cat) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    renderProducts(cat);
}

// ==========================================
// 5. MODAL
// ==========================================
function openModal(id) {
    const product = products.find(p => p.id === id);
    if(!product) return;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-category').innerText = product.category;
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-id').innerText = `SKU-00${product.id}`;
    document.getElementById('modal-price').innerText = formatRupiah(product.price);
    document.getElementById('modal-desc').innerText = product.desc;

    currentModalProductId = product.id;
    currentModalQty = 1;
    document.getElementById('qty-input').value = 1;
    updateTotalPriceDisplay();

    if(productModalInstance) productModalInstance.show();
}

function updateQuantity(change) {
    let newQty = currentModalQty + change;
    if(newQty < 1) return;
    currentModalQty = newQty;
    document.getElementById('qty-input').value = newQty;
    updateTotalPriceDisplay();
}

function updateTotalPriceDisplay() {
    const product = products.find(p => p.id === currentModalProductId);
    if(product) {
        const total = product.price * currentModalQty;
        document.getElementById('modal-total-price').innerText = formatRupiah(total);
    }
}

function addToCartFromModal() {
    const product = products.find(p => p.id === currentModalProductId);
    if(product) {
        addToCart(product, currentModalQty);
        if(productModalInstance) productModalInstance.hide();
        showFloatingAlert(`<strong>Berhasil!</strong> ${product.name} ditambahkan.`);
    }
}

function buyNowFromModal() {
    addToCartFromModal();
    setTimeout(() => {
        window.location.href = 'cara-belanja.html';
    }, 500);
}

// ==========================================
// 6. KERANJANG
// ==========================================
function addToCart(product, qty) {
    const existing = cartData.find(item => item.id === product.id);
    if(existing) {
        existing.qty += qty;
    } else {
        cartData.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: qty
        });
    }
    saveCart();
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('myOrganicCart', JSON.stringify(cartData));
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.badge-cart');
    const totalQty = cartData.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(b => b.innerText = totalQty);
}

function initCartPage() {
    const tbody = document.getElementById('cart-table-body');
    if(!tbody) return;

    tbody.innerHTML = '';
    let subtotal = 0;

    if(cartData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-muted">Keranjang Anda kosong.<br><a href="index.html" class="btn btn-sm btn-success mt-2">Belanja Sekarang</a></td></tr>`;
    } else {
        cartData.forEach((item, index) => {
            const total = item.price * item.qty;
            subtotal += total;
            tbody.innerHTML += `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;" onerror="this.src='https://dummyimage.com/50x50/dee2e6/6c757d.jpg'">
                            <div><div class="fw-bold small">${item.name}</div></div>
                        </div>
                    </td>
                    <td>${formatRupiah(item.price)}</td>
                    <td>
                        <div class="input-group input-group-sm" style="width: 100px;">
                            <button class="btn btn-outline-secondary" onclick="updateCartItem(${index}, -1)">-</button>
                            <input type="text" class="form-control text-center p-0" value="${item.qty}" readonly>
                            <button class="btn btn-outline-success" onclick="updateCartItem(${index}, 1)">+</button>
                        </div>
                    </td>
                    <td class="fw-bold text-success">${formatRupiah(total)}</td>
                    <td><button class="btn btn-sm text-danger" onclick="removeCartItem(${index})"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
        });
    }

    const subtotalEl = document.getElementById('checkout-subtotal');
    if(subtotalEl) {
        subtotalEl.innerText = formatRupiah(subtotal);
        subtotalEl.dataset.val = subtotal;
        calculateTotalCheckout();
    }
}

function updateCartItem(index, change) {
    if(cartData[index].qty + change < 1) return;
    cartData[index].qty += change;
    saveCart();
    initCartPage();
    updateCartBadge();
}

function removeCartItem(index) {
    if(confirm("Hapus produk ini dari keranjang?")) {
        cartData.splice(index, 1);
        saveCart();
        initCartPage();
        updateCartBadge();
    }
}

// ==========================================
// 7. CHECKOUT
// ==========================================
function calculateTotalCheckout() {
    const subtotalEl = document.getElementById('checkout-subtotal');
    if(!subtotalEl) return;
    
    const subtotal = parseInt(subtotalEl.dataset.val || 0);
    const courierVal = parseInt(document.getElementById('courierSelect').value || 0);
    
    document.getElementById('checkout-shipping').innerText = courierVal === 0 ? "Gratis" : formatRupiah(courierVal);
    document.getElementById('checkout-total').innerText = formatRupiah(subtotal + courierVal);
}

function handleCheckout(e) {
    e.preventDefault();
    if(cartData.length === 0) {
        showFloatingAlert("Keranjang kosong!", "danger");
        return;
    }
    const courierVal = document.getElementById('courierSelect').value;
    if(courierVal === "0" && document.getElementById('courierSelect').selectedIndex === 0) {
        showFloatingAlert("Silakan pilih kurir pengiriman!", "danger");
        return;
    }

    showFloatingAlert("<strong>Pesanan Diterima!</strong> Terima kasih telah berbelanja.", "success");
    
    cartData = [];
    saveCart();
    initCartPage();
    updateCartBadge();

    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

// ==========================================
// 8. FORMS & ALERTS
// ==========================================
function setupForms() {
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = document.getElementById('inputNama').value;
            if(!nama) { showFloatingAlert("Isi nama dulu!", "danger"); return; }
            showFloatingAlert(`<strong>Terkirim!</strong> Terima kasih ${nama}, pesan diterima.`);
            contactForm.reset();
        });
    }

    const regForm = document.getElementById('registerFormElement');
    if(regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const p1 = document.getElementById('regPass').value;
            const p2 = document.getElementById('regConfirm').value;
            
            if(p1 !== p2) {
                showFloatingAlert("Password tidak sama!", "danger");
            } else {
                showFloatingAlert("<strong>Pendaftaran Berhasil!</strong> Silakan Login.", "success");
                regForm.reset();
                const loginTabBtn = document.getElementById('pills-login-tab');
                if(loginTabBtn) {
                    const tab = new bootstrap.Tab(loginTabBtn);
                    setTimeout(() => tab.show(), 1500);
                }
            }
        });
    }

    const loginForm = document.getElementById('loginFormElement');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showFloatingAlert("<strong>Login Berhasil!</strong> Mengalihkan...", "success");
            setTimeout(() => window.location.href = "index.html", 1500);
        });
    }
}

function showFloatingAlert(message, type = 'success') {
    let container = document.getElementById('alert-container');
    if(!container) return;

    const el = document.createElement('div');
    const bgClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    el.className = `alert ${bgClass} custom-alert alert-dismissible fade show mb-2 shadow`;
    el.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${iconClass} me-2 fs-5"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(el);

    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 200);
    }, 3000);
}