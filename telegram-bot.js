require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Bot token from environment variable
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN not found in environment variables');
  console.error('Please create a .env file with TELEGRAM_BOT_TOKEN=your_bot_token');
  process.exit(1);
}

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Path to data files
const usersFilePath = path.join(__dirname, 'users.json');
const productsFilePath = path.join(__dirname, 'products.json');
const ordersFilePath = path.join(__dirname, 'orders.json');

// Initialize storage
let users = {};
let products = [];
let orders = [];

// Admin user IDs (add your Telegram user ID here)
const ADMIN_IDS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(id => parseInt(id.trim())) : [];

// Translations for multi-language support
const translations = {
  en: {
    welcome: '👋 Welcome to the Order Bot!\n\nPlease select your language:',
    languageSelected: '✅ Language selected: English',
    regionSelected: '✅ Region selected!\n\nPlease enter your full name:',
    enterName: 'Please enter your full name:',
    nameSaved: '✅ Name saved!',
    alreadyRegistered: '✅ You are already registered!\n\nUse the menu to place orders.',
    registrationCancelled: '❌ Registration cancelled.',
    registrationComplete: '🎉 Registration Complete!\n\nYour account has been successfully created.',
    myInfo: '✅ Your Information:',
    notRegistered: '❌ You are not registered yet.\n\nUse the menu to register.',
    invalidName: '❌ Please enter a valid name (at least 2 characters).',
    menuRegister: '📝 Register',
    menuMyInfo: '👤 My Info',
    menuLanguage: '🌐 Language',
    menuPlaceOrder: '🛒 Place Order',
    menuCancel: '❌ Cancel',
    name: 'Name',
    language: 'Language',
    region: 'Region',
    registered: 'Registered',
    userId: 'User ID',
    selectProduct: 'Please select a product:',
    enterAddress: 'Please enter delivery address:',
    enterTime: 'Please enter delivery time (e.g., 14:00 or 2:00 PM):',
    orderPlaced: '✅ Order placed successfully!',
    orderCancelled: '❌ Order cancelled.',
    noProducts: '❌ No products available. Please contact administrator.',
    invalidAddress: '❌ Please enter a valid address.',
    invalidTime: '❌ Please enter a valid time.',
    orderDetails: '📦 Order Details:',
    product: 'Product',
    address: 'Address',
    time: 'Time',
    status: 'Status',
    orderNumber: 'Order #',
    // Admin
    adminMenu: '🔧 Admin Menu',
    adminAddProduct: '➕ Add Product',
    adminRemoveProduct: '➖ Remove Product',
    adminViewOrders: '📋 View Orders',
    adminBackToMain: '⬅️ Back to Main Menu',
    enterProductName: 'Enter product name:',
    productAdded: '✅ Product added successfully!',
    productRemoved: '✅ Product removed successfully!',
    selectProductToRemove: 'Select product to remove:',
    noProductsToRemove: 'No products to remove.'
  },
  ru: {
    welcome: '👋 Добро пожаловать в Бот Заказов!\n\nПожалуйста, выберите язык:',
    languageSelected: '✅ Язык выбран: Русский',
    regionSelected: '✅ Регион выбран!\n\nПожалуйста, введите ваше полное имя:',
    enterName: 'Пожалуйста, введите ваше полное имя:',
    nameSaved: '✅ Имя сохранено!',
    alreadyRegistered: '✅ Вы уже зарегистрированы!\n\nИспользуйте меню для оформления заказов.',
    registrationCancelled: '❌ Регистрация отменена.',
    registrationComplete: '🎉 Регистрация завершена!\n\nВаш аккаунт успешно создан.',
    myInfo: '✅ Ваша информация:',
    notRegistered: '❌ Вы еще не зарегистрированы.\n\nИспользуйте меню для регистрации.',
    invalidName: '❌ Пожалуйста, введите корректное имя (минимум 2 символа).',
    menuRegister: '📝 Регистрация',
    menuMyInfo: '👤 Моя информация',
    menuLanguage: '🌐 Язык',
    menuPlaceOrder: '🛒 Оформить заказ',
    menuCancel: '❌ Отмена',
    name: 'Имя',
    language: 'Язык',
    region: 'Регион',
    registered: 'Зарегистрирован',
    userId: 'ID пользователя',
    selectProduct: 'Пожалуйста, выберите товар:',
    enterAddress: 'Пожалуйста, введите адрес доставки:',
    enterTime: 'Пожалуйста, введите время доставки (например, 14:00 или 2:00 PM):',
    orderPlaced: '✅ Заказ успешно оформлен!',
    orderCancelled: '❌ Заказ отменен.',
    noProducts: '❌ Нет доступных товаров. Пожалуйста, свяжитесь с администратором.',
    invalidAddress: '❌ Пожалуйста, введите корректный адрес.',
    invalidTime: '❌ Пожалуйста, введите корректное время.',
    orderDetails: '📦 Детали заказа:',
    product: 'Товар',
    address: 'Адрес',
    time: 'Время',
    status: 'Статус',
    orderNumber: 'Заказ №',
    // Admin
    adminMenu: '🔧 Меню администратора',
    adminAddProduct: '➕ Добавить товар',
    adminRemoveProduct: '➖ Удалить товар',
    adminViewOrders: '📋 Просмотр заказов',
    adminBackToMain: '⬅️ Назад в главное меню',
    enterProductName: 'Введите название товара:',
    productAdded: '✅ Товар успешно добавлен!',
    productRemoved: '✅ Товар успешно удален!',
    selectProductToRemove: 'Выберите товар для удаления:',
    noProductsToRemove: 'Нет товаров для удаления.'
  },
  et: {
    welcome: '👋 Tere tulemast tellimuste botti!\n\nPalun valige keel:',
    languageSelected: '✅ Keel valitud: Eesti',
    regionSelected: '✅ Piirkond valitud!\n\nPalun sisestage oma täisnimi:',
    enterName: 'Palun sisestage oma täisnimi:',
    nameSaved: '✅ Nimi salvestatud!',
    alreadyRegistered: '✅ Olete juba registreeritud!\n\nKasutage menüüd tellimuste tegemiseks.',
    registrationCancelled: '❌ Registreerimine tühistatud.',
    registrationComplete: '🎉 Registreerimine lõpetatud!\n\nTeie konto on edukalt loodud.',
    myInfo: '✅ Teie teave:',
    notRegistered: '❌ Te ei ole veel registreeritud.\n\nKasutage menüüd registreerimiseks.',
    invalidName: '❌ Palun sisestage kehtiv nimi (vähemalt 2 tähemärki).',
    menuRegister: '📝 Registreeri',
    menuMyInfo: '👤 Minu info',
    menuLanguage: '🌐 Keel',
    menuPlaceOrder: '🛒 Tee tellimus',
    menuCancel: '❌ Tühista',
    name: 'Nimi',
    language: 'Keel',
    region: 'Piirkond',
    registered: 'Registreeritud',
    userId: 'Kasutaja ID',
    selectProduct: 'Palun valige toode:',
    enterAddress: 'Palun sisestage tarneaadress:',
    enterTime: 'Palun sisestage tarneaeg (nt 14:00 või 2:00 PM):',
    orderPlaced: '✅ Tellimus edukalt esitatud!',
    orderCancelled: '❌ Tellimus tühistatud.',
    noProducts: '❌ Tooteid pole saadaval. Palun võtke ühendust administraatoriga.',
    invalidAddress: '❌ Palun sisestage kehtiv aadress.',
    invalidTime: '❌ Palun sisestage kehtiv aeg.',
    orderDetails: '📦 Tellimuse üksikasjad:',
    product: 'Toode',
    address: 'Aadress',
    time: 'Aeg',
    status: 'Olek',
    orderNumber: 'Tellimus #',
    // Admin
    adminMenu: '🔧 Administraatori menüü',
    adminAddProduct: '➕ Lisa toode',
    adminRemoveProduct: '➖ Eemalda toode',
    adminViewOrders: '📋 Vaata tellimusi',
    adminBackToMain: '⬅️ Tagasi peamenüüsse',
    enterProductName: 'Sisestage toote nimi:',
    productAdded: '✅ Toode edukalt lisatud!',
    productRemoved: '✅ Toode edukalt eemaldatud!',
    selectProductToRemove: 'Valige eemaldatav toode:',
    noProductsToRemove: 'Pole tooteid eemaldamiseks.'
  }
};

