import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  InputAdornment,
} from "@mui/material";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import API from "../api/axios";
import useCartStore from "../store/cartStore";

import "./css/Payment.css";

function Payment() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cart = useCartStore((state) => state.cart);
  const coupon = useCartStore((state) => state.coupon);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearCoupon = useCartStore((state) => state.clearCoupon);

  const [checkoutData, setCheckoutData] = useState(null);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOAD CHECKOUT DATA
     ========================================================= */

  useEffect(() => {
    const savedData = sessionStorage.getItem("zyaCheckoutData");

    if (!savedData || cart.length === 0) {
      navigate("/checkout");
      return;
    }

    try {
      setCheckoutData(JSON.parse(savedData));
    } catch (error) {
      console.error(error);
      navigate("/checkout");
    }
  }, [cart.length, navigate]);

  /* =========================================================
     CARD INPUT
     ========================================================= */

  const handleCardChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);

      if (value.length >= 3) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    }

    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    setCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     CARD PREVIEW
     ========================================================= */

  const formatCardNumber = () => {
    if (!card.number) {
      return "•••• •••• •••• ••••";
    }

    return card.number.padEnd(19, "•");
  };

  /* =========================================================
     PAYMENT
     ========================================================= */

  const handlePayment = async () => {
    if (!checkoutData || loading) return;

    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      alert(t("payment.fillCard"));
      return;
    }

    const cleanCardNumber = card.number.replace(/\s/g, "");

    if (cleanCardNumber.length !== 16) {
      alert(t("payment.invalidCard"));
      return;
    }

    if (card.expiry.length !== 5) {
      alert(t("payment.invalidExpiry"));
      return;
    }

    if (card.cvv.length < 3) {
      alert(t("payment.invalidCvv"));
      return;
    }

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      /*
       * IMPORTANT:
       * Card information is intentionally NOT sent to the backend.
       *
       * This endpoint creates the normal order that appears
       * in the admin panel.
       */

      await API.post("/orders", {
        userId: user?.id,

        customerName: checkoutData.customerName,
        phone: checkoutData.phone,
        city: checkoutData.city,
        address: checkoutData.address,
        notes: checkoutData.notes,

        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,

          size:
            typeof item.size === "object"
              ? JSON.stringify(item.size)
              : item.size,

          color: item.color,
        })),

        couponCode: checkoutData.couponCode || coupon?.code || null,
      });

      clearCart();
      clearCoupon();

      sessionStorage.removeItem("zyaCheckoutData");

      navigate("/order-success");
    } catch (error) {
      console.error(error.response?.data || error);

      alert(error.response?.data?.message || t("payment.paymentError"));
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) {
    return null;
  }

  /* =========================================================
     TOTALS
     ========================================================= */

  const subtotal = Number(checkoutData.subtotal || 0);
  const total = Number(checkoutData.total || subtotal);
  const discount = Number(checkoutData.discount || 0);

  return (
    <Box className="payment-page">
      <Box className="payment-container">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box className="payment-header">
          <Box>
            <Typography className="payment-eyebrow">ZYA CHECKOUT</Typography>

            <Typography className="payment-title">
              {t("payment.title")}
            </Typography>

            <Typography className="payment-subtitle">
              {t("payment.subtitle")}
            </Typography>
          </Box>
        </Box>

        {/* =====================================================
            PROGRESS
        ===================================================== */}

        <Box className="payment-progress">
          <Box className="progress-step progress-done">
            <Box className="progress-number">✓</Box>

            <Typography>{t("payment.cart")}</Typography>
          </Box>

          <Box className="progress-line progress-active" />

          <Box className="progress-step progress-done">
            <Box className="progress-number">✓</Box>

            <Typography>{t("payment.checkout")}</Typography>
          </Box>

          <Box className="progress-line progress-current" />

          <Box className="progress-step progress-current-step">
            <Box className="progress-number">3</Box>

            <Typography>{t("payment.payment")}</Typography>
          </Box>
        </Box>

        {/* =====================================================
            MAIN
            كل شيء تحت بعض وبنفس العرض
        ===================================================== */}

        <Box className="payment-layout">
          {/* ===================================================
              PAYMENT CARD
          =================================================== */}

          <Box className="payment-column">
            <Paper className="payment-card">
              {/* CARD PREVIEW */}

              <Box className="credit-card-preview">
                <Box className="card-glow card-glow-one" />
                <Box className="card-glow card-glow-two" />

                <Box className="card-top">
                  <Typography className="card-brand">ZYA</Typography>

                  <Box className="card-type">
                    <CreditCardIcon />
                  </Box>
                </Box>

                <Box className="card-chip">
                  <Box />
                  <Box />
                  <Box />
                  <Box />
                </Box>

                <Typography className="card-number">
                  {formatCardNumber()}
                </Typography>

                <Box className="card-bottom">
                  <Box>
                    <Typography className="card-label">
                      {t("payment.cardholder")}
                    </Typography>

                    <Typography className="card-value">
                      {card.name || "YOUR NAME"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography className="card-label">
                      {t("payment.expires")}
                    </Typography>

                    <Typography className="card-value">
                      {card.expiry || "MM/YY"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* FORM HEADER */}

              <Box className="payment-section-header">
                <Box className="section-icon">
                  <CreditCardIcon />
                </Box>

                <Box>
                  <Typography className="section-title">
                    {t("payment.cardDetails")}
                  </Typography>

                  <Typography className="section-description">
                    Enter your card details to continue
                  </Typography>
                </Box>
              </Box>

              {/* FORM */}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("payment.cardNumber")}
                    name="number"
                    value={card.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCardIcon className="input-icon" />
                        </InputAdornment>
                      ),
                    }}
                    className="payment-input"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("payment.cardholder")}
                    name="name"
                    value={card.name}
                    onChange={handleCardChange}
                    placeholder="JOHN DOE"
                    autoComplete="cc-name"
                    className="payment-input"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t("payment.expires")}
                    name="expiry"
                    value={card.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    className="payment-input"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t("payment.cvv")}
                    name="cvv"
                    value={card.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    type="password"
                    autoComplete="cc-csc"
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    className="payment-input"
                  />
                </Grid>
              </Grid>

              {/* SECURITY */}

              <Box className="security-box">
                <Box className="security-icon">
                  <LockOutlinedIcon />
                </Box>

                <Box>
                  <Typography className="security-title">
                    Secure checkout
                  </Typography>

                  <Typography className="security-text">
                    {t("payment.secure")}
                  </Typography>
                </Box>
              </Box>

              {/* PAY */}

              <Button
                fullWidth
                onClick={handlePayment}
                disabled={loading}
                className="pay-button"
              >
                {loading ? (
                  <Box className="pay-loading">
                    <span className="loading-dot" />
                    {t("payment.processing")}
                  </Box>
                ) : (
                  <>
                    <LockOutlinedIcon />

                    <span>{t("payment.payNow")}</span>

                    <span className="pay-price">
                      {total.toFixed(2)} {t("payment.currency")}
                    </span>
                  </>
                )}
              </Button>

              {/* BACK */}

              <Button
                fullWidth
                onClick={() => navigate("/checkout")}
                disabled={loading}
                startIcon={<ArrowBackIcon />}
                className="back-button"
              >
                {t("payment.backToCheckout")}
              </Button>
            </Paper>
          </Box>

          {/* ===================================================
              SUMMARY
          =================================================== */}

          <Box className="summary-column">
            <Paper className="summary-card">
              {/* SUMMARY HEADER */}

              <Box className="summary-header">
                <Box>
                  <Typography className="summary-title">
                    {t("payment.orderSummary")}
                  </Typography>

                  <Typography className="summary-count">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </Typography>
                </Box>

                <Box className="secure-badge">{t("payment.secure")}</Box>
              </Box>

              {/* PRODUCTS */}

              <Box className="summary-products">
                {cart.map((item) => (
                  <Box
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="summary-product"
                  >
                    <Box className="product-image">
                      {item.image ? (
                        <Box component="img" src={item.image} alt={item.name} />
                      ) : (
                        <CreditCardIcon />
                      )}

                      <Box className="product-quantity">{item.quantity}</Box>
                    </Box>

                    <Box className="product-details">
                      <Typography className="product-name">
                        {item.name}
                      </Typography>

                      <Typography className="product-meta">
                        {t("payment.quantity")}: {item.quantity}
                      </Typography>

                      {item.size && (
                        <Typography className="product-meta">
                          {t("payment.size")}:{" "}
                          {typeof item.size === "object"
                            ? Object.values(item.size).join(" / ")
                            : item.size}
                        </Typography>
                      )}

                      {item.color && (
                        <Typography className="product-meta">
                          {t("payment.color")}: {item.color}
                        </Typography>
                      )}
                    </Box>

                    <Typography className="product-price">
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}{" "}
                      {t("payment.currency")}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider />

              {/* CALCULATIONS */}

              <Box className="summary-calculations">
                <Box className="summary-row">
                  <Typography>{t("payment.subtotal")}</Typography>

                  <Typography>
                    {subtotal.toFixed(2)} {t("payment.currency")}
                  </Typography>
                </Box>

                {discount > 0 && (
                  <Box className="summary-row discount-row">
                    <Typography>{t("payment.discount")}</Typography>

                    <Typography>-{discount}%</Typography>
                  </Box>
                )}

                <Divider className="summary-divider" />

                <Box className="total-row">
                  <Typography>{t("payment.total")}</Typography>

                  <Box className="total-price">
                    <Typography>{total.toFixed(2)}</Typography>

                    <span>{t("payment.currency")}</span>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* =================================================
                SHIPPING
            ================================================= */}

            <Paper className="shipping-card">
              <Box className="shipping-icon">
                <LocalShippingOutlinedIcon />
              </Box>

              <Box className="shipping-content">
                <Box className="shipping-heading">
                  <Box>
                    <Typography className="shipping-title">
                      {t("payment.shippingInfo")}
                    </Typography>

                    <Typography className="shipping-subtitle">
                      {t("payment.deliveryDetails")}
                    </Typography>
                  </Box>

                  <Button
                    onClick={() => navigate("/checkout")}
                    disabled={loading}
                    className="update-button"
                  >
                    {t("payment.update")}
                  </Button>
                </Box>

                {/* SHIPPING DETAILS */}

                <Box className="shipping-details">
                  <Box className="shipping-detail-row">
                    <Typography className="shipping-label">
                      {t("payment.customer")}
                    </Typography>

                    <Typography className="shipping-value">
                      {checkoutData.customerName}
                    </Typography>
                  </Box>

                  <Box className="shipping-detail-row">
                    <Typography className="shipping-label">
                      {t("payment.phone")}
                    </Typography>

                    <Typography className="shipping-value" dir="ltr">
                      {checkoutData.phone}
                    </Typography>
                  </Box>

                  <Box className="shipping-detail-row">
                    <Typography className="shipping-label">
                      {t("payment.city")}
                    </Typography>

                    <Typography className="shipping-value">
                      {checkoutData.city}
                    </Typography>
                  </Box>

                  <Box className="shipping-detail-row">
                    <Typography className="shipping-label">
                      {t("payment.address")}
                    </Typography>

                    <Typography className="shipping-value">
                      {checkoutData.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Box className="payment-footer">
          <LockOutlinedIcon />

          <Typography>
            Your payment information is protected and never stored.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Payment;
