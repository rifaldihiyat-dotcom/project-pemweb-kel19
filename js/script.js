// FATA PRODUK (HARGA,FOTO,DESKRIPSI)
const products = [
    // Buah
    { id: 1, name: "Alpukat Mentega 1kg", category: "buah", price: 37000, image: "foto produk/buah buahan/Alpucado.jpg", desc: "Alpukat mentega pilihan." },
    { id: 2, name: "Apel Merah 1kg", category: "buah", price: 6055, image: "foto produk/buah buahan/Apel.jpg", desc: "Apel merah segar manis." },
    { id: 3, name: "Semangka Non-Biji 1kg ", category: "buah", price: 47000, image: "foto produk/buah buahan/Semangka.jpg", desc: "Semangka segar tanpa biji." },
    { id: 4, name: "Strawberry 1 kg", category: "buah", price: 42800, image: "foto produk/buah buahan/Strawbery.jpg", desc: "Strawberry organik." },
    { id: 5, name: "Anggur Segar", category: "buah", price: 25000, image: "foto produk/buah buahan/Anggur.jpg", desc: "Anggur manis segar." },
    // Snack
    { id: 6, name: "Raspberry Dried", category: "snack", price: 35000, image: "foto produk/makanan ringan organik/Raspberry.jpeg", desc: "Camilan raspberry sehat." },
    { id: 7, name: "Clover Mix", category: "snack", price: 35000, image: "foto produk/makanan ringan organik/Four-leaf clover.jpeg", desc: "Mix buah kering." },
    { id: 8, name: "Tropicana Mix", category: "snack", price: 35000, image: "foto produk/makanan ringan organik/Tropicana.jpeg", desc: "Buah tropis kering." },
    // Minuman
    { id: 9, name: "Juice Watermelon", category: "minuman", price: 10000, image: "foto produk/minuman organik/jus semangka.jpeg", desc: "Jus semangka murni." },
    { id: 10, name: "Juice Dragonfruit", category: "minuman", price: 15000, image: "foto produk/minuman organik/jus naga.jpeg", desc: "Jus naga merah." },
    // Sayur
    { id: 11, name: "Tomat Merah 1kg", category: "sayur", price: 10000, image: "foto produk/sayur sayuran/tomat.jpeg", desc: "Tomat merah segar." },
    { id: 12, name: "Kol Organik 1kg", category: "sayur", price: 9000, image: "foto produk/sayur sayuran/kol.jpeg", desc: "Kol segar renyah." },
    { id: 13, name: "Wortel Brastagi 1kg", category: "sayur", price: 15000, image: "foto produk/sayur sayuran/wortel.jpeg", desc: "Wortel vitamin A." },
    { id: 14, name: "Kentang Dieng 1kg", category: "sayur", price: 30000, image: "foto produk/sayur sayuran/kentang.jpeg", desc: "Kentang pulen." },
    { id: 15, name: "Bayam Hijau 1kg", category: "sayur", price: 8000, image: "foto produk/sayur sayuran/bayam.jpeg", desc: "Bayam hijau segar." }
];

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

// SYESA ALERT MENGAMBANG
function showFloatingAlert(message, type = 'success') {
    // 1. Cek apakah container alert sudah ada?
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        // Kalau belum ada, kita buatkan div penampungnya
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.className = 'position-fixed top-0 end-0 p-3';
        alertContainer.style.zIndex = '99999';
        document.body.appendChild(alertContainer);
    }

    // 2. Buat elemen alert baru
    const alertEl = document.createElement('div');
    alertEl.className = `custom-alert alert-dismissible fade show mb-3`;
    
    // Warna merah jika type='danger' (error)
    if(type === 'danger') {
        alertEl.style.backgroundColor = '#f8d7da';
        alertEl.style.color = '#842029';
        alertEl.style.borderLeftColor = '#dc3545';
    }

    // 3. Isi HTML Alert (Icon Centang + Pesan)
    alertEl.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'} me-2 fs-5"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // 4. Masukkan ke layar
    alertContainer.appendChild(alertEl);

    // 5. Hilang otomatis setelah 4 detik
    setTimeout(() => {
        alertEl.classList.remove('show'); // Animasi fade out
        setTimeout(() => alertEl.remove(), 200); // Hapus elemen
    }, 4000);
}

//LOGIC UTAMA (SAAT HALAMAN DIMUAT)
let currentProductPrice = 0;
let currentQuantity = 1;
let productModal;

document.addEventListener("DOMContentLoaded", function() {
    
    // A. SCROLL EFFECT NAVBAR (Interaksi Scroll)
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // B. DARK MODE (Toggle Menu)
    const darkModeBtn = document.getElementById('darkModeBtn');
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if(darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    if(darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if(document.body.classList.contains('dark-mode')){
                localStorage.setItem('theme', 'dark');
                darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }

    // C. INISIALISASI MODAL & PRODUK
    if(document.getElementById('productModal')) {
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
    }
    if(document.getElementById('product-list')) {
        renderProducts('all');
    }
});

// RENDER PRODUK & FILTERING
function renderProducts(filterCategory) {
    const productList = document.getElementById('product-list');
    if(!productList) return;
    
    productList.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-success"></div></div>';

    setTimeout(() => {
        productList.innerHTML = ''; 
        const filteredData = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);

        if(filteredData.length === 0) {
            productList.innerHTML = '<div class="col-12 text-center text-muted">Produk kosong.</div>';
            return;
        }

        filteredData.forEach(product => {
            const cardHTML = `
                <div class="col-6 col-md-3 fade-in">
                    <div class="product-card h-100" onclick="openModal(${product.id})">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" onerror="this.src='https://placehold.co/400x300?text=Gambar+Rusak'">
                        <div class="card-body p-3">
                            <small class="text-uppercase text-muted fw-bold" style="font-size:0.7rem;">${product.category}</small>
                            <h6 class="card-title fw-bold mt-1">${product.name}</h6>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="price-tag">${formatRupiah(product.price)}</span>
                                <button class="btn btn-sm btn-outline-success rounded-circle"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>`;
            productList.innerHTML += cardHTML;
        });
    }, 300);
}

function filterProducts(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    if(event) event.target.classList.add('active');
    renderProducts(category);
}

// LOGIC MODAL PRODUK
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-category').innerText = product.category.toUpperCase();
    document.getElementById('modal-price').innerText = formatRupiah(product.price);
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-id').innerText = `SKU-${product.id}`;

    currentProductPrice = product.price;
    currentQuantity = 1;
    document.getElementById('qty-input').value = 1;
    updateTotalPriceDisplay();

    if(productModal) productModal.show();
}

function updateQuantity(change) {
    let newQty = currentQuantity + change;
    if (newQty < 1) return;
    currentQuantity = newQty;
    document.getElementById('qty-input').value = currentQuantity;
    updateTotalPriceDisplay();
}

function updateTotalPriceDisplay() {
    const total = currentProductPrice * currentQuantity;
    document.getElementById('modal-total-price').innerText = formatRupiah(total);
}

// VALIDASI FORM KONTAK
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const nama = document.getElementById('inputNama').value.trim();
        const pesan = document.getElementById('inputPesan').value.trim();

        if(nama === "") {
            showFloatingAlert("<strong>Error!</strong> Nama harus diisi.", "danger");
            return;
        }
        if(pesan === "") {
            showFloatingAlert("<strong>Error!</strong> Pesan tidak boleh kosong.", "danger");
            return;
        }

        showFloatingAlert(`<strong>Terkirim!</strong> Terima kasih ${nama}, pesan Anda sudah kami terima.`);
        contactForm.reset();
    });
}