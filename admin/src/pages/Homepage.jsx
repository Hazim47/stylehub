import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { ArrowBack } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Homepage() {
  const [homepage, setHomepage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImages, setSelectedImages] = useState({});
  const [uploading, setUploading] = useState({});
  const [deleting, setDeleting] = useState({});

  const navigate = useNavigate();

  // ======================================================
  // IMAGE SETTINGS
  // ======================================================

  const imageSections = [
    {
      field: "heroImage1",
      title: "Hero Image 1",
      description: "الصورة الأولى في Hero الرئيسية",
    },
    {
      field: "heroImage2",
      title: "Hero Image 2",
      description: "الصورة الثانية في Hero الرئيسية",
    },
    {
      field: "summerImage",
      title: "Summer",
      description: "صورة قسم Summer",
    },
    {
      field: "springImage",
      title: "Spring",
      description: "صورة قسم Spring",
    },
    {
      field: "autumnImage",
      title: "Autumn",
      description: "صورة قسم Autumn",
    },
    {
      field: "winterImage",
      title: "Winter",
      description: "صورة قسم Winter",
    },
  ];

  // ======================================================
  // GET HOMEPAGE
  // ======================================================

  const fetchHomepage = async () => {
    try {
      setLoading(true);

      const res = await api.get("/homepage");

      setHomepage(res.data);
    } catch (error) {
      console.error("Failed to load homepage:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchHomepage();
  }, []);

  // ======================================================
  // SELECT IMAGE
  // ======================================================

  const handleSelectImage = (field, file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG, WEBP and AVIF images are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum image size is 10MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setSelectedImages((prev) => ({
      ...prev,
      [field]: {
        file,
        preview,
      },
    }));
  };

  // ======================================================
  // UPLOAD IMAGE
  // ======================================================

  const handleUpload = async (field) => {
    const selected = selectedImages[field];

    if (!selected?.file) {
      alert("Please select an image first.");
      return;
    }

    try {
      setUploading((prev) => ({
        ...prev,
        [field]: true,
      }));

      const formData = new FormData();

      formData.append("image", selected.file);

      const res = await api.post(`/homepage/images/${field}`, formData);

      setHomepage(res.data.homepage);

      setSelectedImages((prev) => {
        const updated = {
          ...prev,
        };

        if (updated[field]?.preview) {
          URL.revokeObjectURL(updated[field].preview);
        }

        delete updated[field];

        return updated;
      });
    } catch (error) {
      console.error("Upload image error:", error);

      alert(error.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  // ======================================================
  // DELETE IMAGE
  // ======================================================

  const handleDelete = async (field) => {
    if (!homepage?.[field]) {
      return;
    }

    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذه الصورة؟");

    if (!confirmed) {
      return;
    }

    try {
      setDeleting((prev) => ({
        ...prev,
        [field]: true,
      }));

      const res = await api.delete(`/homepage/images/${field}`);

      setHomepage(res.data.homepage);
    } catch (error) {
      console.error("Delete image error:", error);

      alert(error.response?.data?.message || "Failed to delete image.");
    } finally {
      setDeleting((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          mb: 5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "28px",
                md: "38px",
              },
              fontWeight: 900,
              letterSpacing: 1,
            }}
          >
            Homepage
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#777",
              fontSize: "15px",
            }}
          >
            Manage all homepage images from one place.
          </Typography>
        </Box>

        {/* BACK BUTTON */}

        <IconButton
          onClick={() => navigate("/dashboard")}
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: "14px",

            background: "#fff",
            color: "#111",

            border: "1px solid #e8e8e8",

            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",

            transition: "all 0.25s ease",

            "&:hover": {
              background: "#111",
              color: "#fff",
              borderColor: "#111",
              transform: "translateX(-3px)",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <ArrowBack sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* GRID */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },

          gap: 3,
        }}
      >
        {imageSections.map((item) => {
          const currentImage = homepage?.[item.field];

          const selectedImage = selectedImages[item.field];

          const isUploading = uploading[item.field];

          const isDeleting = deleting[item.field];

          return (
            <Box
              key={item.field}
              sx={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 5px 25px rgba(0,0,0,.05)",
              }}
            >
              {/* CARD HEADER */}

              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: 800,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: "13px",
                      color: "#888",
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageIcon sx={{ color: "#111" }} />
                </Box>
              </Box>

              {/* IMAGE */}

              <Box sx={{ px: 2.5 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: {
                      xs: "260px",
                      sm: "300px",
                    },
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#f4f4f4",
                    border: "1px solid #eee",
                  }}
                >
                  {selectedImage?.preview ? (
                    <Box
                      component="img"
                      src={selectedImage.preview}
                      alt="Selected preview"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : currentImage ? (
                    <Box
                      component="img"
                      src={currentImage}
                      alt={item.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#aaa",
                      }}
                    >
                      <ImageIcon
                        sx={{
                          fontSize: 50,
                          mb: 1,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        No image
                      </Typography>
                    </Box>
                  )}

                  {selectedImage?.preview && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        px: 1.5,
                        py: 0.7,
                        borderRadius: "20px",
                        background: "#111",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      New Image
                    </Box>
                  )}
                </Box>
              </Box>

              {/* ACTIONS */}

              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    flex: 1,
                    minWidth: "150px",
                    height: "46px",
                    borderRadius: "10px",
                    borderColor: "#ddd",
                    color: "#111",
                    fontWeight: 700,
                    textTransform: "none",

                    "&:hover": {
                      borderColor: "#111",
                      background: "#f7f7f7",
                    },
                  }}
                >
                  Choose Image
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                    onChange={(e) => {
                      handleSelectImage(item.field, e.target.files?.[0]);

                      e.target.value = "";
                    }}
                  />
                </Button>

                <Button
                  variant="contained"
                  disabled={!selectedImage?.file || isUploading}
                  onClick={() => handleUpload(item.field)}
                  sx={{
                    flex: 1,
                    minWidth: "150px",
                    height: "46px",
                    borderRadius: "10px",
                    background: "#111",
                    color: "#fff",
                    fontWeight: 700,
                    textTransform: "none",

                    "&:hover": {
                      background: "#333",
                    },
                  }}
                >
                  {isUploading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    "Upload & Replace"
                  )}
                </Button>

                {currentImage && (
                  <IconButton
                    onClick={() => handleDelete(item.field)}
                    disabled={isDeleting}
                    sx={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "10px",
                      border: "1px solid #eee",
                      color: "#d32f2f",

                      "&:hover": {
                        background: "#fff1f1",
                      },
                    }}
                  >
                    {isDeleting ? (
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "#d32f2f",
                        }}
                      />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Homepage;
