const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("OrderItem", {
  productId: {
    type: DataTypes.UUID,
  },

  productName: {
    type: DataTypes.STRING,
  },

  productImage: {
    type: DataTypes.STRING,
  },

  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

  price: {
    type: DataTypes.FLOAT,
  },

  color: {
    type: DataTypes.STRING,
  },

  size: {
    type: DataTypes.STRING,
  },
});

module.exports = OrderItem;
