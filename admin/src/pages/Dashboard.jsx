import { Box, Typography, Card, CardContent } from "@mui/material";

import { ShoppingBag, Inventory, AttachMoney } from "@mui/icons-material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";

import api from "../api/axios";

import Sidebar from "../components/Sidebar";

import "./css/Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [chart, setChart] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setStats({
        products: res.data.products,

        orders: res.data.orders,

        revenue: res.data.revenue,
      });

      setChart([
        {
          name: "Orders",
          sales: res.data.orders,
        },

        {
          name: "Sales",
          sales: res.data.revenue,
        },

        {
          name: "Products",
          sales: res.data.products,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className="dashboard">
      <Sidebar />

      <Box className="content">
        <div className="page-header">
          <Typography variant="h4">Dashboard</Typography>

          <p>Welcome back, here is your store overview</p>
        </div>

        <div className="cards">
          <Card className="stat-card orange-card">
            <CardContent>
              <div className="card-icon">
                <ShoppingBag />
              </div>

              <h3>{stats.orders}</h3>

              <p>Orders</p>
            </CardContent>
          </Card>

          <Card className="stat-card product-card">
            <CardContent>
              <div className="card-icon">
                <Inventory />
              </div>

              <h3>{stats.products}</h3>

              <p>Products</p>
            </CardContent>
          </Card>

          <Card className="stat-card money-card">
            <CardContent>
              <div className="card-icon">
                <AttachMoney />
              </div>

              <h3>${stats.revenue}</h3>

              <p>Sales</p>
            </CardContent>
          </Card>
        </div>

        <Card className="chart-card">
          <CardContent>
            <div className="chart-title">
              <h2>Sales Chart</h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chart}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#ff7a00"
                  strokeWidth={4}
                  activeDot={{
                    r: 8,
                  }}
                  dot={{
                    r: 4,
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
