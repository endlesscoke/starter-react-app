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
const categoriesFilePath = path.join(__dirname, 'categories.json');
const couriersFilePath = path.join(__dirname, 'couriers.json');

// Initialize storage
let users = {};
let products = [];
let orders = [];
let categories = [];
let couriers = {};

// Admin user IDs (add your Telegram user ID here)
const ADMIN_IDS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(id => parseInt(id.trim())) : [];

// Helper function to check if user is a courier
function isCourier(userId) {
  return couriers.hasOwnProperty(userId);
}

// Translations for multi-language support
const translations = {
  en: {
    welcome: '👋 Welcome to the Order Bot!\n\nPlease select your language:',
    languageSelected: '✅ Language selected: English',
    regionSelected: '✅ Region selected!\n\nPlease enter your nickname:',
    enterName: 'Please enter your nickname:',
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
    menuViewProducts: '📦 View Products',
    menuCancel: '❌ Cancel',
    name: 'Name',
    language: 'Language',
    region: 'Region',
    registered: 'Registered',
    userId: 'User ID',
    selectProduct: 'Please select a product:',
    selectProductToView: 'Select a product to view details:',
    productDetails: '📦 Product Details',
    description: 'Description',
    price: 'Price',
    viewProductsTitle: '📦 Available Products',
    backToMenu: '⬅️ Back to Menu',
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
    enterProductDescription: 'Enter product description:',
    enterProductPrice: 'Enter product price (or skip with /skip):',
    enterProductPhoto: 'Send product photo (or skip with /skip):',
    enterProductCategory: 'Enter product category:',
    productAdded: '✅ Product added successfully!',
    productRemoved: '✅ Product removed successfully!',
    selectProductToRemove: 'Select product to remove:',
    noProductsToRemove: 'No products to remove.',
    addingProductStep1: 'Step 1/5: Product name',
    addingProductStep2: 'Step 2/5: Product description',
    addingProductStep3: 'Step 3/5: Product price',
    addingProductStep4: 'Step 4/5: Product photo',
    addingProductStep5: 'Step 5/5: Product category',
    category: 'Category',
    photo: 'Photo',
    adminManageCategories: '📂 Manage Categories',
    adminAddCategory: '➕ Add Category',
    adminRemoveCategory: '➖ Remove Category',
    enterCategoryName: 'Enter category name:',
    categoryAdded: '✅ Category added successfully!',
    categoryRemoved: '✅ Category removed successfully!',
    selectCategory: 'Select category:',
    selectCategoryToRemove: 'Select category to remove:',
    noCategoriesAvailable: 'No categories available.',
    viewByCategory: 'View by category',
    // Courier
    courierMenu: '🚚 Courier Menu',
    availableOrders: '📦 Available Orders',
    myOrders: '🚚 My Orders',
    takeOrder: '✅ Take Order',
    updateStatus: '🔄 Update Status',
    addCustomerNote: '📝 Add Customer Note',
    orderTaken: '✅ Order taken successfully!',
    orderAlreadyTaken: '❌ This order has already been taken by another courier.',
    noAvailableOrders: 'No available orders at the moment.',
    noAssignedOrders: 'You have no assigned orders.',
    enterCustomerNote: 'Enter customer note (e.g., "Polite customer", "Rude", etc.):',
    customerNoteAdded: '✅ Customer note added successfully!',
    selectOrderStatus: 'Select new order status:',
    statusUpdated: '✅ Order status updated!',
    orderStatusPending: '⏳ Pending',
    orderStatusInProgress: '🚚 In Progress',
    orderStatusCompleted: '✅ Completed',
    courier: 'Courier',
    customerNotes: 'Customer Notes',
    // Admin Courier Management
    adminManageCouriers: '👥 Manage Couriers',
    adminAddCourier: '➕ Add Courier',
    adminRemoveCourier: '➖ Remove Courier',
    adminViewCouriers: '👁️ View Couriers',
    enterCourierId: 'Enter courier Telegram ID:',
    courierAdded: '✅ Courier added successfully!',
    courierRemoved: '✅ Courier removed successfully!',
    courierNotFound: '❌ Courier not found.',
    selectCourierToRemove: 'Select courier to remove:',
    noCouriersToRemove: 'No couriers to remove.',
    noCouriersAvailable: 'No couriers available.',
    couriersList: '👥 Couriers List',
    addedBy: 'Added by'
  },
  ru: {
    welcome: '👋 Добро пожаловать в Бот Заказов!\n\nПожалуйста, выберите язык:',
    languageSelected: '✅ Язык выбран: Русский',
    regionSelected: '✅ Регион выбран!\n\nПожалуйста, введите ваш ник:',
    enterName: 'Пожалуйста, введите ваш ник:',
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
    menuViewProducts: '📦 Просмотр товаров',
    menuCancel: '❌ Отмена',
    name: 'Имя',
    language: 'Язык',
    region: 'Регион',
    registered: 'Зарегистрирован',
    userId: 'ID пользователя',
    selectProduct: 'Пожалуйста, выберите товар:',
    selectProductToView: 'Выберите товар для просмотра:',
    productDetails: '📦 Информация о товаре',
    description: 'Описание',
    price: 'Цена',
    viewProductsTitle: '📦 Доступные товары',
    backToMenu: '⬅️ Вернуться в меню',
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
    enterProductDescription: 'Введите описание товара:',
    enterProductPrice: 'Введите цену товара (или пропустите командой /skip):',
    enterProductPhoto: 'Отправьте фото товара (или пропустите командой /skip):',
    enterProductCategory: 'Введите категорию товара:',
    productAdded: '✅ Товар успешно добавлен!',
    productRemoved: '✅ Товар успешно удален!',
    selectProductToRemove: 'Выберите товар для удаления:',
    noProductsToRemove: 'Нет товаров для удаления.',
    addingProductStep1: 'Шаг 1/5: Название товара',
    addingProductStep2: 'Шаг 2/5: Описание товара',
    addingProductStep3: 'Шаг 3/5: Цена товара',
    addingProductStep4: 'Шаг 4/5: Фото товара',
    addingProductStep5: 'Шаг 5/5: Категория товара',
    category: 'Категория',
    photo: 'Фото',
    adminManageCategories: '📂 Управление категориями',
    adminAddCategory: '➕ Добавить категорию',
    adminRemoveCategory: '➖ Удалить категорию',
    enterCategoryName: 'Введите название категории:',
    categoryAdded: '✅ Категория успешно добавлена!',
    categoryRemoved: '✅ Категория успешно удалена!',
    selectCategory: 'Выберите категорию:',
    selectCategoryToRemove: 'Выберите категорию для удаления:',
    noCategoriesAvailable: 'Категории отсутствуют.',
    viewByCategory: 'Просмотр по категориям',
    // Courier
    courierMenu: '🚚 Меню курьера',
    availableOrders: '📦 Доступные заказы',
    myOrders: '🚚 Мои заказы',
    takeOrder: '✅ Взять заказ',
    updateStatus: '🔄 Обновить статус',
    addCustomerNote: '📝 Добавить заметку о клиенте',
    orderTaken: '✅ Заказ успешно взят!',
    orderAlreadyTaken: '❌ Этот заказ уже взят другим курьером.',
    noAvailableOrders: 'На данный момент нет доступных заказов.',
    noAssignedOrders: 'У вас нет назначенных заказов.',
    enterCustomerNote: 'Введите заметку о клиенте (например, "Вежливый клиент", "Грубый" и т.д.):',
    customerNoteAdded: '✅ Заметка о клиенте успешно добавлена!',
    selectOrderStatus: 'Выберите новый статус заказа:',
    statusUpdated: '✅ Статус заказа обновлен!',
    orderStatusPending: '⏳ Ожидает',
    orderStatusInProgress: '🚚 В процессе',
    orderStatusCompleted: '✅ Выполнен',
    courier: 'Курьер',
    customerNotes: 'Заметки о клиенте',
    // Admin Courier Management
    adminManageCouriers: '👥 Управление курьерами',
    adminAddCourier: '➕ Добавить курьера',
    adminRemoveCourier: '➖ Удалить курьера',
    adminViewCouriers: '👁️ Просмотр курьеров',
    enterCourierId: 'Введите Telegram ID курьера:',
    courierAdded: '✅ Курьер успешно добавлен!',
    courierRemoved: '✅ Курьер успешно удален!',
    courierNotFound: '❌ Курьер не найден.',
    selectCourierToRemove: 'Выберите курьера для удаления:',
    noCouriersToRemove: 'Нет курьеров для удаления.',
    noCouriersAvailable: 'Курьеры отсутствуют.',
    couriersList: '👥 Список курьеров',
    addedBy: 'Добавлен'
  },
  et: {
    welcome: '👋 Tere tulemast tellimuste botti!\n\nPalun valige keel:',
    languageSelected: '✅ Keel valitud: Eesti',
    regionSelected: '✅ Piirkond valitud!\n\nPalun sisestage oma hüüdnimi:',
    enterName: 'Palun sisestage oma hüüdnimi:',
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
    menuViewProducts: '📦 Vaata tooteid',
    menuCancel: '❌ Tühista',
    name: 'Nimi',
    language: 'Keel',
    region: 'Piirkond',
    registered: 'Registreeritud',
    userId: 'Kasutaja ID',
    selectProduct: 'Palun valige toode:',
    selectProductToView: 'Valige toode üksikasjade vaatamiseks:',
    productDetails: '📦 Toote üksikasjad',
    description: 'Kirjeldus',
    price: 'Hind',
    viewProductsTitle: '📦 Saadaolevad tooted',
    backToMenu: '⬅️ Tagasi menüüsse',
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
    enterProductDescription: 'Sisestage toote kirjeldus:',
    enterProductPrice: 'Sisestage toote hind (või jätke vahele käsuga /skip):',
    enterProductPhoto: 'Saatke toote foto (või jätke vahele käsuga /skip):',
    enterProductCategory: 'Sisestage toote kategooria:',
    productAdded: '✅ Toode edukalt lisatud!',
    productRemoved: '✅ Toode edukalt eemaldatud!',
    selectProductToRemove: 'Valige eemaldatav toode:',
    noProductsToRemove: 'Pole tooteid eemaldamiseks.',
    addingProductStep1: 'Samm 1/5: Toote nimi',
    addingProductStep2: 'Samm 2/5: Toote kirjeldus',
    addingProductStep3: 'Samm 3/5: Toote hind',
    addingProductStep4: 'Samm 4/5: Toote foto',
    addingProductStep5: 'Samm 5/5: Toote kategooria',
    category: 'Kategooria',
    photo: 'Foto',
    adminManageCategories: '📂 Halda kategooriaid',
    adminAddCategory: '➕ Lisa kategooria',
    adminRemoveCategory: '➖ Eemalda kategooria',
    enterCategoryName: 'Sisestage kategooria nimi:',
    categoryAdded: '✅ Kategooria edukalt lisatud!',
    categoryRemoved: '✅ Kategooria edukalt eemaldatud!',
    selectCategory: 'Valige kategooria:',
    selectCategoryToRemove: 'Valige eemaldatav kategooria:',
    noCategoriesAvailable: 'Kategooriaid pole saadaval.',
    viewByCategory: 'Vaata kategooriate kaupa',
    // Courier
    courierMenu: '🚚 Kullermenüü',
    availableOrders: '📦 Saadaolevad tellimused',
    myOrders: '🚚 Minu tellimused',
    takeOrder: '✅ Võta tellimus',
    updateStatus: '🔄 Uuenda staatust',
    addCustomerNote: '📝 Lisa kliendi märkus',
    orderTaken: '✅ Tellimus edukalt võetud!',
    orderAlreadyTaken: '❌ See tellimus on juba teise kulleri poolt võetud.',
    noAvailableOrders: 'Hetkel pole saadaolevaid tellimusi.',
    noAssignedOrders: 'Teil pole määratud tellimusi.',
    enterCustomerNote: 'Sisestage kliendi märkus (nt "Viisakas klient", "Ebaviisakas" jne):',
    customerNoteAdded: '✅ Kliendi märkus edukalt lisatud!',
    selectOrderStatus: 'Valige uus tellimuse staatus:',
    statusUpdated: '✅ Tellimuse staatus uuendatud!',
    orderStatusPending: '⏳ Ootel',
    orderStatusInProgress: '🚚 Pooleli',
    orderStatusCompleted: '✅ Lõpetatud',
    courier: 'Kuller',
    customerNotes: 'Kliendi märkused',
    // Admin Courier Management
    adminManageCouriers: '👥 Halda kullereid',
    adminAddCourier: '➕ Lisa kuller',
    adminRemoveCourier: '➖ Eemalda kuller',
    adminViewCouriers: '👁️ Vaata kullereid',
    enterCourierId: 'Sisestage kulleri Telegram ID:',
    courierAdded: '✅ Kuller edukalt lisatud!',
    courierRemoved: '✅ Kuller edukalt eemaldatud!',
    courierNotFound: '❌ Kullerit ei leitud.',
    selectCourierToRemove: 'Valige eemaldatav kuller:',
    noCouriersToRemove: 'Ei ole kullereid eemaldamiseks.',
    noCouriersAvailable: 'Kullereid pole saadaval.',
    couriersList: '👥 Kullerite nimekiri',
    addedBy: 'Lisas'
  }
};