// Store user preferences (language) and states
const userPreferences = {};
const orderStates = {};
const adminStates = {};

// Load existing users from file
function loadUsers() {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(data);
      console.log('Loaded existing users:', Object.keys(users).length);
    }
  } catch (error) {
    console.error('Error loading users:', error.message);
    users = {};
  }
}

// Save users to file
function saveUsers() {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error.message);
  }
}

// Load products from file
function loadProducts() {
  try {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf8');
      products = JSON.parse(data);
      console.log('Loaded products:', products.length);
    }
  } catch (error) {
    console.error('Error loading products:', error.message);
    products = [];
  }
}

// Save products to file
function saveProducts() {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products:', error.message);
  }
}

// Load orders from file
function loadOrders() {
  try {
    if (fs.existsSync(ordersFilePath)) {
      const data = fs.readFileSync(ordersFilePath, 'utf8');
      orders = JSON.parse(data);
      console.log('Loaded orders:', orders.length);
    }
  } catch (error) {
    console.error('Error loading orders:', error.message);
    orders = [];
  }
}

// Save orders to file
function saveOrders() {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving orders:', error.message);
  }
}

// Check if user is admin
function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

// Get user's language preference
function getUserLanguage(userId) {
  return userPreferences[userId] || users[userId]?.language || 'en';
}

