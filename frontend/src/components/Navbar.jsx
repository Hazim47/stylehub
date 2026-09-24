import {
  AppBar,
  Box,
  Badge,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import ProfileMenu from "../components/ProfileMenu";
import useCartStore from "../store/cartStore";
import api from "../api/axios";

import "./css/Navbar.css";

function Navbar() {
  const cart = useCartStore((state) => state.cart);

  const isMobile = useMediaQuery("(max-width: 900px)");

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const [mobilePanel, setMobilePanel] = useState(null);

  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  // =========================================================
  // MOBILE SHEET DRAG
  // =========================================================

  const [sheetY, setSheetY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);

  const sheetStartY = useRef(0);

  // =========================================================
  // CATEGORIES
  // =========================================================

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

  // =========================================================
  // CATEGORY NAVIGATION
  // =========================================================

  const handleCategory = (category) => {
    setMobilePanel(null);
    setDesktopSearchOpen(false);
    setSheetY(0);

    setSearch("");
    setSearchResults([]);

    if (category.value === "NEW IN") {
      navigate("/products");
      return;
    }

    navigate(`/products?category=${encodeURIComponent(category.value)}`);
  };

  // =========================================================
  // SYNC SEARCH WITH URL
  // =========================================================

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    setSearch(urlSearch);
  }, [searchParams]);

  // =========================================================
  // SEARCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const value = search.trim();

    if (!value) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const response = await api.get("/products", {
          params: {
            search: value,
            page: 1,
            limit: 8,
          },
        });

        setSearchResults(response.data?.products || []);
      } catch (error) {
        console.log("SEARCH ERROR:", error);

        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================================================
  // SEARCH PAGE
  // =========================================================

  const handleSearchSubmit = () => {
    const value = search.trim();

    if (!value) return;

    navigate(`/products?search=${encodeURIComponent(value)}`);

    setMobilePanel(null);
    setDesktopSearchOpen(false);
    setSheetY(0);
  };

  // =========================================================
  // OPEN PRODUCT FROM SEARCH
  // =========================================================

  const handleSearchProduct = (product) => {
    if (!product?.id) return;

    navigate(`/products/${product.id}`);

    setMobilePanel(null);
    setDesktopSearchOpen(false);
    setSheetY(0);
    setSearchResults([]);
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!user) {
          setNotificationCount(0);
          return;
        }

        const response = await api.get(`/notifications/${user.id}`);

        const unread = response.data.filter(
          (notification) => !notification.isRead,
        ).length;

        setNotificationCount(unread);
      } catch (error) {
        console.log("NOTIFICATION ERROR:", error);
      }
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // LANGUAGE
  // =========================================================

  const changeLanguage = () => {
    const newLanguage = i18n.language === "ar" ? "en" : "ar";

    i18n.changeLanguage(newLanguage);

    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
  };

  // =========================================================
  // CLOSE PANELS
  // =========================================================

  const closePanels = () => {
    setMobilePanel(null);
    setDesktopSearchOpen(false);
    setSheetY(0);
    setIsDraggingSheet(false);
  };

  // =========================================================
  // MOBILE SHEET DRAG
  // =========================================================

  const handleSheetPointerDown = (event) => {
    sheetStartY.current = event.clientY;
    setIsDraggingSheet(true);

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleSheetPointerMove = (event) => {
    if (!isDraggingSheet) return;

    const distance = event.clientY - sheetStartY.current;

    // السماح بالسحب للأسفل فقط
    if (distance > 0) {
      setSheetY(distance);
    }
  };

  const handleSheetPointerUp = (event) => {
    if (!isDraggingSheet) return;

    const distance = event.clientY - sheetStartY.current;

    setIsDraggingSheet(false);

    // إذا سحب المستخدم أكثر من 100px -> إغلاق
    if (distance > 100) {
      setSheetY(0);
      setMobilePanel(null);
      return;
    }

    // إذا كانت المسافة قليلة -> رجوع لمكانه
    setSheetY(0);
  };

  const handleSheetPointerCancel = () => {
    setIsDraggingSheet(false);
    setSheetY(0);
  };

  // =========================================================
  // PRODUCT IMAGE
  // =========================================================

  const getProductImage = (product) => {
    if (!product) return "";

    if (product.image) {
      return product.image;
    }

    if (product.imageUrl) {
      return product.imageUrl;
    }

    if (product.cloudinaryUrl) {
      return product.cloudinaryUrl;
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return (
        firstImage?.url ||
        firstImage?.image ||
        firstImage?.imageUrl ||
        firstImage?.cloudinaryUrl ||
        ""
      );
    }

    if (
      Array.isArray(product.ProductImages) &&
      product.ProductImages.length > 0
    ) {
      return (
        product.ProductImages[0]?.image || product.ProductImages[0]?.url || ""
      );
    }

    return "";
  };

  // =========================================================
  // MOBILE
  // =========================================================

  if (isMobile) {
    return (
      <>
        {/* ===================================================
            MOBILE NAVBAR
        ==================================================== */}

        <AppBar position="fixed" elevation={0} className="zya-navbar">
          <Box className="zya-mobile-navbar">
            {/* LEFT */}

            <Box className="zya-mobile-left">
              <IconButton
                onClick={() => {
                  setMobilePanel("categories");
                  setSheetY(0);
                }}
                className="zya-icon-button"
              >
                <Badge
                  badgeContent={notificationCount}
                  color="error"
                  invisible={notificationCount === 0}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "8px",
                      minWidth: 13,
                      height: 13,
                      padding: 0,
                    },
                  }}
                >
                  <MenuIcon />
                </Badge>
              </IconButton>
            </Box>

            {/* CENTER */}

            <Typography component={Link} to="/" className="zya-mobile-logo">
              ZYA
            </Typography>

            {/* RIGHT */}

            <Box className="zya-mobile-right">
              {/* SEARCH */}

              <IconButton
                onClick={() => {
                  setMobilePanel("search");
                  setSheetY(0);
                }}
                className="zya-icon-button"
              >
                <SearchIcon />
              </IconButton>

              {/* CART */}

              <IconButton
                component={Link}
                to="/cart"
                className="zya-icon-button"
              >
                <Badge
                  badgeContent={cart?.length || 0}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "8px",
                      minWidth: 13,
                      height: 13,
                      padding: 0,
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>

              {/* FAVORITES */}

              <IconButton
                component={Link}
                to="/favorites"
                className="zya-icon-button"
              >
                <FavoriteBorderOutlinedIcon />
              </IconButton>

              {/* PROFILE */}

              <Box className="zya-mobile-profile-icon">
                <ProfileMenu />
              </Box>
            </Box>
          </Box>
        </AppBar>

        {/* ===================================================
            MOBILE PANEL
        ==================================================== */}

        {mobilePanel && (
          <>
            <Box className="zya-panel-backdrop" onClick={closePanels} />

            <Box
              className="zya-mobile-sheet"
              style={{
                transform: `translateY(${sheetY}px)`,
                transition: isDraggingSheet ? "none" : "transform 0.3s ease",
              }}
            >
              {/* DRAG HANDLE */}

              <Box
                className="zya-sheet-handle"
                onPointerDown={handleSheetPointerDown}
                onPointerMove={handleSheetPointerMove}
                onPointerUp={handleSheetPointerUp}
                onPointerCancel={handleSheetPointerCancel}
              />

              <Box className="zya-sheet-header">
                <Typography className="zya-sheet-title">
                  {mobilePanel === "categories" ? "CATEGORIES" : "SEARCH"}
                </Typography>

                <IconButton onClick={closePanels} className="zya-close-button">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* =================================================
                  CATEGORIES
              ================================================== */}

              {mobilePanel === "categories" && (
                <>
                  <Box className="zya-mobile-category-list">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        className="zya-mobile-category"
                        onClick={() => handleCategory(category)}
                      >
                        <span>{category.label}</span>

                        <ArrowForwardIosIcon />
                      </button>
                    ))}
                  </Box>

                  <Box className="zya-sheet-account">
                    {/* NOTIFICATIONS */}

                    <Box
                      className="zya-account-item"
                      onClick={() => {
                        setMobilePanel(null);
                        setSheetY(0);
                        navigate("/notifications");
                      }}
                    >
                      <Badge badgeContent={notificationCount} color="error">
                        <NotificationsNoneOutlinedIcon />
                      </Badge>

                      <span>Notifications</span>
                    </Box>

                    {/* LANGUAGE */}

                    <Box className="zya-account-item" onClick={changeLanguage}>
                      <LanguageIcon />

                      <span>
                        {i18n.language === "ar" ? "English" : "العربية"}
                      </span>
                    </Box>
                  </Box>
                </>
              )}

              {/* =================================================
                  SEARCH
              ================================================== */}

              {mobilePanel === "search" && (
                <Box className="zya-search-panel">
                  <Box className="zya-search-input">
                    <SearchIcon />

                    <InputBase
                      autoFocus
                      placeholder={t("navbar.search")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchSubmit();
                        }
                      }}
                    />

                    {search && (
                      <IconButton
                        onClick={() => {
                          setSearch("");
                          setSearchResults([]);
                        }}
                        className="zya-clear-search"
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Box className="zya-search-results">
                    {!search.trim() ? (
                      <Typography className="zya-search-empty">
                        Start typing to search
                      </Typography>
                    ) : searchLoading ? (
                      <Box className="zya-search-loading">
                        <CircularProgress size={25} />
                      </Box>
                    ) : searchResults.length === 0 ? (
                      <Typography className="zya-search-empty">
                        No products found
                      </Typography>
                    ) : (
                      <>
                        {searchResults.map((product) => {
                          const image = getProductImage(product);

                          return (
                            <button
                              key={product.id}
                              type="button"
                              className="zya-search-product"
                              onClick={() => handleSearchProduct(product)}
                            >
                              <Box className="zya-search-product-image">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name || "Product"}
                                  />
                                ) : (
                                  <Box className="zya-image-placeholder" />
                                )}
                              </Box>

                              <Box className="zya-search-product-info">
                                <span className="zya-search-product-name">
                                  {product.name}
                                </span>

                                {product.price !== undefined && (
                                  <span className="zya-search-product-price">
                                    {product.price} JD
                                  </span>
                                )}
                              </Box>

                              <ArrowForwardIosIcon />
                            </button>
                          );
                        })}

                        <button
                          type="button"
                          className="zya-view-all"
                          onClick={handleSearchSubmit}
                        >
                          View all search results
                        </button>
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
      </>
    );
  }

  // =========================================================
  // DESKTOP
  // =========================================================

  return (
    <>
      <AppBar position="fixed" elevation={0} className="zya-navbar">
        <Box className="zya-desktop-navbar">
          {/* LOGO */}

          <Box className="zya-brand-area">
            <Typography component={Link} to="/" className="zya-desktop-logo">
              ZYA
            </Typography>

            <Box className="zya-logo-line" />
          </Box>

          {/* CATEGORIES */}

          <Box className="zya-desktop-categories">
            {categories.map((category) => (
              <button
                key={category.value}
                className="zya-desktop-category"
                onClick={() => handleCategory(category)}
              >
                {category.label}
              </button>
            ))}
          </Box>

          {/* ACTIONS */}

          <Box className="zya-desktop-actions">
            {/* SEARCH */}

            <IconButton
              onClick={() => setDesktopSearchOpen(true)}
              className="zya-desktop-icon"
            >
              <SearchIcon />
            </IconButton>

            {/* HOME */}

            {location.pathname !== "/" && (
              <IconButton
                component={Link}
                to="/"
                className="zya-desktop-icon"
                aria-label="Home"
              >
                <HomeOutlinedIcon />
              </IconButton>
            )}

            {/* CART */}

            <IconButton
              component={Link}
              to="/cart"
              className="zya-desktop-icon"
            >
              <Badge badgeContent={cart?.length || 0} color="error">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {/* FAVORITES */}

            <IconButton
              component={Link}
              to="/favorites"
              className="zya-desktop-icon"
            >
              <FavoriteBorderOutlinedIcon />
            </IconButton>

            {/* NOTIFICATIONS */}

            <IconButton
              component={Link}
              to="/notifications"
              className="zya-desktop-icon"
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>

            {/* LANGUAGE */}

            <button className="zya-language" onClick={changeLanguage}>
              {i18n.language === "ar" ? "EN" : "AR"}
            </button>

            {/* PROFILE */}

            <Box className="zya-desktop-profile">
              <ProfileMenu />
            </Box>
          </Box>
        </Box>
      </AppBar>

      {/* =====================================================
          DESKTOP SEARCH
      ====================================================== */}

      {desktopSearchOpen && (
        <>
          <Box className="zya-desktop-search-backdrop" onClick={closePanels} />

          <Box className="zya-desktop-search-panel">
            <Box className="zya-desktop-search-top">
              <Typography>SEARCH</Typography>

              <IconButton onClick={closePanels} className="zya-close-button">
                <CloseIcon />
              </IconButton>
            </Box>

            <Box className="zya-desktop-search-input">
              <SearchIcon />

              <InputBase
                autoFocus
                placeholder={t("navbar.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />

              {search && (
                <IconButton
                  onClick={() => {
                    setSearch("");
                    setSearchResults([]);
                  }}
                  className="zya-clear-search"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>

            <Box className="zya-search-results">
              {!search.trim() ? (
                <Typography className="zya-search-empty">
                  Start typing to search
                </Typography>
              ) : searchLoading ? (
                <Box className="zya-search-loading">
                  <CircularProgress size={27} />
                </Box>
              ) : searchResults.length === 0 ? (
                <Typography className="zya-search-empty">
                  No products found
                </Typography>
              ) : (
                <>
                  {searchResults.map((product) => {
                    const image = getProductImage(product);

                    return (
                      <button
                        key={product.id}
                        type="button"
                        className="zya-search-product"
                        onClick={() => handleSearchProduct(product)}
                      >
                        <Box className="zya-search-product-image">
                          {image ? (
                            <img src={image} alt={product.name || "Product"} />
                          ) : (
                            <Box className="zya-image-placeholder" />
                          )}
                        </Box>

                        <Box className="zya-search-product-info">
                          <span className="zya-search-product-name">
                            {product.name}
                          </span>

                          {product.price !== undefined && (
                            <span className="zya-search-product-price">
                              {product.price} JD
                            </span>
                          )}
                        </Box>

                        <ArrowForwardIosIcon />
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="zya-view-all"
                    onClick={handleSearchSubmit}
                  >
                    View all search results
                  </button>
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default Navbar;
