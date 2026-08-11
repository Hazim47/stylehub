const {
  Order,
  OrderItem,
  Product,
  ProductImage,
  Coupon,
  Notification,
  CouponUsage,
} = require("../models");

// =================================
// CREATE ORDER
// =================================

const createOrder = async (req, res) => {
  // استخدم Sequelize المرتبط بالموديل نفسه
  const transaction = await Order.sequelize.transaction();

  try {
    const {
      userId,
      customerName,
      phone,
      city,
      address,
      notes,
      items,
      couponCode,
    } = req.body;

    if (!items || items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let total = 0;

    const orderItems = [];

    // ===============================
    // PRODUCTS + STOCK
    // ===============================

    for (const item of items) {
      /*
       * مهم جدًا:
       *
       * lock: UPDATE
       *
       * يمنع أكثر من Order من تعديل
       * نفس المنتج بنفس اللحظة.
       */
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        continue;
      }

      // جلب الصور بدون FOR UPDATE
      const productImages = await ProductImage.findAll({
        where: {
          productId: product.id,
        },
        transaction,
      });

      // ===============================
      // CHECK STOCK
      // ===============================

      if (product.stock < item.quantity) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: `عذراً، المتوفر من "${product.name}" هو ${product.stock} قطع فقط`,
          available: product.stock,
          requested: item.quantity,
        });
      }
      const price = Number(product.price);

      total += price * item.quantity;

      // ===============================
      // DECREASE STOCK
      // ===============================

      product.stock -= item.quantity;

      await product.save({
        transaction,
      });

      // ===============================
      // ORDER ITEM
      // ===============================

      orderItems.push({
        productId: product.id,

        productName: product.name,

        productImage: productImages?.[0]?.image || null,

        quantity: item.quantity,

        price,

        color: item.color || null,

        size: item.size || null,
      });
    }

    if (orderItems.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "No valid products",
      });
    }

    // ===============================
    // COUPON
    // ===============================

    let discount = 0;
    let finalTotal = total;
    let usedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: {
          code: couponCode,
          isActive: true,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (coupon) {
        // ===============================
        // CHECK COUPON USAGE
        // ===============================

        if (userId) {
          const usage = await CouponUsage.findOne({
            where: {
              couponId: coupon.id,
              userId,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

          if (usage && usage.usedCount >= coupon.usagePerUser) {
            await transaction.rollback();

            return res.status(400).json({
              message: "لقد وصلت للحد الأقصى لاستخدام هذا الكوبون",
            });
          }
        }

        usedCoupon = coupon.code;

        discount = Number(coupon.discount);

        finalTotal = total - (total * discount) / 100;
      }
    }

    // ===============================
    // GENERATE ORDER NUMBER
    // ===============================

    /*
     * نقفل آخر Order حتى لا يحصل:
     *
     * User A -> orderNumber 7
     * User B -> orderNumber 7
     *
     * في نفس اللحظة.
     */

    const lastOrder = await Order.findOne({
      order: [["createdAt", "DESC"]],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

    // ===============================
    // CREATE ORDER
    // ===============================

    const order = await Order.create(
      {
        orderNumber,

        userId: userId || null,

        customerName,

        phone,

        city,

        address,

        notes,

        total,

        discount,

        finalTotal,

        couponCode: usedCoupon,
      },
      {
        transaction,
      },
    );

    // ===============================
    // ORDER ITEMS
    // ===============================

    await OrderItem.bulkCreate(
      orderItems.map((item) => ({
        ...item,

        orderId: order.id,
      })),
      {
        transaction,
      },
    );

    // ===============================
    // SAVE COUPON USAGE
    // ===============================

    if (usedCoupon && userId) {
      const coupon = await Coupon.findOne({
        where: {
          code: usedCoupon,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (coupon) {
        let usage = await CouponUsage.findOne({
          where: {
            couponId: coupon.id,
            userId,
          },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!usage) {
          await CouponUsage.create(
            {
              couponId: coupon.id,
              userId,
              usedCount: 1,
            },
            {
              transaction,
            },
          );
        } else {
          usage.usedCount += 1;

          await usage.save({
            transaction,
          });
        }
      }
    }

    // ===============================
    // COMMIT
    // ===============================

    await transaction.commit();

    // ===============================
    // RESPONSE
    // ===============================

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    // ===============================
    // ROLLBACK
    // ===============================

    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("ROLLBACK ERROR:", rollbackError);
    }

    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET ORDERS
// PAGINATED
// =================================

const getOrders = async (req, res) => {
  try {
    // ===============================
    // PAGINATION
    // ===============================

    const page = Math.max(Number(req.query.page) || 1, 1);

    // 50 طلب في الصفحة
    // أقصى شيء 100
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);

    const offset = (page - 1) * limit;

    // ===============================
    // GET ORDERS
    // ===============================

    const { count, rows } = await Order.findAndCountAll({
      where: {
        completed: false,
      },

      include: [
        {
          model: OrderItem,
        },
      ],

      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],

      limit,
      offset,

      // مهم جدًا مع include
      distinct: true,
    });

    // ===============================
    // RESPONSE
    // ===============================

    res.json({
      orders: rows,

      total: count,

      totalPages: Math.ceil(count / limit),

      page,

      limit,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET SINGLE ORDER
// =================================

const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(
      req.params.id,

      {
        include: [
          {
            model: OrderItem,

            include: [Product],
          },
        ],
      },
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// UPDATE STATUS
// =================================

const updateStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const newStatus = req.body.status;

    if (order.status === newStatus) {
      return res.json({
        message: "Status already updated",
      });
    }

    order.status = newStatus;

    let notificationType = null;

    switch (newStatus) {
      case "CONFIRMED":
        notificationType = "ORDER_CONFIRMED";
        break;

      case "PREPARING":
        notificationType = "ORDER_PREPARING";
        break;

      case "SHIPPED":
        notificationType = "ORDER_SHIPPED";
        break;

      case "DELIVERED":
        notificationType = "ORDER_DELIVERED";
        order.completed = true;
        break;

      case "CANCELLED":
        notificationType = "ORDER_CANCELLED";
        order.completed = true;
        break;
    }

    await order.save();

    if (notificationType && order.userId) {
      const messages = {
        ORDER_CONFIRMED: "تم تأكيد طلبك بنجاح ✅",

        ORDER_PREPARING: "طلبك قيد التحضير الآن 🛍️",

        ORDER_SHIPPED: "طلبك خرج للتوصيل 🚚",

        ORDER_DELIVERED: "تم توصيل طلبك بنجاح 🎉",

        ORDER_CANCELLED: "تم إلغاء طلبك ❌",
      };

      await Notification.create({
        userId: order.userId,

        orderId: order.id,

        type: notificationType,

        message: messages[notificationType],
      });
    }

    res.json({
      success: true,

      message: "Status updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// EXPORTS
// =================================

module.exports = {
  createOrder,

  getOrders,

  getOrder,

  updateStatus,
};
