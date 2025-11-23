#!/bin/bash

# Telegram Bot - Quick Deployment Script
# This script sets up and runs the Telegram bot with one command

set -e  # Exit on error

echo "🚀 Starting Telegram Bot Deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "❗ IMPORTANT: You need to configure your bot token!"
    echo "Please edit .env file and add:"
    echo "  - TELEGRAM_BOT_TOKEN (get from @BotFather)"
    echo "  - ADMIN_IDS (get from @userinfobot)"
    echo ""
    read -p "Press Enter after you've edited .env file, or Ctrl+C to exit..."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
else
    echo "✅ Dependencies already installed"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    sudo npm install -g pm2
else
    echo "✅ PM2 already installed"
fi

# Stop existing bot instance if running
if pm2 list | grep -q "telegram-bot"; then
    echo "⏹️  Stopping existing bot instance..."
    pm2 stop telegram-bot
    pm2 delete telegram-bot
fi

# Start the bot with PM2
echo "🤖 Starting Telegram bot..."
pm2 start telegram-bot.js --name telegram-bot

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot (first time only)
if [ ! -f /etc/systemd/system/pm2-$(whoami).service ]; then
    echo "⚙️  Configuring PM2 to start on system boot..."
    pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami))
    echo "Note: You may need to run the command shown above with sudo"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Bot status:"
pm2 status

echo ""
echo "📝 Useful commands:"
echo "  pm2 logs telegram-bot  - View bot logs"
echo "  pm2 restart telegram-bot  - Restart bot"
echo "  pm2 stop telegram-bot  - Stop bot"
echo "  pm2 status  - Check status"
echo ""
echo "🎉 Your Telegram bot is now running!"
