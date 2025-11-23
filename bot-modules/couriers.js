// Courier management module
const storage = require('./storage');

// Get courier
function getCourier(courierId) {
  const couriers = storage.loadCouriers();
  return couriers[courierId] || null;
}

// Get all couriers
function getAllCouriers() {
  const couriers = storage.loadCouriers();
  return Object.values(couriers);
}

// Add courier
function addCourier(courierId, courierData) {
  const couriers = storage.loadCouriers();
  couriers[courierId] = {
    userId: courierId,
    ...courierData,
    addedAt: new Date().toISOString()
  };
  storage.saveCouriers(couriers);
  return couriers[courierId];
}

// Remove courier
function removeCourier(courierId) {
  const couriers = storage.loadCouriers();
  if (couriers[courierId]) {
    delete couriers[courierId];
    storage.saveCouriers(couriers);
    return true;
  }
  return false;
}

// Check if user is courier
function isCourier(userId) {
  const courier = getCourier(userId);
  return courier !== null;
}

module.exports = {
  getCourier,
  getAllCouriers,
  addCourier,
  removeCourier,
  isCourier
};
