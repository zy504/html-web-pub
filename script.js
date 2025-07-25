// Cart functionality
let cart = [];

function addToCart(name, price, image) {
  // Add item to cart array
  cart.push({
    name: name,
    price: price,
    image: image,
    id: Date.now() // Simple unique ID
  });
  
  // Update cart display
  updateCartDisplay();
  
  // Show success message
  showSuccessMessage();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartCount = document.getElementById('EcartCount');
  const cartItems = document.getElementById('EcartItems');
  const cartTotal = document.getElementById('EcartTotal');
  
  // Update cart count
  cartCount.textContent = cart.length;
  
  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="Ecart-empty">Your cart is empty</div>';
    cartTotal.textContent = 'Total: S$0.00';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="Ecart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="Ecart-item-info">
          <div class="Ecart-item-name">${item.name}</div>
          <div class="Ecart-item-price">S$${item.price.toFixed(2)}</div>
        </div>
        <button class="Ecart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `).join('');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `Total: S$${total.toFixed(2)}`;
  }
}

function toggleCart() {
  const cartDropdown = document.getElementById('EcartDropdown');
  cartDropdown.classList.toggle('show');
}

function showSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 2000);
  }
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
  const cartIcon = document.querySelector('.Ecart-icon');
  const cartDropdown = document.getElementById('EcartDropdown');
  
  if (!cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
    cartDropdown.classList.remove('show');
  }
});

// Optional: Filter and search functionality
function initializeFilters() {
  const searchInput = document.getElementById('EsearchInput');
  const categoryRadios = document.querySelectorAll('input[name="cat"]');
  const sizeCheckboxes = document.querySelectorAll('input[name="size"]');
  const genderFilter = document.getElementById('EgenderFilter');
  const colorFilter = document.getElementById('EcolorFilter');
  const styleFilter = document.getElementById('EstyleFilter');
  const priceSlider = document.getElementById('priceSlider');
  const sortBy = document.getElementById('EsortBy');
  const clearFilters = document.getElementById('EclearFilters');
  const priceDisplay = document.getElementById('EpriceDisplay');

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  // Category filter
  categoryRadios.forEach(radio => {
    radio.addEventListener('change', filterProducts);
  });

  // Size filter
  sizeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
  });

  // Other filters
  if (genderFilter) genderFilter.addEventListener('change', filterProducts);
  if (colorFilter) colorFilter.addEventListener('change', filterProducts);
  if (styleFilter) styleFilter.addEventListener('change', filterProducts);
  if (sortBy) sortBy.addEventListener('change', filterProducts);

  // Price slider
  if (priceSlider) {
    priceSlider.addEventListener('input', function() {
      const value = this.value;
      if (priceDisplay) {
        priceDisplay.textContent = `S$1 - S$${value}`;
      }
      filterProducts();
    });
  }

  // Clear filters
  if (clearFilters) {
    clearFilters.addEventListener('click', function() {
      // Reset all filters
      if (searchInput) searchInput.value = '';
      document.getElementById('All').checked = true;
      sizeCheckboxes.forEach(cb => cb.checked = false);
      if (genderFilter) genderFilter.value = '';
      if (colorFilter) colorFilter.value = '';
      if (styleFilter) styleFilter.value = '';
      if (priceSlider) priceSlider.value = 100;
      if (sortBy) sortBy.value = '';
      if (priceDisplay) priceDisplay.textContent = 'S$1 - S$100';
      
      filterProducts();
    });
  }
}

function filterProducts() {
  const searchTerm = document.getElementById('EsearchInput')?.value.toLowerCase() || '';
  const selectedCategory = document.querySelector('input[name="cat"]:checked')?.value || '';
  const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(cb => cb.value);
  const selectedGender = document.getElementById('EgenderFilter')?.value || '';
  const selectedColor = document.getElementById('EcolorFilter')?.value || '';
  const selectedStyle = document.getElementById('EstyleFilter')?.value || '';
  const maxPrice = parseFloat(document.getElementById('priceSlider')?.value || 100);
  const sortOption = document.getElementById('EsortBy')?.value || '';

  const productCards = document.querySelectorAll('.Eproduct-card');
  let visibleProducts = [];

  productCards.forEach(card => {
    const title = card.querySelector('.Eproduct-title')?.textContent.toLowerCase() || '';
    const category = card.dataset.category || '';
    const gender = card.dataset.gender || '';
    const color = card.dataset.color || '';
    const style = card.dataset.style || '';
    const price = parseFloat(card.dataset.price || 0);
    const rating = parseFloat(card.dataset.rating || 0);

    // Check all filter conditions
    const matchesSearch = title.includes(searchTerm);
    const matchesCategory = !selectedCategory || category === selectedCategory;
    const matchesGender = !selectedGender || gender === selectedGender;
    const matchesColor = !selectedColor || color === selectedColor;
    const matchesStyle = !selectedStyle || style === selectedStyle;
    const matchesPrice = price <= maxPrice;
    const matchesSize = selectedSizes.length === 0; // Size filtering logic can be added here

    if (matchesSearch && matchesCategory && matchesGender && matchesColor && matchesStyle && matchesPrice && matchesSize) {
      card.style.display = 'flex';
      visibleProducts.push({ card, price, rating });
    } else {
      card.style.display = 'none';
    }
  });

  // Sort products
  if (sortOption && visibleProducts.length > 0) {
    visibleProducts.sort((a, b) => {
      switch (sortOption) {
        case 'l': // Price Low to High
          return a.price - b.price;
        case 'h': // Price High to Low
          return b.price - a.price;
        case 'rating': // Rating
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    // Reorder DOM elements
    const productGrid = document.getElementById('EproductGrid');
    visibleProducts.forEach(({ card }) => {
      productGrid.appendChild(card);
    });
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  updateCartDisplay(); // Initialize cart display
});
function checkout() {
    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Calculate total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Show checkout confirmation (replace with real payment processing)
    alert(`Checkout complete! Total: $${total.toFixed(2)}\n\nIn a real store, this would redirect to a payment processor.`);
    
    // Clear cart after successful checkout
    cart = [];
    updateCartDisplay();
    toggleCart(); // Close the cart sidebar
}

// Alternative checkout function with more features
function checkoutAdvanced() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get cart summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create order summary
    let orderSummary = "Order Summary:\n";
    cart.forEach(item => {
        orderSummary += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderSummary += `\nTotal Items: ${itemCount}\nTotal Price: $${total.toFixed(2)}`;
    
    // Confirm order
    const confirmed = confirm(orderSummary + "\n\nProceed to checkout?");
    
    if (confirmed) {
        // Here you would typically:
        // 1. Send cart data to your backend
        // 2. Redirect to payment processor (Stripe, PayPal, etc.)
        // 3. Handle the checkout process
        
        console.log('Sending to payment processor:', cart);
        
        // For demo purposes, simulate successful checkout
        alert('Redirecting to payment processor...');
        
        // Clear cart and close sidebar
        cart = [];
        updateCartDisplay();
        toggleCart();
    }
}
