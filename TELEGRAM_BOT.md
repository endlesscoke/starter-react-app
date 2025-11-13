# Telegram Bot - Ordering System

This project includes a Telegram bot that allows users to register and place orders with an admin panel for product management.

📦 **[Deployment Guide](DEPLOYMENT.md)** - Learn how to deploy the bot to a server

## Features

- ✅ User registration (name, language, region - no email)
- 🛒 Order placement system
- 🌐 Multi-language support (English, Russian, Estonian)
- 📍 Region selection (Tallinn, Paldiski)
- 📦 Product selection from catalog
- 📋 View user information
- 🔧 Admin panel for product management
- 📊 Order tracking and management
- 🔒 Persistent data storage (users, products, orders)
- 💬 Interactive conversation flow with menu buttons
- 🛡️ Input validation
- ⌨️ User-friendly keyboard interface

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token provided by BotFather

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your bot token and admin IDs:
   ```
   TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
   ADMIN_IDS=123456789,987654321
   ```
   
   **To get your Telegram user ID:**
   - Message [@userinfobot](https://t.me/userinfobot) on Telegram
   - It will reply with your user ID
   - Add your ID to ADMIN_IDS (comma-separated for multiple admins)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Bot

```bash
npm run bot
```

The bot will start and begin polling for messages.

## How to Use

### Starting the Bot

1. Send `/start` command to the bot
2. Select your preferred language:
   - 🇬🇧 English
   - 🇷🇺 Русский (Russian)
   - 🇪🇪 Eesti (Estonian)
3. Use the menu buttons to navigate

### Menu Buttons

The bot uses an interactive keyboard menu with the following options:

**For Unregistered Users:**
- **📝 Register / Регистрация / Registreeri** - Start the registration process
- **🌐 Language / Язык / Keel** - Change language preference

**For Registered Users:**
- **🛒 Place Order / Оформить заказ / Tee tellimus** - Start ordering process
- **👤 My Info / Моя информация / Minu info** - View your information
- **🌐 Language / Язык / Keel** - Change language preference

**For Administrators:**
- **🔧 Admin Menu / Меню администратора / Administraatori menüü** - Access admin panel

## Registration Flow

1. User sends `/start` command
2. User selects language (English, Russian, or Estonian)
3. User clicks "📝 Register" button from the menu
4. Bot asks user to select region (Tallinn or Paldiski)
5. User selects region using inline buttons
6. Bot asks for full name
7. User provides their name
8. Bot confirms successful registration

### Registration Example

```
User: /start
Bot: 👋 Welcome to the Order Bot!
     Please select your language:
     [🇬🇧 English] [🇷🇺 Русский]
     [🇪🇪 Eesti]

User: [Clicks 🇬🇧 English]
Bot: ✅ Language selected: English
     [Menu appears with buttons: 📝 Register | 🌐 Language]

User: [Clicks 📝 Register]
Bot: ✅ Language selected: English
     Now, please select your region:
     [🏙️ Tallinn]
     [🏘️ Paldiski]

User: [Clicks 🏙️ Tallinn]
Bot: ✅ Region selected!
     Please enter your full name:

User: John Doe
Bot: 🎉 Registration Complete!
     Your account has been successfully created:
     👤 Name: John Doe
     🌐 Language: English
     📍 Region: Tallinn
```

## Ordering Flow

1. User clicks "🛒 Place Order" button
2. Bot shows available products (inline keyboard)
3. User selects a product
4. Bot asks for delivery address
5. User enters address
6. Bot asks for delivery time
7. User enters time
8. Bot confirms order with details

### Order Example

```
User: [Clicks 🛒 Place Order]
Bot: Please select a product:
     [Product A]
     [Product B]
     [Product C]

User: [Clicks Product A]
Bot: Please enter delivery address:

User: 123 Main St, Tallinn
Bot: Please enter delivery time (e.g., 14:00 or 2:00 PM):

User: 15:00
Bot: ✅ Order placed successfully!
     
     📦 Order Details:
     Order #: 1
     Product: Product A
     Address: 123 Main St, Tallinn
     Time: 15:00
     Status: pending
```

## Admin Panel

Administrators (configured in `.env` file) have access to additional features:

### Admin Menu Options

- **➕ Add Product** - Add new products to the catalog
- **➖ Remove Product** - Remove products from the catalog
- **📋 View Orders** - See all orders placed by users
- **⬅️ Back to Main Menu** - Return to main menu

### Add Product Example

```
Admin: [Clicks 🔧 Admin Menu]
Bot: 🔧 Admin Menu
     [Shows admin menu buttons]

Admin: [Clicks ➕ Add Product]
Bot: Enter product name:

Admin: Pizza Margherita
Bot: ✅ Product added successfully!
```

### Remove Product Example

```
Admin: [Clicks ➖ Remove Product]
Bot: Select product to remove:
     [❌ Product A]
     [❌ Product B]

Admin: [Clicks ❌ Product A]
Bot: ✅ Product removed successfully!
```

### View Orders Example

```
Admin: [Clicks 📋 View Orders]
Bot: 📋 All Orders:
     
     Order #1
     👤 John Doe
     📦 Product A
     📍 123 Main St, Tallinn
     🕐 15:00
     Status: pending
     ───────────
     
     Order #2
     👤 Jane Smith
     📦 Product B
     📍 456 Oak Ave, Paldiski
     🕐 18:30
     Status: pending
     ───────────
```

## Data Storage

All data is stored in JSON files in the project root directory. These files are automatically created when needed.

**Note:** All data files are excluded from version control via `.gitignore` to protect privacy.

### User Data Structure (`users.json`)

```json
{
  "123456789": {
    "userId": 123456789,
    "username": "johndoe",
    "name": "John Doe",
    "language": "en",
    "region": "tallinn",
    "registeredAt": "2025-11-13T04:30:00.000Z"
  }
}
```

### Product Data Structure (`products.json`)

```json
[
  {
    "id": 1,
    "name": "Product A",
    "addedAt": "2025-11-13T04:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Product B",
    "addedAt": "2025-11-13T04:35:00.000Z"
  }
]
```

### Order Data Structure (`orders.json`)

```json
[
  {
    "orderId": 1,
    "userId": 123456789,
    "userName": "John Doe",
    "product": "Product A",
    "address": "123 Main St, Tallinn",
    "time": "15:00",
    "status": "pending",
    "createdAt": "2025-11-13T04:40:00.000Z"
  }
]
```

## Security Considerations

- 🔒 Bot token is stored in `.env` file and not committed to version control
- 🔒 Admin IDs configured securely in `.env` file
- 🔒 User data, products, and orders stored locally and not exposed publicly
- 🔒 Input validation performed for all user inputs
- 🔒 Input sanitization for user-provided data
- 🔒 Admin-only features protected by user ID verification

## Troubleshooting

### Bot not responding

- Verify your bot token is correct in the `.env` file
- Check if the bot is running without errors
- Ensure your bot is not already running in another terminal

### "TELEGRAM_BOT_TOKEN not found" error

- Make sure you created the `.env` file
- Verify the `.env` file contains `TELEGRAM_BOT_TOKEN=your_token`
- Check that there are no extra spaces around the token

### Polling errors

- Check your internet connection
- Verify the bot token is valid
- Only one instance of the bot should be running at a time

## Future Enhancements

Possible improvements for the bot:

- 📞 Phone number collection
- 🌍 Language selection
- 🔐 User authentication
- 📊 Admin dashboard
- 💾 Database integration (PostgreSQL, MongoDB)
- 🔔 Notification system
- 👥 User profile updates
- 🗑️ Account deletion

## Technical Details

- **Framework:** node-telegram-bot-api
- **Node.js Version:** 14.x or higher recommended
- **Storage:** JSON file (can be upgraded to database)
- **Bot Mode:** Long polling (can be upgraded to webhooks)

## License

This bot is part of the starter-react-app project.
