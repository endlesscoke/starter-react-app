// Product management module
const storage = require('./storage');

// Get product by ID
function getProduct(productId) {
  const products = storage.loadProducts();
  return products.find(p => p.id === productId) || null;
}

// Get all products
function getAllProducts() {
  return storage.loadProducts();
}

// Get products by category
function getProductsByCategory(category) {
  const products = getAllProducts();
  if (!category || category === 'all') {
    return products;
  }
  return products.filter(p => p.category === category);
}

// Add product
function addProduct(productData) {
  const products = storage.loadProducts();
  const newProduct = {
    id: products.length + 1,
    ...productData,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  storage.saveProducts(products);
  return newProduct;
}

// Delete product
function deleteProduct(productId) {
  const products = storage.loadProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
    storage.saveProducts(products);
    return true;
  }
  return false;
}

// Update product
function updateProduct(productId, updates) {
  const products = storage.loadProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    storage.saveProducts(products);
    return products[index];
  }
  return null;
}

module.exports = {
  getProduct,
  getAllProducts,
  getProductsByCategory,
  addProduct,
  deleteProduct,
  updateProduct
};
