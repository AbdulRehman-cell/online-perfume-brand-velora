document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;
    
    themeBtn.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Shopping Cart Functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    
    let cart = [];
    
    // Open/Close Cart Modal
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
    });
    
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Add to Cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.querySelector('h3').textContent;
            const productTitle = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('PKR ', ''));
            const productImage = productCard.querySelector('img').src;
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            updateCart();
            showAddToCartFeedback();
        });
    });
    
    // Update Cart
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">PKR ${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>
                <div class="remove-item"><i class="fas fa-times"></i></div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // Add event listeners to quantity buttons
            const decreaseBtn = cartItemElement.querySelector('.decrease-quantity');
            const increaseBtn = cartItemElement.querySelector('.increase-quantity');
            const removeBtn = cartItemElement.querySelector('.remove-item');
            
            decreaseBtn.addEventListener('click', function() {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    updateCart();
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                item.quantity += 1;
                updateCart();
            });
            
            removeBtn.addEventListener('click', function() {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                updateCart();
            });
        });
        
        totalAmount.textContent = `PKR ${total.toFixed(2)}`;
        cartCount.textContent = count;
    }
    
    // Show feedback when adding to cart
    function showAddToCartFeedback() {
        const feedback = document.createElement('div');
        feedback.textContent = 'Item added to cart!';
        feedback.style.position = 'fixed';
        feedback.style.bottom = '20px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = 'var(--primary-color)';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '1000';
        feedback.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 500);
        }, 2000);
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Here you would typically connect to a payment gateway
        alert('Redirecting to checkout...');
        // In a real implementation, you would redirect to a checkout page
        // or connect to a payment processor like Stripe, PayPal, etc.
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});