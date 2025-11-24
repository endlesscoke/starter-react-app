require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Import all modules
const storage = require('./bot-modules/storage');
const { translations } = require('./bot-modules/translations');
const userModule = require('./bot-modules/users');
const blacklistModule = require('./bot-modules/blacklist');
const courierModule = require('./bot-modules/couriers');
const productModule = require('./bot-modules/products');
const orderModule = require('./bot-modules/orders');
const cartModule = require('./bot-modules/cart');
const discountModule = require('./bot-modules/discounts');

// Bot token from environment variable
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN not found in environment variables');
  console.error('Please create a .env file with TELEGRAM_BOT_TOKEN=your_bot_token');
  process.exit(1);
}

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Admin user IDs
const ADMIN_IDS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(id => parseInt(id.trim())) : [];

// Initialize data
let users = storage.loadUsers();
let products = storage.loadProducts();
let categories = storage.loadCategories();
let orders = storage.loadOrders();
let couriers = storage.loadCouriers();
let blacklist = storage.loadBlacklist();
let carts = cartModule.loadCarts();
let discounts = discountModule.loadDiscounts();

// User states for conversation flows
const userStates = {};

// Helper functions
function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

function isCourier(userId) {
  return couriers.hasOwnProperty(userId);
}

function isBlacklisted(userId) {
  return blacklist.hasOwnProperty(userId);
}

function getUserLanguage(userId) {
  return users[userId]?.language || 'en';
}

function t(userId, key) {
  const lang = getUserLanguage(userId);
  return translations[lang]?.[key] || translations.en[key] || key;
}

// Main menu keyboard
function getMainMenuKeyboard(userId) {
  const lang = getUserLanguage(userId);
  const keyboard = [];
  
  if (!users[userId]) {
    keyboard.push([{ text: t(userId, 'menuRegister') }]);
  } else {
    keyboard.push([{ text: t(userId, 'menuBrowseOrder') }]);
    if (cartModule.hasItems(carts, userId)) {
      keyboard.push([{ text: t(userId, 'menuMyCart') }]);
    }
    keyboard.push([{ text: t(userId, 'menuMyInfo') }, { text: t(userId, 'menuLanguage') }]);
  }
  
  if (isAdmin(userId)) {
    keyboard.push([{ text: t(userId, 'adminMenu') }]);
  }
  
  if (isCourier(userId)) {
    keyboard.push([{ text: t(userId, 'courierMenu') }]);
  }
  
  return {
    keyboard: keyboard,
    resize_keyboard: true
  };
}

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (isBlacklisted(userId)) {
    bot.sendMessage(chatId, t(userId, 'blacklisted'));
    return;
  }
  
  if (!users[userId]) {
    // Show language selection
    bot.sendMessage(chatId, translations.en.welcome, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🇬🇧 English', callback_data: 'lang_en' }],
          [{ text: '🇷🇺 Русский', callback_data: 'lang_ru' }],
          [{ text: '🇪🇪 Eesti', callback_data: 'lang_et' }]
        ]
      }
    });
  } else {
    bot.sendMessage(chatId, t(userId, 'alreadyRegistered'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
  }
});

// Handle callback queries
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;
  
  // Language selection
  if (data.startsWith('lang_')) {
    const lang = data.split('_')[1];
    userStates[userId] = { step: 'select_region', language: lang };
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, translations[lang].languageSelected);
    
    // Show region selection
    bot.sendMessage(chatId, translations[lang].selectRegion || 'Select your region:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🏙️ Tallinn', callback_data: 'region_tallinn' }],
          [{ text: '🏘️ Paldiski', callback_data: 'region_paldiski' }]
        ]
      }
    });
    return;
  }
  
  // Region selection
  if (data.startsWith('region_')) {
    const region = data.split('_')[1];
    if (userStates[userId]) {
      userStates[userId].region = region;
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, t(userId, 'regionSelected'));
      userStates[userId].step = 'enter_name';
    }
    return;
  }
  
  // Handle other callbacks (products, orders, etc.)
  // This will be implemented with handlers from modules
  
  bot.answerCallbackQuery(query.id);
});

// Handle text messages
bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return; // Skip commands
  
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  
  if (isBlacklisted(userId)) {
    bot.sendMessage(chatId, t(userId, 'blacklisted'));
    return;
  }
  
  // Handle user state flows
  if (userStates[userId]) {
    const state = userStates[userId];
    
    // Registration flow
    if (state.step === 'enter_name') {
      if (text && text.length >= 2) {
        const profileLink = msg.from.username 
          ? `https://t.me/${msg.from.username}`
          : `tg://user?id=${userId}`;
        
        users[userId] = {
          userId: userId,
          username: msg.from.username || '',
          name: text,
          profileLink: profileLink,
          language: state.language,
          region: state.region,
          registeredAt: new Date().toISOString()
        };
        
        storage.saveUsers(users);
        delete userStates[userId];
        
        bot.sendMessage(chatId, t(userId, 'registrationComplete'), {
          reply_markup: getMainMenuKeyboard(userId)
        });
      } else {
        bot.sendMessage(chatId, t(userId, 'invalidName'));
      }
      return;
    }
  }
  
  // Handle menu buttons
  if (!text) return;
  
  // Registration
  if (text === t(userId, 'menuRegister') || text === '📝 Register' || text === '📝 Регистрация' || text === '📝 Registreeri') {
    bot.sendMessage(chatId, translations.en.welcome, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🇬🇧 English', callback_data: 'lang_en' }],
          [{ text: '🇷🇺 Русский', callback_data: 'lang_ru' }],
          [{ text: '🇪🇪 Eesti', callback_data: 'lang_et' }]
        ]
      }
    });
    return;
  }
  
  // My Info
  if (text === t(userId, 'menuMyInfo') || text === '👤 My Info' || text === '👤 Моя информация' || text === '👤 Minu info') {
    if (!users[userId]) {
      bot.sendMessage(chatId, t(userId, 'notRegistered'));
      return;
    }
    
    const user = users[userId];
    const info = `${t(userId, 'myInfo')}\n\n` +
                 `${t(userId, 'name')}: ${user.name}\n` +
                 `${t(userId, 'language')}: ${user.language}\n` +
                 `${t(userId, 'region')}: ${user.region}\n` +
                 `${t(userId, 'registered')}: ${new Date(user.registeredAt).toLocaleDateString()}`;
    
    bot.sendMessage(chatId, info, {
      reply_markup: getMainMenuKeyboard(userId)
    });
    return;
  }
  
  // Language change
  if (text === t(userId, 'menuLanguage') || text === '🌐 Language' || text === '🌐 Язык' || text === '🌐 Keel') {
    bot.sendMessage(chatId, 'Select language:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🇬🇧 English', callback_data: 'change_lang_en' }],
          [{ text: '🇷🇺 Русский', callback_data: 'change_lang_ru' }],
          [{ text: '🇪🇪 Eesti', callback_data: 'change_lang_et' }]
        ]
      }
    });
    return;
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.log('Polling error:', error.message);
});

console.log('✅ Bot started successfully!');
console.log(`👥 Admins: ${ADMIN_IDS.join(', ')}`);
console.log(`📦 Products loaded: ${Object.keys(products).length}`);
console.log(`👥 Users loaded: ${Object.keys(users).length}`);
console.log(`📋 Orders loaded: ${orders.length || 0}`);
console.log(`🚚 Couriers loaded: ${Object.keys(couriers).length}`);
console.log('🔄 Listening for messages...');
