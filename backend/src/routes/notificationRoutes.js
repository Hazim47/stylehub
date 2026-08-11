const express = require("express");

const router = express.Router();

const {
  getUserNotifications,
  deleteNotification,
  markNotificationsRead,
} = require("../controllers/notificationController");

// جلب اشعارات المستخدم
router.get("/:userId", getUserNotifications);

// تعليم الاشعارات كمقروءة
router.patch("/read/:userId", markNotificationsRead);

// حذف اشعار
router.delete("/:id", deleteNotification);

module.exports = router;