// Get translation text
function t(userId, key) {
  const lang = getUserLanguage(userId);
  return translations[lang][key] || translations.en[key];
}

// Load data on startup
loadUsers();
loadProducts();
loadOrders();

// Store registration state for each user
const registrationStates = {};

// Create main menu keyboard
function getMainMenuKeyboard(userId) {
  const lang = getUserLanguage(userId);
  const keyboard = [];
  
  if (!users[userId]) {
    keyboard.push([{ text: translations[lang].menuRegister }]);
  } else {
    keyboard.push([{ text: translations[lang].menuPlaceOrder }]);
    keyboard.push([{ text: translations[lang].menuMyInfo }]);
  }
  
  keyboard.push([{ text: translations[lang].menuLanguage }]);
  
  if (isAdmin(userId)) {
    keyboard.push([{ text: translations[lang].adminMenu }]);
  }
  
  return {
    keyboard: keyboard,
    resize_keyboard: true
  };
}

// Create admin menu keyboard
function getAdminMenuKeyboard(userId) {
  const lang = getUserLanguage(userId);
  return {
    keyboard: [
      [{ text: translations[lang].adminAddProduct }],
      [{ text: translations[lang].adminRemoveProduct }],
      [{ text: translations[lang].adminViewOrders }],
      [{ text: translations[lang].adminBackToMain }]
    ],
    resize_keyboard: true
  };
}

// Create language selection keyboard
function getLanguageKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🇬🇧 English', callback_data: 'lang_en' },
        { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
      ],
      [
        { text: '🇪🇪 Eesti', callback_data: 'lang_et' }
      ]
    ]
  };
}

// Create region selection keyboard
function getRegionKeyboard(userId) {
  return {
    inline_keyboard: [
      [
        { text: '🏙️ Tallinn', callback_data: 'region_tallinn' }
      ],
      [
        { text: '🏘️ Paldiski', callback_data: 'region_paldiski' }
      ]
    ]
  };
}

