const { Product, Order } = require("../models");

const { fn, col, literal } = require("sequelize");

const getDashboard = async (req, res) => {
  try {
    const products = await Product.count();

    const orders = await Order.count();

    const revenue = await Order.sum("total", {
      where: {
        status: "DELIVERED",
      },
    });

    const newOrders = await Order.count({
      where: {
        status: "NEW",
      },
    });

    const topProducts = await Product.findAll({
      order: [["views", "DESC"]],

      limit: 5,

      attributes: ["name", "views"],
    });

    res.json({
      products,

      orders,

      revenue: revenue || 0,

      newOrders,

      topProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
