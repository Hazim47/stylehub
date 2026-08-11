import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/EditProduct";
import Orders from "./pages/Orders";
import Homepage from "./pages/Homepage";
import Coupons from "./pages/Coupons";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products/add" element={<AddProduct />} />

        <Route path="/products" element={<Products />} />

        <Route path="/coupons" element={<Coupons />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
