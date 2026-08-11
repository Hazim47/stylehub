const Admin = require("./Admin");
const Category = require("./Category");
const Product = require("./Product");
const ProductImage = require("./ProductImage");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Coupon = require("./Coupon");
const CouponUsage = require("./CouponUsage");
const User = require("./User");
const Notification = require("./Notification");
const HomepageSettings = require("./HomepageSettings");
// =====================
// CATEGORY PRODUCTS
// =====================

Category.hasMany(Product, {
  foreignKey: "categoryId",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
});

// =====================
// PRODUCT IMAGES
// =====================

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});

ProductImage.belongsTo(Product, {
  foreignKey: "productId",
});

// =====================
// ORDERS
// =====================

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

// =====================
// USER NOTIFICATIONS
// =====================

User.hasMany(Notification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
});

// =====================
// ORDER NOTIFICATIONS
// =====================

Order.hasMany(Notification, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
});

Notification.belongsTo(Order, {
  foreignKey: "orderId",
});

// =====================
// COUPON USAGE
// =====================

// المستخدم لديه عدة استخدامات للكوبونات
User.hasMany(CouponUsage, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

CouponUsage.belongsTo(User, {
  foreignKey: "userId",
});

// الكوبون لديه عدة استخدامات
Coupon.hasMany(CouponUsage, {
  foreignKey: "couponId",
  onDelete: "CASCADE",
});

CouponUsage.belongsTo(Coupon, {
  foreignKey: "couponId",
});

module.exports = {
  Admin,
  Category,
  Product,
  ProductImage,
  Order,
  OrderItem,
  Coupon,
  CouponUsage,
  User,
  Notification,
  HomepageSettings,
};
