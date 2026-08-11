const { Product, ProductImage, Category } = require("../models");

const { Op } = require("sequelize");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

// ======================================================
// CONFIG
// ======================================================

const MAX_PRODUCTS_PER_PAGE = 100;
const DEFAULT_PRODUCTS_PER_PAGE = 12;
const NEW_PRODUCT_DAYS = 30;

const PRODUCT_IMAGES_DIR = path.join(__dirname, "..", "uploads", "products");

// ======================================================
// HELPERS
// ======================================================

function parsePositiveNumber(value, fallback = null) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return fallback;
  }

  return number;
}

function parsePage(value) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function parseLimit(value) {
  const limit = Number(value);

  if (!Number.isInteger(limit) || limit < 1) {
    return DEFAULT_PRODUCTS_PER_PAGE;
  }

  return Math.min(limit, MAX_PRODUCTS_PER_PAGE);
}

function parseBoolean(value) {
  return value === true || value === "true";
}

function parseJSON(value, fallback = []) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function createSlug(text) {
  const base = String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const uniqueId = crypto.randomBytes(4).toString("hex");

  return `${base || "product"}-${uniqueId}`;
}

function generateSKU() {
  return `STH-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

async function deleteProductImages(images = []) {
  if (!images.length) {
    return;
  }

  await Promise.allSettled(
    images.map(async (img) => {
      if (!img?.image) {
        return;
      }

      const filePath = path.join(PRODUCT_IMAGES_DIR, path.basename(img.image));

      try {
        await fs.unlink(filePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Failed to delete product image:", filePath, error);
        }
      }
    }),
  );
}

function getSortOrder(sort) {
  switch (sort) {
    case "priceAsc":
      return [
        ["price", "ASC"],
        ["id", "DESC"],
      ];

    case "priceDesc":
      return [
        ["price", "DESC"],
        ["id", "DESC"],
      ];

    case "popular":
      return [
        ["views", "DESC"],
        ["id", "DESC"],
      ];

    case "oldest":
      return [
        ["createdAt", "ASC"],
        ["id", "ASC"],
      ];

    case "newest":
    default:
      return [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ];
  }
}

// ======================================================
// GET ALL PRODUCTS
// ======================================================

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      gender,
      featured,
      newIn,
      minPrice,
      maxPrice,
      sort = "newest",
    } = req.query;

    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);

    const offset = (page - 1) * limit;

    const where = {};

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    if (search?.trim()) {
      const searchTerm = search.trim();

      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          brand: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          category: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    if (category?.trim()) {
      where.category = {
        [Op.iLike]: category.trim(),
      };
    }

    // --------------------------------------------------
    // GENDER
    // --------------------------------------------------

    if (gender?.trim()) {
      where.gender = gender.trim();
    }

    // --------------------------------------------------
    // FEATURED
    // --------------------------------------------------

    if (parseBoolean(featured)) {
      where.isFeatured = true;
    }

    // --------------------------------------------------
    // NEW IN
    // --------------------------------------------------

    if (parseBoolean(newIn)) {
      const date = new Date();

      date.setDate(date.getDate() - NEW_PRODUCT_DAYS);

      where.createdAt = {
        [Op.gte]: date,
      };
    }

    // --------------------------------------------------
    // PRICE
    // --------------------------------------------------

    const minimumPrice = parsePositiveNumber(minPrice);
    const maximumPrice = parsePositiveNumber(maxPrice);

    if (minimumPrice !== null || maximumPrice !== null) {
      where.price = {};

      if (minimumPrice !== null) {
        where.price[Op.gte] = minimumPrice;
      }

      if (maximumPrice !== null) {
        where.price[Op.lte] = maximumPrice;
      }
    }

    // --------------------------------------------------
    // QUERY
    // --------------------------------------------------

    const result = await Product.findAndCountAll({
      where,

      include: [
        {
          model: ProductImage,
          required: false,
        },
      ],

      distinct: true,

      limit,
      offset,

      order: getSortOrder(sort),

      // Only fetch what frontend actually needs
      // Uncomment/add attributes according to your model.
    });

    return res.status(200).json({
      success: true,
      total: result.count,
      page,
      limit,
      pages: Math.ceil(result.count / limit),
      products: result.rows,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ======================================================
// GET ONE PRODUCT
// ======================================================

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
        },
        {
          model: ProductImage,
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // لا تنتظر تحديث المشاهدات قبل إرسال response
    Product.increment("views", {
      by: 1,
      where: {
        id: productId,
      },
    }).catch((error) => {
      console.error("VIEW INCREMENT ERROR:", error);
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};
// ======================================================
// CREATE PRODUCT
// ======================================================

const createProduct = async (req, res) => {
  const transaction = await Product.sequelize.transaction();

  try {
    const {
      name,
      description,
      price,
      oldPrice,
      stock,
      brand,
      gender,
      sizes,
      colors,
      material,
      category,
      isFeatured,
    } = req.body;

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!name?.trim()) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const productPrice = Number(price);
    const productStock = Number(stock || 0);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid product price",
      });
    }

    if (!Number.isFinite(productStock) || productStock < 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid product stock",
      });
    }

    // --------------------------------------------------
    // PARSE JSON FIELDS
    // --------------------------------------------------

    const parsedSizes = parseJSON(sizes, []);
    const parsedColors = parseJSON(colors, []);

    if (parsedSizes === null || parsedColors === null) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid sizes or colors format",
      });
    }

    // --------------------------------------------------
    // CREATE PRODUCT
    // --------------------------------------------------

    const product = await Product.create(
      {
        name: name.trim(),
        slug: createSlug(name),
        description,
        price: productPrice,
        oldPrice: oldPrice || null,
        stock: productStock,
        sku: generateSKU(),
        brand,
        gender,
        material,
        category,
        sizes: parsedSizes,
        colors: parsedColors,
        isFeatured: parseBoolean(isFeatured),
      },
      { transaction },
    );

    // --------------------------------------------------
    // CREATE IMAGES
    // --------------------------------------------------

    if (req.files?.length) {
      const images = req.files.map((file) => ({
        productId: product.id,
        image: file.filename,
      }));

      await ProductImage.bulkCreate(images, {
        transaction,
      });
    }

    await transaction.commit();

    // --------------------------------------------------
    // RETURN CREATED PRODUCT
    // --------------------------------------------------

    const result = await Product.findByPk(product.id, {
      include: [
        {
          model: ProductImage,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: result,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// ======================================================
// UPDATE PRODUCT
// ======================================================

const updateProduct = async (req, res) => {
  const transaction = await Product.sequelize.transaction();

  try {
    const productId = req.params.id;

    if (!productId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByPk(productId, {
      transaction,
    });

    if (!product) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // --------------------------------------------------
    // PARSE VALUES
    // --------------------------------------------------

    const price =
      req.body.price !== undefined ? Number(req.body.price) : product.price;

    const stock =
      req.body.stock !== undefined ? Number(req.body.stock) : product.stock;

    if (!Number.isFinite(price) || price < 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid product price",
      });
    }

    if (!Number.isFinite(stock) || stock < 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid product stock",
      });
    }

    const updates = {
      price,
      stock,
    };

    // --------------------------------------------------
    // OPTIONAL FIELDS
    // --------------------------------------------------

    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty",
        });
      }

      updates.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      updates.description = req.body.description;
    }

    if (req.body.oldPrice !== undefined) {
      updates.oldPrice = req.body.oldPrice || null;
    }

    if (req.body.brand !== undefined) {
      updates.brand = req.body.brand;
    }

    if (req.body.gender !== undefined) {
      updates.gender = req.body.gender;
    }

    if (req.body.material !== undefined) {
      updates.material = req.body.material;
    }

    if (req.body.category !== undefined) {
      updates.category = req.body.category;
    }

    if (req.body.isFeatured !== undefined) {
      updates.isFeatured = parseBoolean(req.body.isFeatured);
    }

    // --------------------------------------------------
    // SIZES
    // --------------------------------------------------

    if (req.body.sizes !== undefined) {
      const parsedSizes = parseJSON(req.body.sizes);

      if (parsedSizes === null) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: "Invalid sizes format",
        });
      }

      updates.sizes = parsedSizes;
    }

    // --------------------------------------------------
    // COLORS
    // --------------------------------------------------

    if (req.body.colors !== undefined) {
      const parsedColors = parseJSON(req.body.colors);

      if (parsedColors === null) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: "Invalid colors format",
        });
      }

      updates.colors = parsedColors;
    }

    // --------------------------------------------------
    // UPDATE PRODUCT
    // --------------------------------------------------

    await product.update(updates, {
      transaction,
    });

    // --------------------------------------------------
    // REPLACE IMAGES
    // --------------------------------------------------

    if (req.files?.length) {
      const oldImages = await ProductImage.findAll({
        where: {
          productId: product.id,
        },
        transaction,
      });

      await ProductImage.destroy({
        where: {
          productId: product.id,
        },
        transaction,
      });

      const images = req.files.map((file) => ({
        productId: product.id,
        image: file.filename,
      }));

      await ProductImage.bulkCreate(images, {
        transaction,
      });

      await transaction.commit();

      // Delete physical files AFTER DB transaction succeeds
      await deleteProductImages(oldImages);
    } else {
      await transaction.commit();
    }

    // --------------------------------------------------
    // RETURN UPDATED PRODUCT
    // --------------------------------------------------

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: ProductImage,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {}

    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// ======================================================
// DELETE PRODUCT
// ======================================================

const deleteProduct = async (req, res) => {
  const transaction = await Product.sequelize.transaction();

  try {
    const productId = req.params.id;

    if (!productId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByPk(productId, {
      transaction,
    });

    if (!product) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const images = await ProductImage.findAll({
      where: {
        productId: product.id,
      },
      transaction,
    });

    await ProductImage.destroy({
      where: {
        productId: product.id,
      },
      transaction,
    });

    await product.destroy({
      transaction,
    });

    await transaction.commit();

    // Delete physical files after successful DB transaction
    await deleteProductImages(images);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {}

    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
