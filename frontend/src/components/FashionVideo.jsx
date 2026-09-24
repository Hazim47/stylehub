import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function FashionVideo() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
      }}
    >
      {/* =========================
          CONTENT ABOVE VIDEO
      ========================== */}
      <Box
        sx={{
          textAlign: "center",
          px: 2,
          pt: {
            xs: 8,
            md: 10,
          },
          pb: {
            xs: 6,
            md: 8,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              md: "14px",
            },
            fontWeight: 700,
            letterSpacing: {
              xs: 3,
              md: 6,
            },
            color: "#777",
            mb: 2,
            textTransform: "uppercase",
          }}
        >
          {t("fashionVideo.collection")}
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "32px",
              sm: "42px",
              md: "58px",
              lg: "64px",
            },
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: {
              xs: 2,
              md: 5,
            },
            color: "#000",
            mb: 2.5,
            textTransform: "uppercase",
          }}
        >
          {t("fashionVideo.title")}
        </Typography>

        <Typography
          sx={{
            maxWidth: "650px",
            mx: "auto",
            color: "#666",
            fontSize: {
              xs: "14px",
              md: "17px",
            },
            lineHeight: 1.7,
          }}
        >
          {t("fashionVideo.description")}
        </Typography>
      </Box>

      {/* =========================
          YOUR ORIGINAL VIDEO
      ========================== */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: "520px",
            sm: "600px",
            md: "700px",
            lg: "760px",
          },
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* VIDEO */}
        <Box
          component="video"
          src="/videos/fashion.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />

        {/* DARK OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.35), rgba(0,0,0,.65))",
          }}
        />
      </Box>
    </Box>
  );
}

export default FashionVideo;
