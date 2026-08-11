import { Box, Typography, Grid, Chip } from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ProductCard from "../components/ProductCard";

import useFavorites from "../hooks/useFavorites";

import { useTranslation } from "react-i18next";

import "./css/Products.css";

export default function Favorites() {
  const { favorites } = useFavorites();

  const { t } = useTranslation();

  return (
    <Box className="favorites-page">
      {/* HERO HEADER */}

      <Box className="favorites-hero">
        <Box className="favorites-title-box">
          <Box className="favorites-icon">
            <FavoriteIcon />
          </Box>

          <Box>
            <Typography className="favorites-title">
              {t("favorites.title")}
            </Typography>

            <Typography className="favorites-subtitle">
              {t("favorites.subtitle")}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`${favorites.length} ${t("products.products")}`}
          className="favorites-count"
        />
      </Box>

      {favorites.length === 0 ? (
        <Box className="favorites-empty">
          <Box className="empty-heart">
            <FavoriteBorderIcon />
          </Box>

          <Typography className="empty-title">
            {t("favorites.empty")}
          </Typography>

          <Typography className="empty-text">
            {t("favorites.subtitle")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} className="products-grid favorites-grid">
          {favorites.map((product) => (
            <Grid
              size={{
                xs: 6,

                sm: 4,

                md: 3,
              }}
              key={product.id}
              className="favorite-item"
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
