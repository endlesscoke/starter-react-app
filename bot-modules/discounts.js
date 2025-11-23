// Discount management module
const fs = require('fs');
const path = require('path');

const DISCOUNTS_FILE = path.join(__dirname, '..', 'discounts.json');

// Load discounts from file
function loadDiscounts() {
  try {
    if (fs.existsSync(DISCOUNTS_FILE)) {
      const data = fs.readFileSync(DISCOUNTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading discounts:', error);
  }
  return {};
}

// Save discounts to file
function saveDiscounts(discounts) {
  try {
    fs.writeFileSync(DISCOUNTS_FILE, JSON.stringify(discounts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving discounts:', error);
  }
}

// Validate discount code
function validateDiscount(code) {
  const discounts = loadDiscounts();
  const discount = discounts[code.toUpperCase()];
  return discount && discount.active ? discount : null;
}

// Apply discount to amount
function applyDiscount(amount, discountCode) {
  const discount = validateDiscount(discountCode);
  if (!discount) return { valid: false, amount: amount };
  
  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = amount * (discount.value / 100);
  } else if (discount.type === 'fixed') {
    discountAmount = Math.min(discount.value, amount);
  }
  
  return {
    valid: true,
    originalAmount: amount,
    discountAmount: discountAmount,
    finalAmount: amount - discountAmount,
    discount: discount
  };
}

// Create discount
function createDiscount(code, type, value, description, createdBy) {
  const discounts = loadDiscounts();
  discounts[code.toUpperCase()] = {
    code: code.toUpperCase(),
    type: type, // 'percentage' or 'fixed'
    value: value,
    description: description,
    active: true,
    createdBy: createdBy,
    createdAt: new Date().toISOString()
  };
  saveDiscounts(discounts);
  return discounts[code.toUpperCase()];
}

// Delete discount
function deleteDiscount(code) {
  const discounts = loadDiscounts();
  delete discounts[code.toUpperCase()];
  saveDiscounts(discounts);
}

// Get all active discounts
function getActiveDiscounts() {
  const discounts = loadDiscounts();
  return Object.values(discounts).filter(d => d.active);
}

module.exports = {
  loadDiscounts,
  saveDiscounts,
  validateDiscount,
  applyDiscount,
  createDiscount,
  deleteDiscount,
  getActiveDiscounts
};
