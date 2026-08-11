const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const CouponUsage = sequelize.define("CouponUsage", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  couponId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = CouponUsage;
