import { Box, Typography, Card, CardMedia, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useTranslation } from "react-i18next";

import "../pages/css/CartItem.css";

function CartItem({ item, increase, decrease, remove }) {
  const { t } = useTranslation();

  return (
    <Card className="cart-item">
      {/* IMAGE */}

      <CardMedia
        component="img"
        image={
          item.image
            ? `http://localhost:5000/uploads/products/${item.image}`
            : "/no-image.png"
        }
        className="cart-item-image"
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
