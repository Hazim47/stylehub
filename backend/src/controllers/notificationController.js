const { Notification } = require("../models");

// GET USER NOTIFICATIONS

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        userId: req.params.userId,
      },

      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await notification.destroy();

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.update(
      {
        isRead: true,
      },
      {
        where: {
          userId: req.params.userId,
        },
      },
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getUserNotifications,
  deleteNotification,
  markNotificationsRead,
};
