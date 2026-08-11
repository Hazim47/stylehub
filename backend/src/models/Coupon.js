const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Coupon = sequelize.define("Coupon", {
  code: {
    type: DataTypes.STRING,

    allowNull: false,

    unique: true,
  },

  discount: {
    type: DataTypes.INTEGER,

    allowNull: false,
  },

  // عدد مرات استخدام الكوبون لكل مستخدم
  usagePerUser: {
    type: DataTypes.INTEGER,

    allowNull: false,

    defaultValue: 1,
  },

  isActive: {
    type: DataTypes.BOOLEAN,

    defaultValue: true,
  },

  expiresAt: {
    type: DataTypes.DATE,

    allowNull: true,
  },
});

module.exports = Coupon;
