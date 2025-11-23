// Shopping cart module
const fs = require('fs');
const path = require('path');

const CARTS_FILE = path.join(__dirname, '..', 'carts.json');

// Load carts from file
function loadCarts() {
  try {
    if (fs.existsSync(CARTS_FILE)) {
      const data = fs.readFileSync(CARTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading carts:', error);
  }
  return {};
}

// Save carts to file
function saveCarts(carts) {
  try {
    fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving carts:', error);
  }
}

// Get user's cart
function getCart(userId) {
  const carts = loadCarts();
  return carts[userId] || { items: [] };
}

// Add item to cart
function addToCart(userId, product, quantity = 1) {
  const carts = loadCarts();
  if (!carts[userId]) {
    carts[userId] = { items: [] };
  }
  
  const existingItem = carts[userId].items.find(item => item.productId === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    });
  }
  
  carts[userId].lastUpdated = new Date().toISOString();
  saveCarts(carts);
  return carts[userId];
}

// Remove item from cart
function removeFromCart(userId, productId) {
  const carts = loadCarts();
  if (carts[userId]) {
    carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);
    carts[userId].lastUpdated = new Date().toISOString();
    saveCarts(carts);
  }
  return carts[userId] || { items: [] };
}

// Clear cart
function clearCart(userId) {
  const carts = loadCarts();
  if (carts[userId]) {
    carts[userId].items = [];
    carts[userId].lastUpdated = new Date().toISOString();
    saveCarts(carts);
  }
}

// Calculate cart total
function calculateTotal(cart) {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    return total + (price * item.quantity);
  }, 0);
}

module.exports = {
  loadCarts,
  saveCarts,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  calculateTotal
};
