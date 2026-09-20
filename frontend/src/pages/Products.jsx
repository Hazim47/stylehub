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

  // =========================================================
  // READ SEARCH + CATEGORY FROM URL
  // =========================================================

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category");

    setSearch(urlSearch);

    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory("NEW IN");
    }
  }, [searchParams]);

  // =========================================================
  // RESET PAGE WHEN SEARCH OR CATEGORY CHANGES
  // =========================================================

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  // =========================================================
  // LIMIT
  // =========================================================

  const getLimit = () => {
    return window.innerWidth <= 768 ? 50 : 100;
  };

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: getLimit(),
        search,
      };

      // NEW IN = newest products
      if (category !== "NEW IN") {
        params.category = category;
      } else {
        params.sort = "newest";
      }

      console.log("Products params:", params);

      const res = await API.get("/products", {
        params,
      });

      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.log("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    loadProducts();
  }, [category, page, search]);

  // =========================================================
  // DISPLAYED PRODUCTS
  // =========================================================

  const displayedProducts = products;

  // =========================================================
  // PAGE TITLE
  // =========================================================

  const getCategoryTitle = () => {
    if (search) {
      return `"${search}"`;
    }

    return category;
  };

  return (
    <Box className="products-page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box className="section-header">
        <Typography className="section-title">{getCategoryTitle()}</Typography>

        <Typography className="section-count">
          {displayedProducts.length} {t("products.products")}
        </Typography>
      </Box>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

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

      {/* =====================================================
          PAGINATION
      ====================================================== */}

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
