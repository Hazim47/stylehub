import {
  Paper,
  Typography,
  Chip,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";

import { ShoppingBag, ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import api from "../api/axios";

import "./css/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  // ======================
  // Pagination
  // ======================

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  const LIMIT = 50;

  // ======================
  // Load Orders
  // ======================

  const loadOrders = async (pageNumber = page) => {
    try {
      setLoading(true);

      const res = await api.get("/orders", {
        params: {
          page: pageNumber,
          limit: LIMIT,
        },
      });

      if (Array.isArray(res.data)) {
        // Fallback in case backend still returns array
        setOrders(res.data);
        setTotalOrders(res.data.length);
        setTotalPages(1);
      } else {
        setOrders(res.data.orders || []);

        setTotalOrders(res.data.total || 0);

        setTotalPages(
          res.data.totalPages || Math.ceil((res.data.total || 0) / LIMIT) || 1,
        );
      }
    } catch (err) {
      console.log("Failed to load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Initial Load / Page Change
  // ======================

  useEffect(() => {
    loadOrders(page);
  }, [page]);

  // ======================
  // Change Status
  // ======================

  const changeStatus = async (id, status) => {
    try {
      const currentOrder = orders.find((order) => order.id === id);

      if (!currentOrder) return;

      if (status === currentOrder.status) {
        return;
      }

      if (status === "DELIVERED" || status === "CANCELLED") {
        const confirmAction = window.confirm(
          status === "DELIVERED"
            ? "Are you sure this order is delivered?"
            : "Are you sure you want to cancel this order?",
        );

        if (!confirmAction) {
          return;
        }
      }

      await api.patch(`/orders/${id}/status`, {
        status,
      });

      // Update status immediately without reloading everything
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order,
        ),
      );

      // Remove delivered/cancelled order after animation
      if (status === "DELIVERED" || status === "CANCELLED") {
        setTimeout(() => {
          setOrders((prev) => prev.filter((order) => order.id !== id));

          // Keep pagination filled
          loadOrders(page);
        }, 500);
      }
    } catch (err) {
      console.log("Failed to change order status:", err);

      // Reload only current page if update fails
      loadOrders(page);
    }
  };

  // ======================
  // Pagination Controls
  // ======================

  const handlePrevious = () => {
    if (page > 1 && !loading) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const statuses = ["NEW", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"];

  // ======================
  // Render
  // ======================

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          {/* العنوان */}
          <Typography
            variant="h4"
            className="orders-title"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ShoppingBag />
            Orders
          </Typography>

          {/* السهم بالزاوية المقابلة */}
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",

              background: "#fff",
              color: "#111",

              border: "1px solid #e8e8e8",

              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",

              transition: "all 0.25s ease",

              "&:hover": {
                background: "#111",
                color: "#fff",
                borderColor: "#111",
                transform: "translateX(-3px)",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <ArrowBack sx={{ fontSize: 22 }} />
          </IconButton>
        </div>

        <p>
          Manage customer orders
          {totalOrders > 0 && ` • ${totalOrders} total orders`}
        </p>
      </div>

      {/* ======================
          Loading
      ====================== */}

      {loading && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 0",
          }}
        >
          <CircularProgress />
        </div>
      )}

      {/* ======================
          Orders Grid
      ====================== */}

      {!loading && (
        <div className="orders-grid">
          {orders.map((order) => (
            <Paper
              className={`order-card ${
                order.status === "NEW" ? "new-order" : ""
              }`}
              key={order.id}
            >
              {/* ======================
                  Customer Info
              ====================== */}

              <div className="customer-info">
                <Typography variant="h6">ORD-{order.orderNumber}</Typography>

                <Chip
                  label={order.status}
                  color={
                    order.status === "NEW"
                      ? "warning"
                      : order.status === "PREPARING"
                        ? "info"
                        : order.status === "CANCELLED"
                          ? "error"
                          : "success"
                  }
                  sx={{
                    marginTop: "10px",
                    fontWeight: "bold",
                  }}
                />

                <p>👤 {order.customerName}</p>

                <p>📞 {order.phone}</p>

                <p>
                  📍 {order.city} - {order.address}
                </p>

                {order.notes && (
                  <p
                    style={{
                      background: "#f5f5f5",
                      padding: "10px",
                      borderRadius: "10px",
                      marginTop: "10px",
                    }}
                  >
                    📝 الملاحظة: {order.notes}
                  </p>
                )}
              </div>

              {/* ======================
                  Products
              ====================== */}

              <div className="products-list">
                {order.OrderItems?.map((item) => (
                  <div className="order-product" key={item.id}>
                    <img
                      loading="lazy"
                      src={
                        item.productImage
                          ? `http://localhost:5000/uploads/products/${item.productImage}`
                          : "/no-image.png"
                      }
                      alt={item.productName || "Product"}
                    />

                    <div>
                      <h4>{item.productName}</h4>

                      <p>Price: {item.price} JD</p>

                      <p>Quantity: {item.quantity}</p>

                      {item.size && <p>Size: {item.size}</p>}

                      {item.color && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "8px",
                          }}
                        >
                          <p style={{ margin: 0 }}>Color:</p>

                          {Array.isArray(item.color) ? (
                            item.color.map((c, index) => (
                              <span
                                key={index}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  borderRadius: "50%",
                                  background: c,
                                  border: "2px solid #ddd",
                                  display: "inline-block",
                                }}
                              />
                            ))
                          ) : (
                            <span
                              style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                background: item.color,
                                border: "2px solid #ddd",
                                display: "inline-block",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ======================
                  Order Footer
              ====================== */}

              <div className="order-footer">
                <div>
                  {order.discount > 0 ? (
                    <>
                      <p>Subtotal: {Number(order.total || 0).toFixed(2)} JD</p>

                      <p
                        style={{
                          color: "#d32f2f",
                          fontWeight: "bold",
                        }}
                      >
                        Discount: {order.discount}%
                      </p>

                      <h3
                        style={{
                          color: "#2e7d32",
                        }}
                      >
                        Total: {Number(order.finalTotal || 0).toFixed(2)} JD
                      </h3>

                      <p>
                        Coupon: <strong>{order.couponCode}</strong>
                      </p>
                    </>
                  ) : (
                    <h3>Total: {Number(order.total || 0).toFixed(2)} JD</h3>
                  )}
                </div>

                {/* ======================
                    Status Select
                ====================== */}

                <Select
                  value={order.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;

                    if (newStatus !== order.status) {
                      changeStatus(order.id, newStatus);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={loading}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },

                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },

                    PaperProps: {
                      sx: {
                        maxHeight: 250,
                        overflowY: "auto",
                        borderRadius: "18px",
                        mt: 1,
                      },
                    },
                  }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </Paper>
          ))}
        </div>
      )}

      {/* ======================
          Empty State
      ====================== */}

      {!loading && orders.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#777",
          }}
        >
          <ShoppingBag
            sx={{
              fontSize: 60,
              opacity: 0.4,
              marginBottom: 1,
            }}
          />

          <Typography variant="h6">No orders found</Typography>
        </div>
      )}

      {/* ======================
          Pagination
      ====================== */}

      {!loading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "18px",
            marginTop: "35px",
            marginBottom: "30px",
          }}
        >
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={handlePrevious}
            sx={{
              minWidth: "110px",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            ← Previous
          </Button>

          <Typography
            sx={{
              fontWeight: "bold",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            Page {page} / {totalPages}
          </Typography>

          <Button
            variant="contained"
            disabled={page === totalPages}
            onClick={handleNext}
            sx={{
              minWidth: "110px",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
