const TelegramBot = require('node-telegram-bot-api');

// Bot token from environment variable
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN environment variable is required');
  console.log('Please set your bot token: export TELEGRAM_BOT_TOKEN="your_bot_token_here"');
  process.exit(1);
}

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// In-memory storage (in production, use a database)
const users = new Map();
const orders = new Map();
let orderIdCounter = 1;

// User roles
const ROLES = {
  USER: 'user',
  COURIER: 'courier',
  ADMIN: 'admin'
};

// Order statuses
const ORDER_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Helper function to check if user is registered
function isRegistered(chatId) {
  return users.has(chatId);
}

// Helper function to get user role
function getUserRole(chatId) {
  const user = users.get(chatId);
  return user ? user.role : null;
}

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
👋 Добро пожаловать в систему доставки!

Доступные команды:
/register - Регистрация пользователя
/register_courier - Регистрация курьера
/help - Показать справку
  `;
  bot.sendMessage(chatId, welcomeMessage);
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const role = getUserRole(chatId);
  
  let helpMessage = `
📋 Доступные команды:

👤 Общие:
/start - Начать работу с ботом
/help - Показать эту справку
/register - Регистрация пользователя
/register_courier - Регистрация курьера
/myinfo - Посмотреть мою информацию
  `;
  
  if (role === ROLES.USER) {
    helpMessage += `
🛒 Команды для пользователей:
/neworder - Создать новый заказ
/myorders - Посмотреть мои заказы
/cancelorder - Отменить заказ
    `;
  }
  
  if (role === ROLES.COURIER) {
    helpMessage += `
🚗 Команды для курьеров:
/available_orders - Посмотреть доступные заказы
/accept_order - Принять заказ
/my_deliveries - Мои текущие доставки
/complete_order - Завершить доставку
    `;
  }
  
  bot.sendMessage(chatId, helpMessage);
});

// Register user
bot.onText(/\/register/, (msg) => {
  const chatId = msg.chat.id;
  
  if (isRegistered(chatId)) {
    bot.sendMessage(chatId, '✅ Вы уже зарегистрированы!');
    return;
  }
  
  const username = msg.from.username || msg.from.first_name || 'Пользователь';
  
  users.set(chatId, {
    id: chatId,
    username: username,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
    role: ROLES.USER,
    registeredAt: new Date()
  });
  
  bot.sendMessage(chatId, `✅ Регистрация успешна!\n\nВы зарегистрированы как пользователь.\n\nИспользуйте /neworder чтобы создать заказ.`);
});

// Register courier
bot.onText(/\/register_courier/, (msg) => {
  const chatId = msg.chat.id;
  
  if (isRegistered(chatId)) {
    const user = users.get(chatId);
    if (user.role === ROLES.COURIER) {
      bot.sendMessage(chatId, '✅ Вы уже зарегистрированы как курьер!');
      return;
    }
    bot.sendMessage(chatId, '❌ Вы уже зарегистрированы как пользователь. Используйте другой аккаунт для регистрации курьера.');
    return;
  }
  
  const username = msg.from.username || msg.from.first_name || 'Курьер';
  
  const courierData = {
    id: chatId,
    username: username,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
    role: ROLES.COURIER,
    registeredAt: new Date(),
    activeOrders: []
  };
  
  users.set(chatId, courierData);
  
  bot.sendMessage(chatId, `✅ Регистрация успешна!\n\nВы зарегистрированы как курьер.\n\nИспользуйте /available_orders чтобы посмотреть доступные заказы.`);
});

// Get user info
bot.onText(/\/myinfo/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Вы не зарегистрированы. Используйте /register или /register_courier');
    return;
  }
  
  const user = users.get(chatId);
  const info = `
