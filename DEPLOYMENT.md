# Deployment Guide - Telegram Bot

This guide explains how to deploy the Telegram bot to a server.

## Deployment Options

### Option 1: VPS/Cloud Server (Ubuntu/Debian)

#### 1. Prepare Your Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2. Upload Your Code

**Option A: Using Git (Recommended)**
```bash
# On server
cd /home/youruser
git clone https://github.com/endlesscoke/starter-react-app.git
cd starter-react-app
git checkout copilot/add-user-registration-bot
```

**Option B: Using SCP/SFTP**
```bash
# From your local machine
scp -r /path/to/starter-react-app user@server-ip:/home/youruser/
```

#### 3. Configure Environment

```bash
# On server
cd /home/youruser/starter-react-app
cp .env.example .env
nano .env  # Edit and add your TELEGRAM_BOT_TOKEN
```

#### 4. Install Dependencies

```bash
npm install --production
```

#### 5. Run the Bot

**Temporary (for testing):**
```bash
npm run bot
```

**Permanent (using PM2):**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start bot with PM2
pm2 start telegram-bot.js --name telegram-bot

# Save PM2 configuration
pm2 save

# Enable PM2 to start on system boot
pm2 startup
# Follow the command it prints

# View logs
pm2 logs telegram-bot

# Other PM2 commands
pm2 status           # Check status
pm2 restart telegram-bot  # Restart bot
pm2 stop telegram-bot     # Stop bot
```

### Option 2: Heroku

#### 1. Create Heroku App

```bash
# Install Heroku CLI
# From: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create new app
heroku create your-telegram-bot-app
```

#### 2. Configure Environment

```bash
# Set bot token
heroku config:set TELEGRAM_BOT_TOKEN=your_bot_token_here
```

#### 3. Create Procfile

Create a file named `Procfile` (no extension) in project root:
```
worker: node telegram-bot.js
```

#### 4. Deploy

```bash
git add Procfile
git commit -m "Add Procfile for Heroku"
git push heroku copilot/add-user-registration-bot:main

# Scale worker
heroku ps:scale worker=1

# View logs
heroku logs --tail
```

### Option 3: Railway

#### 1. Sign Up & Deploy

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Select the branch: `copilot/add-user-registration-bot`

#### 2. Configure Environment

1. Go to your project settings
2. Click "Variables"
3. Add: `TELEGRAM_BOT_TOKEN` = `your_token_here`

#### 3. Configure Start Command

1. Go to Settings
2. Set Start Command: `node telegram-bot.js`
3. Railway will automatically deploy

### Option 4: DigitalOcean App Platform

#### 1. Create App

1. Go to [DigitalOcean](https://cloud.digitalocean.com)
2. Navigate to "Apps"
3. Click "Create App"
4. Connect your GitHub repository
5. Select branch: `copilot/add-user-registration-bot`

#### 2. Configure

1. Set run command: `node telegram-bot.js`
2. Add environment variable: `TELEGRAM_BOT_TOKEN`
3. Choose worker instead of web service
4. Click "Next" and deploy

### Option 5: Docker

#### 1. Create Dockerfile

Create `Dockerfile` in project root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "telegram-bot.js"]
```

#### 2. Create .dockerignore

```
node_modules
.env
.git
build
*.md
```

#### 3. Build and Run

```bash
# Build image
docker build -t telegram-bot .

# Run container
docker run -d \
  --name telegram-bot \
  --restart unless-stopped \
  -e TELEGRAM_BOT_TOKEN=your_token_here \
  telegram-bot

# View logs
docker logs -f telegram-bot
```

## Important Notes

### Security Checklist

- ✅ Never commit `.env` file to Git
- ✅ Use environment variables for the bot token
- ✅ Set proper file permissions on server (600 for .env)
- ✅ Keep your bot token secret
- ✅ Enable firewall on your server
- ✅ Keep Node.js and dependencies updated

### Data Persistence

The bot stores data in `users.json`. Make sure this file persists across deployments:

**For VPS:** File automatically persists in project directory

**For Heroku/Railway:** Consider using:
- Database add-on (PostgreSQL, MongoDB)
- Or connect to external database service

**For Docker:** Use volume mounting:
```bash
docker run -d \
  --name telegram-bot \
  -v $(pwd)/users.json:/app/users.json \
  -e TELEGRAM_BOT_TOKEN=your_token_here \
  telegram-bot
```

### Monitoring

Check if bot is running:
```bash
# Using PM2
pm2 status

# Using systemctl
systemctl status telegram-bot

# Manual check
ps aux | grep telegram-bot
```

View logs:
```bash
# PM2
pm2 logs telegram-bot

# Heroku
heroku logs --tail

# Docker
docker logs -f telegram-bot

# Manual (if running in background)
tail -f bot.log
```

## Troubleshooting

### Bot not responding

1. Check if process is running
2. Verify bot token is correct
3. Check logs for errors
4. Ensure port 443 is not blocked (for Telegram API)

### "EADDRINUSE" error

Bot is already running. Stop the existing process first.

### Memory issues

For small VPS, limit memory usage:
```bash
pm2 start telegram-bot.js --max-memory-restart 200M
```

### Automatic updates

Set up automatic deployment:
```bash
# Using cron on VPS
0 2 * * * cd /home/youruser/starter-react-app && git pull && npm install && pm2 restart telegram-bot
```

## Quick Deployment (VPS)

Complete script for Ubuntu/Debian:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repo
cd ~
git clone https://github.com/endlesscoke/starter-react-app.git
cd starter-react-app
git checkout copilot/add-user-registration-bot

# Configure
cp .env.example .env
echo "TELEGRAM_BOT_TOKEN=YOUR_TOKEN_HERE" >> .env
nano .env  # Edit the token

# Install dependencies
npm install --production

# Install PM2 and start bot
sudo npm install -g pm2
pm2 start telegram-bot.js --name telegram-bot
pm2 save
pm2 startup

echo "✅ Bot deployed! Check status with: pm2 status"
```

Replace `YOUR_TOKEN_HERE` with your actual bot token from @BotFather.
