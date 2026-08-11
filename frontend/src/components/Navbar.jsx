import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  InputBase,
  Button,
} from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ProfileMenu from "../components/ProfileMenu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import api from "../api/axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import useCartStore from "../store/cartStore";
import { useTranslation } from "react-i18next";
function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const isMobile = useMediaQuery("(max-width:900px)");
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mobileSearch, setMobileSearch] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [notificationCount, setNotificationCount] = useState(0);
  const showHome = location.pathname !== "/";
  const [showNavbar, setShowNavbar] = useState(true);
  const isMobileSearch = isMobile && location.pathname === "/products";
  const { t, i18n } = useTranslation();
  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll) {
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
    }, 5000); // كل 5 ثواني

    return () => clearInterval(interval);
  }, []);

  // Sync input with URL
  // ===============================
  // SYNC SEARCH WITH URL
  // ===============================
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    setSearch((current) => {
      if (current === urlSearch) return current;
      return urlSearch;
    });
  }, [searchParams]);

  // ===============================
  // HANDLE SEARCH
  // ===============================
  useEffect(() => {
    const value = search.trim();

    const timer = setTimeout(() => {
      // =========================
      // SEARCH HAS VALUE
      // =========================
      if (value) {
        const currentUrlSearch = searchParams.get("search") || "";

        // لا تعمل navigate إذا الرابط أصلًا صحيح
        if (location.pathname !== "/products" || currentUrlSearch !== value) {
          navigate(`/products?search=${encodeURIComponent(value)}`, {
            replace: true,
          });
        }

        return;
      }

      // =========================
      // SEARCH CLEARED
      // =========================
      if (location.pathname === "/products" && searchParams.has("search")) {
        navigate("/products", {
          replace: true,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, searchParams, location.pathname, navigate]);
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "#fff",

        color: "#000",

        zIndex: 1200,

        height: {
          xs: location.pathname === "/" && !mobileSearch ? "55px" : "110px",
          md: "70px",
        },

        justifyContent: "center",

        borderBottom: "1px solid #e8e8e8",

        boxShadow: "0 5px 25px rgba(0,0,0,.05)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs:
              location.pathname === "/" && !mobileSearch
                ? "55px !important"
                : "110px !important",
            md: "70px !important",
          },

          px: {
            xs: 1.5,
            md: 5,
          },

          display: "flex",

          justifyContent: "space-between",

          gap: {
            xs: 1,
            md: 3,
          },

          overflow: "visible",
        }}
      >
        {isMobileSearch && (
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              border: "1px solid #ddd",
              width: 38,
              height: 38,
              color: "#000",
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}
        {/* LOGO */}

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
              xs: "20px",
              md: "32px",
            },

            fontWeight: 900,

            letterSpacing: {
              xs: 2,
              md: 3,
            },

            color: "#000",

            textDecoration: "none",

            lineHeight: 1,
          }}
        >
          STYLEHUB
        </Typography>
        {/* MOBILE SEARCH BUTTON */}
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

              border: "1px solid #ddd",
              width: 38,
              height: 38,
              color: "#000",
            }}
          >
            <SearchIcon />
          </IconButton>
        )}
        {/* SEARCH */}
        <Box
          sx={{
            display: {
              xs: isMobileSearch ? "flex" : "none",
              md: "flex",
            },
            position: "static",
            flex: 1,
            mx: {
              xs: 1,
              md: 0,
            },

            width: {
              xs: "calc(100% - 24px)",
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

              "& input::placeholder": {
                color: "#999",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* MENU */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 0.3,
              md: 1,
            },
          }}
        >
          {" "}
          <Box
            sx={{
              display: {
                xs: isMobileSearch ? "none" : "flex",
                md: "flex",
              },
              alignItems: "center",
              gap: 1,
            }}
          >
            {showHome && (
              <Button
                component={Link}
                to="/"
                startIcon={<HomeOutlinedIcon />}
                sx={{
                  color: "#000",

                  fontWeight: 700,

                  fontSize: 16,

                  textTransform: "none",

                  borderRadius: 30,

                  px: 2,

                  "&:hover": {
                    background: "#000",

                    color: "#fff",
                  },
                }}
              >
                {t("navbar.home")}
              </Button>
            )}

            <IconButton
              component={Link}
              to="/products"
              sx={{
                width: {
                  xs: 38,
                  md: 44,
                },

                height: {
                  xs: 38,
                  md: 44,
                },
                border: "1px solid #ddd",
                color: "#000",
                transition: ".3s",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <StorefrontOutlinedIcon sx={{ fontSize: 24 }} />
            </IconButton>

            <IconButton
              component={Link}
              to="/cart"
              sx={{
                width: {
                  xs: 38,
                  md: 44,
                },

                height: {
                  xs: 38,
                  md: 44,
                },

                border: "1px solid #ddd",

                color: "#000",

                transition: ".3s",

                "&:hover": {
                  background: "#000",

                  color: "#fff",

                  transform: "translateY(-3px)",
                },
              }}
            >
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCartOutlinedIcon
                  sx={{
                    fontSize: 24,
                  }}
                />
              </Badge>
            </IconButton>
            <IconButton
              component={Link}
              to="/favorites"
              sx={{
                width: {
                  xs: 38,
                  md: 44,
                },

                height: {
                  xs: 38,
                  md: 44,
                },

                border: "1px solid #ddd",

                color: "#000",

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
                  fontSize: 24,
                }}
              />
            </IconButton>
            <IconButton
              component={Link}
              to="/notifications"
              sx={{
                width: {
                  xs: 38,
                  md: 44,
                },

                height: {
                  xs: 38,
                  md: 44,
                },
                border: "1px solid #ddd",
                color: "#000",
                transition: ".3s",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsNoneOutlinedIcon
                  sx={{
                    fontSize: 24,
                  }}
                />
              </Badge>
            </IconButton>
            <Button
              onClick={() => {
                const newLang = i18n.language === "ar" ? "en" : "ar";
                i18n.changeLanguage(newLang);
              }}
              sx={{
                minWidth: 45,
                height: 38,
                border: "1px solid #ddd",
                borderRadius: "25px",
                color: "#000",
                fontWeight: 700,
                textTransform: "none",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                },
              }}
            >
              {i18n.language === "ar" ? "EN" : "AR"}
            </Button>
          </Box>
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
