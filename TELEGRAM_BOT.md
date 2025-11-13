# Telegram Bot - User Registration

This project includes a Telegram bot that allows users to register and manage their account information.

📦 **[Deployment Guide](DEPLOYMENT.md)** - Learn how to deploy the bot to a server

## Features

- ✅ User registration with name and email
- 🌐 Multi-language support (English, Russian, Estonian)
- 📍 Region selection (Tallinn, Paldiski)
- 📋 View registered user information
- 🔒 Persistent user data storage
- 💬 Interactive conversation flow with menu buttons
- 🛡️ Basic input validation
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

2. Edit `.env` and add your bot token:
   ```
   TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
   ```

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

- **📝 Register / Регистрация / Registreeri** - Start the registration process
- **👤 My Info / Моя информация / Minu info** - View your registration information
- **🌐 Language / Язык / Keel** - Change language preference

## Registration Flow

1. User sends `/start` command
2. User selects language (English, Russian, or Estonian)
3. User clicks "📝 Register" button from the menu
4. Bot asks user to select region (Tallinn or Paldiski)
5. User selects region using inline buttons
6. Bot asks for full name
7. User provides their name
8. Bot asks for email address
9. User provides their email
10. Bot confirms successful registration with all details

### Example Conversation

```
User: /start
Bot: 👋 Welcome to the Registration Bot!
     Please select your language:
     [🇬🇧 English] [🇷🇺 Русский]
     [🇪🇪 Eesti]

User: [Clicks 🇬🇧 English]
Bot: ✅ Language selected: English
     [Menu appears with buttons: 📝 Register | 👤 My Info | 🌐 Language]

User: [Clicks 📝 Register]
Bot: ✅ Language selected: English
     Now, please select your region:
     [🏙️ Tallinn]
     [🏘️ Paldiski]

User: [Clicks 🏙️ Tallinn]
Bot: ✅ Region selected!
     Please enter your full name:

User: John Doe
Bot: ✅ Name saved!
     Now, please enter your email address:

User: john.doe@example.com
Bot: 🎉 Registration Complete!
     Your account has been successfully created:
     👤 Name: John Doe
     📧 Email: john.doe@example.com
     🌐 Language: English
     📍 Region: Tallinn
```

## Data Storage

User data is stored in `users.json` file in the project root directory. This file is automatically created when the first user registers.

**Note:** The `users.json` file is excluded from version control via `.gitignore` to protect user privacy.

### User Data Structure

```json
{
  "123456789": {
    "userId": 123456789,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "registeredAt": "2025-11-13T04:30:00.000Z"
  }
}
```

## Security Considerations

- 🔒 Bot token is stored in `.env` file and not committed to version control
- 🔒 User data is stored locally and not exposed publicly
- 🔒 Basic email validation is performed
- 🔒 Input sanitization for user-provided data

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
