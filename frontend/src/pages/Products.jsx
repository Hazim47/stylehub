import { useEffect, useState } from "react";

import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./css/Products.css";

export default function Products() {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("NEW IN");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  const categories = [
    {
      label: t("products.newIn"),
      value: "NEW IN",
    },
    {
      label: t("products.clothing"),
      value: "طقم",
    },
    {
      label: t("products.shoes"),
      value: "بوت",
    },
    {
      label: t("products.tops"),
      value: "بلوزة",
    },
    {
      label: t("products.shirts"),
      value: "قميص",
    },
    {
      label: t("products.trousers"),
      value: "بنطلون",
    },
  ];

  const getLimit = () => {
    return window.innerWidth <= 768 ? 50 : 100;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: getLimit(),
        search,
      };

      if (category !== "NEW IN") {
        params.category = category;
      } else {
        params.sort = "newest";
      }

      const res = await API.get("/products", {
        params,
      });

      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, page, search]);

  const displayedProducts = products;

  return (
    <Box className="products-page">
      <Box className="category-wrapper">
        <Box className="category-bar">
          {categories.map((item) => (
            <button
              key={item.value}
              className={
                category === item.value ? "category-btn active" : "category-btn"
              }
              onClick={() => {
                setCategory(item.value);
                setPage(1);
              }}
            >
              {item.label}
            </button>
          ))}
        </Box>
      </Box>

      <Box className="section-header">
        <Typography className="section-title">
          {categories.find((item) => item.value === category)?.label ||
            category}
        </Typography>

        <Typography className="section-count">
          {displayedProducts.length} {t("products.products")}
        </Typography>
      </Box>

      {loading ? (
        <Box className="loading-box">
          <CircularProgress size={45} />
        </Box>
      ) : displayedProducts.length === 0 ? (
        <Box className="empty-products">
          <Typography className="empty-title">
            {t("products.noProducts")}
          </Typography>

          <Typography className="empty-text">
            {t("products.noProductsText")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} className="products-grid">
          {products.map((product) => (
            <Grid
              size={{
                xs: 6,
                sm: 4,
                md: 3,
              }}
              key={product.id}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && pages > 1 && (
        <Box className="arrow-pagination">
          <button
            className="page-arrow"
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            <ArrowBackIosNew />
          </button>

          <button
            className="page-arrow"
            disabled={page === pages}
            onClick={() => {
              setPage(page + 1);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            <ArrowForwardIos />
          </button>
        </Box>
      )}
    </Box>
  );
}
