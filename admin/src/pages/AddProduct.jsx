import { useEffect, useState } from "react";
import { TextField, Button, MenuItem, Paper, Typography } from "@mui/material";

import Sidebar from "../components/Sidebar";
import api from "../api/axios";

import "./css/AddProduct.css";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [customColors, setCustomColors] = useState([]);
  const [customColor, setCustomColor] = useState("#000000");
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    sizes: [],
    topSizes: [],
    pantsSizes: [],
    colors: [],
  });

  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");

      setCategories(res.data);
    } catch (error) {
      console.error("LOAD CATEGORIES ERROR:", error);
    }
  };

  // =========================
  // CONSTANTS
  // =========================

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

  // =========================
  // HELPERS
  // =========================

  const getSizes = () => {
    if (product.category === "بنطلون") {
      return sizesPants;
    }

    if (product.category === "بوت") {
      return sizesShoes;
    }

    return sizesClothes;
  };

  // =========================
  // PRODUCT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // TOP SIZE
  // =========================

  const toggleTopSize = (size) => {
    setProduct((prev) => {
      const exists = prev.topSizes.includes(size);

      return {
        ...prev,
        topSizes: exists
          ? prev.topSizes.filter((item) => item !== size)
          : [...prev.topSizes, size],
      };
    });
  };

  // =========================
  // PANTS SIZE
  // =========================

  const togglePantsSize = (size) => {
    setProduct((prev) => {
      const exists = prev.pantsSizes.includes(size);

      return {
        ...prev,
        pantsSizes: exists
          ? prev.pantsSizes.filter((item) => item !== size)
          : [...prev.pantsSizes, size],
      };
    });
  };

  // =========================
  // NORMAL SIZE
  // =========================

  const toggleSize = (size) => {
    setProduct((prev) => {
      const exists = prev.sizes.includes(size);

      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((item) => item !== size)
          : [...prev.sizes, size],
      };
    });
  };

  // =========================
  // COLOR
  // =========================

  const toggleColor = (color) => {
    setProduct((prev) => {
      const exists = prev.colors.includes(color);

      return {
        ...prev,
        colors: exists
          ? prev.colors.filter((item) => item !== color)
          : [...prev.colors, color],
      };
    });
  };

  // =========================
  // CUSTOM COLOR
  // =========================

  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
  };

  const handleCustomColorBlur = () => {
    const color = customColor.toLowerCase();

    if (!customColors.includes(color)) {
      setCustomColors((prev) => [...prev, color]);

      setProduct((prev) => {
        if (prev.colors.includes(color)) {
          return prev;
        }

        return {
          ...prev,
          colors: [...prev.colors, color],
        };
      });
    }
  };

  // =========================
  // IMAGES
  // =========================

  const handleImages = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    if (!selectedImages.length) {
      return;
    }

    setImages((prev) => [...prev, ...selectedImages]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================
  // VALIDATION
  // =========================

  const validateProduct = () => {
    if (!product.name.trim()) {
      alert("يرجى إدخال اسم المنتج");
      return false;
    }

    if (product.price === "" || Number(product.price) <= 0) {
      alert("يرجى إدخال سعر صحيح");
      return false;
    }

    if (product.stock === "" || Number(product.stock) < 0) {
      alert("يرجى إدخال كمية صحيحة");
      return false;
    }

    if (!product.category) {
      alert("يرجى اختيار الفئة");
      return false;
    }

    if (product.category === "طقم") {
      if (product.topSizes.length === 0) {
        alert("يرجى اختيار مقاسات القميص / البلوزة");
        return false;
      }

      if (product.pantsSizes.length === 0) {
        alert("يرجى اختيار مقاسات البنطلون");
        return false;
      }
    } else {
      if (product.sizes.length === 0) {
        alert("يرجى اختيار مقاس واحد على الأقل");
        return false;
      }
    }

    if (product.colors.length === 0) {
      alert("يرجى اختيار لون واحد على الأقل");
      return false;
    }

    if (images.length === 0) {
      alert("يرجى إضافة صورة واحدة على الأقل");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateProduct()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", product.name.trim());

      formData.append("price", Number(product.price));

      formData.append("stock", Number(product.stock));

      formData.append("category", product.category);

      if (product.category === "طقم") {
        formData.append(
          "sizes",
          JSON.stringify({
            top: product.topSizes,
            pants: product.pantsSizes,
          }),
        );
      } else {
        formData.append("sizes", JSON.stringify(product.sizes));
      }

      formData.append("colors", JSON.stringify(product.colors));

      images.forEach((image) => {
        formData.append("images", image);
      });

      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("تمت إضافة المنتج بنجاح");

      // Reset
      setProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        sizes: [],
        topSizes: [],
        pantsSizes: [],
        colors: [],
      });

      setImages([]);
      setCustomColors([]);
      setCustomColor("#000000");
    } catch (error) {
      console.error("ADD PRODUCT ERROR:", error);

      alert(error.response?.data?.message || "حدث خطأ أثناء إضافة المنتج");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="page-content">
        <Paper className="product-form">
          <Typography variant="h4">إضافة منتج</Typography>

          <form onSubmit={handleSubmit}>
            {/* ================= NAME ================= */}

            <TextField
              label="اسم المنتج"
              name="name"
              value={product.name}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* ================= PRICE ================= */}

            <TextField
              label="سعر"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{
                min: 0,
                step: "0.01",
              }}
            />

            {/* ================= STOCK ================= */}

            <TextField
              label="كمية"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{
                min: 0,
                step: 1,
              }}
            />

            {/* ================= CATEGORY ================= */}

            <TextField
              select
              label="فئة"
              name="category"
              value={product.category}
              onChange={(e) => {
                setProduct((prev) => ({
                  ...prev,
                  category: e.target.value,
                  sizes: [],
                  topSizes: [],
                  pantsSizes: [],
                }));
              }}
              fullWidth
              required
            >
              <MenuItem value="بلوزة">بلوزة</MenuItem>

              <MenuItem value="بنطلون">بنطلون</MenuItem>

              <MenuItem value="بوت">بوت</MenuItem>

              <MenuItem value="قميص">قميص</MenuItem>

              <MenuItem value="طقم">طقم</MenuItem>
            </TextField>

            {/* ================= SIZES ================= */}

            {product.category === "طقم" ? (
              <>
                <Typography sx={{ mt: 2 }}>مقاس القميص / البلوزة</Typography>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  {sizesClothes.map((size) => (
                    <Button
                      key={size}
                      variant={
                        product.topSizes.includes(size)
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => toggleTopSize(size)}
                      type="button"
                    >
                      {size}
                    </Button>
                  ))}
                </div>

                <Typography sx={{ mt: 3 }}>مقاس البنطلون</Typography>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  {sizesPants.map((size) => (
                    <Button
                      key={size}
                      variant={
                        product.pantsSizes.includes(size)
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => togglePantsSize(size)}
                      type="button"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <Typography sx={{ mt: 2 }}>اختيار الحجم</Typography>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  {getSizes().map((size) => {
                    const selected = product.sizes.includes(size);

                    return (
                      <Button
                        key={size}
                        variant={selected ? "contained" : "outlined"}
                        onClick={() => toggleSize(size)}
                        type="button"
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ================= COLORS ================= */}

            <Typography
              sx={{
                mt: 3,
                fontWeight: 800,
              }}
            >
              اختيار اللون
            </Typography>

            <div
              style={{
                display: "flex",
                gap: "18px",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              {colorsList.map((color) => {
                const selected = product.colors.includes(color.value);

                return (
                  <div
                    key={color.value}
                    onClick={() => toggleColor(color.value)}
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: color.value,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: selected
                          ? "4px solid #ff9800"
                          : "2px solid #ddd",
                        boxShadow: selected
                          ? "0 0 12px rgba(255,152,0,.7)"
                          : "none",
                      }}
                    >
                      {selected && (
                        <span
                          style={{
                            color:
                              color.value === "#ffffff" ? "black" : "white",
                            fontSize: "22px",
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        fontSize: "13px",
                        marginTop: "5px",
                        display: "block",
                      }}
                    >
                      {color.name}
                    </span>
                  </div>
                );
              })}

              {/* ================= CUSTOM COLORS ================= */}

              {customColors.map((color) => {
                const selected = product.colors.includes(color);

                return (
                  <div
                    key={color}
                    onClick={() => toggleColor(color)}
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: selected
                          ? "4px solid #ff9800"
                          : "2px solid #ddd",
                      }}
                    >
                      {selected && (
                        <span
                          style={{
                            color: "white",
                            fontSize: "22px",
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* ================= COLOR PICKER ================= */}

              <div
                style={{
                  textAlign: "center",
                }}
              >
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  onBlur={handleCustomColorBlur}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: "3px dashed #ff9800",
                    padding: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "13px",
                    display: "block",
                    marginTop: "5px",
                  }}
                >
                  لون مخصص
                </span>
              </div>
            </div>

            {/* ================= IMAGES ================= */}

            <input
              style={{ marginTop: "20px" }}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
            />

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              {images.map((img, index) => (
                <div
                  key={`${img.name}-${index}`}
                  style={{
                    position: "relative",
                  }}
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "black",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "25px",
                      height: "25px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* ================= SUBMIT ================= */}

            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "جاري الإضافة..." : "إضافة المنتج"}
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}
