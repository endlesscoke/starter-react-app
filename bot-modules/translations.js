// Translation module for multi-language support
const translations = {
  en: {
    // General
    backToMenu: '⬅️ Back to Main Menu',
    cancel: '❌ Cancel',
    
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
  },
  ru: {
    // General
    backToMenu: '⬅️ Назад в меню',
    cancel: '❌ Отмена',
    
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
  },
  et: {
    // General
    backToMenu: '⬅️ Tagasi menüüsse',
    cancel: '❌ Tühista',
    
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
  }
};

function getText(lang, key) {
  return translations[lang]?.[key] || translations['en'][key] || key;
}

module.exports = { translations, getText };
