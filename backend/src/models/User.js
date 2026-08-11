const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,

    defaultValue: DataTypes.UUIDV4,

    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,

    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,

    allowNull: false,

    unique: true,
  },

  picture: {
    type: DataTypes.TEXT,

    allowNull: true,
  },

  googleId: {
    type: DataTypes.STRING,

    allowNull: true,

    unique: true,
  },

  google: {
    type: DataTypes.BOOLEAN,

    defaultValue: false,
  },
});

module.exports = User;
