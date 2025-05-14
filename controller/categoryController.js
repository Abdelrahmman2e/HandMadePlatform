const Category = require("../models/categoryModel");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMW");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const {
  deleteOne,
  getAll,
  getOne,
  updateOne,
  createOne,
} = require("./handlersFactory");

exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`public/img/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

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
