const Coupon = require("../models/Coupon");

const CouponUsage = require("../models/CouponUsage");

// =====================
// GET ALL COUPONS
// =====================

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(coupons);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =====================
// CREATE COUPON
// =====================

const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({
      code: req.body.code,

      discount: req.body.discount,

      usagePerUser: req.body.usagePerUser,

      expiresAt: req.body.expiresAt,
    });

    res.json(coupon);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error",
    });
  }
};

// =====================
// DELETE COUPON
// =====================

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
    });
  }
};

// =====================
// APPLY COUPON
// =====================

const applyCoupon = async (req, res) => {
  try {
    const { code, total } = req.body;

    const userId = req.user?.id;

    if (!code) {
      return res.status(400).json({
        message: "Coupon code is required",
      });
    }

    if (!Number.isFinite(Number(total)) || Number(total) <= 0) {
      return res.status(400).json({
        message: "Invalid total",
      });
    }

    const coupon = await Coupon.findOne({
      where: {
        code: code.trim().toUpperCase(),
        isActive: true,
      },
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon invalid",
      });
    }

    // Check expiration
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({
        message: "Coupon expired",
      });
    }

    // Check user usage
    if (userId) {
      const usage = await CouponUsage.findOne({
        where: {
          userId,
          couponId: coupon.id,
        },
      });

      if (usage && usage.usedCount >= coupon.usagePerUser) {
        return res.status(400).json({
          message: "لقد استخدمت هذا الكوبون الحد المسموح",
        });
      }
    }

    const orderTotal = Number(total);
    const discount = Number(coupon.discount);

    if (discount <= 0 || discount > 100) {
      return res.status(400).json({
        message: "Invalid coupon discount",
      });
    }

    const discountAmount = (orderTotal * discount) / 100;

    const newTotal = orderTotal - discountAmount;

    return res.json({
      success: true,
      couponId: coupon.id,
      discount,
      discountAmount,
      newTotal,
    });
  } catch (err) {
    console.error("APPLY COUPON ERROR:", err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getCoupons,

  createCoupon,

  deleteCoupon,

  applyCoupon,
};
