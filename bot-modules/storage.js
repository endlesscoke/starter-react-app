// File storage module - handles all JSON file operations
const fs = require('fs');
const path = require('path');

// File paths
const FILES = {
  users: path.join(__dirname, '..', 'users.json'),
  products: path.join(__dirname, '..', 'products.json'),
  categories: path.join(__dirname, '..', 'categories.json'),
  orders: path.join(__dirname, '..', 'orders.json'),
  couriers: path.join(__dirname, '..', 'couriers.json'),
  blacklist: path.join(__dirname, '..', 'blacklist.json'),
  carts: path.join(__dirname, '..', 'carts.json'),
  discounts: path.join(__dirname, '..', 'discounts.json')
};

// Generic load function
function load(fileKey) {
  try {
    const filePath = FILES[fileKey];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading ${fileKey}:`, error);
  }
  return {};
}

// Generic save function
function save(fileKey, data) {
  try {
    const filePath = FILES[fileKey];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving ${fileKey}:`, error);
    return false;
  }
}

// Load users
function loadUsers() {
  return load('users');
}

// Save users
function saveUsers(users) {
  return save('users', users);
}

// Load products
function loadProducts() {
  return load('products');
}

// Save products
function saveProducts(products) {
  return save('products', products);
}

// Load categories
function loadCategories() {
  return load('categories');
}

// Save categories
function saveCategories(categories) {
  return save('categories', categories);
}

// Load orders
function loadOrders() {
  return load('orders');
}

// Save orders
function saveOrders(orders) {
  return save('orders', orders);
}

// Load couriers
function loadCouriers() {
  return load('couriers');
}

// Save couriers
function saveCouriers(couriers) {
  return save('couriers', couriers);
}

// Load blacklist
function loadBlacklist() {
  return load('blacklist');
}

// Save blacklist
function saveBlacklist(blacklist) {
  return save('blacklist', blacklist);
}

module.exports = {
  FILES,
  load,
  save,
  loadUsers,
  saveUsers,
  loadProducts,
  saveProducts,
  loadCategories,
  saveCategories,
  loadOrders,
  saveOrders,
  loadCouriers,
  saveCouriers,
  loadBlacklist,
  saveBlacklist
};
