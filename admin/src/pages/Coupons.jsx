import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Chip,
} from "@mui/material";

import { Add, Delete, CardGiftcard } from "@mui/icons-material";

import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";

import api from "../api/axios";

import "./css/Coupons.css";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);

  const [coupon, setCoupon] = useState({
    code: "",

    discount: 10,

    usagePerUser: 1,
  });

  const discounts = [10, 15, 20, 25, 30, 40, 50];

  const usageOptions = [1, 2, 3, 5, 10];

  // =====================
  // جلب الكوبونات
  // =====================

  const loadCoupons = async () => {
    try {
      const res = await api.get("/coupons");

      setCoupons(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // =====================
  // إنشاء كوبون
  // =====================

  const createCoupon = async () => {
    if (!coupon.code.trim()) {
      toast.error("يرجى إدخال كود الكوبون");

      return;
    }

    if (!coupon.discount) {
      toast.error("يرجى اختيار نسبة الخصم");

      return;
    }

    try {
      await api.post("/coupons", coupon);

      setCoupon({
        code: "",

        discount: 10,

        usagePerUser: 1,
      });

      loadCoupons();
    } catch (err) {
      console.log(err);
    }
  };

  // =====================
  // حذف كوبون
  // =====================

  const deleteCoupon = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);

      loadCoupons();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="coupon-page">
        <div className="coupon-header">
          <div>
            <Typography variant="h4" className="coupon-title">
              <CardGiftcard />
              الكوبونات
            </Typography>

            <p>إدارة كوبونات الخصم</p>
          </div>
        </div>

        <Paper className="create-coupon">
          <Typography variant="h5">إنشاء كوبون جديد</Typography>

          <TextField
            label="كود الكوبون"
            value={coupon.code}
            onChange={(e) =>
              setCoupon({
                ...coupon,

                code: e.target.value.toUpperCase(),
              })
            }
            fullWidth
          />

          <TextField
            select
            label="نسبة الخصم"
            value={coupon.discount}
            onChange={(e) =>
              setCoupon({
                ...coupon,

                discount: Number(e.target.value),
              })
            }
            fullWidth
          >
            {discounts.map((item) => (
              <MenuItem key={item} value={item}>
                خصم {item}%
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="عدد مرات الاستخدام لكل مستخدم"
            value={coupon.usagePerUser}
            onChange={(e) =>
              setCoupon({
                ...coupon,

                usagePerUser: Number(e.target.value),
              })
            }
            fullWidth
          >
            {usageOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item} مرات
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={createCoupon}
            className="create-btn"
          >
            إنشاء كوبون
          </Button>
        </Paper>

        <div className="coupon-grid">
          {coupons.map((coupon) => (
            <Paper key={coupon.id} className="coupon-card">
              <div>
                <Typography variant="h5">{coupon.code}</Typography>

                <Chip label={`خصم ${coupon.discount}%`} />

                <Chip
                  sx={{ mt: 1 }}
                  label={`لكل مستخدم: ${coupon.usagePerUser || 1} مرات`}
                />
              </div>

              <Chip
                label={coupon.isActive ? "فعال" : "متوقف"}
                color={coupon.isActive ? "success" : "default"}
              />

              <IconButton onClick={() => deleteCoupon(coupon.id)}>
                <Delete />
              </IconButton>
            </Paper>
          ))}
        </div>
      </div>
    </div>
  );
}
