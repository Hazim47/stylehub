import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import API from "../api/axios";

function Hero() {
  const { t } = useTranslation();

  const [homepage, setHomepage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await API.get("/homepage");

        setHomepage(res.data);
      } catch (error) {
        console.error("FAILED TO FETCH HOMEPAGE:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return null;

    // الرابط كامل
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // الرابط يبدأ بـ /
    if (image.startsWith("/")) {
      return `${API.defaults.baseURL}${image}`;
    }

    // فقط اسم الملف
    return `${API.defaults.baseURL}/uploads/homepage/${image}`;
  };

  const heroImage1 = getImageUrl(homepage?.heroImage1);
  const heroImage2 = getImageUrl(homepage?.heroImage2);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#060806",
      }}
    >
      {/* =====================================================
    IMAGES
===================================================== */}

      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        {/* HERO 1 */}

        <Box
          sx={{
            width: "50%",
            overflow: "hidden",
            lineHeight: 0,
          }}
        >
          {heroImage1 && (
            <Box
              component="img"
              src={heroImage1}
              alt="StyleHub"
              onError={(e) => {
                console.error("HERO IMAGE 1 FAILED:", heroImage1);
                e.currentTarget.style.display = "none";
              }}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "initial",

                transition: "transform 1.2s",

                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          )}
        </Box>

        {/* HERO 2 */}

        <Box
          sx={{
            width: "50%",
            overflow: "hidden",
            lineHeight: 0,
          }}
        >
          {heroImage2 && (
            <Box
              component="img"
              src={heroImage2}
              alt="StyleHub"
              onError={(e) => {
                console.error("HERO IMAGE 2 FAILED:", heroImage2);
                e.currentTarget.style.display = "none";
              }}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "initial",

                transition: "transform 1.2s",

                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          )}
        </Box>
      </Box>
      {/* =====================================================
          CONTENT
      ===================================================== */}

      <Box
        sx={{
          position: "absolute",

          top: "50%",
          left: "50%",

          transform: "translate(-50%, -50%)",

          textAlign: "center",

          color: "#fff",

          width: {
            xs: "90%",
            sm: "85%",
            md: "70%",
            lg: "65%",
          },
        }}
      >
        {/* LOGO */}

        <Typography
          sx={{
            fontSize: {
              xs: "40px",
              sm: "48px",
              md: "58px",
              lg: "64px",
            },

            fontWeight: 900,

            letterSpacing: {
              xs: "4px",
              md: "6px",
            },

            mb: 2,
          }}
        >
          STYLEHUB
        </Typography>

        {/* DESCRIPTION */}

        <Typography
          sx={{
            fontSize: {
              xs: "16px",
              sm: "17px",
              md: "19px",
              lg: "21px",
            },

            color: "#ddd",

            lineHeight: 1.8,

            maxWidth: "620px",

            mx: "auto",
          }}
        >
          {t("hero.description")}
        </Typography>

        {/* =====================================================
            BUTTONS
        ===================================================== */}

        <Box
          sx={{
            mt: 4,

            display: "flex",

            justifyContent: "center",

            gap: 2,

            flexWrap: "wrap",
          }}
        >
          {/* SHOP NOW */}

          <Button
            component={Link}
            to="/products"
            sx={{
              background: "#556B2F",

              color: "#fff",

              px: {
                xs: 4,
                md: 5,
              },

              py: {
                xs: 1.4,
                md: 1.7,
              },

              fontSize: {
                xs: "15px",
                md: "16px",
              },

              fontWeight: 700,

              borderRadius: "40px",

              textTransform: "none",

              boxShadow: "0 12px 30px rgba(0,0,0,.35)",

              transition: ".3s",

              "&:hover": {
                background: "#718B3E",

                transform: "translateY(-3px)",
              },
            }}
          >
            {t("hero.shopNow")}
          </Button>

          {/* DISCOVER */}

          <Button
            component={Link}
            to="/products"
            variant="outlined"
            sx={{
              borderColor: "#fff",

              color: "#fff",

              px: {
                xs: 4,
                md: 5,
              },

              py: {
                xs: 1.4,
                md: 1.7,
              },

              borderRadius: "40px",

              fontSize: {
                xs: "15px",
                md: "16px",
              },

              fontWeight: 700,

              textTransform: "none",

              transition: ".3s",

              "&:hover": {
                background: "#fff",

                color: "#000",

                borderColor: "#fff",

                transform: "translateY(-3px)",
              },
            }}
          >
            {t("hero.discover")}
          </Button>
        </Box>
      </Box>

      {/* =====================================================
          BOTTOM BLUR
      ===================================================== */}

      <Box
        sx={{
          position: "absolute",

          bottom: 0,

          width: "100%",

          height: "120px",

          background: "linear-gradient(to top,#060806,transparent)",

          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

export default Hero;
