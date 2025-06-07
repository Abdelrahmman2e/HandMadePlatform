const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinary");
const { uploadSingleImage } = require("../middlewares/uploadImageMW");
const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
  createOne,
} = require("./handlersFactory");

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const base64Data = `data:${
    req.file.mimetype
  };base64,${req.file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64Data, {
    folder: "category_images",
    public_id: `category-${uuidv4()}-${Date.now()}`,
    transformation: [
      { width: 600, height: 600, crop: "fill" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  // Save image into our db
  req.body.image = result.secure_url;
  next();
});

// @desc     Get a list of categories
// @route    GET /api/v1/categories
// @access   Public
exports.getCategories = getAll(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private/Admin-Artisan
exports.createCategory = createOne(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = getOne(Category);
// @desc    Update specific category
// @route   PATCH /api/v1/categories/:id
// @access  Private/Admin-Artisan
exports.updateCategory = updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = deleteOne(Category);
