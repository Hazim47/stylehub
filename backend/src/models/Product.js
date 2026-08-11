const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  sizes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },

  colors: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },

  slug: {
    type: DataTypes.STRING,
    unique: true,
  },

  description: {
    type: DataTypes.TEXT,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  oldPrice: {
    type: DataTypes.FLOAT,
  },

  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  sku: {
    type: DataTypes.STRING,
    unique: true,
  },

  brand: {
    type: DataTypes.STRING,
  },

  gender: {
    type: DataTypes.STRING,
  },

  material: {
    type: DataTypes.STRING,
  },

  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
