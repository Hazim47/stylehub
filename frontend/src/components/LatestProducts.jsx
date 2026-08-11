import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import api from "../api/axios";
import SliderSection from "../components/SliderSection";
import { useTranslation } from "react-i18next";

function LatestProducts() {
  const [products, setProducts] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const [shirtsRes, pantsRes, blousesRes, bootsRes, setsRes] =
        await Promise.all([
          api.get("/products?category=قميص&limit=4"),
          api.get("/products?category=بنطلون&limit=4"),
          api.get("/products?category=بلوزة&limit=4"),
          api.get("/products?category=بوت&limit=4"),
          api.get("/products?category=طقم&limit=4"),
        ]);

      const allProducts = [
        ...(shirtsRes.data.products || []),
        ...(blousesRes.data.products || []),
        ...(pantsRes.data.products || []),
        ...(bootsRes.data.products || []),
        ...(setsRes.data.products || []),
      ];

      setProducts(allProducts);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box
      sx={{
        maxWidth: "1600px",
        mx: "auto",
        px: {
          xs: 2,
          md: 4,
        },
        py: {
          xs: 7,
          md: 8,
        },
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          fontSize: {
            xs: "32px",
            sm: "40px",
            md: "50px",
            lg: "56px",
          },
          fontWeight: 900,
          letterSpacing: {
            xs: 3,
            md: 5,
          },
          mb: 2,
        }}
      >
        {t("latest.title")}
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          color: "#777",
          fontSize: {
            xs: "16px",
            md: "18px",
            lg: "19px",
          },
          lineHeight: 1.8,
          maxWidth: "650px",
          mx: "auto",
          mb: 5,
        }}
      >
        {t("latest.subtitle")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 6,
        }}
      >
        <Box
          component="button"
          onClick={() => (window.location.href = "/products")}
          sx={{
            border: "none",
            background: "#000",
            color: "#fff",
            px: {
              xs: 4,
              md: 5,
            },
            py: {
              xs: 1.5,
              md: 1.8,
            },
            borderRadius: "50px",
            fontSize: {
              xs: "15px",
              md: "17px",
            },
            fontWeight: 800,
            letterSpacing: 1.5,
            cursor: "pointer",
            boxShadow: "0 12px 30px rgba(0,0,0,.2)",
            transition: ".3s",

            "&:hover": {
              background: "#556B3F",
              transform: "translateY(-4px)",
            },
          }}
        >
          {t("latest.shopNow")}
        </Box>
      </Box>

      {products.length > 0 && <SliderSection products={products} />}
    </Box>
  );
}

export default LatestProducts;
