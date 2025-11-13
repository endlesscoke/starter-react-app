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

### 1. Starting the Bot

**User:** `/start`

**Bot Response:**
```
Welcome to the Registration Bot! 👋

Available commands:
/register - Register as a new user
/myinfo - View your registration information
/help - Show this help message
/cancel - Cancel current operation

Let's get started! Use /register to begin registration.
```

### 2. Beginning Registration

**User:** `/register`

**Bot Response:**
```
📝 Let's start the registration process!

Please enter your full name:
```

### 3. Entering Name

**User:** `John Doe`

**Bot Response:**
```
✅ Name saved!

Now, please enter your email address:
```

### 4. Entering Email

**User:** `john.doe@example.com`

**Bot Response:**
```
🎉 Registration Complete!

Your account has been successfully created:
👤 Name: John Doe
📧 Email: john.doe@example.com

You can view your information anytime using /myinfo
```

### 5. Viewing Information

**User:** `/myinfo`

**Bot Response:**
```
✅ Your Registration Information:

👤 Name: John Doe
📧 Email: john.doe@example.com
📅 Registered: 11/13/2025, 4:30:00 AM
🆔 User ID: 123456789
```

### 6. Getting Help

**User:** `/help`

**Bot Response:**
```
📋 Available Commands:

/start - Start the bot and see welcome message
/register - Register as a new user
/myinfo - View your registration information
/help - Show this help message
/cancel - Cancel current operation

To register, simply type /register and follow the instructions.
```

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
    "registeredAt": "2025-11-13T04:30:00.000Z"
  },
  "987654321": {
    "userId": 987654321,
    "username": "janedoe",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "registeredAt": "2025-11-13T05:15:00.000Z"
  }
}
```

## Command Summary

| Command | Description | Status Required |
|---------|-------------|-----------------|
| `/start` | Show welcome message | None |
| `/help` | Display help information | None |
| `/register` | Begin registration process | Not registered |
| `/myinfo` | View registration details | Registered |
| `/cancel` | Cancel current operation | In registration |

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
