// Translation module for multi-language support
const translations = {
  en: {
    // General
    welcome: 'Welcome! Please select your language:',
    backToMenu: '⬅️ Back to Main Menu',
    cancel: '❌ Cancel',
    
    // Main Menu
    menuRegister: '📝 Register',
    menuMyInfo: '👤 My Info',
    menuLanguage: '🌐 Language',
    menuPlaceOrder: '🛒 Place Order',
    menuViewProducts: '📦 View Products',
    menuBrowseOrder: '🛒 Browse & Order',
    menuMyCart: '🛍️ My Cart',
    menuAdminPanel: '🔧 Admin Menu',
    menuCourierPanel: '🚚 Courier Menu',
    
    // Registration
    alreadyRegistered: 'You are already registered!',
    notRegistered: 'Please register first using the Register button',
    registrationComplete: '✅ Registration complete!',
    registered: 'Registered',
    selectLanguage: 'Please select your language:',
    languageSelected: '✅ Language selected!',
    selectRegion: 'Please select your region:',
    enterName: 'Please enter your nickname:',
    invalidName: 'Invalid nickname. Please try again.',
    regionSelected: 'Region selected',
    language: 'Language',
    name: 'Name',
    region: 'Region',
    myInfo: 'My Info',
    blacklisted: '🚫 You are blacklisted and cannot use this bot.',
    
    // Menus
    adminMenu: '🔧 Admin Menu',
    courierMenu: '🚚 Courier Menu',
    
    // Cart
    myCart: '🛍️ My Cart',
    cartEmpty: 'Your cart is empty',
    addToCart: '➕ Add to Cart',
    removeFromCart: '➖ Remove',
    clearCart: '🗑️ Clear Cart',
    checkout: '💳 Checkout',
    cartTotal: 'Total',
    selectQuantity: 'Select quantity',
    
    // Discounts
    manageDiscounts: '💰 Manage Discounts',
    createDiscount: '➕ Create Discount',
    deleteDiscount: '➖ Delete Discount',
    viewDiscounts: '👁️ View Discounts',
    enterDiscountCode: 'Enter discount code (or /skip)',
    discountApplied: '✅ Discount applied',
    invalidDiscount: '❌ Invalid discount code',
    
    // User management
    viewUsers: '👤 View Users',
    deleteUser: '🗑️ Delete User',
    selectUser: 'Select user',
    confirmDelete: '⚠️ Confirm deletion?',
    userDeleted: '✅ User deleted',
    
    // Additional keys
    back: 'Back',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    selectCategory: 'Select a category:',
    allProducts: 'All Products',
    manageProducts: 'Manage Products',
    manageCategories: 'Manage Categories',
    manageCouriers: 'Manage Couriers',
    viewOrders: 'View Orders',
    manageBlacklist: 'Manage Blacklist',
    availableOrders: 'Available Orders',
    myOrders: 'My Orders',
  },
  ru: {
    // General
    welcome: 'Добро пожаловать! Пожалуйста, выберите язык:',
    backToMenu: '⬅️ Назад в меню',
    cancel: '❌ Отмена',
    
    // Main Menu
    menuRegister: '📝 Регистрация',
    menuMyInfo: '👤 Моя информация',
    menuLanguage: '🌐 Язык',
    menuPlaceOrder: '🛒 Оформить заказ',
    menuViewProducts: '📦 Просмотр товаров',
    menuBrowseOrder: '🛒 Каталог и заказ',
    menuMyCart: '🛍️ Моя корзина',
    menuAdminPanel: '🔧 Админ панель',
    menuCourierPanel: '🚚 Меню курьера',
    
    // Registration
    alreadyRegistered: 'Вы уже зарегистрированы!',
    notRegistered: 'Пожалуйста, сначала зарегистрируйтесь',
    registrationComplete: '✅ Регистрация завершена!',
    registered: 'Зарегистрирован',
    selectLanguage: 'Пожалуйста, выберите язык:',
    languageSelected: '✅ Язык выбран!',
    selectRegion: 'Пожалуйста, выберите регион:',
    enterName: 'Пожалуйста, введите ваш ник:',
    invalidName: 'Неверный ник. Попробуйте снова.',
    regionSelected: 'Регион выбран',
    language: 'Язык',
    name: 'Имя',
    region: 'Регион',
    myInfo: 'Моя информация',
    blacklisted: '🚫 Вы находитесь в черном списке и не можете использовать бота.',
    
    // Menus
    adminMenu: '🔧 Админ панель',
    courierMenu: '🚚 Меню курьера',
    
    // Cart
    myCart: '🛍️ Моя корзина',
    cartEmpty: 'Ваша корзина пуста',
    addToCart: '➕ Добавить в корзину',
    removeFromCart: '➖ Удалить',
    clearCart: '🗑️ Очистить корзину',
    checkout: '💳 Оформить заказ',
    cartTotal: 'Итого',
    selectQuantity: 'Выберите количество',
    
    // Discounts
    manageDiscounts: '💰 Управление скидками',
    createDiscount: '➕ Создать скидку',
    deleteDiscount: '➖ Удалить скидку',
    viewDiscounts: '👁️ Просмотр скидок',
    enterDiscountCode: 'Введите код скидки (или /skip)',
    discountApplied: '✅ Скидка применена',
    invalidDiscount: '❌ Неверный код скидки',
    
    // User management
    viewUsers: '👤 Просмотр пользователей',
    deleteUser: '🗑️ Удалить пользователя',
    selectUser: 'Выберите пользователя',
    confirmDelete: '⚠️ Подтвердить удаление?',
    userDeleted: '✅ Пользователь удален',
    
    // Additional keys
    back: 'Назад',
    emptyCart: 'Ваша корзина пуста',
    total: 'Итого',
    selectCategory: 'Выберите категорию:',
    allProducts: 'Все товары',
    manageProducts: 'Управление товарами',
    manageCategories: 'Управление категориями',
    manageCouriers: 'Управление курьерами',
    viewOrders: 'Просмотр заказов',
    manageBlacklist: 'Управление черным списком',
    availableOrders: 'Доступные заказы',
    myOrders: 'Мои заказы',
  },
  et: {
    // General
    welcome: 'Tere tulemast! Palun valige keel:',
    backToMenu: '⬅️ Tagasi menüüsse',
    cancel: '❌ Tühista',
    
    // Main Menu
    menuRegister: '📝 Registreeri',
    menuMyInfo: '👤 Minu info',
    menuLanguage: '🌐 Keel',
    menuPlaceOrder: '🛒 Tee tellimus',
    menuViewProducts: '📦 Vaata tooteid',
    menuBrowseOrder: '🛒 Kataloog ja tellimus',
    menuMyCart: '🛍️ Minu ostukorv',
    menuAdminPanel: '🔧 Admin menüü',
    menuCourierPanel: '🚚 Kulleri menüü',
    
    // Registration
    alreadyRegistered: 'Olete juba registreeritud!',
    notRegistered: 'Palun registreerige esmalt',
    registrationComplete: '✅ Registreerimine lõpetatud!',
    registered: 'Registreeritud',
    selectLanguage: 'Palun valige keel:',
    languageSelected: '✅ Keel valitud!',
    selectRegion: 'Palun valige piirkond:',
    enterName: 'Palun sisestage oma hüüdnimi:',
    invalidName: 'Vigane hüüdnimi. Proovige uuesti.',
    regionSelected: 'Piirkond valitud',
    language: 'Keel',
    name: 'Nimi',
    region: 'Piirkond',
    myInfo: 'Minu info',
    blacklisted: '🚫 Olete mustas nimekirjas ja ei saa botti kasutada.',
    
    // Menus
    adminMenu: '🔧 Admin menüü',
    courierMenu: '🚚 Kulleri menüü',
    
    // Cart
    myCart: '🛍️ Minu ostukorv',
    cartEmpty: 'Teie ostukorv on tühi',
    addToCart: '➕ Lisa ostukorvi',
    removeFromCart: '➖ Eemalda',
    clearCart: '🗑️ Tühjenda ostukorv',
    checkout: '💳 Vormista tellimus',
    cartTotal: 'Kokku',
    selectQuantity: 'Vali kogus',
    
    // Discounts
    manageDiscounts: '💰 Halda allahindlusi',
    createDiscount: '➕ Loo allahindlus',
    deleteDiscount: '➖ Kustuta allahindlus',
    viewDiscounts: '👁️ Vaata allahindlusi',
    enterDiscountCode: 'Sisesta allahindluskood (või /skip)',
    discountApplied: '✅ Allahindlus rakendatud',
    invalidDiscount: '❌ Vigane allahindluskood',
    
    // User management
    viewUsers: '👤 Vaata kasutajaid',
    deleteUser: '🗑️ Kustuta kasutaja',
    selectUser: 'Vali kasutaja',
    confirmDelete: '⚠️ Kinnita kustutamine?',
    userDeleted: '✅ Kasutaja kustutatud',
    
    // Additional keys
    back: 'Tagasi',
    emptyCart: 'Teie ostukorv on tühi',
    total: 'Kokku',
    selectCategory: 'Valige kategooria:',
    allProducts: 'Kõik tooted',
    manageProducts: 'Halda tooteid',
    manageCategories: 'Halda kategooriaid',
    manageCouriers: 'Halda kullereid',
    viewOrders: 'Vaata tellimusi',
    manageBlacklist: 'Halda musta nimekirja',
    availableOrders: 'Saadaolevad tellimused',
    myOrders: 'Minu tellimused',
  }
};

function getText(lang, key) {
  return translations[lang]?.[key] || translations['en'][key] || key;
}

module.exports = { translations, getText };
