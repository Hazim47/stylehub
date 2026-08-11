import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import API from "../api/axios";

function NewIn() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [homepage, setHomepage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await API.get("/homepage");
        setHomepage(res.data);
      } catch (error) {
        console.error("Failed to fetch homepage settings:", error);
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

  const seasons = [
    {
      title: t("newIn.summer"),
      image: getImageUrl(homepage?.summerImage),
      value: "summer",
    },
    {
      title: t("newIn.spring"),
      image: getImageUrl(homepage?.springImage),
      value: "spring",
    },
    {
      title: t("newIn.autumn"),
      image: getImageUrl(homepage?.autumnImage),
      value: "autumn",
    },
    {
      title: t("newIn.winter"),
      image: getImageUrl(homepage?.winterImage),
      value: "winter",
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: "1550px",
        mx: "auto",
        px: { xs: 2, md: 5 },
        py: 12,
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          fontSize: {
            xs: "30px",
            md: "52px",
          },
          fontWeight: 900,
          letterSpacing: 8,
          mb: 2,
        }}
      >
        {t("newIn.title")}
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          color: "#666",
          fontSize: "17px",
          mb: 8,
          letterSpacing: 1,
        }}
      >
        {t("newIn.subtitle")}
      </Typography>

      {loading ? (
        <Box
          sx={{
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 4,
            alignItems: "start",
          }}
        >
          {seasons.map((item) => (
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                background: "#000",

                height: {
                  xs: "500px",
                  sm: "550px",
                  lg: "600px",
                },

                "&:hover img": {
                  transform: "scale(1.03)",
                },

                "&:hover .overlay": {
                  background: "rgba(0,0,0,.45)",
                },

                "&:hover .title": {
                  transform: "translateY(-20px)",
                },

                "&:hover .btn": {
                  opacity: 1,
                  transform: "translate(-50%, 0)",
                },
              }}
            >
              {item.image && (
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    transition: "transform 1.2s",
                  }}
                />
              )}

              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  transition: ".5s",
                  background:
                    "linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.1),rgba(0,0,0,.35))",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  pb: 5,
                }}
              >
                <Typography
                  className="title"
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: {
                      xs: 32,
                      md: 44,
                    },
                    letterSpacing: 5,
                    transition: ".5s",
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Typography>

                <Button
                  className="btn"
                  variant="contained"
                  sx={{
                    opacity: 0,
                    transform: "translate(-50%, 30px)",
                    position: "absolute",
                    left: "50%",
                    bottom: 30,
                    transition: ".5s",
                    background: "#fff",
                    color: "#000",
                    px: 5,
                    py: 1.4,
                    borderRadius: 0,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",

                    "&:hover": {
                      background: "#000",
                      color: "#fff",
                    },
                  }}
                >
                  {t("newIn.explore")}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default NewIn;
