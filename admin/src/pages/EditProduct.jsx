import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";

import { Edit, Delete, Save, Close } from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import api from "../api/axios";

import "./css/EditProduct.css";

export default function Products() {
  // =====================================================
  // STATE
  // =====================================================

  const [category, setCategory] = useState("بلوزة");

  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [tempColor, setTempColor] = useState("#000000");

  const [customColors, setCustomColors] = useState([]);

  const [editData, setEditData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    stock: "",
    sizes: [],
    topSizes: [],
    pantsSizes: [],
    colors: [],
    category: "",
  });

  // =====================================================
  // CONSTANTS
  // =====================================================

  const categories = [
    {
      id: "بلوزة",
      name: "👕 بلوزات",
    },
    {
      id: "بنطلون",
      name: "👖 بناطيل",
    },
    {
      id: "بوت",
      name: "👞 بوت",
    },
    {
      id: "قميص",
      name: "👔 قمصان",
    },
    {
      id: "طقم",
      name: "🧥 أطقم",
    },
  ];

  const sizesClothes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const sizesPants = ["32", "33", "34", "35", "36", "38", "40", "42", "44"];

  const sizesShoes = ["38", "39", "40", "41", "42", "43", "44", "45"];

  const colorsList = [
    {
      name: "أسود",
      value: "#000000",
    },
    {
      name: "أبيض",
      value: "#ffffff",
    },
    {
      name: "أحمر",
      value: "#ff0000",
    },
    {
      name: "أزرق",
      value: "#0000ff",
    },
    {
      name: "أخضر",
      value: "#008000",
    },
    {
      name: "رمادي",
      value: "#808080",
    },
    {
      name: "بني",
      value: "#8b4513",
    },
    {
      name: "بيج",
      value: "#f5f5dc",
    },
    {
      name: "كحلي",
      value: "#001f3f",
    },
    {
      name: "زهري",
      value: "#ff69b4",
    },
    {
      name: "موف",
      value: "#800080",
    },
  ];

  // =====================================================
  // GET PRODUCTS
  // =====================================================

  useEffect(() => {
    getProducts();
  }, [category]);

  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/products?category=${encodeURIComponent(category)}`,
      );

      const productsData = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      const normalizedProducts = productsData.map((product) => {
        let sizes = product.sizes;

        // -----------------------------
        // Normal product sizes
        // -----------------------------

        if (product.category !== "طقم") {
          if (!Array.isArray(sizes)) {
            sizes = sizes ? Object.values(sizes) : [];
          }
        }

        // -----------------------------
        // Set sizes
        // -----------------------------

        if (product.category === "طقم") {
          sizes = {
            top: Array.isArray(product.sizes?.top) ? product.sizes.top : [],

            pants: Array.isArray(product.sizes?.pants)
              ? product.sizes.pants
              : [],
          };
        }

        // -----------------------------
        // Colors
        // -----------------------------

        let colors = product.colors;

        if (!Array.isArray(colors)) {
          colors = colors ? Object.values(colors) : [];
        }

        return {
          ...product,
          sizes,
          colors,
        };
      });

      setProducts(normalizedProducts);
    } catch (error) {
      console.error("GET PRODUCTS ERROR:", error);

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET SIZES
  // =====================================================

  const getSizesForCategory = (productCategory) => {
    if (productCategory === "بنطلون") {
      return sizesPants;
    }

    if (productCategory === "بوت") {
      return sizesShoes;
    }

    return sizesClothes;
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEdit = (product) => {
    setEditingId(product.id);

    setCustomColors([]);

    const isSet = product.category === "طقم";

    let sizes = [];
    let topSizes = [];
    let pantsSizes = [];

    if (isSet) {
      topSizes = Array.isArray(product.sizes?.top)
        ? [...product.sizes.top]
        : [];

      pantsSizes = Array.isArray(product.sizes?.pants)
        ? [...product.sizes.pants]
        : [];
    } else {
      sizes = Array.isArray(product.sizes) ? [...product.sizes] : [];
    }

    const colors = Array.isArray(product.colors) ? [...product.colors] : [];

    setTempColor(colors.length > 0 ? colors[0] : "#000000");

    setEditData({
      name: product.name || "",

      price: product.price ?? "",

      oldPrice: product.oldPrice ?? "",

      stock: product.stock ?? "",

      sizes,

      topSizes,

      pantsSizes,

      colors,

      category: product.category || "",
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditingId(null);

    setCustomColors([]);

    setTempColor("#000000");

    setEditData({
      name: "",
      price: "",
      oldPrice: "",
      stock: "",
      sizes: [],
      topSizes: [],
      pantsSizes: [],
      colors: [],
      category: "",
    });
  };

  // =====================================================
  // CHANGE CATEGORY DURING EDIT
  // =====================================================

  const handleCategoryChange = (newCategory) => {
    setEditData((prev) => ({
      ...prev,

      category: newCategory,

      sizes: newCategory === "طقم" ? [] : [],

      topSizes: newCategory === "طقم" ? [] : [],

      pantsSizes: newCategory === "طقم" ? [] : [],
    }));
  };

  // =====================================================
  // TOGGLE NORMAL SIZE
  // =====================================================

  const toggleSize = (size) => {
    setEditData((prev) => {
      const exists = prev.sizes.includes(size);

      return {
        ...prev,

        sizes: exists
          ? prev.sizes.filter((item) => item !== size)
          : [...prev.sizes, size],
      };
    });
  };

  // =====================================================
  // TOGGLE TOP SIZE
  // =====================================================

  const toggleTopSize = (size) => {
    setEditData((prev) => {
      const exists = prev.topSizes.includes(size);

      return {
        ...prev,

        topSizes: exists
          ? prev.topSizes.filter((item) => item !== size)
          : [...prev.topSizes, size],
      };
    });
  };

  // =====================================================
  // TOGGLE PANTS SIZE
  // =====================================================

  const togglePantsSize = (size) => {
    setEditData((prev) => {
      const exists = prev.pantsSizes.includes(size);

      return {
        ...prev,

        pantsSizes: exists
          ? prev.pantsSizes.filter((item) => item !== size)
          : [...prev.pantsSizes, size],
      };
    });
  };

  // =====================================================
  // TOGGLE COLOR
  // =====================================================

  const toggleColor = (color) => {
    setEditData((prev) => {
      const exists = prev.colors.includes(color);

      return {
        ...prev,

        colors: exists
          ? prev.colors.filter((item) => item !== color)
          : [...prev.colors, color],
      };
    });
  };

  // =====================================================
  // ADD CUSTOM COLOR
  // =====================================================

  const addCustomColor = () => {
    const color = tempColor.toLowerCase();

    if (!customColors.includes(color)) {
      setCustomColors((prev) => [...prev, color]);
    }

    setEditData((prev) => {
      if (prev.colors.includes(color)) {
        return prev;
      }

      return {
        ...prev,
        colors: [...prev.colors, color],
      };
    });
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const saveEdit = async () => {
    // -----------------------------
    // Validation
    // -----------------------------

    if (!editData.name.trim()) {
      alert("يرجى إدخال اسم المنتج");
      return;
    }

    if (editData.price === "" || Number(editData.price) <= 0) {
      alert("يرجى إدخال سعر صحيح");
      return;
    }

    if (editData.stock === "" || Number(editData.stock) < 0) {
      alert("يرجى إدخال كمية صحيحة");
      return;
    }

    if (!editData.category) {
      alert("يرجى اختيار الفئة");
      return;
    }

    // -----------------------------
    // Validate sizes
    // -----------------------------

    if (editData.category === "طقم") {
      if (editData.topSizes.length === 0) {
        alert("يرجى اختيار مقاس واحد على الأقل للعلوي");

        return;
      }

      if (editData.pantsSizes.length === 0) {
        alert("يرجى اختيار مقاس واحد على الأقل للبنطلون");

        return;
      }
    } else {
      if (editData.sizes.length === 0) {
        alert("يرجى اختيار مقاس واحد على الأقل");

        return;
      }
    }

    // -----------------------------
    // Validate colors
    // -----------------------------

    if (editData.colors.length === 0) {
      alert("يرجى اختيار لون واحد على الأقل");

      return;
    }

    try {
      setSaving(true);

      const data = {
        name: editData.name.trim(),

        price: Number(editData.price),

        oldPrice:
          editData.oldPrice !== "" && editData.oldPrice !== null
            ? Number(editData.oldPrice)
            : null,

        stock: Number(editData.stock),

        category: editData.category,

        colors: editData.colors,

        sizes:
          editData.category === "طقم"
            ? {
                top: editData.topSizes,
                pants: editData.pantsSizes,
              }
            : editData.sizes,
      };

      console.log("UPDATE PRODUCT:", data);

      const res = await api.put(`/products/${editingId}`, data);

      console.log("UPDATE RESPONSE:", res.data);

      // -----------------------------
      // Update locally
      // -----------------------------

      setProducts((prev) =>
        prev.map((product) => {
          if (product.id !== editingId) {
            return product;
          }

          return {
            ...product,

            name: data.name,

            price: data.price,

            oldPrice: data.oldPrice,

            stock: data.stock,

            category: data.category,

            colors: data.colors,

            sizes: data.sizes,
          };
        }),
      );

      cancelEdit();

      alert("تم تعديل المنتج بنجاح");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      alert(error.response?.data?.message || "حدث خطأ أثناء تعديل المنتج");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      alert(error.response?.data?.message || "حدث خطأ أثناء حذف المنتج");
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // FORMAT SIZES
  // =====================================================

  const formatSizes = (sizes, productCategory) => {
    if (productCategory === "طقم" && sizes) {
      return (
        <div className="set-sizes">
          <div className="size-box">
            <div className="size-title">👕 العلوي</div>

            <div className="size-list">
              {sizes.top?.map((size, index) => (
                <span key={index}>{size}</span>
              ))}
            </div>
          </div>

          <div className="size-box">
            <div className="size-title">👖 البنطلون</div>

            <div className="size-list">
              {sizes.pants?.map((size, index) => (
                <span key={index}>{size}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return <span className="no-size">لا يوجد</span>;
    }

    return (
      <div className="normal-sizes">
        {sizes.map((size, index) => (
          <span key={index}>{size}</span>
        ))}
      </div>
    );
  };

  // =====================================================
  // IMAGE URL
  // =====================================================
  const getImageUrl = (product) => {
    if (!product.ProductImages?.length) {
      return "/no-image.png";
    }

    return `http://localhost:5000/uploads/products/${product.ProductImages[0].image}`;
  };
  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="page-content">
        <Box className="products-page">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="products-header">
            <Typography variant="h3">إدارة المنتجات</Typography>

            <p>إدارة منتجات المتجر بسهولة</p>
          </div>

          {/* ================================================= */}
          {/* CATEGORIES */}
          {/* ================================================= */}

          <div className="category-box">
            <Tabs
              value={category}
              onChange={(e, value) => setCategory(value)}
              variant="scrollable"
              scrollButtons="auto"
              className="tabs"
            >
              {categories.map((cat) => (
                <Tab key={cat.id} value={cat.id} label={cat.name} />
              ))}
            </Tabs>
          </div>

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                لا توجد منتجات في هذه الفئة
              </Typography>
            </Box>
          ) : (
            /* ================================================= */
            /* PRODUCTS GRID */
            /* ================================================= */

            <div className="products-grid">
              {products.map((product) => (
                <Card className="product-card" key={product.id}>
                  {/* ================================================= */}
                  {/* IMAGE */}
                  {/* ================================================= */}

                  <div className="image-box">
                    <CardMedia
                      component="img"
                      height="260"
                      image={getImageUrl(product)}
                      alt={product.name}
                      sx={{
                        objectFit: "contain",
                        background: "#f8fafc",
                        padding: "15px",
                      }}
                    />
                  </div>

                  {/* ================================================= */}
                  {/* CARD CONTENT */}
                  {/* ================================================= */}

                  <CardContent>
                    {editingId === product.id ? (
                      <>
                        {/* ================================================= */}
                        {/* EDIT FORM */}
                        {/* ================================================= */}

                        <div className="edit-form">
                          {/* NAME */}

                          <label>اسم المنتج</label>

                          <input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            disabled={saving}
                          />

                          {/* PRICE */}

                          <label>السعر</label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editData.price}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            disabled={saving}
                          />

                          {/* OLD PRICE */}

                          <label>السعر قبل الخصم (اختياري)</label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editData.oldPrice}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                oldPrice: e.target.value,
                              }))
                            }
                            disabled={saving}
                          />

                          {/* STOCK */}

                          <label>المخزون</label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={editData.stock}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                stock: e.target.value,
                              }))
                            }
                            disabled={saving}
                          />

                          {/* CATEGORY */}

                          <label>الفئة</label>

                          <select
                            value={editData.category}
                            onChange={(e) =>
                              handleCategoryChange(e.target.value)
                            }
                            disabled={saving}
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>

                          {/* ================================================= */}
                          {/* SIZES */}
                          {/* ================================================= */}

                          <label>المقاسات</label>

                          {editData.category === "طقم" ? (
                            <>
                              {/* TOP */}

                              <Typography
                                sx={{
                                  mt: 1,
                                  mb: 1,
                                  fontWeight: 700,
                                }}
                              >
                                مقاس القميص / البلوزة
                              </Typography>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  flexWrap: "wrap",
                                  marginBottom: "15px",
                                }}
                              >
                                {sizesClothes.map((size) => {
                                  const selected =
                                    editData.topSizes.includes(size);

                                  return (
                                    <Button
                                      key={size}
                                      type="button"
                                      variant={
                                        selected ? "contained" : "outlined"
                                      }
                                      onClick={() => toggleTopSize(size)}
                                      disabled={saving}
                                      size="small"
                                    >
                                      {size}
                                    </Button>
                                  );
                                })}
                              </div>

                              {/* PANTS */}

                              <Typography
                                sx={{
                                  mb: 1,
                                  fontWeight: 700,
                                }}
                              >
                                مقاس البنطلون
                              </Typography>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  flexWrap: "wrap",
                                  marginBottom: "15px",
                                }}
                              >
                                {sizesPants.map((size) => {
                                  const selected =
                                    editData.pantsSizes.includes(size);

                                  return (
                                    <Button
                                      key={size}
                                      type="button"
                                      variant={
                                        selected ? "contained" : "outlined"
                                      }
                                      onClick={() => togglePantsSize(size)}
                                      disabled={saving}
                                      size="small"
                                    >
                                      {size}
                                    </Button>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            /* NORMAL PRODUCT */

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                marginBottom: "15px",
                              }}
                            >
                              {getSizesForCategory(editData.category).map(
                                (size) => {
                                  const selected =
                                    editData.sizes.includes(size);

                                  return (
                                    <Button
                                      key={size}
                                      type="button"
                                      variant={
                                        selected ? "contained" : "outlined"
                                      }
                                      onClick={() => toggleSize(size)}
                                      disabled={saving}
                                      size="small"
                                    >
                                      {size}
                                    </Button>
                                  );
                                },
                              )}
                            </div>
                          )}

                          {/* ================================================= */}
                          {/* COLORS */}
                          {/* ================================================= */}

                          <label>الألوان</label>

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                              alignItems: "center",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            {/* DEFAULT COLORS */}

                            {colorsList.map((color) => {
                              const selected = editData.colors.includes(
                                color.value,
                              );

                              return (
                                <div
                                  key={color.value}
                                  onClick={() => toggleColor(color.value)}
                                  title={color.name}
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    background: color.value,
                                    border: selected
                                      ? "4px solid #ff9800"
                                      : "2px solid #ddd",
                                    boxShadow: selected
                                      ? "0 0 10px rgba(255,152,0,.6)"
                                      : "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {selected && (
                                    <span
                                      style={{
                                        color:
                                          color.value === "#ffffff"
                                            ? "#000"
                                            : "#fff",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                      }}
                                    >
                                      ✓
                                    </span>
                                  )}
                                </div>
                              );
                            })}

                            {/* CUSTOM COLORS */}

                            {customColors.map((color) => {
                              const selected = editData.colors.includes(color);

                              return (
                                <div
                                  key={color}
                                  onClick={() => toggleColor(color)}
                                  title={color}
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    background: color,
                                    border: selected
                                      ? "4px solid #ff9800"
                                      : "2px solid #ddd",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {selected && (
                                    <span
                                      style={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                      }}
                                    >
                                      ✓
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* COLOR PICKER */}

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <input
                              type="color"
                              value={tempColor}
                              onChange={(e) => setTempColor(e.target.value)}
                              disabled={saving}
                              style={{
                                width: "45px",
                                height: "40px",
                                cursor: "pointer",
                              }}
                            />

                            <Button
                              type="button"
                              variant="contained"
                              size="small"
                              onClick={addCustomColor}
                              disabled={saving}
                            >
                              إضافة لون
                            </Button>
                          </div>
                        </div>

                        {/* ================================================= */}
                        {/* EDIT BUTTONS */}
                        {/* ================================================= */}

                        <div
                          className="edit-buttons"
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={
                              saving ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <Save />
                              )
                            }
                            onClick={saveEdit}
                            disabled={saving}
                          >
                            {saving ? "جاري الحفظ..." : "حفظ"}
                          </Button>

                          <Button
                            variant="outlined"
                            startIcon={<Close />}
                            onClick={cancelEdit}
                            disabled={saving}
                          >
                            إلغاء
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* ================================================= */}
                        {/* PRODUCT NAME */}
                        {/* ================================================= */}

                        <Typography className="product-name" variant="h5">
                          {product.name}
                        </Typography>

                        {/* ================================================= */}
                        {/* PRODUCT INFO */}
                        {/* ================================================= */}

                        <div className="product-info">
                          {/* PRICE */}

                          <div className="price-area">
                            <span className="price-label">💰 السعر:</span>

                            {product.oldPrice &&
                            Number(product.oldPrice) > Number(product.price) ? (
                              <>
                                <span className="old-price">
                                  {product.oldPrice} JD
                                </span>

                                <span className="current-price">
                                  {product.price} JD
                                </span>
                              </>
                            ) : (
                              <span className="current-price">
                                {product.price} JD
                              </span>
                            )}
                          </div>

                          {/* STOCK */}

                          <p>
                            📦 المخزون:
                            <span> {product.stock}</span>
                          </p>

                          {/* SIZES */}

                          <div>
                            📏 المقاسات:
                            <div
                              style={{
                                marginTop: "8px",
                              }}
                            >
                              {formatSizes(product.sizes, product.category)}
                            </div>
                          </div>

                          {/* COLORS */}

                          {product.colors?.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "12px",
                              }}
                            >
                              <span>🎨 اللون:</span>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                {product.colors.map((color, index) => (
                                  <span
                                    key={index}
                                    style={{
                                      width: "22px",
                                      height: "22px",
                                      borderRadius: "50%",
                                      background: color,
                                      border: "1px solid #ccc",
                                      display: "block",
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* CATEGORY */}

                          <p>
                            📂 الفئة:
                            <span> {product.category}</span>
                          </p>
                        </div>
                      </>
                    )}

                    {/* ================================================= */}
                    {/* ACTIONS */}
                    {/* ================================================= */}

                    {editingId !== product.id && (
                      <div className="actions">
                        <Button
                          className="edit-btn"
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => startEdit(product)}
                        >
                          تعديل
                        </Button>

                        <Button
                          className="delete-btn"
                          variant="contained"
                          startIcon={
                            deletingId === product.id ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <Delete />
                            )
                          }
                          onClick={() => deleteProduct(product.id)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? "جاري الحذف..." : "حذف"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Box>
      </div>
    </div>
  );
}
