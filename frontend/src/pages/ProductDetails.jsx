import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { Add, Remove, ShoppingBag } from "@mui/icons-material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useParams } from "react-router-dom";

import API from "../api/axios";

import useCartStore from "../store/cartStore";
import { useTranslation } from "react-i18next";
import "./css/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [color, setColor] = useState([]);
  const [product, setProduct] = useState(null);
  const [topSize, setTopSize] = useState("");
  const [pantsSize, setPantsSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [openSnack, setOpenSnack] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [size, setSize] = useState("");

  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/products/${id}`);

        setProduct(res.data);

        if (res.data?.ProductImages?.length > 0) {
          setSelectedImage(res.data.ProductImages[0].image);
        }
      } catch (err) {
        console.error("GET PRODUCT ERROR:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);
  const handleColorSelect = (c) => {
    // إذا اللون موجود احذفه
    if (color.includes(c)) {
      setColor(color.filter((item) => item !== c));
      return;
    }

    // للطقم يسمح بلونين فقط
    if (product.category === "طقم") {
      if (color.length < 2) {
        setColor([...color, c]);
      }

      return;
    }

    // المنتجات العادية لون واحد
    setColor([c]);
  };
  if (loading)
    return (
      <Box className="loading">
        <CircularProgress />
      </Box>
    );

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">Product Not Found</Typography>
      </Box>
    );
  }

  const imageUrl = "http://localhost:5000/uploads/products/";
  const addProduct = () => {
    if (product.category === "طقم") {
      if (!topSize || !pantsSize) {
        alert(t("Detalis.selectSizes"));
        return;
      }
    } else {
      if (product.sizes?.length > 0 && !size) {
        alert(t("Detalis.selectSize"));
        return;
      }
    }

    addToCart({
      id: product.id,

      name: product.name,

      price: Number(product.price),

      image: product.ProductImages?.[0]?.image,

      size:
        product.category === "طقم"
          ? {
              top: topSize,
              pants: pantsSize,
            }
          : size,

      color:
        product.category === "طقم" ? color : color.length > 0 ? color[0] : null,

      quantity,
    });
    setOpenSnack(true);
  };

  return (
    <div className="product-page">
      <Grid container spacing={5} alignItems="stretch">
        {/* Gallery */}

        <Grid item xs={12} md={6}>
          <div className="gallery">
            <div className="thumbs">
              {product.ProductImages?.map((img) => (
                <img
                  key={img.id}
                  src={imageUrl + img.image}
                  className={
                    selectedImage === img.image ? "thumb active" : "thumb"
                  }
                  onClick={() => setSelectedImage(img.image)}
                />
              ))}
            </div>

            <div className="main-image-box">
              <img src={imageUrl + selectedImage} className="main-image" />
            </div>
          </div>
        </Grid>

        {/* Details */}

        <Grid item xs={12} md={6}>
          <div className="details-card">
            <Typography className="title">{product.name}</Typography>

            <div className="price-box">
              <span className="price">{product.price} JD</span>

              {product.oldPrice && (
                <span className="old">{product.oldPrice} JD</span>
              )}
            </div>

            <Divider />

            <p className="description">{product.description}</p>
            {product.colors?.length > 0 && (
              <div className="option">
                <h4>
                  {t("Details.color")}

                  {product.category === "طقم" && (
                    <span style={{ fontSize: "13px", color: "#777" }}>
                      {" "}
                      ({t("Details.chooseUpToTwo")})
                    </span>
                  )}
                </h4>

                <div className="colors">
                  {product.colors.map((c) => (
                    <div
                      key={c}
                      onClick={() => handleColorSelect(c)}
                      className={
                        color.includes(c) ? "color active-color" : "color"
                      }
                      style={{
                        background: c,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* طقم */}
            {product.category === "طقم" && product.sizes && (
              <div className="option">
                <h4>{t("Details.topSize")}</h4>

                <div className="sizes">
                  {product.sizes.top?.map((s) => (
                    <button
                      key={s}
                      className={topSize === s ? "size active-size" : "size"}
                      onClick={() => setTopSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <h4 style={{ marginTop: "20px" }}>{t("Details.pantsSize")}</h4>

                <div className="sizes">
                  {product.sizes.pants?.map((s) => (
                    <button
                      key={s}
                      className={pantsSize === s ? "size active-size" : "size"}
                      onClick={() => setPantsSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* المنتجات العادية */}
            {product.category !== "طقم" && product.sizes?.length > 0 && (
              <div className="option">
                <h4>{t("Details.size")}</h4>

                <div className="sizes">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={size === s ? "size active-size" : "size"}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity">
              <IconButton
                onClick={() => {
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
              >
                <Remove />
              </IconButton>

              <span>{quantity}</span>

              <IconButton onClick={() => setQuantity(quantity + 1)}>
                <Add />
              </IconButton>
            </div>

            <Button
              className="cart-btn"
              variant="contained"
              onClick={addProduct}
              endIcon={<ShoppingBagOutlinedIcon />}
            >
              {t("Details.addToCart")}
            </Button>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnack}
        autoHideDuration={2500}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setOpenSnack(false)}
          variant="filled"
          sx={{
            fontWeight: 800,
            borderRadius: "15px",
            bgcolor: "#111",
            color: "#fff",
            "& .MuiAlert-icon": {
              color: "#fff",
            },
          }}
        >
          {t("Details.addedToCart")}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ProductDetails;