👤 Ваша информация:
━━━━━━━━━━━━━━━━━
📛 Имя: ${user.firstName || 'Не указано'}
👤 Username: @${user.username || 'Не указан'}
🎭 Роль: ${user.role === ROLES.COURIER ? 'Курьер' : 'Пользователь'}
📅 Дата регистрации: ${user.registeredAt.toLocaleDateString('ru-RU')}
  `;
  
  bot.sendMessage(chatId, info);
});

// Create new order
bot.onText(/\/neworder/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Сначала зарегистрируйтесь: /register');
    return;
  }
  
  const role = getUserRole(chatId);
  if (role !== ROLES.USER) {
    bot.sendMessage(chatId, '❌ Только пользователи могут создавать заказы.');
    return;
  }
  
  bot.sendMessage(chatId, '📝 Введите описание заказа и адрес доставки:\n\nПример: Пицца Маргарита, ул. Ленина 10, кв. 5');
  
  // Listen for the next message from this user
  const listener = bot.onReplyToMessage(chatId, msg.message_id, (reply) => {
    const orderDetails = reply.text;
    
    const orderId = orderIdCounter++;
    const order = {
      id: orderId,
      userId: chatId,
      details: orderDetails,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date(),
      courierId: null
    };
    
    orders.set(orderId, order);
    
    bot.sendMessage(chatId, `✅ Заказ #${orderId} создан!\n\n📦 Детали: ${orderDetails}\n📊 Статус: Ожидает курьера\n\nВы можете посмотреть ваши заказы: /myorders`);
    
    // Notify all couriers about new order
    users.forEach((user, userId) => {
      if (user.role === ROLES.COURIER) {
        bot.sendMessage(userId, `🔔 Новый заказ #${orderId}!\n\n📦 ${orderDetails}\n\nИспользуйте /available_orders чтобы посмотреть все доступные заказы.`);
      }
    });
  });
});

// View my orders
bot.onText(/\/myorders/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Сначала зарегистрируйтесь: /register');
    return;
  }
  
  const role = getUserRole(chatId);
  if (role !== ROLES.USER) {
    bot.sendMessage(chatId, '❌ Эта команда доступна только для пользователей.');
    return;
  }
  
  const userOrders = Array.from(orders.values()).filter(order => order.userId === chatId);
  
  if (userOrders.length === 0) {
    bot.sendMessage(chatId, '📭 У вас пока нет заказов.\n\nСоздайте новый заказ: /neworder');
    return;
  }
  
  let message = '📦 Ваши заказы:\n\n';
  userOrders.forEach(order => {
    const statusEmoji = order.status === ORDER_STATUS.DELIVERED ? '✅' : 
                       order.status === ORDER_STATUS.IN_PROGRESS ? '🚗' :
                       order.status === ORDER_STATUS.ASSIGNED ? '👤' : '⏳';
    
    message += `${statusEmoji} Заказ #${order.id}\n`;
    message += `📝 ${order.details}\n`;
    message += `📊 Статус: ${getStatusText(order.status)}\n`;
    if (order.courierId) {
      const courier = users.get(order.courierId);
      message += `🚗 Курьер: ${courier.firstName || courier.username}\n`;
    }
    message += `📅 Создан: ${order.createdAt.toLocaleString('ru-RU')}\n\n`;
  });
  
  bot.sendMessage(chatId, message);
});

