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

// Load users on startup
loadUsers();

// Command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || msg.from.first_name;

  const welcomeMessage = `
Welcome to the Registration Bot! 👋

Available commands:
/register - Register as a new user
/myinfo - View your registration information
/help - Show this help message
/cancel - Cancel current operation

Let's get started! Use /register to begin registration.
  `.trim();

  bot.sendMessage(chatId, welcomeMessage);
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
📋 Available Commands:

/start - Start the bot and see welcome message
/register - Register as a new user
/myinfo - View your registration information
/help - Show this help message
/cancel - Cancel current operation

To register, simply type /register and follow the instructions.
  `.trim();

  bot.sendMessage(chatId, helpMessage);
});

// Store registration state for each user
const registrationStates = {};

// Command: /register
bot.onText(/\/register/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check if user is already registered
  if (users[userId]) {
    bot.sendMessage(chatId, 
      '✅ You are already registered!\n\n' +
      'Use /myinfo to view your information.'
    );
    return;
  }

  // Initialize registration state
  registrationStates[userId] = {
    step: 'name',
    data: {}
  };

  bot.sendMessage(chatId, 
    '📝 Let\'s start the registration process!\n\n' +
    'Please enter your full name:'
  );
});

// Command: /cancel
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (registrationStates[userId]) {
    delete registrationStates[userId];
    bot.sendMessage(chatId, '❌ Registration cancelled. Use /register to start again.');
  } else {
    bot.sendMessage(chatId, 'No active operation to cancel.');
  }
});

// Command: /myinfo
bot.onText(/\/myinfo/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!users[userId]) {
    bot.sendMessage(chatId, 
      '❌ You are not registered yet.\n\n' +
      'Use /register to create your account.'
    );
    return;
  }

  const user = users[userId];
  const infoMessage = `
✅ Your Registration Information:

👤 Name: ${user.name}
📧 Email: ${user.email}
📅 Registered: ${new Date(user.registeredAt).toLocaleString()}
🆔 User ID: ${userId}
  `.trim();

  bot.sendMessage(chatId, infoMessage);
});

// Handle text messages for registration flow
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  // Skip if message is a command
  if (text && text.startsWith('/')) {
    return;
  }

  // Check if user is in registration process
  if (!registrationStates[userId]) {
    return;
  }

  const state = registrationStates[userId];

  if (state.step === 'name') {
    // Validate name (basic validation)
    if (!text || text.trim().length < 2) {
      bot.sendMessage(chatId, '❌ Please enter a valid name (at least 2 characters).');
      return;
    }

    state.data.name = text.trim();
    state.step = 'email';
    
    bot.sendMessage(chatId, 
      '✅ Name saved!\n\n' +
      'Now, please enter your email address:'
    );
  } else if (state.step === 'email') {
    // Validate email (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      bot.sendMessage(chatId, '❌ Please enter a valid email address.');
      return;
    }

    state.data.email = text.trim();
    
    // Complete registration
    users[userId] = {
      userId: userId,
      username: msg.from.username || msg.from.first_name,
      name: state.data.name,
      email: state.data.email,
      registeredAt: new Date().toISOString()
    };

    // Save to file
    saveUsers();

    // Clear registration state
    delete registrationStates[userId];

    const successMessage = `
🎉 Registration Complete!

Your account has been successfully created:
👤 Name: ${state.data.name}
📧 Email: ${state.data.email}

You can view your information anytime using /myinfo
    `.trim();

    bot.sendMessage(chatId, successMessage);
  }
});

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

console.log('✅ Telegram bot is running...');
console.log('Registered users:', Object.keys(users).length);
