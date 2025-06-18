// CeramicBD Frontend JavaScript

// Product data
const products = [
    {
        id: 1,
        name: "Heritage Bathroom Tiles",
        category: "tiles",
        price: 2500,
        originalPrice: 3000,
        image: "./images/Screenshot2025-05-30165423.png",
        description: "Traditional patterns with modern durability",
        rating: 4.5,
        isNew: true,
        isFeatured: false
    },
    {
        id: 2,
        name: "Artisan Wash Basin",
        category: "sanitaryware",
        price: 15000,
        originalPrice: null,
        image: "./images/Screenshot2025-05-30164629.png",
        description: "Hand-carved ceramic basin with cultural motifs",
        rating: 5.0,
        isNew: false,
        isFeatured: true
    },
    {
        id: 3,
        name: "Nakshi Kantha Wall Tiles",
        category: "tiles",
        price: 1800,
        originalPrice: 2200,
        image: "./images/Screenshot2025-05-30165006.png",
        description: "Inspired by traditional Bangladeshi embroidery",
        rating: 4.8,
        isNew: true,
        isFeatured: false
    },
    {
        id: 4,
        name: "Premium Toilet Suite",
        category: "sanitaryware",
        price: 25000,
        originalPrice: null,
        image: "./images/Screenshot2025-06-01035722.png",
        description: "Complete bathroom solution with elegant design",
        rating: 4.7,
        isNew: false,
        isFeatured: false
    },
    {
        id: 5,
        name: "Festive Floor Tiles",
        category: "tiles",
        price: 3200,
        originalPrice: null,
        image: "./images/Screenshot2025-05-30165028.png",
        description: "Celebrate tradition with every step",
        rating: 4.6,
        isNew: false,
        isFeatured: true
    },
    {
        id: 6,
        name: "Designer Sink Collection",
        category: "sanitaryware",
        price: 12000,
        originalPrice: 14000,
        image: "./images/Screenshot2025-06-01035702.png",
        description: "Modern aesthetics meet traditional craftsmanship",
        rating: 4.9,
        isNew: false,
        isFeatured: false
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('ceramicbd_cart')) || [];

// Update cart count in header
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('ceramicbd_cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    showNotification('Product added to cart!', 'success');
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('ceramicbd_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification('Product removed from cart!', 'info');
}

// Update quantity function
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('ceramicbd_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Render products function
function renderProducts(productsToRender = products) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (productsToRender.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>No products found.</p></div>';
        return;
    }
    
    productsToRender.forEach(product => {
        const discountPercentage = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="product-card">
                    ${discountPercentage > 0 ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
                    ${product.isNew ? '<div class="new-badge">New</div>' : ''}
                    ${product.isFeatured ? '<div class="featured-badge">Featured</div>' : ''}
                    
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid">
                        <div class="product-overlay">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline-primary">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="btn btn-outline-primary">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h5 class="product-name">${product.name}</h5>
                        <p class="product-description">${product.description}</p>
                        
                        <div class="product-rating">
                            ${generateStars(product.rating)}
                            <span class="rating-text">${product.rating} (${Math.floor(Math.random() * 50) + 10})</span>
                        </div>
                        
                        <div class="product-price">
                            <span class="current-price">৳${product.price.toLocaleString()}</span>
                            ${product.originalPrice ? `<span class="original-price">৳${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                        
                        <button class="btn btn-success add-to-cart-btn" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += productCard;
    });
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Render cart function
function renderCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
                <h3>Cart is Empty!</h3>
                <p class="text-muted">Add some products to your cart</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 10000 ? 0 : 500; // Free shipping over ৳10,000
    const total = subtotal + shipping;
    
    cartContent.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="cart-items">
                    <h4 class="mb-4">Shopping Cart (${cart.length} items)</h4>
                    
                    <div class="table-responsive">
                        <table class="table cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${cart.map(item => `
                                    <tr>
                                        <td>
                                            <div class="cart-product">
                                                <img src="${item.image}" alt="${item.name}" class="cart-product-image">
                                                <div class="cart-product-info">
                                                    <h6>${item.name}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>৳${item.price.toLocaleString()}</td>
                                        <td>
                                            <div class="quantity-controls">
                                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                                <span class="quantity">${item.quantity}</span>
                                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                            </div>
                                        </td>
                                        <td>৳${(item.price * item.quantity).toLocaleString()}</td>
                                        <td>
                                            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="cart-actions mt-4">
                        <a href="products.html" class="btn btn-outline-primary">Continue Shopping</a>
                        <button class="btn btn-secondary" onclick="clearCart()">Clear Cart</button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="cart-summary">
                    <h4>Order Summary</h4>
                    
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>৳${subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span>${shipping === 0 ? 'Free' : '৳' + shipping.toLocaleString()}</span>
                    </div>
                    
                    <hr>
                    
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>৳${total.toLocaleString()}</span>
                    </div>
                    
                    <button class="btn btn-success btn-lg w-100 mt-3" onclick="proceedToCheckout()">
                        Proceed to Checkout
                    </button>
                    
                    <div class="payment-methods mt-3">
                        <small class="text-muted">We accept:</small>
                        <div class="payment-icons">
                            <i class="fab fa-cc-visa"></i>
                            <i class="fab fa-cc-mastercard"></i>
                            <span class="payment-method">bKash</span>
                            <span class="payment-method">Nagad</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Clear cart function
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('ceramicbd_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
        showNotification('Cart cleared!', 'info');
    }
}

// Proceed to checkout function
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    // For now, just show a message
    showNotification('Checkout functionality will be implemented soon!', 'info');
}

// Newsletter subscription
function subscribeNewsletter(email) {
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address!', 'warning');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
    }, 500);
}

// Filter and sort functions
function filterProducts() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const priceRange = document.getElementById('priceRange')?.value || 50000;
    const sortBy = document.getElementById('sortBy')?.value || 'latest';
    
    let filteredProducts = products;
    
    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Filter by price
    filteredProducts = filteredProducts.filter(product => product.price <= priceRange);
    
    // Sort products
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Latest (default order)
            break;
    }
    
    renderProducts(filteredProducts);
    
    // Update product count
    const productCountElement = document.getElementById('productCount');
    if (productCountElement) {
        productCountElement.textContent = filteredProducts.length;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Render products on products page
    if (document.getElementById('products-container')) {
        renderProducts();
    }
    
    // Render cart on cart page
    if (document.getElementById('cart-content')) {
        renderCart();
    }
    
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        const maxPriceDisplay = document.getElementById('maxPrice');
        priceRange.addEventListener('input', function() {
            if (maxPriceDisplay) {
                maxPriceDisplay.textContent = parseInt(this.value).toLocaleString();
            }
            filterProducts();
        });
    }
    
    // Sort dropdown
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', filterProducts);
    }
    
    // Category filter
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            const filteredProducts = category === 'all' ? 
                products : 
                products.filter(product => product.category === category);
            
            renderProducts(filteredProducts);
        });
    });
    
    // Newsletter form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            subscribeNewsletter(email);
            this.reset();
        });
    });
    
    // View toggle (grid/list)
    const viewToggleButtons = document.querySelectorAll('[data-view]');
    viewToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active state
            viewToggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update container class
            const container = document.getElementById('products-container');
            if (container) {
                container.className = view === 'list' ? 'products-list' : 'products-grid';
            }
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

