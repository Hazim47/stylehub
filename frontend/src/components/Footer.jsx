import { Box, Typography, Grid, IconButton } from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  const storeLinks = [
    {
      icon: HomeOutlinedIcon,
      path: "/",
      title: t("home"),
    },
    {
      icon: ShoppingBagOutlinedIcon,
      path: "/products",
      title: t("product"),
    },
    {
      icon: ShoppingCartOutlinedIcon,
      path: "/cart",
      title: t("carts"),
    },
  ];

  const socialLinks = [
    {
      icon: InstagramIcon,
      link: "https://www.instagram.com/hazim_alqaralleh/?hl=ar",
      label: "Instagram",
    },
    {
      icon: FacebookIcon,
      link: "https://www.facebook.com/hazim.al.qaralleh?locale=ar_AR",
      label: "Facebook",
    },
    {
      icon: WhatsAppIcon,
      link: "https://wa.me/962782333118",
      label: "WhatsApp",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 7, md: 10 },
        background: "#fff",
        color: "#111",
        borderTop: "1px solid #e8e8e8",
      }}
    >
      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 3, sm: 5, md: 7, lg: 9 },
          pt: { xs: 5, md: 7 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Grid container spacing={{ xs: 5, md: 8 }}>
          {/* =================================================
              BRAND
          ================================================== */}

          <Grid item xs={12} md={5}>
            <Typography
              component={Link}
              to="/"
              sx={{
                display: "inline-block",
                color: "#111",
                textDecoration: "none",
                fontSize: { xs: 34, md: 42 },
                fontWeight: 1000,
                letterSpacing: { xs: 5, md: 7 },
                lineHeight: 1,
              }}
            >
              ZYA
            </Typography>

            {/* SMALL LINE */}

            <Box
              sx={{
                width: 42,
                height: 2,
                background: "#111",
                mt: 2,
                mb: 2.2,
              }}
            />

            <Typography
              sx={{
                maxWidth: 390,
                color: "#666",
                fontSize: { xs: 13, md: 14 },
                lineHeight: 1.9,
              }}
            >
              {t("footer.description")}
            </Typography>

            {/* SOCIAL */}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 3,
              }}
            >
              {socialLinks.map(({ icon: Icon, link, label }) => (
                <IconButton
                  key={link}
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    width: 38,
                    height: 38,
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    color: "#222",
                    transition: "all .25s ease",

                    "& svg": {
                      fontSize: 18,
                    },

                    "&:hover": {
                      background: "#111",
                      color: "#fff",
                      borderColor: "#111",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* =================================================
              STORE
          ================================================== */}

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.5,
                mb: 2.5,
                textTransform: "uppercase",
              }}
            >
              {t("footer.store")}
            </Typography>

            <Box>
              {storeLinks.map(({ icon: Icon, path, title }) => (
                <Box
                  key={path}
                  component={Link}
                  to={path}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    maxWidth: 190,
                    py: 0.8,
                    color: "#666",
                    textDecoration: "none",
                    transition: "all .25s ease",

                    "& .footer-link-left": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    },

                    "& .footer-arrow": {
                      opacity: 0,
                      transform: "translateX(-4px)",
                      transition: "all .25s ease",
                    },

                    "&:hover": {
                      color: "#111",
                    },

                    "&:hover .footer-arrow": {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  }}
                >
                  <Box className="footer-link-left">
                    <Icon
                      sx={{
                        fontSize: 19,
                        color: "inherit",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "inherit",
                      }}
                    >
                      {title}
                    </Typography>
                  </Box>

                  <ArrowForwardIosIcon
                    className="footer-arrow"
                    sx={{
                      fontSize: 11,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* =================================================
              CONTACT
          ================================================== */}

          <Grid item xs={12} sm={6} md={4}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.5,
                mb: 2.5,
                textTransform: "uppercase",
              }}
            >
              {t("footer.contact")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.4,
              }}
            >
              {/* PHONE */}

              <Box>
                <Typography
                  sx={{
                    color: "#999",
                    fontSize: 11,
                    letterSpacing: 1,
                    mb: 0.3,
                    textTransform: "uppercase",
                  }}
                >
                  {t("footer.phone")}
                </Typography>

                <Typography
                  component="a"
                  href="tel:+962782333118"
                  sx={{
                    color: "#444",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: ".2s",

                    "&:hover": {
                      color: "#000",
                    },
                  }}
                >
                  078 233 3118
                </Typography>
              </Box>

              {/* EMAIL */}

              <Box>
                <Typography
                  sx={{
                    color: "#999",
                    fontSize: 11,
                    letterSpacing: 1,
                    mb: 0.3,
                    textTransform: "uppercase",
                  }}
                >
                  {t("footer.email")}
                </Typography>

                <Typography
                  component="a"
                  href="mailto:support@zya.com"
                  sx={{
                    color: "#444",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: ".2s",

                    "&:hover": {
                      color: "#000",
                    },
                  }}
                >
                  support@zya.com
                </Typography>
              </Box>

              {/* LOCATION */}

              <Box>
                <Typography
                  sx={{
                    color: "#999",
                    fontSize: 11,
                    letterSpacing: 1,
                    mb: 0.3,
                    textTransform: "uppercase",
                  }}
                >
                  {t("footer.location")}
                </Typography>

                <Typography
                  sx={{
                    color: "#444",
                    fontSize: 14,
                  }}
                >
                  {t("footer.country")}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* =====================================================
          BOTTOM
      ====================================================== */}

      <Box
        sx={{
          borderTop: "1px solid #eee",
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: { xs: 3, sm: 5, md: 7, lg: 9 },
            py: 2.3,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            sx={{
              color: "#999",
              fontSize: 11,
              letterSpacing: 0.5,
            }}
          >
            © 2026 ZYA — {t("footer.rights")}
          </Typography>

          <Typography
            sx={{
              color: "#aaa",
              fontSize: 10,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            {t("footer.fashion")} · {t("footer.style")} · ZYA
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
