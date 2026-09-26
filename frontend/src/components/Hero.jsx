import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import API from "../api/axios";

function Hero() {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  const [heroVideo, setHeroVideo] = useState("/videos/hero.mp4");

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await API.get("/homepage");

        if (res.data?.heroVideo) {
          setHeroVideo(res.data.heroVideo);
        }
      } catch (error) {
        console.error("Failed to load hero video:", error);
      }
    };

    fetchHomepage();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: "620px",
            sm: "650px",
            md: "700px",
            lg: "720px",
          },
          overflow: "hidden",
          background: "#050505",
        }}
      >
        {/* =====================================================
            HERO VIDEO
        ====================================================== */}

        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={heroVideo}
          sx={{
            position: "absolute",
            inset: 0,

            width: "100%",
            height: "100%",

            objectFit: "cover",

            objectPosition: "center center",

            display: "block",

            zIndex: 1,
          }}
        />

        {/* =====================================================
            MAIN DARK GRADIENT
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",
            inset: 0,

            background: `
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.10) 0%,
                rgba(0,0,0,0.02) 35%,
                rgba(0,0,0,0.18) 58%,
                rgba(0,0,0,0.82) 100%
              )
            `,

            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* =====================================================
            LEFT GRADIENT
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",
            inset: 0,

            background: `
              linear-gradient(
                90deg,
                rgba(0,0,0,.45) 0%,
                rgba(0,0,0,.12) 30%,
                transparent 65%
              )
            `,

            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* =====================================================
            TOP FADE
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",

            top: 0,
            left: 0,
            right: 0,

            height: {
              xs: "80px",
              md: "110px",
            },

            background:
              "linear-gradient(to bottom, rgba(0,0,0,.35), transparent)",

            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* =====================================================
            FRAME
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",

            inset: {
              xs: "14px",
              sm: "20px",
              md: "25px",
            },

            border: "1px solid rgba(255,255,255,.17)",

            pointerEvents: "none",
            zIndex: 4,

            "&::before": {
              content: '""',

              position: "absolute",

              top: "-1px",
              left: "-1px",

              width: {
                xs: "50px",
                md: "65px",
              },

              height: {
                xs: "50px",
                md: "65px",
              },

              borderTop: "2px solid rgba(255,255,255,.75)",
              borderLeft: "2px solid rgba(255,255,255,.75)",
            },

            "&::after": {
              content: '""',

              position: "absolute",

              bottom: "-1px",
              right: "-1px",

              width: {
                xs: "50px",
                md: "65px",
              },

              height: {
                xs: "50px",
                md: "65px",
              },

              borderBottom: "2px solid rgba(255,255,255,.75)",
              borderRight: "2px solid rgba(255,255,255,.75)",
            },
          }}
        />

        {/* =====================================================
            TOP LEFT
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",

            top: {
              xs: "38px",
              md: "48px",
            },

            left: {
              xs: "28px",
              md: "50px",
            },

            display: "flex",
            alignItems: "center",

            gap: 1.5,

            color: "#fff",

            zIndex: 5,
          }}
        >
          <Box
            sx={{
              width: "28px",
              height: "1px",
              background: "#fff",
              opacity: 0.8,
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: "8px",
                md: "10px",
              },

              letterSpacing: "3px",
              fontWeight: 600,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            {t("hero.newCollection")}
          </Typography>
        </Box>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",

            left: isRTL
              ? "auto"
              : {
                  xs: "28px",
                  sm: "45px",
                  md: "60px",
                  lg: "75px",
                },

            right: isRTL
              ? {
                  xs: "28px",
                  sm: "45px",
                  md: "60px",
                  lg: "75px",
                }
              : "auto",

            bottom: {
              xs: "45px",
              sm: "45px",
              md: "50px",
              lg: "55px",
            },

            width: {
              xs: "calc(100% - 56px)",
              sm: "470px",
              md: "520px",
              lg: "560px",
            },

            color: "#fff",
            textAlign: isRTL ? "right" : "left",
            zIndex: 5,
          }}
        >
          {/* SMALL STATEMENT */}

          <Typography
            sx={{
              fontSize: {
                xs: "10px",
                sm: "11px",
                md: "12px",
              },

              letterSpacing: {
                xs: "3px",
                md: "5px",
              },

              fontWeight: 500,

              color: "rgba(255,255,255,.72)",

              textTransform: "uppercase",

              mb: {
                xs: 1.2,
                md: 1.5,
              },
            }}
          >
            {t("hero.statement")}
          </Typography>

          {/* MAIN TITLE */}

          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "34px",
                sm: "43px",
                md: "52px",
                lg: "58px",
              },

              lineHeight: 1.02,

              fontWeight: 700,

              letterSpacing: {
                xs: "1px",
                md: "2px",
              },

              color: "#070000",

              textTransform: "uppercase",

              textShadow: "0 5px 20px rgba(0,0,0,.75)",

              maxWidth: {
                xs: "330px",
                md: "500px",
              },

              mb: {
                xs: 1.5,
                md: 2,
              },
            }}
          >
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}
          </Typography>

          {/* THIN LINE */}

          <Box
            sx={{
              width: {
                xs: "55px",
                md: "75px",
              },

              height: "1px",

              background: "#fff",

              mb: {
                xs: 1.5,
                md: 2,
              },
            }}
          />

          {/* DESCRIPTION */}

          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "13px",
                md: "14px",
              },

              lineHeight: 1.65,

              maxWidth: {
                xs: "320px",
                sm: "430px",
                md: "500px",
              },

              color: "rgba(255,255,255,.78)",

              textShadow: "0 2px 12px rgba(0,0,0,.8)",

              mb: {
                xs: 2,
                md: 2.5,
              },
            }}
          >
            {t("hero.description")}
          </Typography>

          {/* BUTTONS */}

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            {/* SHOP NOW */}

            <Button
              component={Link}
              to="/products"
              sx={{
                minWidth: {
                  xs: "125px",
                  sm: "140px",
                },

                height: {
                  xs: "42px",
                  md: "45px",
                },

                px: 2.5,

                background: "#fff",
                color: "#000",

                borderRadius: 0,

                fontSize: {
                  xs: "10px",
                  md: "11px",
                },

                fontWeight: 800,

                letterSpacing: "1.5px",

                textTransform: "uppercase",

                transition: ".3s",

                "&:hover": {
                  background: "#000",
                  color: "#fff",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t("hero.shopNow")}
            </Button>

            {/* DISCOVER */}

            <Button
              component={Link}
              to="/products"
              sx={{
                minWidth: {
                  xs: "125px",
                  sm: "140px",
                },

                height: {
                  xs: "42px",
                  md: "45px",
                },

                px: 2.5,

                background: "rgba(0,0,0,.15)",

                color: "#fff",

                border: "1px solid rgba(255,255,255,.75)",

                borderRadius: 0,

                fontSize: {
                  xs: "10px",
                  md: "11px",
                },

                fontWeight: 700,

                letterSpacing: "1.5px",

                textTransform: "uppercase",

                backdropFilter: "blur(4px)",

                transition: ".3s",

                "&:hover": {
                  background: "#fff",
                  color: "#000",
                  borderColor: "#fff",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t("hero.discover")}
            </Button>
          </Box>
        </Box>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",

            right: isRTL
              ? "auto"
              : {
                  md: "28px",
                  lg: "45px",
                },

            left: isRTL
              ? {
                  md: "28px",
                  lg: "45px",
                }
              : "auto",

            bottom: {
              md: "45px",
              lg: "48px",
            },

            display: {
              xs: "none",
              md: "flex",
            },

            alignItems: "center",

            gap: 1.5,

            color: "rgba(255,255,255,.65)",

            zIndex: 5,
          }}
        >
          <Typography
            sx={{
              fontSize: "8px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {t("hero.location")}
          </Typography>

          <Box
            sx={{
              width: "25px",
              height: "1px",
              background: "rgba(255,255,255,.5)",
            }}
          />

          <Typography
            sx={{
              fontSize: "8px",
              letterSpacing: "2px",
            }}
          >
            2026
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