// Create product selection keyboard
function getProductKeyboard(userId) {
  if (products.length === 0) {
    return null;
  }
  
  const buttons = products.map((product, index) => {
    return [{ text: product.name, callback_data: `product_${index}` }];
  });
  
  return {
    inline_keyboard: buttons
  };
}

// Create product removal keyboard for admin
function getProductRemovalKeyboard() {
  if (products.length === 0) {
    return null;
  }
  
  const buttons = products.map((product, index) => {
    return [{ text: `❌ ${product.name}`, callback_data: `remove_product_${index}` }];
  });
  
  return {
    inline_keyboard: buttons
  };
}

// Command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Show language selection first
  bot.sendMessage(chatId, translations.en.welcome, {
    reply_markup: getLanguageKeyboard()
  });
});

// Handle callback queries (inline keyboard buttons)
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  // Handle language selection
  if (data.startsWith('lang_')) {
    const lang = data.split('_')[1];
    userPreferences[userId] = lang;
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, t(userId, 'languageSelected'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
  }
  // Handle region selection during registration
  else if (data.startsWith('region_')) {
    const region = data.split('_')[1];
    
    if (registrationStates[userId]) {
      registrationStates[userId].data.region = region;
      registrationStates[userId].step = 'name';
      
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, t(userId, 'regionSelected'));
    }
  }
  // Handle product selection during order
  else if (data.startsWith('product_')) {
    const productIndex = parseInt(data.split('_')[1]);
    
    if (orderStates[userId] && products[productIndex]) {
      orderStates[userId].product = products[productIndex].name;
      orderStates[userId].step = 'address';
      
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, t(userId, 'enterAddress'));
    }
  }
  // Handle product removal by admin
  else if (data.startsWith('remove_product_')) {
    if (!isAdmin(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const productIndex = parseInt(data.split('_')[2]);
    
    if (products[productIndex]) {
      const productName = products[productIndex].name;
      products.splice(productIndex, 1);
      saveProducts();
      
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, t(userId, 'productRemoved'), {
        reply_markup: getAdminMenuKeyboard(userId)
      });
      
      delete adminStates[userId];
    }
  }
});

// Handle menu button presses
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  if (!text) return;

  // Skip if message is a command
  if (text.startsWith('/')) {
    return;
  }

  const lang = getUserLanguage(userId);

  // Handle menu buttons
  if (text === translations[lang].menuRegister) {
    startRegistration(chatId, userId);
    return;
  } else if (text === translations[lang].menuMyInfo) {
    showUserInfo(chatId, userId);
    return;
  } else if (text === translations[lang].menuLanguage) {
    bot.sendMessage(chatId, t(userId, 'welcome'), {
      reply_markup: getLanguageKeyboard()
    });
    return;
  } else if (text === translations[lang].menuPlaceOrder) {
    startOrder(chatId, userId);
    return;
  } else if (text === translations[lang].adminMenu) {
    if (isAdmin(userId)) {
      bot.sendMessage(chatId, t(userId, 'adminMenu'), {
        reply_markup: getAdminMenuKeyboard(userId)
      });
    }
    return;
  } else if (text === translations[lang].adminAddProduct) {
    if (isAdmin(userId)) {
      adminStates[userId] = { action: 'add_product' };
      bot.sendMessage(chatId, t(userId, 'enterProductName'));
    }
    return;
  } else if (text === translations[lang].adminRemoveProduct) {
    if (isAdmin(userId)) {
      const keyboard = getProductRemovalKeyboard();
      if (keyboard) {
        adminStates[userId] = { action: 'remove_product' };
        bot.sendMessage(chatId, t(userId, 'selectProductToRemove'), {
          reply_markup: keyboard
        });
      } else {
        bot.sendMessage(chatId, t(userId, 'noProductsToRemove'), {
          reply_markup: getAdminMenuKeyboard(userId)
        });
      }
    }
    return;
  } else if (text === translations[lang].adminViewOrders) {
    if (isAdmin(userId)) {
      showAllOrders(chatId, userId);
    }
    return;
  } else if (text === translations[lang].adminBackToMain) {
    bot.sendMessage(chatId, t(userId, 'languageSelected'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
    delete adminStates[userId];
    return;
  } else if (text === translations[lang].menuCancel) {
    if (registrationStates[userId]) {
      delete registrationStates[userId];
      bot.sendMessage(chatId, t(userId, 'registrationCancelled'), {
        reply_markup: getMainMenuKeyboard(userId)
      });
    } else if (orderStates[userId]) {
      delete orderStates[userId];
      bot.sendMessage(chatId, t(userId, 'orderCancelled'), {
        reply_markup: getMainMenuKeyboard(userId)
      });
    }
    return;
  }

  // Handle admin input
  if (adminStates[userId]) {
    handleAdminInput(chatId, userId, text);
    return;
  }

  // Handle order flow
  if (orderStates[userId]) {
    handleOrderInput(chatId, userId, text);
    return;
  }

  // Handle registration flow
  if (registrationStates[userId]) {
    handleRegistrationInput(chatId, userId, text);
    return;
  }
});

