[![Deploy to Cyclic](https://deploy.cyclic.app/button.svg)](https://deploy.cyclic.app/)

# Starter React App with Telegram Bot

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and includes a Telegram bot for order management system.

## 🤖 Telegram Bot Features

The Telegram bot includes:
- **User Registration System**: Users and couriers can register with different roles
- **Order Management**: Users can create, view, and cancel orders
- **Courier System**: Couriers can view available orders, accept them, and mark as delivered
- **Real-time Notifications**: Automated notifications for order updates

### Setting Up the Telegram Bot

1. **Create a Telegram Bot**:
   - Open Telegram and search for [@BotFather](https://t.me/botfather)
   - Send `/newbot` command
   - Follow the instructions to create your bot
   - Copy the bot token you receive

2. **Configure the Bot**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your bot token
   # TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Bot**:
   ```bash
   node bot.js
   ```

### Bot Commands

#### For All Users:
- `/start` - Start the bot and see welcome message
- `/help` - Show all available commands
- `/register` - Register as a user
- `/register_courier` - Register as a courier
- `/myinfo` - View your registration information

#### For Users:
- `/neworder` - Create a new order
- `/myorders` - View all your orders
- `/cancelorder` - Cancel an active order

#### For Couriers:
- `/available_orders` - View all pending orders
- `/accept_order` - Accept an order for delivery
- `/my_deliveries` - View your active deliveries
- `/complete_order` - Mark an order as delivered

### Documentation

- **User Guide (Russian)**: [BOT_USAGE_RU.md](./BOT_USAGE_RU.md) - Detailed instructions for users and couriers
- **Developer Guide**: [BOT_DEVELOPMENT.md](./BOT_DEVELOPMENT.md) - Architecture, setup, and extension guide
- **Workflow Diagrams**: [BOT_WORKFLOW.md](./BOT_WORKFLOW.md) - Visual workflows and data flow diagrams

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the production mode.

### `npm dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
