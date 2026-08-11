import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";

import Footer from "../components/Footer";
import api from "../api/axios";

import "./css/Notifications.css";

export default function Notifications() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const user = (() => {
    try {
      const data = localStorage.getItem("user");

      if (!data || data === "undefined") return null;

      return JSON.parse(data);
    } catch {
      return null;
    }
  })();

  const loadNotifications = async () => {
    try {
      if (!user?.id) {
        console.log("No user logged in");

        return;
      }

      const res = await api.get(`/notifications/${user.id}`);

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadNotifications();

    api
      .patch(`/notifications/read/${user.id}`)
      .catch((err) => console.log(err));
  }, []);

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getIcon = (type) => {
    if (type === "ORDER_PREPARING" || type === "ORDER_SHIPPED") {
      return <LocalShippingOutlinedIcon />;
    }

    if (type === "ORDER_DELIVERED") {
      return <CheckCircleOutlineOutlinedIcon />;
    }

    if (type === "ORDER_CANCELLED") {
      return <CancelOutlinedIcon />;
    }

    return <NotificationsNoneOutlinedIcon />;
  };

  return (
    <>
      <Box className="notifications-page">
        <Box className="notifications-header">
          <Typography variant="h3" className="notifications-title">
            {t("notifications.title")}
          </Typography>

          <Typography className="notifications-subtitle">
            {t("notifications.subtitle")}
          </Typography>

          <Chip
            label={`${notifications.length} ${t("notifications.notifications")}`}
            className="notification-counter"
          />
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Paper className="empty-notifications">
            <NotificationsNoneOutlinedIcon
              sx={{
                fontSize: 90,
                mb: 2,
              }}
            />

            <Typography variant="h5">{t("notifications.empty")}</Typography>

            <Typography
              sx={{
                opacity: 0.7,
                mt: 1,
              }}
            >
              {t("notifications.emptyText")}
            </Typography>
          </Paper>
        ) : (
          <Box className="notifications-list">
            {notifications.map((notification) => (
              <Paper
                key={notification.id}
                className={`notification-card ${
                  !notification.isRead ? "unread" : ""
                }`}
                elevation={0}
              >
                <Box className="notification-left">
                  <Box className="notification-icon">
                    {getIcon(notification.type)}
                  </Box>

                  <Box className="notification-content">
                    <Typography className="notification-message">
                      {t(`notifications.${notification.type}`)}
                    </Typography>

                    <Typography className="notification-date">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>

                    {!notification.isRead && (
                      <Chip
                        label={t("notifications.new")}
                        size="small"
                        color="error"
                        sx={{
                          mt: 1,
                          fontWeight: 700,
                          width: "fit-content",
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <IconButton
                  className="delete-notification-btn"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <CloseIcon />
                </IconButton>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
