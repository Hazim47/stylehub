import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFavorites from "../hooks/useFavorites";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
export default function SliderSection({ products }) {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  // -----------------------------
  // Drag Slider
  // -----------------------------
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();
  const mouseDown = (e) => {
    const slider = sliderRef.current;
    slider.isDown = true;
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const mouseLeave = () => {
    if (!sliderRef.current) return;
    sliderRef.current.isDown = false;
  };

  const mouseUp = () => {
    if (!sliderRef.current) return;
    sliderRef.current.isDown = false;
  };

  const mouseMove = (e) => {
    const slider = sliderRef.current;

    if (!slider.isDown) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 1.4;

    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  return (
    <Box
      sx={{
        mb: -4,
        position: "relative",
      }}
    >
      <Box
        ref={sliderRef}
        onMouseDown={mouseDown}
        onMouseLeave={mouseLeave}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
        sx={{
          display: "flex",
          overflowX: "auto",
          cursor: "grab",
          userSelect: "none",
          py: 2,

          "&:active": {
            cursor: "grabbing",
          },

          "&::-webkit-scrollbar": {
            display: "none",
          },

          scrollbarWidth: "none",
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{
              flex: "0 0 auto",

              width: {
                xs: "60%",
                sm: "40%",
                md: "26%",
                lg: "22%",
              },

              px: 1,
            }}
          >
            <Box
              sx={{
                background: "#fff",
                transition: ".35s",

                "&:hover": {
                  transform: "translateY(-6px)",
                },

                "&:hover .image": {
                  transform: "scale(1.04)",
                },
              }}
            >
              {/* IMAGE */}
              <Box
                onClick={() => navigate(`/products/${product.id}`)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  background: "#f7f7f7",

                  aspectRatio: "3 / 4",

                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 15,
                    left: 15,
                    zIndex: 2,

                    background: "#000",
                    color: "#fff",

                    px: 1.5,
                    py: 0.6,

                    fontSize: "11px",
                    fontWeight: 800,

                    letterSpacing: 2,

                    textTransform: "uppercase",
                  }}
                >
                  NEW
                </Box>
                <Box
                  component="img"
                  className="image"
                  src={
                    product.ProductImages?.[0]?.image
                      ? `http://localhost:5000/uploads/products/${product.ProductImages[0].image}`
                      : "/no-image.png"
                  }
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "100%",

                    objectFit: "cover",

                    objectPosition: "center",

                    transition: ".5s",
                  }}
                />
              </Box>

              {/* DETAILS */}

              <Box
                sx={{
                  pt: 1.2,
                  px: 0.5,
                  pb: 1.5,
                }}
              >
                {/* NAME + HEART */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: 14,
                        md: 16,
                      },

                      fontWeight: 700,

                      color: "#111",

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",

                      flex: 1,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      toggleFavorite(product);
                    }}
                    sx={{
                      width: 44,
                      height: 44,

                      borderRadius: "50%",

                      background: "rgba(255,255,255,0.95)",

                      backdropFilter: "blur(10px)",

                      boxShadow: "0 6px 20px rgba(0,0,0,.12)",

                      transition: "all .35s ease",

                      flexShrink: 0,

                      "&:hover": {
                        background: "#000",

                        transform: "scale(1.12)",

                        "& svg": {
                          color: "#fff",
                        },
                      },

                      "&:active": {
                        transform: "scale(.9)",
                      },
                    }}
                  >
                    {isFavorite(product.id) ? (
                      <Favorite
                        sx={{
                          color: "#000",
                          fontSize: 24,
                        }}
                      />
                    ) : (
                      <FavoriteBorder
                        sx={{
                          color: "#000",
                          fontSize: 24,
                        }}
                      />
                    )}
                  </IconButton>
                </Box>

                {/* PRICE */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mt: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: 17,
                        md: 20,
                      },
                      fontWeight: 900,
                      color: "#000",
                    }}
                  >
                    {product.price} JD
                  </Typography>

                  {product.oldPrice && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: {
                            xs: 13,
                            md: 15,
                          },

                          color: "#999",

                          textDecoration: "line-through",

                          fontWeight: 600,
                        }}
                      >
                        {product.oldPrice} JD
                      </Typography>

                      <Box
                        sx={{
                          background: "#e53935",
                          color: "#fff",
                          px: 1,
                          py: 0.3,
                          borderRadius: "20px",
                          fontSize: {
                            xs: 10,
                            md: 11,
                          },
                          fontWeight: 800,
                          letterSpacing: 0.5,
                        }}
                      >
                        SALE
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
