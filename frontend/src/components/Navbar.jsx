import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  InputBase,
  Button,
  useMediaQuery,
} from "@mui/material";

import { FavoriteBorder } from "@mui/icons-material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import ProfileMenu from "../components/ProfileMenu";

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../api/axios";

import { useEffect, useState } from "react";

import useCartStore from "../store/cartStore";
import { useTranslation } from "react-i18next";

function Navbar() {
  const cart = useCartStore((state) => state.cart);

  const isMobile = useMediaQuery("(max-width:900px)");
  const isSmallMobile = useMediaQuery("(max-width:380px)");

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mobileSearch, setMobileSearch] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [notificationCount, setNotificationCount] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);

  const showHome = location.pathname !== "/";

  const isMobileSearch = isMobile && location.pathname === "/products";

  const { t, i18n } = useTranslation();

  // =========================================================
  // HIDE / SHOW NAVBAR WHILE SCROLLING
  // =========================================================

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!user) {
          setNotificationCount(0);
          return;
        }

        const res = await api.get(`/notifications/${user.id}`);

        const unread = res.data.filter((n) => !n.isRead).length;

        setNotificationCount(unread);
      } catch (err) {
        console.log(err);
      }
    };

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // SYNC SEARCH WITH URL
  // =========================================================

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    setSearch((current) => {
      if (current === urlSearch) {
        return current;
      }

      return urlSearch;
    });
  }, [searchParams]);

  // =========================================================
  // HANDLE SEARCH
  // =========================================================

  useEffect(() => {
    const value = search.trim();

    const timer = setTimeout(() => {
      // SEARCH HAS VALUE
      if (value) {
        const currentUrlSearch = searchParams.get("search") || "";

        if (location.pathname !== "/products" || currentUrlSearch !== value) {
          navigate(`/products?search=${encodeURIComponent(value)}`, {
            replace: true,
          });
        }

        return;
      }

      // SEARCH CLEARED
      if (location.pathname === "/products" && searchParams.has("search")) {
        navigate("/products", {
          replace: true,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, searchParams, location.pathname, navigate]);

  // =========================================================
  // RESPONSIVE SIZES
  // =========================================================

  const mobileIconSize = isSmallMobile ? 31 : 34;
  const mobileIconFontSize = isSmallMobile ? 19 : 20;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "#fff",
        color: "#000",
        zIndex: 1200,

        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        overflow: "hidden",

        height: {
          xs: location.pathname === "/" && !mobileSearch ? "55px" : "110px",
          md: "70px",
        },

        justifyContent: "center",

        borderBottom: "1px solid #e8e8e8",

        boxShadow: "0 5px 25px rgba(0,0,0,.05)",

        transition: "transform .25s ease",

        transform:
          !showNavbar && isMobile ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: {
            xs:
              location.pathname === "/" && !mobileSearch
                ? "55px !important"
                : "110px !important",
            md: "70px !important",
          },

          width: "100%",
          maxWidth: "100%",
          minWidth: 0,

          px: {
            xs: isSmallMobile ? 0.7 : 1,
            md: 5,
          },

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: {
            xs: 0.4,
            md: 3,
          },

          overflow: "hidden",

          "& > *": {
            minWidth: 0,
          },
        }}
      >
        {/* =====================================================
            MOBILE SEARCH BACK BUTTON
        ===================================================== */}

        {isMobileSearch && (
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },

              flexShrink: 0,

              width: {
                xs: mobileIconSize,
                md: 38,
              },

              height: {
                xs: mobileIconSize,
                md: 38,
              },

              minWidth: 0,

              border: "1px solid #ddd",

              color: "#000",

              p: 0,
            }}
          >
            <ArrowBackIosNewIcon
              sx={{
                fontSize: isSmallMobile ? 16 : 18,
              }}
            />
          </IconButton>
        )}

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Typography
          component={Link}
          to="/"
          sx={{
            fontFamily: "serif",

            display: {
              xs: isMobileSearch ? "none" : "block",
              md: "block",
            },

            fontSize: {
              xs: isSmallMobile ? "18px" : "20px",
              md: "32px",
            },

            fontWeight: 900,

            letterSpacing: {
              xs: isSmallMobile ? 1 : 2,
              md: 3,
            },

            color: "#000",

            textDecoration: "none",

            lineHeight: 1,

            whiteSpace: "nowrap",

            flexShrink: 1,

            minWidth: 0,
          }}
        >
          STYLEHUB
        </Typography>

        {/* =====================================================
            MOBILE SEARCH BUTTON
        ===================================================== */}

        {location.pathname === "/" && (
          <IconButton
            onClick={() => {
              setMobileSearch(true);
              navigate("/products");
            }}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },

              flexShrink: 0,

              width: mobileIconSize,
              height: mobileIconSize,

              minWidth: 0,

              border: "1px solid #ddd",

              color: "#000",

              p: 0,
            }}
          >
            <SearchIcon
              sx={{
                fontSize: mobileIconFontSize,
              }}
            />
          </IconButton>
        )}

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <Box
          sx={{
            display: {
              xs: isMobileSearch ? "flex" : "none",
              md: "flex",
            },

            position: "static",

            flex: 1,

            minWidth: 0,

            mx: {
              xs: 0.5,
              md: 0,
            },

            width: {
              xs: "auto",
              md: 280,
              lg: 350,
            },

            height: 40,

            borderRadius: "999px",

            border: "1px solid #ececec",

            boxShadow: "none",

            background: "#fff",

            alignItems: "center",

            px: 2,

            zIndex: 1300,

            overflow: "hidden",
          }}
        >
          <SearchIcon
            sx={{
              fontSize: {
                xs: 21,
                md: 22,
              },

              color: "#555",

              mr: 1.5,

              flexShrink: 0,
            }}
          />

          <InputBase
            placeholder={t("navbar.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              fontSize: {
                xs: "14px",
                md: "15px",
              },

              width: "100%",

              minWidth: 0,

              "& input": {
                minWidth: 0,
              },

              "& input::placeholder": {
                color: "#999",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* =====================================================
            RIGHT MENU
        ===================================================== */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            justifyContent: "flex-end",

            gap: {
              xs: isSmallMobile ? 0.15 : 0.25,
              md: 1,
            },

            minWidth: 0,

            maxWidth: "100%",

            flexShrink: 1,

            overflow: "hidden",
          }}
        >
          {/* =================================================
              MAIN MENU
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: isMobileSearch ? "none" : "flex",
                md: "flex",
              },

              alignItems: "center",

              justifyContent: "flex-end",

              gap: {
                xs: isSmallMobile ? 0.15 : 0.25,
                md: 1,
              },

              minWidth: 0,

              flexShrink: 1,
            }}
          >
            {/* =================================================
                HOME
            ================================================= */}

            {showHome && (
              <Button
                component={Link}
                to="/"
                startIcon={
                  <HomeOutlinedIcon
                    sx={{
                      fontSize: {
                        xs: 19,
                        md: 24,
                      },
                    }}
                  />
                }
                sx={{
                  color: "#000",

                  fontWeight: 700,

                  fontSize: {
                    xs: 0,
                    md: 16,
                  },

                  textTransform: "none",

                  borderRadius: 30,

                  minWidth: {
                    xs: mobileIconSize,
                    md: "auto",
                  },

                  width: {
                    xs: mobileIconSize,
                    md: "auto",
                  },

                  height: {
                    xs: mobileIconSize,
                    md: "auto",
                  },

                  p: {
                    xs: 0,
                    md: "6px 16px",
                  },

                  flexShrink: 0,

                  "& .MuiButton-startIcon": {
                    margin: {
                      xs: 0,
                      md: "0 8px 0 0",
                    },
                  },

                  "&:hover": {
                    background: "#000",
                    color: "#fff",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: {
                      xs: "none",
                      md: "inline",
                    },
                  }}
                >
                  {t("navbar.home")}
                </Box>
              </Button>
            )}

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <IconButton
              component={Link}
              to="/products"
              sx={{
                width: {
                  xs: mobileIconSize,
                  md: 44,
                },

                height: {
                  xs: mobileIconSize,
                  md: 44,
                },

                minWidth: 0,

                flexShrink: 0,

                border: "1px solid #ddd",

                color: "#000",

                p: 0,

                transition: ".3s",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <StorefrontOutlinedIcon
                sx={{
                  fontSize: {
                    xs: mobileIconFontSize,
                    md: 24,
                  },
                }}
              />
            </IconButton>

            {/* =================================================
                CART
            ================================================= */}

            <IconButton
              component={Link}
              to="/cart"
              sx={{
                width: {
                  xs: mobileIconSize,
                  md: 44,
                },

                height: {
                  xs: mobileIconSize,
                  md: 44,
                },

                minWidth: 0,

                flexShrink: 0,

                border: "1px solid #ddd",

                color: "#000",

                p: 0,

                transition: ".3s",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Badge
                badgeContent={cart.length}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: {
                      xs: 8,
                      md: 10,
                    },

                    minWidth: {
                      xs: 14,
                      md: 18,
                    },

                    height: {
                      xs: 14,
                      md: 18,
                    },

                    padding: 0,
                  },
                }}
              >
                <ShoppingCartOutlinedIcon
                  sx={{
                    fontSize: {
                      xs: mobileIconFontSize,
                      md: 24,
                    },
                  }}
                />
              </Badge>
            </IconButton>

            {/* =================================================
                FAVORITES
            ================================================= */}

            <IconButton
              component={Link}
              to="/favorites"
              sx={{
                width: {
                  xs: mobileIconSize,
                  md: 44,
                },

                height: {
                  xs: mobileIconSize,
                  md: 44,
                },

                minWidth: 0,

                flexShrink: 0,

                border: "1px solid #ddd",

                color: "#000",

                p: 0,

                transition: ".3s",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <FavoriteBorder
                sx={{
                  fontSize: {
                    xs: mobileIconFontSize,
                    md: 24,
                  },
                }}
              />
            </IconButton>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <IconButton
              component={Link}
              to="/notifications"
              sx={{
                width: {
                  xs: mobileIconSize,
                  md: 44,
                },

                height: {
                  xs: mobileIconSize,
                  md: 44,
                },

                minWidth: 0,

                flexShrink: 0,

                border: "1px solid #ddd",

                color: "#000",

                p: 0,

                transition: ".3s",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Badge
                badgeContent={notificationCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: {
                      xs: 8,
                      md: 10,
                    },

                    minWidth: {
                      xs: 14,
                      md: 18,
                    },

                    height: {
                      xs: 14,
                      md: 18,
                    },

                    padding: 0,
                  },
                }}
              >
                <NotificationsNoneOutlinedIcon
                  sx={{
                    fontSize: {
                      xs: mobileIconFontSize,
                      md: 24,
                    },
                  }}
                />
              </Badge>
            </IconButton>

            {/* =================================================
                LANGUAGE
            ================================================= */}

            <Button
              onClick={() => {
                const newLang = i18n.language === "ar" ? "en" : "ar";
                i18n.changeLanguage(newLang);
              }}
              sx={{
                minWidth: {
                  xs: mobileIconSize,
                  md: 44,
                },

                width: {
                  xs: mobileIconSize,
                  md: 44,
                },

                height: {
                  xs: mobileIconSize,
                  md: 44,
                },

                border: "1px solid #ddd",

                borderRadius: "50%",

                color: "#000",

                fontWeight: 700,

                fontSize: {
                  xs: 10,
                  md: 14,
                },

                textTransform: "none",

                padding: 0,

                flexShrink: 0,

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                },
              }}
            >
              {i18n.language === "ar" ? "EN" : "AR"}
            </Button>
          </Box>

          {/* ===================================================
              PROFILE
          =================================================== */}
          <Box
            sx={{
              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              minWidth: {
                xs: 0,
                md: 125,
              },

              height: {
                xs: mobileIconSize,
                md: 44,
              },

              "& > *": {
                maxWidth: {
                  xs: "100%",
                  md: "125px",
                },

                width: {
                  xs: "auto",
                  md: "100%",
                },
              },
            }}
          >
            <ProfileMenu />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
