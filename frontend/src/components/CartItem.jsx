import { Box, Typography, Card, CardMedia, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useTranslation } from "react-i18next";

import "../pages/css/CartItem.css";

function CartItem({ item, increase, decrease, remove }) {
  const { t } = useTranslation();

  // تحويل رابط الصورة سواء كانت Cloudinary أو صورة محلية
  const getImageUrl = (image) => {
    if (!image) {
      return "/no-image.png";
    }

    // إذا كانت الصورة رابط كامل مثل Cloudinary
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // إذا كان المسار يبدأ بـ /
    if (image.startsWith("/")) {
      return `http://localhost:5000${image}`;
    }

    // إذا كانت صورة محلية قديمة
    return `http://localhost:5000/uploads/products/${image}`;
  };

  return (
    <Card className="cart-item">
      {/* IMAGE */}

      <CardMedia
        component="img"
        image={getImageUrl(item.image)}
        className="cart-item-image"
        alt={item.name}
      />

      {/* INFO */}

      <Box className="cart-item-info">
        <Typography className="cart-item-name">{item.name}</Typography>

        {item.size && typeof item.size === "object" ? (
          <>
            <Typography className="cart-item-option">
              {t("cart.topSize")} : {item.size.top || "-"}
            </Typography>

            <Typography className="cart-item-option">
              {t("cart.pantsSize")} : {item.size.pants || "-"}
            </Typography>
          </>
        ) : (
          <Typography className="cart-item-option">
            {t("cart.size")} : {item.size}
          </Typography>
        )}

        {item.color && (
          <Box className="cart-color">
            <Typography className="cart-item-option">
              {t("cart.color")} :
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {Array.isArray(item.color) ? (
                item.color.map((c, index) => (
                  <span
                    key={index}
                    className="color-circle"
                    style={{
                      background: c,
                    }}
                  />
                ))
              ) : (
                <span
                  className="color-circle"
                  style={{
                    background: item.color,
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        <Typography className="cart-item-price">{item.price}</Typography>
      </Box>

      {/* ACTIONS */}

      <Box className="cart-actions">
        <IconButton
          className="plus-btn"
          onClick={() => increase(item.id, item.size, item.color)}
        >
          <AddIcon />
        </IconButton>

        <Typography className="quantity">{item.quantity}</Typography>

        <IconButton onClick={() => decrease(item.id, item.size, item.color)}>
          <RemoveIcon />
        </IconButton>

        <IconButton
          color="error"
          onClick={() => remove(item.id, item.size, item.color)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}

export default CartItem;
