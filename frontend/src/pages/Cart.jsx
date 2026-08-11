import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Divider,
  TextField,
} from "@mui/material";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { useState } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import api from "../api/axios";
import useCartStore from "../store/cartStore";

import CartItem from "../components/CartItem";

import "./css/Cart.css";

function Cart() {
  const { t } = useTranslation();

  const cart = useCartStore((state) => state.cart);

  const discount = useCartStore((state) => state.discount);

  const finalTotal = useCartStore((state) => state.finalTotal);

  const setCoupon = useCartStore((state) => state.setCoupon);

  const increase = useCartStore((state) => state.increase);

  const decrease = useCartStore((state) => state.decrease);
  const user = JSON.parse(localStorage.getItem("user"));
  const remove = useCartStore((state) => state.remove);

  const [couponInput, setCouponInput] = useState("");

  const [message, setMessage] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = finalTotal !== null ? total - finalTotal : 0;

  const applyCoupon = async () => {
    try {
      const res = await api.post("/coupons/apply", {
        code: couponInput,
        total,
        userId: user?.role === "USER" ? user.id : null,
      });

      setCoupon({
        code: couponInput,
        discount: res.data.discount,
        discountAmount: res.data.discountAmount,
        finalTotal: res.data.newTotal,
      });

      setMessage(`${t("cart.couponApplied")} ${res.data.discount}%`);
    } catch {
      setMessage(t("cart.invalidCoupon"));
    }
  };

  if (cart.length === 0) {
    return (
      <Box className="cart-empty">
        <ShoppingBagIcon className="cart-empty-icon" />

        <Typography className="cart-empty-title">{t("cart.empty")}</Typography>

        <Button component={Link} to="/products" className="cart-shop-btn">
          {t("cart.shopNow")}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="cart-page"
      sx={{
        maxWidth: "1050px",
        mx: "auto",

        px: {
          xs: 1.5,
          md: 2,
        },

        py: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Typography
        className="cart-title"
        sx={{
          fontSize: {
            xs: 24,
            md: 32,
          },
          mb: 2,
        }}
      >
        {t("cart.title")}
      </Typography>

      <Grid
        container
        spacing={{
          xs: 1.5,
          md: 2,
        }}
      >
        <Grid item xs={12} md={8}>
          {cart.map((item) => (
            <CartItem
              key={item.id + JSON.stringify(item.size) + item.color}
              item={item}
              increase={increase}
              decrease={decrease}
              remove={remove}
            />
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            className="summary-card"
            sx={{
              p: {
                xs: 1.5,
                md: 2.2,
              },

              borderRadius: "16px",
            }}
          >
            <Typography
              className="summary-title"
              sx={{
                fontSize: {
                  xs: 16,
                  md: 20,
                },

                fontWeight: 900,
              }}
            >
              {t("cart.summary")}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <TextField
              fullWidth
              size="small"
              label={t("cart.coupon")}
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />

            <Button
              fullWidth
              onClick={applyCoupon}
              className="coupon-btn"
              sx={{
                mt: 1.5,
                height: 38,
                fontSize: 13,
              }}
            >
              {t("cart.apply")}
            </Button>

            <Typography
              className={
                message.includes("Invalid") ? "coupon-error" : "coupon-success"
              }
              sx={{
                fontSize: 12,
                mt: 0.8,
              }}
            >
              {message}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                borderBottom: "1px solid #ececec",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#555",
                }}
              >
                {t("cart.products")}
              </Typography>

              <Box
                sx={{
                  minWidth: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#111",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {cart.length}
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography
                sx={{
                  color: "#666",
                  fontWeight: 600,
                }}
              >
                {t("cart.subtotal")}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {total.toFixed(2)} {t("currency")}
              </Typography>
            </Box>

            {discount > 0 && (
              <Box display="flex" justifyContent="space-between" mt={0.8}>
                <Typography fontSize={14}>{t("cart.discount")}</Typography>

                <Typography color="error" fontWeight={900} fontSize={14}>
                  -{discountAmount.toFixed(2)} {t("currency")}
                </Typography>
              </Box>
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2.5}
              pt={2}
              sx={{
                borderTop: "1px solid #e5e5e5",
              }}
            >
              <Typography
                sx={{
                  color: "#ff0000",
                  fontWeight: 900,
                  fontSize: 17,
                }}
              >
                {t("cart.total")}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 1000,
                  fontSize: 26,
                  color: "#111",
                }}
              >
                {finalTotal !== null ? finalTotal.toFixed(2) : total.toFixed(2)}{" "}
                {t("currency")}
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/checkout"
              fullWidth
              className="checkout-btn"
              sx={{
                mt: 2,
                height: 40,
                fontSize: 14,
              }}
            >
              {t("cart.checkout")}
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Cart;
