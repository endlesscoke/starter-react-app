// User management module
const storage = require('./storage');

// Get user
function getUser(userId) {
  const users = storage.loadUsers();
  return users[userId] || null;
}

// Create/update user
function saveUser(userId, userData) {
  const users = storage.loadUsers();
  users[userId] = {
    ...users[userId],
    ...userData,
    userId: userId,
    updatedAt: new Date().toISOString()
  };
  storage.saveUsers(users);
  return users[userId];
}

// Delete user
function deleteUser(userId) {
  const users = storage.loadUsers();
  if (users[userId]) {
    delete users[userId];
    storage.saveUsers(users);
    return true;
  }
  return false;
}

// Get all users
function getAllUsers() {
  const users = storage.loadUsers();
  return Object.values(users);
}

// Get users list (last N users)
function getUsersList(limit = 20) {
  const users = getAllUsers();
  return users.slice(-limit).reverse();
}

// Check if user is registered
function isRegistered(userId) {
  const user = getUser(userId);
  return user && user.name && user.language && user.region;
}

// Generate profile link
function generateProfileLink(msg) {
  if (msg.from.username) {
    return `https://t.me/${msg.from.username}`;
  }
  return `tg://user?id=${msg.from.id}`;
}

module.exports = {
  getUser,
  saveUser,
  deleteUser,
  getAllUsers,
  getUsersList,
  isRegistered,
  generateProfileLink
};
