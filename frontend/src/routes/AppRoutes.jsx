import { Routes, Route } from "react-router-dom";

import Products from "../pages/Products";
import MainLayout from "../layouts/MainLayout";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Home from "../pages/Home";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Favorites from "../pages/Favorites";
import Notifications from "../pages/Notifications";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />

        <Route path="/favorites" element={<Favorites />} />

        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
