// Order management module
const storage = require('./storage');

// Get order by ID
function getOrder(orderId) {
  const orders = storage.loadOrders();
  return orders.find(o => o.orderId === orderId) || null;
}

// Get all orders
function getAllOrders() {
  return storage.loadOrders();
}

// Get orders for user
function getUserOrders(userId) {
  const orders = getAllOrders();
  return orders.filter(o => o.userId === userId);
}

// Get orders by status
function getOrdersByStatus(status) {
  const orders = getAllOrders();
  return orders.filter(o => o.status === status);
}

// Get courier orders
function getCourierOrders(courierId) {
  const orders = getAllOrders();
  return orders.filter(o => o.courierId === courierId);
}

// Create order
function createOrder(orderData) {
  const orders = storage.loadOrders();
  const newOrder = {
    orderId: orders.length + 1,
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  storage.saveOrders(orders);
  return newOrder;
}

// Update order
function updateOrder(orderId, updates) {
  const orders = storage.loadOrders();
  const index = orders.findIndex(o => o.orderId === orderId);
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    storage.saveOrders(orders);
    return orders[index];
  }
  return null;
}

// Assign courier to order
function assignCourier(orderId, courierId, courierName) {
  return updateOrder(orderId, {
    courierId: courierId,
    courierName: courierName,
    status: 'in_progress'
  });
}

// Update order status
function updateOrderStatus(orderId, status) {
  return updateOrder(orderId, { status: status });
}

// Add customer note
function addCustomerNote(orderId, note) {
  const order = getOrder(orderId);
  if (order) {
    const existingNotes = order.customerNotes || '';
    const newNotes = existingNotes ? `${existingNotes}; ${note}` : note;
    return updateOrder(orderId, { customerNotes: newNotes });
  }
  return null;
}

// Get recent orders (last N)
function getRecentOrders(limit = 20) {
  const orders = getAllOrders();
  return orders.slice(-limit).reverse();
}

module.exports = {
  getOrder,
  getAllOrders,
  getUserOrders,
  getOrdersByStatus,
  getCourierOrders,
  createOrder,
  updateOrder,
  assignCourier,
  updateOrderStatus,
  addCustomerNote,
  getRecentOrders
};
