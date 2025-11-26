# Telegram Bot - Developer Guide

## Architecture Overview

The Telegram bot is implemented as a standalone Node.js application that can run independently or alongside the React application.

### Components

1. **bot.js** - Main bot application
   - Handles all bot commands and logic
   - Uses in-memory storage (Map objects) for data
   - Implements three user roles: user, courier, admin

2. **Data Storage**
   - `users` - Stores all registered users and couriers
   - `orders` - Stores all orders with their status

3. **User Roles**
   - `USER` - Can create, view, and cancel orders
   - `COURIER` - Can view, accept, and complete orders
   - `ADMIN` - Reserved for future administrative functions

4. **Order Statuses**
   - `PENDING` - Order created, waiting for courier
   - `ASSIGNED` - Order accepted by courier
   - `IN_PROGRESS` - Order is being delivered (reserved for future use)
   - `DELIVERED` - Order successfully delivered
   - `CANCELLED` - Order cancelled by user

## Setup for Development

### Prerequisites
- Node.js (v14 or higher)
- npm
- A Telegram account
- A Telegram bot token from [@BotFather](https://t.me/botfather)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd starter-react-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your bot token:
```
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
```

5. Run the bot:
```bash
npm run bot
```

## Code Structure

### Main Functions

#### Registration
- `bot.onText(/\/register/)` - Handles user registration
- `bot.onText(/\/register_courier/)` - Handles courier registration

#### Order Management (Users)
- `bot.onText(/\/neworder/)` - Creates new order
- `bot.onText(/\/myorders/)` - Lists user's orders
- `bot.onText(/\/cancelorder/)` - Cancels an order

#### Order Management (Couriers)
- `bot.onText(/\/available_orders/)` - Shows pending orders
- `bot.onText(/\/accept_order/)` - Assigns order to courier
- `bot.onText(/\/my_deliveries/)` - Shows courier's active deliveries
- `bot.onText(/\/complete_order/)` - Marks order as delivered

### Helper Functions

- `isRegistered(chatId)` - Checks if user is registered
- `getUserRole(chatId)` - Gets user's role
- `getStatusText(status)` - Converts status code to Russian text

## Data Models

### User Object
```javascript
{
  id: chatId,                  // Telegram chat ID
  username: string,            // Telegram username
  firstName: string,           // User's first name
  lastName: string,            // User's last name
  role: string,                // 'user' or 'courier'
  registeredAt: Date,          // Registration timestamp
  activeOrders: []             // Array of order IDs (couriers only)
}
```

### Order Object
```javascript
{
  id: number,                  // Unique order ID
  userId: chatId,              // Chat ID of user who created order
  details: string,             // Order description and address
  status: string,              // Order status
  createdAt: Date,             // Creation timestamp
  courierId: chatId | null,    // Chat ID of assigned courier
  assignedAt: Date,            // When courier accepted order
  completedAt: Date            // When order was delivered
}
```

## Extending the Bot

### Adding New Commands

1. Add command handler:
```javascript
bot.onText(/\/mycommand/, (msg) => {
  const chatId = msg.chat.id;
  // Your logic here
  bot.sendMessage(chatId, 'Response message');
});
```

2. Update help command to include new command
3. Update documentation

### Adding Database Support

To use a real database instead of in-memory storage:

1. Install database driver (e.g., `npm install mongodb` or `npm install pg`)
2. Replace Map operations with database queries
3. Update data models to match database schema
4. Add database connection initialization

Example with MongoDB:
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

// Replace: users.set(chatId, userData)
// With: await db.collection('users').insertOne(userData)

// Replace: users.get(chatId)
// With: await db.collection('users').findOne({ id: chatId })
```

### Adding Payment Integration

To integrate payment processing:

1. Install payment provider SDK
2. Add payment command handler
3. Implement payment verification
4. Update order flow to include payment step

### Adding Location Tracking

To track courier location:

1. Request location permissions
2. Use `bot.on('location')` to receive location updates
3. Store location data with courier profile
4. Share location with customers

## Testing

### Manual Testing

1. Create two Telegram accounts (user and courier)
2. Register each with appropriate role
3. Test order flow:
   - User creates order
   - Courier accepts order
   - Courier completes order
4. Verify notifications

### Automated Testing

The bot includes basic tests in `bot.test.js`. Run them with:
```bash
npm test
```

To add more tests, create test files with `.test.js` suffix.

## Security Considerations

1. **Token Security**: Never commit `.env` file or expose bot token
2. **Input Validation**: All user inputs are validated (e.g., parseInt checks)
3. **Access Control**: Commands verify user roles before execution
4. **Data Privacy**: User data is only accessible by authorized users

## Deployment

### Heroku
```bash
heroku create your-bot-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

### Docker
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["node", "bot.js"]
```

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start bot.js --name telegram-bot
pm2 save
pm2 startup
```

## Monitoring

Add logging for production:
```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'bot.log' })
  ]
});

// Replace console.log with logger
logger.info('Bot started');
```

## Troubleshooting

### Bot not responding
- Check if bot token is correct
- Verify bot is running (`ps aux | grep node`)
- Check network connectivity
- Review error logs

### Commands not working
- Verify user is registered
- Check user role matches command requirements
- Ensure proper command syntax

### Data loss after restart
- This is expected with in-memory storage
- Implement database persistence for production

## Future Enhancements

1. **Database Integration**: PostgreSQL or MongoDB
2. **Payment Processing**: Stripe or PayPal integration
3. **Location Tracking**: Real-time courier location
4. **Order History**: Persistent order records
5. **Admin Panel**: Web interface for management
6. **Analytics**: Order statistics and reports
7. **Multi-language Support**: English, Russian, etc.
8. **Push Notifications**: SMS or email notifications
9. **Rating System**: User ratings for couriers
10. **Scheduling**: Schedule orders for later delivery

## Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

## License

See LICENSE file for details.
