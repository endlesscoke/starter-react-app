# Telegram Bot Usage Example

This document provides a visual walkthrough of how to use the Telegram bot.

## Setup Process

### Step 1: Get Bot Token from BotFather

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow instructions to name your bot
5. Copy the API token provided

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and paste your token
# TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### Step 3: Start the Bot

```bash
npm run bot
```

You should see:
```
✅ Telegram bot is running...
Registered users: 0
```

## User Registration Flow

### 1. Starting the Bot and Selecting Language

**User:** `/start`

**Bot Response:**
```
👋 Welcome to the Registration Bot!

Please select your language:
```
**Inline buttons appear:**
- 🇬🇧 English
- 🇷🇺 Русский
- 🇪🇪 Eesti

**User clicks:** `🇬🇧 English`

**Bot Response:**
```
✅ Language selected: English
```
**Menu keyboard appears with buttons:**
- 📝 Register
- 👤 My Info
- 🌐 Language

### 2. Beginning Registration

**User clicks:** `📝 Register` button

**Bot Response:**
```
✅ Language selected: English

Now, please select your region:
```
**Inline buttons appear:**
- 🏙️ Tallinn
- 🏘️ Paldiski

### 3. Selecting Region

**User clicks:** `🏙️ Tallinn`

**Bot Response:**
```
✅ Region selected!

Please enter your full name:
```

### 4. Entering Name

**User types:** `John Doe`

**Bot Response:**
```
✅ Name saved!

Now, please enter your email address:
```

### 5. Entering Email

**User types:** `john.doe@example.com`

**Bot Response:**
```
🎉 Registration Complete!

Your account has been successfully created:
👤 Name: John Doe
📧 Email: john.doe@example.com
🌐 Language: English
📍 Region: Tallinn
```

### 6. Viewing Information

**User clicks:** `👤 My Info` button

**Bot Response:**
```
✅ Your Registration Information:

👤 Name: John Doe
📧 Email: john.doe@example.com
🌐 Language: English
📍 Region: Tallinn
📅 Registered: 11/13/2025, 4:30:00 AM
🆔 User ID: 123456789
```

### 7. Changing Language

**User clicks:** `🌐 Language` button

**Bot Response:**
```
👋 Welcome to the Registration Bot!

Please select your language:
```
**Inline buttons appear again:**
- 🇬🇧 English
- 🇷🇺 Русский
- 🇪🇪 Eesti

User can select a different language, and all menu buttons will change to the new language.

## Error Handling

### Invalid Name

**User:** `/register`
**Bot:** Please enter your full name:
**User:** `A`
**Bot Response:**
```
❌ Please enter a valid name (at least 2 characters).
```

### Invalid Email

**User:** (after entering valid name)
**Bot:** Now, please enter your email address:
**User:** `invalid-email`
**Bot Response:**
```
❌ Please enter a valid email address.
```

### Already Registered

**User:** `/register` (when already registered)
**Bot Response:**
```
✅ You are already registered!

Use /myinfo to view your information.
```

### Canceling Registration

**User:** `/register`
**Bot:** Please enter your full name:
**User:** `/cancel`
**Bot Response:**
```
❌ Registration cancelled. Use /register to start again.
```

## Data Storage

The bot stores user data in `users.json` file:

```json
{
  "123456789": {
    "userId": 123456789,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "language": "en",
    "region": "tallinn",
    "registeredAt": "2025-11-13T04:30:00.000Z"
  },
  "987654321": {
    "userId": 987654321,
    "username": "janedoe",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "language": "ru",
    "region": "paldiski",
    "registeredAt": "2025-11-13T05:15:00.000Z"
  }
}
```

## Menu Button Summary

| Button | Description | Status Required |
|--------|-------------|-----------------|
| 📝 Register / Регистрация / Registreeri | Begin registration process | Not registered |
| 👤 My Info / Моя информация / Minu info | View registration details | Registered |
| 🌐 Language / Язык / Keel | Change language preference | None |

## Available Languages

- 🇬🇧 **English** - Full interface in English
- 🇷🇺 **Русский** - Полный интерфейс на русском языке
- 🇪🇪 **Eesti** - Täielik kasutajaliides eesti keeles

## Available Regions

- 🏙️ **Tallinn** - Capital city
- 🏘️ **Paldiski** - Coastal town

## Tips

- ✅ You can use `/cancel` at any time during registration
- ✅ Email format is validated before acceptance
- ✅ Names must be at least 2 characters long
- ✅ User data persists between bot restarts
- ✅ Each user can only register once
- ✅ Use `/myinfo` to check if you're already registered

## Troubleshooting

### Bot not responding
- Check if bot is running (`npm run bot`)
- Verify token in `.env` is correct
- Check console for error messages

### Can't register
- You may already be registered (use `/myinfo`)
- Check email format is correct
- Ensure name is at least 2 characters

### Lost registration data
- Check if `users.json` exists in project root
- Verify file has not been deleted
- Check file permissions

---

For more detailed information, see [TELEGRAM_BOT.md](TELEGRAM_BOT.md)
