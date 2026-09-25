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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import API from "../api/axios";
import useCartStore from "../store/cartStore";

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

  useEffect(() => {
    const savedData = sessionStorage.getItem("zyaCheckoutData");

    if (!savedData || cart.length === 0) {
      navigate("/checkout");
      return;
    }

    try {
      setCheckoutData(JSON.parse(savedData));
    } catch (error) {
      console.log(error);
      navigate("/checkout");
    }
  }, [cart.length, navigate]);

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

    setCard({
      ...card,
      [name]: value,
    });
  };

  const formatCardNumber = () => {
    if (!card.number) {
      return "•••• •••• •••• ••••";
    }

    return card.number.padEnd(19, "•");
  };

  const handlePayment = async () => {
    if (!checkoutData) return;

    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      alert(t("payment.fillCard"));
      return;
    }

    const cleanCardNumber = card.number.replace(/\s/g, "");

    if (cleanCardNumber.length < 16) {
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
      console.log(error.response?.data || error);

      alert(error.response?.data?.message || t("payment.paymentError"));
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) {
    return null;
  }

  const subtotal = Number(checkoutData.subtotal || 0);
  const total = Number(checkoutData.total || subtotal);
  const discount = Number(checkoutData.discount || 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f7f7f7",
        py: {
          xs: 3,
          md: 5,
        },
        px: {
          xs: 2,
          md: 5,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* HEADER */}

        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: {
                xs: 30,
                md: 42,
              },
              fontWeight: 900,
              letterSpacing: 2,
              color: "#111",
            }}
          >
            {t("payment.title")}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#777",
              fontSize: 14,
            }}
          >
            {t("payment.subtitle")}
          </Typography>
        </Box>

        {/* PROGRESS */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            gap: {
              xs: 1,
              md: 2,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: "#999",
              fontWeight: 700,
            }}
          >
            {t("payment.cart")}
          </Typography>

          <Box
            sx={{
              width: {
                xs: 25,
                md: 45,
              },
              height: 1,
              background: "#ddd",
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              color: "#999",
              fontWeight: 700,
            }}
          >
            {t("payment.checkout")}
          </Typography>

          <Box
            sx={{
              width: {
                xs: 25,
                md: 45,
              },
              height: 1,
              background: "#111",
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              color: "#111",
              fontWeight: 800,
            }}
          >
            {t("payment.payment")}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT SIDE */}

          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 15px 40px rgba(0,0,0,.05)",
              }}
            >
              {/* CARD PREVIEW */}

              <Box
                sx={{
                  position: "relative",
                  height: {
                    xs: 200,
                    md: 230,
                  },
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #111 0%, #292929 100%)",
                  color: "#fff",
                  p: {
                    xs: 2.5,
                    md: 3,
                  },
                  mb: 4,
                  overflow: "hidden",
                  boxShadow: "0 15px 30px rgba(0,0,0,.18)",
                }}
              >
                {/* CARD DECORATION */}

                <Box
                  sx={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,.08)",
                    right: -60,
                    top: -60,
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    width: 130,
                    height: 130,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,.08)",
                    right: 20,
                    bottom: -80,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 900,
                      letterSpacing: 3,
                    }}
                  >
                    ZYA
                  </Typography>

                  <CreditCardIcon
                    sx={{
                      fontSize: 30,
                      opacity: 0.9,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    position: "relative",
                    mt: {
                      xs: 5,
                      md: 6,
                    },
                    fontSize: {
                      xs: 18,
                      md: 22,
                    },
                    letterSpacing: 2,
                    fontWeight: 600,
                    fontFamily: "monospace",
                  }}
                >
                  {formatCardNumber()}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    position: "absolute",
                    left: {
                      xs: 20,
                      md: 24,
                    },
                    right: {
                      xs: 20,
                      md: 24,
                    },
                    bottom: {
                      xs: 18,
                      md: 22,
                    },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 8,
                        opacity: 0.6,
                        letterSpacing: 1,
                      }}
                    >
                      {t("payment.cardholder")}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {card.name || "YOUR NAME"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 8,
                        opacity: 0.6,
                        letterSpacing: 1,
                      }}
                    >
                      {t("payment.expires")}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {card.expiry || "MM/YY"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* PAYMENT FORM */}

              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                {t("payment.cardDetails")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("payment.cardNumber")}
                    name="number"
                    value={card.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCardIcon
                            sx={{
                              color: "#777",
                              fontSize: 20,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#fafafa",
                        height: 50,
                      },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#fafafa",
                        height: 50,
                      },
                    }}
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
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#fafafa",
                        height: 50,
                      },
                    }}
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
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#fafafa",
                        height: 50,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* SECURITY */}

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#777",
                }}
              >
                <LockOutlinedIcon
                  sx={{
                    fontSize: 18,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 12,
                  }}
                >
                  {t("payment.secure")}
                </Typography>
              </Box>

              {/* PAY BUTTON */}

              <Button
                fullWidth
                onClick={handlePayment}
                disabled={loading}
                sx={{
                  mt: 3,
                  height: 52,
                  borderRadius: 2,
                  background: "#111",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 1,
                  "&:hover": {
                    background: "#333",
                  },
                  "&:disabled": {
                    background: "#999",
                    color: "#fff",
                  },
                }}
              >
                {loading
                  ? t("payment.processing")
                  : `${t("payment.payNow")} ${total.toFixed(2)} ${t(
                      "payment.currency",
                    )}`}
              </Button>

              <Button
                fullWidth
                onClick={() => navigate("/checkout")}
                disabled={loading}
                startIcon={<ArrowBackIcon />}
                sx={{
                  mt: 1,
                  height: 45,
                  borderRadius: 2,
                  color: "#555",
                  fontSize: 13,
                  fontWeight: 700,
                  "&:hover": {
                    background: "#f5f5f5",
                  },
                }}
              >
                {t("payment.backToCheckout")}
              </Button>
            </Paper>
          </Grid>

          {/* RIGHT SIDE */}

          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 15px 40px rgba(0,0,0,.05)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  {t("payment.orderSummary")}
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                }}
              >
                {/* PRODUCTS */}

                {cart.map((item) => (
                  <Box
                    key={`${item.id}-${item.size}-${item.color}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 55,
                        height: 65,
                        borderRadius: 2,
                        background: "#f5f5f5",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {item.image && (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Box>

                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#222",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#888",
                          mt: 0.3,
                        }}
                      >
                        {t("payment.quantity")}: {item.quantity}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        direction: "ltr",
                      }}
                    >
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}{" "}
                      {t("payment.currency")}
                    </Typography>
                  </Box>
                ))}

                <Divider
                  sx={{
                    my: 2,
                  }}
                />

                {/* SUBTOTAL */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#777",
                      fontSize: 14,
                    }}
                  >
                    {t("payment.subtotal")}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      direction: "ltr",
                    }}
                  >
                    {subtotal.toFixed(2)} {t("payment.currency")}
                  </Typography>
                </Box>

                {/* DISCOUNT */}

                {discount > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: 14,
                      }}
                    >
                      {t("payment.discount")}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#16803c",
                        fontSize: 14,
                        fontWeight: 700,
                        direction: "ltr",
                      }}
                    >
                      -{discount}%
                    </Typography>
                  </Box>
                )}

                <Divider
                  sx={{
                    my: 2,
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
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 800,
                    }}
                  >
                    {t("payment.total")}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 23,
                      fontWeight: 900,
                      direction: "ltr",
                    }}
                  >
                    {total.toFixed(2)}{" "}
                    <Box
                      component="span"
                      sx={{
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      {t("payment.currency")}
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* SHIPPING INFO */}

            <Paper
              sx={{
                mt: 2,
                p: 2.5,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,.04)",
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  mb: 1.5,
                }}
              >
                {t("payment.shippingInfo")}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#666",
                  lineHeight: 1.8,
                }}
              >
                {checkoutData.customerName}
                <br />
                {checkoutData.phone}
                <br />
                {checkoutData.city}
                <br />
                {checkoutData.address}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Payment;
