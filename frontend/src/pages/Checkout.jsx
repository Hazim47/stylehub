import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import API from "../api/axios";

import useCartStore from "../store/cartStore";

function Checkout() {
  const cart = useCartStore((state) => state.cart);

  const coupon = useCartStore((state) => state.coupon);

  const discount = useCartStore((state) => state.discount);

  const finalTotal = useCartStore((state) => state.finalTotal);
  const user = JSON.parse(localStorage.getItem("user"));
  const clearCart = useCartStore((state) => state.clearCart);
  const { t } = useTranslation();
  const clearCoupon = useCartStore((state) => state.clearCoupon);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      alert("السلة فارغة");
      return;
    }

    if (!form.customerName || !form.phone || !form.city || !form.address) {
      alert("يرجى تعبئة جميع معلومات التوصيل");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/orders", {
        userId: user?.id,
        customerName: form.customerName,

        phone: form.phone,

        city: form.city,

        address: form.address,

        notes: form.notes,

        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,

          size:
            typeof item.size === "object"
              ? JSON.stringify(item.size)
              : item.size,

          color: item.color,
        })),

        couponCode: coupon?.code || null,
      });

      clearCart();

      clearCoupon();

      setForm({
        customerName: "",
        phone: "",
        city: "",
        address: "",
        notes: "",
      });

      alert("تم إرسال طلبك بنجاح");
    } catch (error) {
      console.log(error.response?.data || error);

      alert(error.response?.data?.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8f8f8",
        py: 4,
        px: {
          xs: 2,
          md: 5,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 950,
          mx: "auto",
        }}
      >
        {/* TITLE */}

        <Box
          sx={{
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 30,
                md: 42,
              },

              fontWeight: 800,

              letterSpacing: 2,

              color: "#111",
            }}
          >
            {t("checkout.title")}
          </Typography>

          <Typography
            sx={{
              color: "#777",

              mt: 0.5,

              fontSize: 14,
            }}
          >
            {t("checkout.subtitle")}
          </Typography>
        </Box>

        <Paper
          sx={{
            p: {
              xs: 2,
              md: 3,
            },

            borderRadius: 3,

            background: "#fff",

            boxShadow: "0 15px 40px rgba(0,0,0,.06)",
          }}
        >
          {/* CUSTOMER INFO */}

          <Typography
            sx={{
              fontSize: 18,

              fontWeight: 800,

              mb: 2,
            }}
          >
            {t("checkout.customerInfo")}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("checkout.name")}
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,

                    background: "#fafafa",

                    height: 48,
                  },

                  "& .MuiInputLabel-root": {
                    fontSize: 14,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("checkout.phone")}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,

                    background: "#fafafa",

                    height: 48,
                  },

                  "& .MuiInputLabel-root": {
                    fontSize: 14,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: 3,
            }}
          />

          {/* ADDRESS */}

          <Typography
            sx={{
              fontSize: 18,

              fontWeight: 800,

              mb: 2,
            }}
          >
            {t("checkout.shippingInfo")}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("checkout.city")}
                name="city"
                value={form.city}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,

                    background: "#fafafa",

                    height: 48,
                  },

                  "& .MuiInputLabel-root": {
                    fontSize: 14,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("checkout.address")}
                name="address"
                value={form.address}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,

                    background: "#fafafa",

                    height: 48,
                  },

                  "& .MuiInputLabel-root": {
                    fontSize: 14,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                label={t("checkout.notes")}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,

                    background: "#fafafa",

                    height: 48,
                  },

                  "& .MuiInputLabel-root": {
                    fontSize: 14,
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* COUPON */}

          {coupon && (
            <Box
              sx={{
                mt: 3,

                p: 2,

                borderRadius: 2,

                background: "#111",

                color: "#fff",
              }}
            >
              <Typography fontWeight={700} fontSize={16}>
                {t("checkout.coupon")} : {coupon.code}
              </Typography>

              <Typography fontSize={14}>
                {t("checkout.discount")} : {discount}%
              </Typography>

              <Typography fontWeight={800} fontSize={16}>
                {t("checkout.total")} : {finalTotal} JD
              </Typography>
            </Box>
          )}

          {/* BUTTON */}

          <Button
            fullWidth
            onClick={submitOrder}
            disabled={loading}
            sx={{
              mt: 3,

              height: 50,

              borderRadius: 2,

              background: "#111",

              color: "#fff",

              fontSize: 14,

              fontWeight: 800,

              letterSpacing: 1,

              "&:hover": {
                background: "#333",
              },
            }}
          >
            {loading ? t("checkout.sending") : t("checkout.confirm")}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default Checkout;