// Store user preferences (language) and states
const userPreferences = {};
const orderStates = {};
const adminStates = {};
const courierStates = {};

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

// Load categories from file
function loadCategories() {
  try {
    if (fs.existsSync(categoriesFilePath)) {
      const data = fs.readFileSync(categoriesFilePath, 'utf8');
      categories = JSON.parse(data);
      console.log('Loaded categories:', categories.length);
    }
  } catch (error) {
    console.error('Error loading categories:', error.message);
    categories = [];
  }
}

// Save categories to file
function saveCategories() {
  try {
    fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error('Error saving categories:', error.message);
  }
}

// Load couriers from file
function loadCouriers() {
  try {
    if (fs.existsSync(couriersFilePath)) {
      const data = fs.readFileSync(couriersFilePath, 'utf8');
      couriers = JSON.parse(data);
      console.log('Loaded couriers:', Object.keys(couriers).length);
    }
  } catch (error) {
    console.error('Error loading couriers:', error.message);
    couriers = {};
  }
}

// Save couriers to file
function saveCouriers() {
  try {
    fs.writeFileSync(couriersFilePath, JSON.stringify(couriers, null, 2));
  } catch (error) {
    console.error('Error saving couriers:', error.message);
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
loadCategories();
loadCouriers();

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
  
  // View Products button available for everyone
  keyboard.push([{ text: translations[lang].menuViewProducts }]);
  keyboard.push([{ text: translations[lang].menuLanguage }]);
  
  if (isAdmin(userId)) {
    keyboard.push([{ text: translations[lang].adminMenu }]);
  }
  
  if (isCourier(userId)) {
    keyboard.push([{ text: translations[lang].courierMenu }]);
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
      [{ text: translations[lang].adminManageCategories }],
      [{ text: translations[lang].adminManageCouriers }],
      [{ text: translations[lang].adminViewOrders }],
      [{ text: translations[lang].adminBackToMain }]
    ],
    resize_keyboard: true
  };
}

