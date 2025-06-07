const Subcategory = require("../models/subCategoryModel");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinary");
const { uploadSingleImage } = require("../middlewares/uploadImageMW");

const {
  deleteOne,
  getAll,
  getOne,
  updateOne,
  createOne,
} = require("./handlersFactory");

exports.createFilterObj = (req, res, nxt) => {
  let filterObj = {};

  if (req.params.categoryId) filterObj = { category: req.params.categoryId };

  req.filterObj = filterObj;
  nxt();
};

// @desc    Get a list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = getAll(Subcategory);

exports.setCategoryIdToBody = (req, res, nxt) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  nxt();
};

// @desc    Create a new subcategory
// @route   POST /api/v1/subcategories
// @access  Private/Admin-Artisan
exports.createSubCategory = createOne(Subcategory);

// @desc    Get a specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = getOne(Subcategory);

// @desc    Update a specific subcategory by id
// @route   PATCH /api/v1/subcategories/:id
// @access  Private/Admin-Artisan
exports.updateSubCategory = updateOne(Subcategory);

// @desc    Delete a specific subcategory by id
// @route   DELETE /api/v1/subcategories/:id
// @access  Private/Admin-Artisan
exports.deleteSubCategory = deleteOne(Subcategory);

// Upload single image
exports.uploadSubCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(
    base64Data,
    {
      folder: "subcategory_images",
      public_id: `subcategory-${uuidv4()}-${Date.now()}`,
      transformation: [
        { width: 600, height: 600, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    }
  );

  // Save image into our db
  req.body.image = result.secure_url;
  next();
});
