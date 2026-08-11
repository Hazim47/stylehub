const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  orderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  finalTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  couponCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
  },

  address: {
    type: DataTypes.STRING,
  },

  notes: {
    type: DataTypes.TEXT,
  },

  status: {
    type: DataTypes.ENUM(
      "NEW",
      "CONFIRMED",
      "PREPARING",
      "DELIVERED",
      "CANCELLED",
    ),
    defaultValue: "NEW",
  },

  total: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = Order;
