   // Store selected sizes for each product
    let selectedSizes = {};
    let cart = [];

    function selectSize(button, productId, size) {
      console.log('Size button clicked:', size, 'for product:', productId);
      
      // Find the product card
      const productCard = button.closest('.Eproduct-card');
      
      // Remove selected class from all size buttons in this product
      const sizeButtons = productCard.querySelectorAll('.Esize-btn');
      sizeButtons.forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Add selected class to clicked button
      button.classList.add('selected');
      
      // Store the selected size
      selectedSizes[productId] = size;
      
      // Update the display - extract number from productId (product1 -> 1)
      const productNumber = productId.replace('product', '');
      const sizeDisplay = document.getElementById('sizeDisplay' + productNumber);
      if (sizeDisplay) {
        sizeDisplay.textContent = `Selected: ${size}`;
        sizeDisplay.classList.add('selected');
      }
      
      // Hide warning
      const warning = document.getElementById('warning' + productNumber);
      if (warning) {
        warning.style.display = 'none';
      }
      
      console.log('Selected sizes:', selectedSizes);
    }

    function addToCart(productName, price, imageUrl, productId) {
      console.log('Add to cart clicked for:', productName);
      
      // Check if this product has size options
      const productCard = document.querySelector(`a[href="#${productId}"]`).closest('.Eproduct-card');
      const hasSizeOptions = productCard.querySelector('.Esize-options .Esize-btn');
      
      if (hasSizeOptions && !selectedSizes[productId]) {
        console.log('No size selected, showing warning');
        
        // Extract number from productId
        const productNumber = productId.replace('product', '');
        
        // Show warning
        const warning = document.getElementById('warning' + productNumber);
        if (warning) {
          warning.style.display = 'block';
        }
        
        // Change size display to show error
        const sizeDisplay = document.getElementById('sizeDisplay' + productNumber);
        if (sizeDisplay) {
          sizeDisplay.textContent = 'Please select a size!';
          sizeDisplay.style.background = '#ffe8e8';
          sizeDisplay.style.color = '#d32f2f';
        }
        
        return; // Don't add to cart
      }
      
      // Create full product name with size if selected
      let fullProductName = productName;
      if (selectedSizes[productId]) {
        fullProductName += ` (Size: ${selectedSizes[productId]})`;
      }
      
      // Add item to cart array
      cart.push({
        name: fullProductName,
        price: price,
        image: imageUrl,
        id: Date.now() // Simple unique ID
      });
      
      console.log(`Adding to cart: ${fullProductName} - S${price}`);
      
      // Update cart display
      updateCartDisplay();
      
      // Show success message
      showSuccessMessage(`${fullProductName} added to cart!`);
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
              <div class="Ecart-item-price">S${item.price.toFixed(2)}</div>
            </div>
            <button class="Ecart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        `).join('');
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `Total: S${total.toFixed(2)}`;
      }
    }

    function toggleCart() {
      const cartDropdown = document.getElementById('EcartDropdown');
      cartDropdown.classList.toggle('show');
    }

    function showSuccessMessage(message) {
      const successMsg = document.getElementById('successMessage');
      if (successMsg) {
        successMsg.textContent = message || 'Item added to cart!';
        successMsg.style.display = 'block';
        
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 3000);
      }
    }

    function checkout() {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      
      // Show checkout confirmation
      alert(`Checkout complete! Total: S${total.toFixed(2)}\n\nIn a real store, this would redirect to a payment processor.`);
      
      // Clear cart after successful checkout
      cart = [];
      updateCartDisplay();
      toggleCart(); // Close the cart dropdown
    }

    // SEARCH AND FILTER FUNCTIONALITY
    function filterProducts() {
      const searchTerm = document.getElementById('EsearchInput').value.toLowerCase();
      const categoryFilter = document.querySelector('input[name="cat"]:checked').value;
      const genderFilter = document.getElementById('EgenderFilter').value;
      const colorFilter = document.getElementById('EcolorFilter').value;
      const styleFilter = document.getElementById('EstyleFilter').value;
      const priceFilter = document.getElementById('priceSlider').value;
      const sortBy = document.getElementById('EsortBy').value;
      
      const productCards = document.querySelectorAll('.Eproduct-card');
      let visibleProducts = [];
      
      productCards.forEach(card => {
        const title = card.querySelector('.Eproduct-title').textContent.toLowerCase();
        const category = card.dataset.category;
        const gender = card.dataset.gender;
        const color = card.dataset.color;
        const style = card.dataset.style;
        const price = parseFloat(card.dataset.price);
        const rating = parseFloat(card.dataset.rating);
        
        let shouldShow = true;
        
        // Search filter
        if (searchTerm && !title.includes(searchTerm)) {
          shouldShow = false;
        }
        
        // Category filter
        if (categoryFilter && category !== categoryFilter) {
          shouldShow = false;
        }
        
        // Gender filter
        if (genderFilter && gender !== genderFilter) {
          shouldShow = false;
        }
        
        // Color filter
        if (colorFilter && color !== colorFilter) {
          shouldShow = false;
        }
        
        // Style filter
        if (styleFilter && style !== styleFilter) {
          shouldShow = false;
        }
        
        // Price filter
        if (price > priceFilter) {
          shouldShow = false;
        }
        
        if (shouldShow) {
          card.classList.remove('hidden');
          visibleProducts.push({
            element: card,
            price: price,
            rating: rating
          });
        } else {
          card.classList.add('hidden');
        }
      });
      
      // Sort products
      if (sortBy && visibleProducts.length > 0) {
        const productGrid = document.getElementById('EproductGrid');
        
        visibleProducts.sort((a, b) => {
          switch (sortBy) {
            case 'l': // Low to High
              return a.price - b.price;
            case 'h': // High to Low
              return b.price - a.price;
            case 'rating': // By Rating
              return b.rating - a.rating;
            default:
              return 0;
          }
        });
        
        // Reorder DOM elements
        visibleProducts.forEach(product => {
          productGrid.appendChild(product.element);
        });
      }
      
      // Show/hide no results message
      const noResults = document.getElementById('noResults');
      if (visibleProducts.length === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }

    function clearAllFilters() {
      // Reset search
      document.getElementById('EsearchInput').value = '';
      
      // Reset category to "All"
      document.getElementById('All').checked = true;
      
      // Reset dropdowns
      document.getElementById('EgenderFilter').value = '';
      document.getElementById('EcolorFilter').value = '';
      document.getElementById('EstyleFilter').value = '';
      document.getElementById('EsortBy').value = '';
      
      // Reset price slider
      document.getElementById('priceSlider').value = 100;
      document.getElementById('EpriceDisplay').textContent = 'S$1 - S$100';
      
      // Show all products
      const productCards = document.querySelectorAll('.Eproduct-card');
      productCards.forEach(card => {
        card.classList.remove('hidden');
      });
      
      // Hide no results message
      document.getElementById('noResults').style.display = 'none';
    }

    function updatePriceDisplay() {
      const slider = document.getElementById('priceSlider');
      const display = document.getElementById('EpriceDisplay');
      display.textContent = `S$1 - S${slider.value}`;
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
      const cartIcon = document.querySelector('.Ecart-icon');
      const cartDropdown = document.getElementById('EcartDropdown');
      
      if (cartIcon && cartDropdown && !cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
        cartDropdown.classList.remove('show');
      }
    });

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', function() {
      updateCartDisplay(); // Initialize cart display
      
      // Add event listeners for filters
      document.getElementById('EsearchInput').addEventListener('input', filterProducts);
      
      // Category radio buttons
      document.querySelectorAll('input[name="cat"]').forEach(radio => {
        radio.addEventListener('change', filterProducts);
      });
      
      // Filter dropdowns
      document.getElementById('EgenderFilter').addEventListener('change', filterProducts);
      document.getElementById('EcolorFilter').addEventListener('change', filterProducts);
      document.getElementById('EstyleFilter').addEventListener('change', filterProducts);
      document.getElementById('EsortBy').addEventListener('change', filterProducts);
      
      // Price slider
      document.getElementById('priceSlider').addEventListener('input', function() {
        updatePriceDisplay();
        filterProducts();
      });
      
      // Clear filters button
      document.getElementById('EclearFilters').addEventListener('click', clearAllFilters);
      
      console.log('JavaScript loaded successfully with search and filters!');
    });
