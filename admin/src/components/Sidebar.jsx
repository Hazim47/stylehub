import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";

import {
  Dashboard,
  AddBox,
  ShoppingCart,
  CardGiftcard,
  Inventory,
  Menu,
  Home,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import "./css/Sidebar.css";

export default function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <Box className="sidebar">
      <h2>👕 StyleHub</h2>

      <Button
        component={Link}
        to="/dashboard"
        startIcon={<Dashboard />}
        onClick={() => setOpen(false)}
      >
        Dashboard
      </Button>

      <Button
        component={Link}
        to="/products/add"
        startIcon={<AddBox />}
        onClick={() => setOpen(false)}
      >
        Add Product
      </Button>

      <Button
        component={Link}
        to="/products"
        startIcon={<Inventory />}
        onClick={() => setOpen(false)}
      >
        Edit Products
      </Button>

      <Button
        component={Link}
        to="/orders"
        startIcon={<ShoppingCart />}
        onClick={() => setOpen(false)}
      >
        Orders
      </Button>

      <Button
        component={Link}
        to="/coupons"
        startIcon={<CardGiftcard />}
        onClick={() => setOpen(false)}
      >
        Coupons
      </Button>
      <Button
        component={Link}
        to="/homepage"
        startIcon={<Home />}
        onClick={() => setOpen(false)}
      >
        Homepage
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            top: 15,
            right: 15,
            zIndex: 3000,

            background: "transparent",

            color: "#000",

            "&:hover": {
              background: "rgba(0,0,0,0.05)",
            },
          }}
        >
          <Menu sx={{ fontSize: 35 }} />
        </IconButton>

        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  return sidebarContent;
}
