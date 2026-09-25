import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useCartStore from "../store/cartStore";

function Checkout() {
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);
  const coupon = useCartStore((state) => state.coupon);
  const discount = useCartStore((state) => state.discount);
  const finalTotal = useCartStore((state) => state.finalTotal);

  const { t } = useTranslation();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const total = coupon ? Number(finalTotal || 0) : subtotal;

  const goToPayment = () => {
    if (cart.length === 0) {
      alert(t("checkout.emptyCart"));
      return;
    }

    if (!form.customerName || !form.phone || !form.city || !form.address) {
      alert(t("checkout.fillInfo"));
      return;
    }

    const checkoutData = {
      customerName: form.customerName,
      phone: form.phone,
      city: form.city,
      address: form.address,
      notes: form.notes,
      couponCode: coupon?.code || null,
      discount: discount || 0,
      subtotal,
      total,
    };

    sessionStorage.setItem("zyaCheckoutData", JSON.stringify(checkoutData));

    navigate("/payment");
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

        <Box sx={{ mb: 3 }}>
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

          <Divider sx={{ my: 3 }} />

          {/* SHIPPING */}

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
                minRows={1}
                label={t("checkout.notes")}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "#fafafa",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: 14,
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* ORDER SUMMARY */}

          <Box
            sx={{
              mt: 4,
              borderRadius: 3,
              border: "1px solid #e5e5e5",
              background: "#fff",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: {
                  xs: 2,
                  md: 3,
                },
                py: 2,
                borderBottom: "1px solid #eeeeee",
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111",
                }}
              >
                {t("checkout.orderSummary")}
              </Typography>
            </Box>

            <Box
              sx={{
                px: {
                  xs: 2,
                  md: 3,
                },
                py: 2.5,
              }}
            >
              {/* SUBTOTAL */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#777",
                    fontSize: 14,
                  }}
                >
                  {t("checkout.subtotal")}
                </Typography>

                <Typography
                  sx={{
                    color: "#222",
                    fontSize: 14,
                    fontWeight: 600,
                    direction: "ltr",
                  }}
                >
                  {subtotal.toFixed(2)} {t("checkout.currency")}
                </Typography>
              </Box>

              {/* COUPON */}

              {coupon && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#777",
                      fontSize: 14,
                    }}
                  >
                    {t("checkout.coupon")}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 1,
                        background: "#f1f8f3",
                        color: "#16803c",
                        fontSize: 12,
                        fontWeight: 700,
                        direction: "ltr",
                      }}
                    >
                      {coupon.code}
                    </Box>

                    <Typography
                      sx={{
                        color: "#16803c",
                        fontSize: 13,
                        fontWeight: 700,
                        direction: "ltr",
                      }}
                    >
                      -{discount}%
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider
                sx={{
                  my: 2,
                  borderColor: "#eeeeee",
                }}
              />

              {/* TOTAL */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#111",
                    }}
                  >
                    {t("checkout.total")}
                  </Typography>

                  {coupon && (
                    <Typography
                      sx={{
                        mt: 0.3,
                        fontSize: 12,
                        color: "#16803c",
                      }}
                    >
                      {t("checkout.discount")} {discount}%
                    </Typography>
                  )}
                </Box>

                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#111",
                    direction: "ltr",
                  }}
                >
                  {total.toFixed(2)}{" "}
                  <Box
                    component="span"
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#555",
                    }}
                  >
                    {t("checkout.currency")}
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* CONFIRM ORDER */}

          <Button
            fullWidth
            onClick={goToPayment}
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
            {t("checkout.confirm")}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default Checkout;
