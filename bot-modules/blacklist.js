// Blacklist management module
const storage = require('./storage');

// Get blacklisted user
function getBlacklisted(userId) {
  const blacklist = storage.loadBlacklist();
  return blacklist[userId] || null;
}

// Get all blacklisted users
function getAllBlacklisted() {
  const blacklist = storage.loadBlacklist();
  return Object.values(blacklist);
}

// Add to blacklist
function addToBlacklist(userId, userData) {
  const blacklist = storage.loadBlacklist();
  blacklist[userId] = {
    userId: userId,
    ...userData,
    blacklistedAt: new Date().toISOString()
  };
  storage.saveBlacklist(blacklist);
  return blacklist[userId];
}

// Remove from blacklist
function removeFromBlacklist(userId) {
  const blacklist = storage.loadBlacklist();
  if (blacklist[userId]) {
    delete blacklist[userId];
    storage.saveBlacklist(blacklist);
    return true;
  }
  return false;
}

// Check if user is blacklisted
function isBlacklisted(userId) {
  const user = getBlacklisted(userId);
  return user !== null;
}

module.exports = {
  getBlacklisted,
  getAllBlacklisted,
  addToBlacklist,
  removeFromBlacklist,
  isBlacklisted
};
