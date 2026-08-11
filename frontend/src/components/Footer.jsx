import { Box, Typography, Grid, IconButton, Divider } from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        background: "#fff",

        color: "#000",

        px: { xs: 3, md: 7 },

        pt: 5,

        pb: 2,

        mt: 8,

        borderTop: "1px solid #eee",
      }}
    >
      <Grid container spacing={4}>
        {/* BRAND */}

        <Grid item xs={12} md={5}>
          <Typography
            sx={{
              fontSize: { xs: 32, md: 38 },

              fontWeight: 1000,

              letterSpacing: 4,
            }}
          >
            StyleHub
          </Typography>

          <Typography
            sx={{
              mt: 1.5,

              color: "#777",

              fontSize: 14,

              lineHeight: 1.8,

              maxWidth: 330,
            }}
          >
            {t("footer.description")}
          </Typography>

          <Box mt={2.5} display="flex" gap={1}>
            {[
              {
                icon: InstagramIcon,

                link: "https://www.instagram.com/hazim_alqaralleh/?hl=ar",
              },

              {
                icon: FacebookIcon,

                link: "https://www.facebook.com/hazim.al.qaralleh?locale=ar_AR",
              },

              {
                icon: WhatsAppIcon,

                link: "https://wa.me/962782333118",
              },
            ].map(({ icon: Icon, link }) => (
              <IconButton
                key={link}
                component="a"
                href={link}
                target="_blank"
                sx={{
                  width: 38,

                  height: 38,

                  border: "1px solid #ddd",

                  color: "#111",

                  transition: ".3s",

                  "&:hover": {
                    background: "#000",

                    color: "#fff",

                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Icon sx={{ fontSize: 19 }} />
              </IconButton>
            ))}
          </Box>
        </Grid>

        {/* LINKS */}

        <Grid item xs={12} sm={6} md={3}>
          <Typography
            sx={{
              fontSize: 18,

              fontWeight: 900,

              mb: 2,
            }}
          >
            {t("footer.store")}
          </Typography>

          {[
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
          ].map(({ icon: Icon, path, title }) => (
            <Box
              key={path}
              component={Link}
              to={path}
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.2,

                mb: 1.3,

                textDecoration: "none",

                color: "#666",

                transition: ".3s",

                "&:hover": {
                  color: "#000",

                  transform: "translateX(5px)",
                },
              }}
            >
              <Icon sx={{ fontSize: 20 }} />

              <Typography
                sx={{
                  fontSize: 14,
                }}
              >
                {title}
              </Typography>
            </Box>
          ))}
        </Grid>

        {/* CONTACT */}

        <Grid item xs={12} sm={6} md={3}>
          <Typography
            sx={{
              fontSize: 18,

              fontWeight: 900,

              mb: 2,
            }}
          >
            {t("footer.contact")}
          </Typography>

          <Typography
            sx={{
              color: "#666",

              fontSize: 14,

              mb: 1.2,
            }}
          >
            📞 0782333118
          </Typography>

          <Typography
            sx={{
              color: "#666",

              fontSize: 14,

              mb: 1.2,
            }}
          >
            ✉ support@stylehub.com
          </Typography>

          <Typography
            sx={{
              color: "#666",

              fontSize: 14,
            }}
          >
            📍 {t("footer.country")}
          </Typography>
        </Grid>
      </Grid>

      <Divider
        sx={{
          my: 3,

          borderColor: "#eee",
        }}
      />

      <Typography
        textAlign="center"
        sx={{
          color: "#888",

          fontSize: 12,

          letterSpacing: 0.5,
        }}
      >
        © 2026 StyleHub - {t("footer.rights")}
      </Typography>
    </Box>
  );
}

export default Footer;
