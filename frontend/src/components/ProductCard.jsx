import { Card, CardMedia, Typography, Box, IconButton } from "@mui/material";

import { Link } from "react-router-dom";

import { FavoriteBorder, Favorite } from "@mui/icons-material";

import useFavorites from "../hooks/useFavorites";

import { useTranslation } from "react-i18next";

function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const { t } = useTranslation();

  const image = product.ProductImages?.[0]?.image
    ? `http://localhost:5000/uploads/products/${product.ProductImages[0].image}`
    : "https://via.placeholder.com/500";

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Link
        to={`/products/${product.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: 0,
            overflow: "hidden",
            background: "#f5f5f5",
            border: "1px solid #eee",
            transition: "all .35s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 35px rgba(0,0,0,.12)",
              "& img": {
                transform: "scale(1.08)",
              },
            },
          }}
        >
          <CardMedia
            component="img"
            src={image}
            alt={product.name}
            sx={{
              width: "100%",
              aspectRatio: "3 / 4",
              objectFit: "cover",
              transition: "transform .6s ease",
            }}
          />
        </Card>
      </Link>

      <Box
        sx={{
          mt: 2,

          position: "relative",

          px: 0.5,
        }}
      >
        {/* FAVORITE */}

        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            toggleFavorite(product);
          }}
          sx={{
            position: "absolute",

            insetInlineEnd: 6, // بدل right

            top: 6,

            width: 44,

            height: 44,

            borderRadius: "50%",

            background: "rgba(255,255,255,0.95)",

            backdropFilter: "blur(10px)",

            boxShadow: "0 6px 20px rgba(0,0,0,.12)",

            transition: "all .35s ease",

            "&:hover": {
              background: "#000",

              transform: "scale(1.12)",

              "& svg": {
                color: "#fff",
              },
            },

            "&:active": {
              transform: "scale(.9)",
            },
          }}
        >
          {isFavorite(product.id) ? (
            <Favorite
              sx={{
                color: "#000",

                fontSize: 26,

                transition: ".3s",
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                color: "#000",

                fontSize: 26,
              }}
            />
          )}
        </IconButton>

        {/* PRODUCT NAME */}
        <Typography
          sx={{
            fontSize: 15,

            fontWeight: 800,

            color: "#000",

            textTransform: "uppercase",

            paddingInlineEnd: 5,

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 42,

            letterSpacing: 1,
          }}
        >
          {product.name}
        </Typography>

        {/* PRICE */}

        <Typography
          sx={{
            mt: 0.8,

            fontSize: 21,

            fontWeight: 900,

            color: "#000",
          }}
        >
          {product.price} {t("currency")}
        </Typography>
      </Box>
    </Box>
  );
}

export default ProductCard;