// Cancel order
bot.onText(/\/cancelorder/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Сначала зарегистрируйтесь: /register');
    return;
  }
  
  const role = getUserRole(chatId);
  if (role !== ROLES.USER) {
    bot.sendMessage(chatId, '❌ Эта команда доступна только для пользователей.');
    return;
  }
  
  const userOrders = Array.from(orders.values()).filter(
    order => order.userId === chatId && 
    (order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.ASSIGNED)
  );
  
  if (userOrders.length === 0) {
    bot.sendMessage(chatId, '❌ У вас нет активных заказов для отмены.');
    return;
  }
  
  let message = '🗑 Введите номер заказа для отмены:\n\n';
  userOrders.forEach(order => {
    message += `Заказ #${order.id}: ${order.details}\n`;
  });
  
  bot.sendMessage(chatId, message);
  
  bot.onReplyToMessage(chatId, msg.message_id, (reply) => {
    const orderId = parseInt(reply.text, 10);
    
    if (isNaN(orderId)) {
      bot.sendMessage(chatId, '❌ Пожалуйста, введите корректный номер заказа.');
      return;
    }
    
    const order = orders.get(orderId);
    
    if (!order || order.userId !== chatId) {
      bot.sendMessage(chatId, '❌ Заказ не найден.');
      return;
    }
    
    if (order.status !== ORDER_STATUS.PENDING && order.status !== ORDER_STATUS.ASSIGNED) {
      bot.sendMessage(chatId, '❌ Этот заказ уже нельзя отменить.');
      return;
    }
    
    order.status = ORDER_STATUS.CANCELLED;
    bot.sendMessage(chatId, `✅ Заказ #${orderId} отменен.`);
    
    if (order.courierId) {
      bot.sendMessage(order.courierId, `❌ Заказ #${orderId} был отменен пользователем.`);
    }
  });
});

// View available orders (for couriers)
bot.onText(/\/available_orders/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Сначала зарегистрируйтесь: /register_courier');
    return;
  }
  
  const role = getUserRole(chatId);
  if (role !== ROLES.COURIER) {
    bot.sendMessage(chatId, '❌ Эта команда доступна только для курьеров.');
    return;
  }
  
  const availableOrders = Array.from(orders.values()).filter(
    order => order.status === ORDER_STATUS.PENDING
  );
  
  if (availableOrders.length === 0) {
    bot.sendMessage(chatId, '📭 Нет доступных заказов.');
    return;
  }
  
  let message = '📦 Доступные заказы:\n\n';
  availableOrders.forEach(order => {
    const customer = users.get(order.userId);
    message += `🆔 Заказ #${order.id}\n`;
    message += `📝 ${order.details}\n`;
    message += `👤 Клиент: ${customer.firstName || customer.username}\n`;
    message += `📅 Создан: ${order.createdAt.toLocaleString('ru-RU')}\n\n`;
  });
  
  message += '\nИспользуйте /accept_order чтобы принять заказ.';
  
  bot.sendMessage(chatId, message);
});

// Accept order (for couriers)
bot.onText(/\/accept_order/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Сначала зарегистрируйтесь: /register_courier');
    return;
  }
  
  const role = getUserRole(chatId);
  if (role !== ROLES.COURIER) {
    bot.sendMessage(chatId, '❌ Эта команда доступна только для курьеров.');
    return;
  }
  
  bot.sendMessage(chatId, '🔢 Введите номер заказа:');
  
  bot.onReplyToMessage(chatId, msg.message_id, (reply) => {
    const orderId = parseInt(reply.text, 10);
    
    if (isNaN(orderId)) {
      bot.sendMessage(chatId, '❌ Пожалуйста, введите корректный номер заказа.');
      return;
    }
    
    const order = orders.get(orderId);
    
    if (!order) {
      bot.sendMessage(chatId, '❌ Заказ не найден.');
      return;
    }
    
    if (order.status !== ORDER_STATUS.PENDING) {
      bot.sendMessage(chatId, '❌ Этот заказ уже принят или недоступен.');
      return;
    }
    
    order.status = ORDER_STATUS.ASSIGNED;
    order.courierId = chatId;
    order.assignedAt = new Date();
    
    const courier = users.get(chatId);
    courier.activeOrders.push(orderId);
    
    bot.sendMessage(chatId, `✅ Вы приняли заказ #${orderId}!\n\n📝 ${order.details}\n\nИспользуйте /my_deliveries чтобы посмотреть ваши доставки.`);
    
    // Notify customer
    const customer = users.get(order.userId);
    bot.sendMessage(order.userId, `🚗 Курьер ${courier.firstName || courier.username} принял ваш заказ #${orderId}!`);
  });
});