// Create courier menu keyboard
function getCourierMenuKeyboard(userId) {
  const lang = getUserLanguage(userId);
  return {
    keyboard: [
      [{ text: translations[lang].availableOrders }],
      [{ text: translations[lang].myOrders }],
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

// Create product keyboard filtered by category for ordering
function getProductKeyboardByCategory(userId, categoryName) {
  const filteredProducts = products.filter(p => p.category === categoryName);
  
  if (filteredProducts.length === 0) {
    return null;
  }
  
  const buttons = filteredProducts.map((product) => {
    const productIndex = products.indexOf(product);
    return [{ text: product.name, callback_data: `product_${productIndex}` }];
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

// Create product viewing keyboard (for extended view)
function getProductViewKeyboard(userId, categoryFilter = null) {
  let filteredProducts = products;
  
  if (categoryFilter) {
    filteredProducts = products.filter(p => p.category === categoryFilter);
  }
  
  if (filteredProducts.length === 0) {
    return null;
  }
  
  const buttons = filteredProducts.map((product) => {
    const productIndex = products.indexOf(product);
    const displayName = product.price ? `${product.name} - ${product.price}` : product.name;
    return [{ text: displayName, callback_data: `view_product_${productIndex}` }];
  });
  
  // Add back button
  buttons.push([{ text: t(userId, 'backToMenu'), callback_data: 'back_to_menu' }]);
  
  return {
    inline_keyboard: buttons
  };
}

// Create category selection keyboard
function getCategoryKeyboard(userId) {
  if (categories.length === 0) {
    return null;
  }
  
  const buttons = categories.map((category, index) => {
    return [{ text: category.name, callback_data: `category_${index}` }];
  });
  
  // Add "All products" option
  buttons.unshift([{ text: '📦 All Products', callback_data: 'category_all' }]);
  buttons.push([{ text: t(userId, 'backToMenu'), callback_data: 'back_to_menu' }]);
  
  return {
    inline_keyboard: buttons
  };
}

// Create category selection keyboard for adding product
function getCategoryKeyboardForProduct() {
  if (categories.length === 0) {
    return null;
  }
  
  const buttons = categories.map((category, index) => {
    return [{ text: category.name, callback_data: `select_category_${index}` }];
  });
  
  return {
    inline_keyboard: buttons
  };
}

// Create category removal keyboard for admin
function getCategoryRemovalKeyboard() {
  if (categories.length === 0) {
    return null;
  }
  
  const buttons = categories.map((category, index) => {
    return [{ text: `❌ ${category.name}`, callback_data: `remove_category_${index}` }];
  });
  
  return {
    inline_keyboard: buttons
  };
}

// Create category selection keyboard for ordering
function getCategoryKeyboardForOrder(userId) {
  if (categories.length === 0) {
    return null;
  }
  
  const buttons = categories.map((category, index) => {
    return [{ text: category.name, callback_data: `order_category_${index}` }];
  });
  
  // Add "All products" option
  buttons.unshift([{ text: '📦 All Products', callback_data: 'order_category_all' }]);
  
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
  // Handle category selection for viewing products
  else if (data.startsWith('category_') && !data.startsWith('order_category_')) {
    bot.answerCallbackQuery(query.id);
    
    if (data === 'category_all') {
      // Show all products
      bot.sendMessage(chatId, t(userId, 'selectProductToView'), {
        reply_markup: getProductViewKeyboard(userId)
      });
    } else {
      const categoryIndex = parseInt(data.split('_')[1]);
      if (categories[categoryIndex]) {
        const categoryName = categories[categoryIndex].name;
        bot.sendMessage(chatId, `${t(userId, 'category')}: ${categoryName}`, {
          reply_markup: getProductViewKeyboard(userId, categoryName)
        });
      }
    }
  }
  // Handle category selection for ordering
  else if (data.startsWith('order_category_')) {
    bot.answerCallbackQuery(query.id);
    
    if (data === 'order_category_all') {
      // Show all products for ordering
      bot.sendMessage(chatId, t(userId, 'selectProduct'), {
        reply_markup: getProductKeyboard(userId)
      });
    } else {
      const categoryIndex = parseInt(data.split('_')[2]);
      if (categories[categoryIndex]) {
        const categoryName = categories[categoryIndex].name;
        bot.sendMessage(chatId, `${t(userId, 'category')}: ${categoryName}\n${t(userId, 'selectProduct')}`, {
          reply_markup: getProductKeyboardByCategory(userId, categoryName)
        });
      }
    }
  }
  // Handle product viewing (extended view)
  else if (data.startsWith('view_product_')) {
    const productIndex = parseInt(data.split('_')[2]);
    
    if (products[productIndex]) {
      const product = products[productIndex];
      const productInfo = `
${t(userId, 'productDetails')}

📦 ${t(userId, 'name')}: ${product.name}
${product.description ? `📝 ${t(userId, 'description')}: ${product.description}` : ''}
${product.price ? `💰 ${t(userId, 'price')}: ${product.price}` : ''}
${product.category ? `📂 ${t(userId, 'category')}: ${product.category}` : ''}
      `.trim();
      
      bot.answerCallbackQuery(query.id);
      
      // If product has photo, send with photo
      if (product.photoId) {
        bot.sendPhoto(chatId, product.photoId, {
          caption: productInfo,
          reply_markup: getProductViewKeyboard(userId)
        });
      } else {
        bot.sendMessage(chatId, productInfo, {
          reply_markup: getProductViewKeyboard(userId)
        });
      }
    }
  }
  // Handle back to menu button
  else if (data === 'back_to_menu') {
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, t(userId, 'languageSelected'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
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
  // Handle category selection when adding product
  else if (data.startsWith('select_category_')) {
    if (!isAdmin(userId) || !adminStates[userId]) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const categoryIndex = parseInt(data.split('_')[2]);
    
    if (categories[categoryIndex]) {
      adminStates[userId].productData.category = categories[categoryIndex].name;
      
      // Create the product
      const productData = adminStates[userId].productData;
      const product = {
        id: products.length + 1,
        name: productData.name,
        description: productData.description || '',
        price: productData.price || '',
        category: productData.category,
        photoId: productData.photoId || null,
        addedAt: new Date().toISOString()
      };
      
      products.push(product);
      saveProducts();
      
      delete adminStates[userId];
      
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, t(userId, 'productAdded'), {
        reply_markup: getAdminMenuKeyboard(userId)
      });
    }
  }
  // Handle category removal by admin
  else if (data.startsWith('remove_category_')) {
    if (!isAdmin(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const categoryIndex = parseInt(data.split('_')[2]);
    
    if (categories[categoryIndex]) {
      categories.splice(categoryIndex, 1);
      saveCategories();
      
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, t(userId, 'categoryRemoved'), {
        reply_markup: getAdminMenuKeyboard(userId)
      });
      
      delete adminStates[userId];
    }
  }
  // Handle courier removal by admin
  else if (data.startsWith('remove_courier_')) {
    if (!isAdmin(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const courierId = data.split('_')[2];
    
    if (couriers[courierId]) {
      delete couriers[courierId];
      saveCouriers();
      
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, t(userId, 'courierRemoved'), {
        reply_markup: getAdminMenuKeyboard(userId)
      });
    }
  }
  // Handle order taking by courier
  else if (data.startsWith('take_order_')) {
    if (!isCourier(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const orderId = parseInt(data.split('_')[2]);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
      bot.answerCallbackQuery(query.id, { text: 'Order not found' });
      return;
    }
    
    if (order.status !== 'pending') {
      bot.answerCallbackQuery(query.id, { text: t(userId, 'orderAlreadyTaken') });
      return;
    }
    
    // Assign order to courier
    order.courierId = userId;
    order.courierName = couriers[userId].name || couriers[userId].username || `Courier ${userId}`;
    order.status = 'in_progress';
    order.updatedAt = new Date().toISOString();
    saveOrders();
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, t(userId, 'orderTaken'), {
      reply_markup: getCourierMenuKeyboard(userId)
    });
  }
  // Handle order status update by courier
  else if (data.startsWith('update_status_')) {
    if (!isCourier(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const orderId = parseInt(data.split('_')[2]);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order || order.courierId !== userId) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    // Show status update options
    bot.answerCallbackQuery(query.id);
    
    const keyboard = {
      inline_keyboard: []
    };
    
    if (order.status === 'pending') {
      keyboard.inline_keyboard.push([{
        text: t(userId, 'orderStatusInProgress'),
        callback_data: `set_status_${orderId}_in_progress`
      }]);
    }
    if (order.status === 'in_progress') {
      keyboard.inline_keyboard.push([{
        text: t(userId, 'orderStatusCompleted'),
        callback_data: `set_status_${orderId}_completed`
      }]);
    }
    
    bot.sendMessage(chatId, t(userId, 'selectOrderStatus'), {
      reply_markup: keyboard
    });
  }
  // Handle setting order status
  else if (data.startsWith('set_status_')) {
    if (!isCourier(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const parts = data.split('_');
    const orderId = parseInt(parts[2]);
    const newStatus = parts[3];
    
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order || order.courierId !== userId) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    saveOrders();
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, t(userId, 'statusUpdated'), {
      reply_markup: getCourierMenuKeyboard(userId)
    });
  }
  // Handle adding customer note
  else if (data.startsWith('add_note_')) {
    if (!isCourier(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const orderId = parseInt(data.split('_')[2]);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order || order.courierId !== userId) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    courierStates[userId] = {
      action: 'add_customer_note',
      orderId: orderId
    };
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, t(userId, 'enterCustomerNote'));
  }
  // Handle admin order status update
  else if (data.startsWith('admin_update_order_')) {
    if (!isAdmin(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const orderId = parseInt(data.split('_')[3]);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
      bot.answerCallbackQuery(query.id, { text: 'Order not found' });
      return;
    }
    
    // Show status selection keyboard
    const keyboard = {
      inline_keyboard: [
        [{ text: '⏳ Pending', callback_data: `admin_set_status_${orderId}_pending` }],
        [{ text: '🚚 In Progress', callback_data: `admin_set_status_${orderId}_in_progress` }],
        [{ text: '✅ Completed', callback_data: `admin_set_status_${orderId}_completed` }]
      ]
    };
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, `${t(userId, 'selectOrderStatus')} #${orderId}`, {
      reply_markup: keyboard
    });
  }
  // Handle admin setting order status
  else if (data.startsWith('admin_set_status_')) {
    if (!isAdmin(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const parts = data.split('_');
    const orderId = parseInt(parts[3]);
    const newStatus = parts[4];
    
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
      bot.answerCallbackQuery(query.id, { text: 'Order not found' });
      return;
    }
    
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    saveOrders();
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, `✅ ${t(userId, 'statusUpdated')} #${orderId}`, {
      reply_markup: getAdminMenuKeyboard(userId)
    });
  }
  // Handle admin adding customer note
  else if (data.startsWith('admin_note_order_')) {
    if (!isAdmin(userId)) {
      bot.answerCallbackQuery(query.id, { text: 'Access denied' });
      return;
    }
    
    const orderId = parseInt(data.split('_')[3]);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
      bot.answerCallbackQuery(query.id, { text: 'Order not found' });
      return;
    }
    
    adminStates[userId] = {
      action: 'add_customer_note_admin',
      orderId: orderId
    };
    
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, t(userId, 'enterCustomerNote'));
  }
  // Handle back to admin menu
  else if (data === 'back_to_admin') {
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(chatId, t(userId, 'adminMenu'), {
      reply_markup: getAdminMenuKeyboard(userId)
    });
  }
});

// Handle menu button presses
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  
  // Handle photos for product addition
  if (msg.photo && adminStates[userId] && adminStates[userId].action === 'add_product' && adminStates[userId].step === 'photo') {
    const photo = msg.photo[msg.photo.length - 1]; // Get highest resolution
    adminStates[userId].productData.photoId = photo.file_id;
    adminStates[userId].step = 'category';
    
    if (categories.length > 0) {
      bot.sendMessage(chatId, `${t(userId, 'addingProductStep5')}\n${t(userId, 'selectCategory')}`, {
        reply_markup: getCategoryKeyboardForProduct()
      });
    } else {
      bot.sendMessage(chatId, t(userId, 'noCategoriesAvailable') + '\n' + t(userId, 'enterCategoryName'));
    }
    return;
  }

  if (!text) return;

  // Handle /skip command for admin adding products
  if (text === '/skip' && adminStates[userId] && adminStates[userId].action === 'add_product') {
    const state = adminStates[userId];
    
    if (state.step === 'price') {
      // Skip price, move to photo
      state.step = 'photo';
      bot.sendMessage(chatId, `${t(userId, 'addingProductStep4')}\n${t(userId, 'enterProductPhoto')}`);
    } else if (state.step === 'photo') {
      // Skip photo, move to category
      state.step = 'category';
      if (categories.length > 0) {
        bot.sendMessage(chatId, `${t(userId, 'addingProductStep5')}\n${t(userId, 'selectCategory')}`, {
          reply_markup: getCategoryKeyboardForProduct()
        });
      } else {
        bot.sendMessage(chatId, t(userId, 'noCategoriesAvailable') + '\n' + t(userId, 'enterCategoryName'));
      }
    }
    return;
  }
  
  // Skip if message is a command
  if (text && text.startsWith('/')) {
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
  } else if (text === translations[lang].menuViewProducts) {
    showProductsView(chatId, userId);
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
      bot.sendMessage(chatId, `${t(userId, 'addingProductStep1')}\n${t(userId, 'enterProductName')}`);
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
  } else if (text === translations[lang].adminManageCategories) {
    if (isAdmin(userId)) {
      // Show category management sub-menu
      bot.sendMessage(chatId, t(userId, 'adminManageCategories'), {
        reply_markup: {
          keyboard: [
            [{ text: translations[lang].adminAddCategory }],
            [{ text: translations[lang].adminRemoveCategory }],
            [{ text: translations[lang].adminBackToMain }]
          ],
          resize_keyboard: true
        }
      });
    }
    return;
  } else if (text === translations[lang].adminAddCategory) {
    if (isAdmin(userId)) {
      adminStates[userId] = { action: 'add_category' };
      bot.sendMessage(chatId, t(userId, 'enterCategoryName'));
    }
    return;
  } else if (text === translations[lang].adminRemoveCategory) {
    if (isAdmin(userId)) {
      const keyboard = getCategoryRemovalKeyboard();
      if (keyboard) {
        bot.sendMessage(chatId, t(userId, 'selectCategoryToRemove'), {
          reply_markup: keyboard
        });
      } else {
        bot.sendMessage(chatId, t(userId, 'noCategoriesAvailable'), {
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
  } else if (text === translations[lang].adminManageCouriers) {
    if (isAdmin(userId)) {
      // Show courier management sub-menu
      bot.sendMessage(chatId, t(userId, 'adminManageCouriers'), {
        reply_markup: {
          keyboard: [
            [{ text: translations[lang].adminAddCourier }],
            [{ text: translations[lang].adminRemoveCourier }],
            [{ text: translations[lang].adminViewCouriers }],
            [{ text: translations[lang].adminBackToMain }]
          ],
          resize_keyboard: true
        }
      });
    }
    return;
  } else if (text === translations[lang].adminAddCourier) {
    if (isAdmin(userId)) {
      adminStates[userId] = { action: 'add_courier' };
      bot.sendMessage(chatId, t(userId, 'enterCourierId'));
    }
    return;
  } else if (text === translations[lang].adminRemoveCourier) {
    if (isAdmin(userId)) {
      const keyboard = getCourierRemovalKeyboard();
      if (keyboard) {
        bot.sendMessage(chatId, t(userId, 'selectCourierToRemove'), {
          reply_markup: keyboard
        });
      } else {
        bot.sendMessage(chatId, t(userId, 'noCouriersToRemove'), {
          reply_markup: getAdminMenuKeyboard(userId)
        });
      }
    }
    return;
  } else if (text === translations[lang].adminViewCouriers) {
    if (isAdmin(userId)) {
      showAllCouriers(chatId, userId);
    }
    return;
  } else if (text === translations[lang].courierMenu) {
    if (isCourier(userId)) {
      bot.sendMessage(chatId, t(userId, 'courierMenu'), {
        reply_markup: getCourierMenuKeyboard(userId)
      });
    }
    return;
  } else if (text === translations[lang].availableOrders) {
    if (isCourier(userId)) {
      showAvailableOrders(chatId, userId);
    }
    return;
  } else if (text === translations[lang].myOrders) {
    if (isCourier(userId)) {
      showCourierOrders(chatId, userId);
    }
    return;
  } else if (text === translations[lang].adminBackToMain) {
    bot.sendMessage(chatId, t(userId, 'languageSelected'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
    delete adminStates[userId];
    delete courierStates[userId];
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

  // Handle courier input
  if (courierStates[userId]) {
    handleCourierInput(chatId, userId, text);
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

// Show products view (with categories)
function showProductsView(chatId, userId) {
  if (products.length === 0) {
    bot.sendMessage(chatId, t(userId, 'noProducts'), {
      reply_markup: getMainMenuKeyboard(userId)
    });
    return;
  }

  // If categories exist, show category selection first
  if (categories.length > 0) {
    bot.sendMessage(chatId, t(userId, 'selectCategory'), {
      reply_markup: getCategoryKeyboard(userId)
    });
  } else {
    // Show all products without category filter
    bot.sendMessage(chatId, t(userId, 'selectProductToView'), {
      reply_markup: getProductViewKeyboard(userId)
    });
  }
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
    const username = state.username || null;
    const profileLink = username ? `https://t.me/${username}` : `tg://user?id=${userId}`;
    
    users[userId] = {
      userId: userId,
      username: username || `user${userId}`,
      name: state.data.name,
      profileLink: profileLink,
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

  // If categories exist, show category selection first
  if (categories.length > 0) {
    bot.sendMessage(chatId, t(userId, 'selectCategory'), {
      reply_markup: getCategoryKeyboardForOrder(userId)
    });
  } else {
    // Show product selection directly if no categories
    bot.sendMessage(chatId, t(userId, 'selectProduct'), {
      reply_markup: getProductKeyboard(userId)
    });
  }
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
    if (!state.step) {
      // Step 1: Product name
      if (!text || text.trim().length < 2) {
        bot.sendMessage(chatId, 'Product name must be at least 2 characters.');
        return;
      }
      
      state.productData = { name: text.trim() };
      state.step = 'description';
      bot.sendMessage(chatId, `${t(userId, 'addingProductStep2')}\n${t(userId, 'enterProductDescription')}`);
    }
    else if (state.step === 'description') {
      // Step 2: Description
      state.productData.description = text.trim();
      state.step = 'price';
      bot.sendMessage(chatId, `${t(userId, 'addingProductStep3')}\n${t(userId, 'enterProductPrice')}`);
    }
    else if (state.step === 'price') {
      // Step 3: Price
      state.productData.price = text.trim();
      state.step = 'photo';
      bot.sendMessage(chatId, `${t(userId, 'addingProductStep4')}\n${t(userId, 'enterProductPhoto')}`);
    }
    else if (state.step === 'category') {
      // Step 5: Category (if categories don't exist, admin types it)
      if (categories.length === 0) {
        const categoryName = text.trim();
        state.productData.category = categoryName;
        
        // Add category if it doesn't exist
        if (!categories.find(c => c.name === categoryName)) {
          categories.push({
            id: categories.length + 1,
            name: categoryName,
            addedAt: new Date().toISOString()
          });
          saveCategories();
        }
        
        // Create the product
        const product = {
          id: products.length + 1,
          name: state.productData.name,
          description: state.productData.description || '',
          price: state.productData.price || '',
          category: state.productData.category,
          photoId: state.productData.photoId || null,
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
  }
  else if (state.action === 'add_category') {
    // Validate category name
    if (!text || text.trim().length < 2) {
      bot.sendMessage(chatId, 'Category name must be at least 2 characters.');
      return;
    }
    
    const category = {
      id: categories.length + 1,
      name: text.trim(),
      addedAt: new Date().toISOString()
    };
    
    categories.push(category);
    saveCategories();
    
    delete adminStates[userId];
    
    bot.sendMessage(chatId, t(userId, 'categoryAdded'), {
      reply_markup: getAdminMenuKeyboard(userId)
    });
  }
  else if (state.action === 'add_courier') {
    // Validate courier ID
    const courierId = parseInt(text.trim());
    if (isNaN(courierId)) {
      bot.sendMessage(chatId, 'Invalid Telegram ID. Please enter a valid number.');
      return;
    }
    
    // Check if courier already exists
    if (couriers[courierId]) {
      bot.sendMessage(chatId, 'This courier is already added.', {
        reply_markup: getAdminMenuKeyboard(userId)
      });
      delete adminStates[userId];
      return;
    }
    
    // Add courier
    couriers[courierId] = {
      userId: courierId,
      username: '',
      name: '',
      addedAt: new Date().toISOString(),
      addedBy: userId
    };
    saveCouriers();
    
    delete adminStates[userId];
    
    bot.sendMessage(chatId, t(userId, 'courierAdded'), {
      reply_markup: getAdminMenuKeyboard(userId)
    });
  }
  else if (state.action === 'add_customer_note_admin') {
    // Admin adding customer note to an order
    const orderId = state.orderId;
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
      bot.sendMessage(chatId, 'Order not found.', {
        reply_markup: getAdminMenuKeyboard(userId)
      });
      delete adminStates[userId];
      return;
    }
    
    order.customerNotes = text.trim();
    order.updatedAt = new Date().toISOString();
    saveOrders();
    
    delete adminStates[userId];
    
    bot.sendMessage(chatId, `✅ ${t(userId, 'customerNoteAdded')} #${orderId}`, {
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

  let ordersMessage = '📋 All Orders (Last 20):\n\n';
  
  const recentOrders = orders.slice(-20).reverse();
  
  recentOrders.forEach(order => {
    let statusEmoji = '⏳';
    if (order.status === 'in_progress') statusEmoji = '🚚';
    if (order.status === 'completed') statusEmoji = '✅';
    
    ordersMessage += `${statusEmoji} Order #${order.orderId}\n`;
    ordersMessage += `👤 ${order.userName}\n`;
    ordersMessage += `📦 ${order.product}\n`;
    ordersMessage += `📍 ${order.address}\n`;
    ordersMessage += `🕐 ${order.time}\n`;
    ordersMessage += `Status: ${order.status}`;
    if (order.courierName) {
      ordersMessage += ` (${t(userId, 'courier')}: ${order.courierName})`;
    }
    ordersMessage += `\n`;
    if (order.customerNotes) {
      ordersMessage += `📝 ${t(userId, 'customerNotes')}: ${order.customerNotes}\n`;
    }
    ordersMessage += `───────────\n`;
  });

  // Create action buttons for each order (admin can manage all orders)
  const keyboard = [];
  recentOrders.slice(0, 10).forEach(order => { // Show buttons for first 10 orders
    keyboard.push([
      {
        text: `🔄 Update #${order.orderId}`,
        callback_data: `admin_update_order_${order.orderId}`
      },
      {
        text: `📝 Note #${order.orderId}`,
        callback_data: `admin_note_order_${order.orderId}`
      }
    ]);
  });
  
  keyboard.push([{ text: t(userId, 'adminBackToMain'), callback_data: 'back_to_admin' }]);

  bot.sendMessage(chatId, ordersMessage, {
    reply_markup: { inline_keyboard: keyboard }
  });
}



// Show all couriers (admin function)
function showAllCouriers(chatId, userId) {
  const courierIds = Object.keys(couriers);
  
  if (courierIds.length === 0) {
    bot.sendMessage(chatId, t(userId, 'noCouriersAvailable'), {
      reply_markup: getAdminMenuKeyboard(userId)
    });
    return;
  }

  let couriersMessage = `${t(userId, 'couriersList')}:\n\n`;
  
  courierIds.forEach(id => {
    const courier = couriers[id];
    couriersMessage += `👤 ID: ${courier.userId}\n`;
    if (courier.name) couriersMessage += `Name: ${courier.name}\n`;
    if (courier.username) couriersMessage += `@${courier.username}\n`;
    couriersMessage += `${t(userId, 'addedBy')}: ${courier.addedBy}\n`;
    couriersMessage += `───────────\n`;
  });

  bot.sendMessage(chatId, couriersMessage, {
    reply_markup: getAdminMenuKeyboard(userId)
  });
}

// Get courier removal keyboard
function getCourierRemovalKeyboard() {
  const courierIds = Object.keys(couriers);
  
  if (courierIds.length === 0) {
    return null;
  }
  
  const keyboard = courierIds.map(id => ([{
    text: `${couriers[id].name || couriers[id].username || couriers[id].userId}`,
    callback_data: `remove_courier_${id}`
  }]));
  
  return {
    inline_keyboard: keyboard
  };
}

// Show available orders (courier function)
function showAvailableOrders(chatId, userId) {
  const availableOrders = orders.filter(order => order.status === 'pending');
  
  if (availableOrders.length === 0) {
    bot.sendMessage(chatId, t(userId, 'noAvailableOrders'), {
      reply_markup: getCourierMenuKeyboard(userId)
    });
    return;
  }

  let ordersMessage = `${t(userId, 'availableOrders')}:\n\n`;
  
  availableOrders.forEach(order => {
    ordersMessage += `${t(userId, 'orderNumber')}${order.orderId}\n`;
    ordersMessage += `👤 ${order.userName}\n`;
    ordersMessage += `📦 ${order.product}\n`;
    ordersMessage += `📍 ${order.address}\n`;
    ordersMessage += `🕐 ${order.time}\n`;
    ordersMessage += `${t(userId, 'status')}: ${t(userId, 'orderStatusPending')}\n`;
    ordersMessage += `───────────\n`;
  });

  // Create buttons for taking orders
  const keyboard = availableOrders.map(order => ([{
    text: `${t(userId, 'takeOrder')} #${order.orderId}`,
    callback_data: `take_order_${order.orderId}`
  }]));

  bot.sendMessage(chatId, ordersMessage, {
    reply_markup: { inline_keyboard: keyboard }
  });
}

// Show courier's assigned orders
function showCourierOrders(chatId, userId) {
  const courierOrders = orders.filter(order => order.courierId === userId);
  
  if (courierOrders.length === 0) {
    bot.sendMessage(chatId, t(userId, 'noAssignedOrders'), {
      reply_markup: getCourierMenuKeyboard(userId)
    });
    return;
  }

  let ordersMessage = `${t(userId, 'myOrders')}:\n\n`;
  
  courierOrders.forEach(order => {
    ordersMessage += `${t(userId, 'orderNumber')}${order.orderId}\n`;
    ordersMessage += `👤 ${order.userName}\n`;
    ordersMessage += `📦 ${order.product}\n`;
    ordersMessage += `📍 ${order.address}\n`;
    ordersMessage += `🕐 ${order.time}\n`;
    
    let statusText = t(userId, 'orderStatusPending');
    if (order.status === 'in_progress') statusText = t(userId, 'orderStatusInProgress');
    if (order.status === 'completed') statusText = t(userId, 'orderStatusCompleted');
    ordersMessage += `${t(userId, 'status')}: ${statusText}\n`;
    
    if (order.customerNotes) {
      ordersMessage += `${t(userId, 'customerNotes')}: ${order.customerNotes}\n`;
    }
    ordersMessage += `───────────\n`;
  });

  // Create action buttons for each order
  const keyboard = [];
  courierOrders.forEach(order => {
    if (order.status !== 'completed') {
      keyboard.push([{
        text: `${t(userId, 'updateStatus')} #${order.orderId}`,
        callback_data: `update_status_${order.orderId}`
      }]);
    }
    keyboard.push([{
      text: `${t(userId, 'addCustomerNote')} #${order.orderId}`,
      callback_data: `add_note_${order.orderId}`
    }]);
  });

  bot.sendMessage(chatId, ordersMessage, {
    reply_markup: { inline_keyboard: keyboard }
  });
}

// Handle courier input
function handleCourierInput(chatId, userId, text) {
  if (!courierStates[userId]) {
    return;
  }

  const state = courierStates[userId];

  if (state.action === 'add_customer_note') {
    const order = orders.find(o => o.orderId === state.orderId);
    if (!order) {
      bot.sendMessage(chatId, 'Order not found.');
      delete courierStates[userId];
      return;
    }

    // Add customer note
    order.customerNotes = text.trim();
    order.updatedAt = new Date().toISOString();
    saveOrders();

    delete courierStates[userId];

    bot.sendMessage(chatId, t(userId, 'customerNoteAdded'), {
      reply_markup: getCourierMenuKeyboard(userId)
    });
  }
}

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

console.log('✅ Telegram bot is running...');
console.log('Registered users:', Object.keys(users).length);