// Start registration process
function startRegistration(chatId, userId) {
  // Check if user is already registered
  if (users[userId]) {
    bot.sendMessage(chatId, t(userId, 'alreadyRegistered'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
    return;
  }

  // Initialize registration state
  registrationStates[userId] = {
    step: 'region',
    data: {}
  };

  // Show region selection
  bot.sendMessage(chatId, t(userId, 'languageSelected'), {
    reply_markup: getRegionKeyboard(userId)
  });
}

// Show user information
function showUserInfo(chatId, userId) {
  if (!users[userId]) {
    bot.sendMessage(chatId, t(userId, 'notRegistered'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
    return;
  }

  const user = users[userId];
  const langNames = { en: 'English', ru: 'Русский', et: 'Eesti' };
  const regionNames = { tallinn: 'Tallinn', paldiski: 'Paldiski' };
  
  const infoMessage = `
${t(userId, 'myInfo')}

👤 ${t(userId, 'name')}: ${user.name}
🌐 ${t(userId, 'language')}: ${langNames[user.language] || user.language}
📍 ${t(userId, 'region')}: ${regionNames[user.region] || user.region}
📅 ${t(userId, 'registered')}: ${new Date(user.registeredAt).toLocaleString()}
🆔 ${t(userId, 'userId')}: ${userId}
  `.trim();

  bot.sendMessage(chatId, infoMessage, {
    reply_markup: getMainMenuKeyboard(userId)
  });
}

// Handle registration input
function handleRegistrationInput(chatId, userId, text) {
  if (!registrationStates[userId]) {
    return;
  }

  const state = registrationStates[userId];

  if (state.step === 'name') {
    // Validate name (basic validation)
    if (!text || text.trim().length < 2) {
      bot.sendMessage(chatId, t(userId, 'invalidName'));
      return;
    }

    state.data.name = text.trim();
    
    // Complete registration (no email needed)
    const lang = getUserLanguage(userId);
    users[userId] = {
      userId: userId,
      username: state.username || 'user',
      name: state.data.name,
      language: lang,
      region: state.data.region,
      registeredAt: new Date().toISOString()
    };

    // Save to file
    saveUsers();

    // Clear registration state
    delete registrationStates[userId];

    const langNames = { en: 'English', ru: 'Русский', et: 'Eesti' };
    const regionNames = { tallinn: 'Tallinn', paldiski: 'Paldiski' };

    const successMessage = `
${t(userId, 'registrationComplete')}

👤 ${t(userId, 'name')}: ${state.data.name}
🌐 ${t(userId, 'language')}: ${langNames[lang]}
📍 ${t(userId, 'region')}: ${regionNames[state.data.region]}
    `.trim();

    bot.sendMessage(chatId, successMessage, {
      reply_markup: getMainMenuKeyboard(userId)
    });
  }
}

// Start order process
function startOrder(chatId, userId) {
  if (!users[userId]) {
    bot.sendMessage(chatId, t(userId, 'notRegistered'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
    return;
  }

  if (products.length === 0) {
    bot.sendMessage(chatId, t(userId, 'noProducts'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
    return;
  }

  // Initialize order state
  orderStates[userId] = {
    step: 'product',
    data: {}
  };

  // Show product selection
  bot.sendMessage(chatId, t(userId, 'selectProduct'), {
    reply_markup: getProductKeyboard(userId)
  });
}

// Handle order input
function handleOrderInput(chatId, userId, text) {
  if (!orderStates[userId]) {
    return;
  }

  const state = orderStates[userId];

  if (state.step === 'address') {
    // Validate address
    if (!text || text.trim().length < 5) {
      bot.sendMessage(chatId, t(userId, 'invalidAddress'));
      return;
    }

    state.data.address = text.trim();
    state.step = 'time';
    
    bot.sendMessage(chatId, t(userId, 'enterTime'));
  } else if (state.step === 'time') {
    // Validate time (basic validation)
    if (!text || text.trim().length < 3) {
      bot.sendMessage(chatId, t(userId, 'invalidTime'));
      return;
    }

    state.data.time = text.trim();
    
    // Complete order
    const order = {
      orderId: orders.length + 1,
      userId: userId,
      userName: users[userId].name,
      product: state.product,
      address: state.data.address,
      time: state.data.time,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    saveOrders();

    // Clear order state
    delete orderStates[userId];

    const successMessage = `
${t(userId, 'orderPlaced')}

${t(userId, 'orderDetails')}
${t(userId, 'orderNumber')}: ${order.orderId}
${t(userId, 'product')}: ${order.product}
${t(userId, 'address')}: ${order.address}
${t(userId, 'time')}: ${order.time}
${t(userId, 'status')}: ${order.status}
    `.trim();

    bot.sendMessage(chatId, successMessage, {
      reply_markup: getMainMenuKeyboard(userId)
    });
  }
}

// Handle admin input
function handleAdminInput(chatId, userId, text) {
  if (!adminStates[userId]) {
    return;
  }

  const state = adminStates[userId];

  if (state.action === 'add_product') {
    // Validate product name
    if (!text || text.trim().length < 2) {
      bot.sendMessage(chatId, 'Product name must be at least 2 characters.');
      return;
    }

    const product = {
      id: products.length + 1,
      name: text.trim(),
      addedAt: new Date().toISOString()
    };

    products.push(product);
    saveProducts();

    delete adminStates[userId];

    bot.sendMessage(chatId, t(userId, 'productAdded'), {
      reply_markup: getAdminMenuKeyboard(userId)
    });
  }
}

// Show all orders (admin function)
function showAllOrders(chatId, userId) {
  if (orders.length === 0) {
    bot.sendMessage(chatId, 'No orders yet.', {
      reply_markup: getAdminMenuKeyboard(userId)
    });
    return;
  }

  let ordersMessage = '📋 All Orders:\n\n';
  
  orders.slice(-10).reverse().forEach(order => {
    ordersMessage += `Order #${order.orderId}\n`;
    ordersMessage += `👤 ${order.userName}\n`;
    ordersMessage += `📦 ${order.product}\n`;
    ordersMessage += `📍 ${order.address}\n`;
    ordersMessage += `🕐 ${order.time}\n`;
    ordersMessage += `Status: ${order.status}\n`;
    ordersMessage += `───────────\n`;
  });

  bot.sendMessage(chatId, ordersMessage, {
    reply_markup: getAdminMenuKeyboard(userId)
  });
}



// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

console.log('✅ Telegram bot is running...');
console.log('Registered users:', Object.keys(users).length);
