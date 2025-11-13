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

// Path to users data file
const usersFilePath = path.join(__dirname, 'users.json');

// Initialize users storage
let users = {};

// Translations for multi-language support
const translations = {
  en: {
    welcome: '👋 Welcome to the Registration Bot!\n\nPlease select your language:',
    languageSelected: '✅ Language selected: English\n\nNow, please select your region:',
    regionSelected: '✅ Region selected!\n\nPlease enter your full name:',
    enterName: 'Please enter your full name:',
    enterEmail: '✅ Name saved!\n\nNow, please enter your email address:',
    alreadyRegistered: '✅ You are already registered!\n\nUse the menu to view your information.',
    registrationCancelled: '❌ Registration cancelled.',
    registrationComplete: '🎉 Registration Complete!\n\nYour account has been successfully created.',
    myInfo: '✅ Your Registration Information:',
    notRegistered: '❌ You are not registered yet.\n\nUse the menu to register.',
    invalidName: '❌ Please enter a valid name (at least 2 characters).',
    invalidEmail: '❌ Please enter a valid email address.',
    menuRegister: '📝 Register',
    menuMyInfo: '👤 My Info',
    menuLanguage: '🌐 Language',
    menuCancel: '❌ Cancel',
    name: 'Name',
    email: 'Email',
    language: 'Language',
    region: 'Region',
    registered: 'Registered',
    userId: 'User ID'
  },
  ru: {
    welcome: '👋 Добро пожаловать в Бот Регистрации!\n\nПожалуйста, выберите язык:',
    languageSelected: '✅ Язык выбран: Русский\n\nТеперь выберите регион:',
    regionSelected: '✅ Регион выбран!\n\nПожалуйста, введите ваше полное имя:',
    enterName: 'Пожалуйста, введите ваше полное имя:',
    enterEmail: '✅ Имя сохранено!\n\nТеперь введите ваш email адрес:',
    alreadyRegistered: '✅ Вы уже зарегистрированы!\n\nИспользуйте меню для просмотра информации.',
    registrationCancelled: '❌ Регистрация отменена.',
    registrationComplete: '🎉 Регистрация завершена!\n\nВаш аккаунт успешно создан.',
    myInfo: '✅ Ваша регистрационная информация:',
    notRegistered: '❌ Вы еще не зарегистрированы.\n\nИспользуйте меню для регистрации.',
    invalidName: '❌ Пожалуйста, введите корректное имя (минимум 2 символа).',
    invalidEmail: '❌ Пожалуйста, введите корректный email адрес.',
    menuRegister: '📝 Регистрация',
    menuMyInfo: '👤 Моя информация',
    menuLanguage: '🌐 Язык',
    menuCancel: '❌ Отмена',
    name: 'Имя',
    email: 'Email',
    language: 'Язык',
    region: 'Регион',
    registered: 'Зарегистрирован',
    userId: 'ID пользователя'
  },
  et: {
    welcome: '👋 Tere tulemast registreerimise botti!\n\nPalun valige keel:',
    languageSelected: '✅ Keel valitud: Eesti\n\nNüüd valige oma piirkond:',
    regionSelected: '✅ Piirkond valitud!\n\nPalun sisestage oma täisnimi:',
    enterName: 'Palun sisestage oma täisnimi:',
    enterEmail: '✅ Nimi salvestatud!\n\nNüüd sisestage oma e-posti aadress:',
    alreadyRegistered: '✅ Olete juba registreeritud!\n\nKasutage menüüd oma teabe vaatamiseks.',
    registrationCancelled: '❌ Registreerimine tühistatud.',
    registrationComplete: '🎉 Registreerimine lõpetatud!\n\nTeie konto on edukalt loodud.',
    myInfo: '✅ Teie registreerimise teave:',
    notRegistered: '❌ Te ei ole veel registreeritud.\n\nKasutage menüüd registreerimiseks.',
    invalidName: '❌ Palun sisestage kehtiv nimi (vähemalt 2 tähemärki).',
    invalidEmail: '❌ Palun sisestage kehtiv e-posti aadress.',
    menuRegister: '📝 Registreeri',
    menuMyInfo: '👤 Minu info',
    menuLanguage: '🌐 Keel',
    menuCancel: '❌ Tühista',
    name: 'Nimi',
    email: 'E-post',
    language: 'Keel',
    region: 'Piirkond',
    registered: 'Registreeritud',
    userId: 'Kasutaja ID'
  }
};

// Store user preferences (language)
const userPreferences = {};

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

// Get user's language preference
function getUserLanguage(userId) {
  return userPreferences[userId] || users[userId]?.language || 'en';
}

// Get translation text
function t(userId, key) {
  const lang = getUserLanguage(userId);
  return translations[lang][key] || translations.en[key];
}

// Load users on startup
loadUsers();

// Store registration state for each user
const registrationStates = {};

// Create main menu keyboard
function getMainMenuKeyboard(userId) {
  const lang = getUserLanguage(userId);
  return {
    keyboard: [
      [{ text: translations[lang].menuRegister }],
      [{ text: translations[lang].menuMyInfo }],
      [{ text: translations[lang].menuLanguage }]
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
    
    // Answer callback query to remove loading state
    bot.answerCallbackQuery(query.id);
    
    // Show main menu after language selection
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
  } else if (text === translations[lang].menuCancel) {
    if (registrationStates[userId]) {
      delete registrationStates[userId];
      bot.sendMessage(chatId, t(userId, 'registrationCancelled'), {
        reply_markup: getMainMenuKeyboard(userId)
      });
    }
    return;
  }

  // Handle registration flow
  handleRegistrationInput(chatId, userId, text);
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
📧 ${t(userId, 'email')}: ${user.email}
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
  // Check if user is in registration process
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
    state.step = 'email';
    
    bot.sendMessage(chatId, t(userId, 'enterEmail'));
  } else if (state.step === 'email') {
    // Validate email (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      bot.sendMessage(chatId, t(userId, 'invalidEmail'));
      return;
    }

    state.data.email = text.trim();
    
    // Complete registration
    const lang = getUserLanguage(userId);
    users[userId] = {
      userId: userId,
      username: state.username || 'user',
      name: state.data.name,
      email: state.data.email,
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
📧 ${t(userId, 'email')}: ${state.data.email}
🌐 ${t(userId, 'language')}: ${langNames[lang]}
📍 ${t(userId, 'region')}: ${regionNames[state.data.region]}
    `.trim();

    bot.sendMessage(chatId, successMessage, {
      reply_markup: getMainMenuKeyboard(userId)
    });
  }
}



// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

console.log('✅ Telegram bot is running...');
console.log('Registered users:', Object.keys(users).length);