// View my deliveries (for couriers)
bot.onText(/\/my_deliveries/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Сначала зарегистрируйтесь: /register_courier');
    return;
  }
  
  const role = getUserRole(chatId);
  if (role !== ROLES.COURIER) {
    bot.sendMessage(chatId, '❌ Эта команда доступна только для курьеров.');
    return;
  }
  
  const myDeliveries = Array.from(orders.values()).filter(
    order => order.courierId === chatId && 
    (order.status === ORDER_STATUS.ASSIGNED || order.status === ORDER_STATUS.IN_PROGRESS)
  );
  
  if (myDeliveries.length === 0) {
    bot.sendMessage(chatId, '📭 У вас нет активных доставок.\n\nИспользуйте /available_orders чтобы посмотреть доступные заказы.');
    return;
  }
  
  let message = '🚗 Ваши доставки:\n\n';
  myDeliveries.forEach(order => {
    const customer = users.get(order.userId);
    message += `🆔 Заказ #${order.id}\n`;
    message += `📝 ${order.details}\n`;
    message += `👤 Клиент: ${customer.firstName || customer.username}\n`;
    message += `📊 Статус: ${getStatusText(order.status)}\n`;
    message += `📅 Принят: ${order.assignedAt.toLocaleString('ru-RU')}\n\n`;
  });
  
  message += '\nИспользуйте /complete_order чтобы завершить доставку.';
  
  bot.sendMessage(chatId, message);
});

// Complete order (for couriers)
bot.onText(/\/complete_order/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isRegistered(chatId)) {
    bot.sendMessage(chatId, '❌ Сначала зарегистрируйтесь: /register_courier');
    return;
  }
  
  const role = getUserRole(chatId);
  if (role !== ROLES.COURIER) {
    bot.sendMessage(chatId, '❌ Эта команда доступна только для курьеров.');
    return;
  }
  
  bot.sendMessage(chatId, '🔢 Введите номер заказа для завершения:');
  
  bot.onReplyToMessage(chatId, msg.message_id, (reply) => {
    const orderId = parseInt(reply.text, 10);
    
    if (isNaN(orderId)) {
      bot.sendMessage(chatId, '❌ Пожалуйста, введите корректный номер заказа.');
      return;
    }
    
    const order = orders.get(orderId);
    
    if (!order || order.courierId !== chatId) {
      bot.sendMessage(chatId, '❌ Заказ не найден или не назначен вам.');
      return;
    }
    
    if (order.status === ORDER_STATUS.DELIVERED) {
      bot.sendMessage(chatId, '❌ Этот заказ уже завершен.');
      return;
    }
    
    order.status = ORDER_STATUS.DELIVERED;
    order.completedAt = new Date();
    
    const courier = users.get(chatId);
    courier.activeOrders = courier.activeOrders.filter(id => id !== orderId);
    
    bot.sendMessage(chatId, `✅ Заказ #${orderId} успешно завершен!`);
    
    // Notify customer
    bot.sendMessage(order.userId, `✅ Ваш заказ #${orderId} доставлен!\n\nСпасибо за использование нашего сервиса!`);
  });
});

// Helper function to get status text in Russian
function getStatusText(status) {
  const statusMap = {
    [ORDER_STATUS.PENDING]: 'Ожидает курьера',
    [ORDER_STATUS.ASSIGNED]: 'Назначен курьеру',
    [ORDER_STATUS.IN_PROGRESS]: 'В процессе доставки',
    [ORDER_STATUS.DELIVERED]: 'Доставлен',
    [ORDER_STATUS.CANCELLED]: 'Отменен'
  };
  return statusMap[status] || status;
}

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 Telegram bot is running...');
console.log('📊 Registered users:', users.size);
console.log('🚗 Registered couriers:', Array.from(users.values()).filter(u => u.role === ROLES.COURIER).length);
console.log('📦 Active orders:', orders.size);
