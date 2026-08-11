const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HomepageSettings = sequelize.define(
  "HomepageSettings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    heroImage1: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    heroImage2: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    summerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    springImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    autumnImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    winterImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "homepage_settings",
    timestamps: true,
  },
);

module.exports = HomepageSettings;
