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

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API.defaults.baseURL}${image}`;
    }

    return `${API.defaults.baseURL}/uploads/homepage/${image}`;
  };

  const heroImage1 = getImageUrl(homepage?.heroImage1);
  const heroImage2 = getImageUrl(homepage?.heroImage2);

  console.log("HOMEPAGE DATA:", homepage);
  console.log("HERO IMAGE 1:", heroImage1);
  console.log("HERO IMAGE 2:", heroImage2);
  console.log("BASE URL:", API.defaults.baseURL);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#060806",
      }}
    >
      {/* HERO IMAGES */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: {
            xs: "420px",
            sm: "480px",
            md: "560px",
            lg: "620px",
          },
        }}
      >
        {/* LEFT IMAGE */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
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
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition: "center center",
                transition: "transform 1.2s",

                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            />
          )}
        </Box>

        {/* RIGHT IMAGE */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
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
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition: "center center",
                transition: "transform 1.2s",

                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            />
          )}
        </Box>
      </Box>

      {/* DARK OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.45))",
          pointerEvents: "none",
        }}
      />

      {/* CENTER CONTENT */}
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
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "38px",
              sm: "48px",
              md: "60px",
              lg: "68px",
            },
            fontWeight: 900,
            letterSpacing: {
              xs: "3px",
              md: "6px",
            },
            mb: 2,
            textShadow: "0 4px 20px rgba(0,0,0,.7)",
          }}
        >
          STYLEHUB
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "15px",
              sm: "17px",
              md: "19px",
              lg: "21px",
            },
            color: "#fff",
            lineHeight: 1.8,
            maxWidth: "620px",
            mx: "auto",
            textShadow: "0 3px 12px rgba(0,0,0,.8)",
          }}
        >
          {t("hero.description")}
        </Typography>

        {/* BUTTONS */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
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
              boxShadow: "0 12px 30px rgba(0,0,0,.45)",
              transition: ".3s",

              "&:hover": {
                background: "#718B3E",
                transform: "translateY(-3px)",
              },
            }}
          >
            {t("hero.shopNow")}
          </Button>

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
              background: "rgba(0,0,0,.15)",

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

      {/* BOTTOM GRADIENT */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "140px",
          background: "linear-gradient(to top, #060806, transparent)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </Box>
  );
}

export default Hero;
