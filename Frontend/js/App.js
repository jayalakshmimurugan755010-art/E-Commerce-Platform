const API_URL = 'http://localhost:5000/api';
let currentUser = null;

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: username.toLowerCase().includes('admin') ? 'Admin' : 'User' })
    });
    const data = await response.json();
    alert(data.message || data.error);
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();

    if (data.success) {
        currentUser = data;
        document.getElementById('userDisplay').innerText = `${data.username} (${data.role})`;
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('navBar').classList.remove('hidden');
        document.getElementById('storeSection').classList.remove('hidden');
        
        if (data.role === 'Admin') {
            document.getElementById('adminPanel').classList.remove('hidden');
        }
        loadProducts();
        loadOrders();
    } else {
        alert(data.message);
    }
}

function logout() {
    currentUser = null;
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('navBar').classList.add('hidden');
    document.getElementById('storeSection').classList.add('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
}

async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    products.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <div class="price">$${p.price}</div>
                <button onclick="placeOrder('${p.name}', ${p.price})">Buy Now</button>
            </div>
        `;
    });
}

async function addProduct() {
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    const description = document.getElementById('prodDesc').value;

    await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description })
    });
    alert('Product added successfully!');
    loadProducts();
}

async function placeOrder(prodName, price) {
    await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username, items: [prodName], total: price })
    });
    alert('Order submitted successfully!');
    loadOrders();
}

async function loadOrders() {
    const response = await fetch(`${API_URL}/orders`);
    const orders = await response.json();
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';

    if(orders.length === 0) {
        orderList.innerHTML = 'No transactions found.';
        return;
    }

    orders.forEach(o => {
        orderList.innerHTML += `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>Order ID:</strong> ${o._id} | <strong>Buyer:</strong> ${o.username} | <strong>Items:</strong> ${o.items.join(', ')} | <strong>Total:</strong> $${o.total} | <span style="color: orange; font-weight:bold;">[${o.status}]</span>
            </div>
        `;
    });
}