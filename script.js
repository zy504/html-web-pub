
    let selectedSizes = {};
    let cart = [];

    function selectSize(button, productId, size) {
      console.log('Size button clicked:', size, 'for product:', productId);
      

      const productCard = button.closest('.Eproduct-card');
      

      const sizeButtons = productCard.querySelectorAll('.Esize-btn');
      sizeButtons.forEach(btn => {
        btn.classList.remove('selected');
      });
      

      button.classList.add('selected');
      

      selectedSizes[productId] = size;
      

      const productNumber = productId.replace('product', '');
      const sizeDisplay = document.getElementById('sizeDisplay' + productNumber);
      if (sizeDisplay) {
        sizeDisplay.textContent = `Selected: ${size}`;
        sizeDisplay.classList.add('selected');
      }
      

      const warning = document.getElementById('warning' + productNumber);
      if (warning) {
        warning.style.display = 'none';
      }
      
      console.log('Selected sizes:', selectedSizes);
    }

    function addToCart(productName, price, imageUrl, productId) {
      console.log('Add to cart clicked for:', productName);
      

      const productCard = document.querySelector(`a[href="#${productId}"]`).closest('.Eproduct-card');
      const hasSizeOptions = productCard.querySelector('.Esize-options .Esize-btn');
      
      if (hasSizeOptions && !selectedSizes[productId]) {
        console.log('No size selected, showing warning');
        

        const productNumber = productId.replace('product', '');
        

        const warning = document.getElementById('warning' + productNumber);
        if (warning) {
          warning.style.display = 'block';
        }
        

        const sizeDisplay = document.getElementById('sizeDisplay' + productNumber);
        if (sizeDisplay) {
          sizeDisplay.textContent = 'Please select a size!';
          sizeDisplay.style.background = '#ffe8e8';
          sizeDisplay.style.color = '#d32f2f';
        }
        
        return; 
      }
      

      let fullProductName = productName;
      if (selectedSizes[productId]) {
        fullProductName += ` (Size: ${selectedSizes[productId]})`;
      }
      

      cart.push({
        name: fullProductName,
        price: price,
        image: imageUrl,
        id: Date.now() 
      });
      
      console.log(`Adding to cart: ${fullProductName} - S${price}`);
      

      updateCartDisplay();
      

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
      

      cartCount.textContent = cart.length;
      
  
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

    function proceedToCheckout() {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      
      alert(`Checkout complete! Total: S${total.toFixed(2)}`);
      
 
      cart = [];
      updateCartDisplay();
      toggleCart();
    }


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
        

        if (searchTerm && !title.includes(searchTerm)) {
          shouldShow = false;
        }
        

        if (categoryFilter && category !== categoryFilter) {
          shouldShow = false;
        }
        
     
        if (genderFilter && gender !== genderFilter) {
          shouldShow = false;
        }
        
      
        if (colorFilter && color !== colorFilter) {
          shouldShow = false;
        }
        
     
        if (styleFilter && style !== styleFilter) {
          shouldShow = false;
        }
        
    
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
        
     
        visibleProducts.forEach(product => {
          productGrid.appendChild(product.element);
        });
      }
      
   
      const noResults = document.getElementById('noResults');
      if (visibleProducts.length === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }

    function clearAllFilters() {
   
      document.getElementById('EsearchInput').value = '';
      

      document.getElementById('All').checked = true;
      

      document.getElementById('EgenderFilter').value = '';
      document.getElementById('EcolorFilter').value = '';
      document.getElementById('EstyleFilter').value = '';
      document.getElementById('EsortBy').value = '';
      

      document.getElementById('priceSlider').value = 100;
      document.getElementById('EpriceDisplay').textContent = 'S$1 - S$100';
      

      const productCards = document.querySelectorAll('.Eproduct-card');
      productCards.forEach(card => {
        card.classList.remove('hidden');
      });
      

      document.getElementById('noResults').style.display = 'none';
    }

    function updatePriceDisplay() {
      const slider = document.getElementById('priceSlider');
      const display = document.getElementById('EpriceDisplay');
      display.textContent = `S$1 - S${slider.value}`;
    }


    document.addEventListener('click', function(event) {
      const cartIcon = document.querySelector('.Ecart-icon');
      const cartDropdown = document.getElementById('EcartDropdown');
      
      if (cartIcon && cartDropdown && !cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
        cartDropdown.classList.remove('show');
      }
    });


    document.addEventListener('DOMContentLoaded', function() {
      updateCartDisplay(); 
      

      document.getElementById('EsearchInput').addEventListener('input', filterProducts);
      

      document.querySelectorAll('input[name="cat"]').forEach(radio => {
        radio.addEventListener('change', filterProducts);
      });
      

      document.getElementById('EgenderFilter').addEventListener('change', filterProducts);
      document.getElementById('EcolorFilter').addEventListener('change', filterProducts);
      document.getElementById('EstyleFilter').addEventListener('change', filterProducts);
      document.getElementById('EsortBy').addEventListener('change', filterProducts);
      

      document.getElementById('priceSlider').addEventListener('input', function() {
        updatePriceDisplay();
        filterProducts();
      });
      

      document.getElementById('EclearFilters').addEventListener('click', clearAllFilters);
      
      console.log('JavaScript loaded successfully with search and filters!');
    });
