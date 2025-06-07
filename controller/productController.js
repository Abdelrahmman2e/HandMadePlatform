const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinary");
const {
  deleteOne,
  updateOne,
  getAll,
  getOne,
  createOne,
} = require("./handlersFactory");

const { uploadMixOfImages } = require("../middlewares/uploadImageMW");
const AppError = require("../utils/AppError");

exports.aliasTopProducts = (req, res, nxt) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "title,price,ratingsAverage,description,imageCover,colors";
  nxt();
};

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, nxt) => {
  if (!req.files || !req.files.imageCover || !req.files.images) return nxt();

  // Upload cover image to Cloudinary
  if (req.files.imageCover) {
    const base64Data = `data:${
      req.files.imageCover[0].mimetype
    };base64,${req.files.imageCover[0].buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "product_images",
      public_id: `product-${uuidv4()}-${Date.now()}-cover`,
      transformation: [
        { width: 2000, height: 1333, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    req.body.imageCover = result.secure_url;
  }

  // Upload additional images to Cloudinary
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const result = await cloudinary.uploader.upload(
          `data:${img.mimetype};base64,${img.buffer.toString("base64")}`,
          {
            folder: "product_images",
            public_id: `product-${uuidv4()}-${Date.now()}-${index + 1}`,
            transformation: [
              { width: 2000, height: 1333, crop: "fill" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          }
        );
        req.body.images.push(result.secure_url);
      })
    );
  }

  nxt();
});

exports.setArtisanIdToBody = (req, res, nxt) => {
  if (!req.body.artisan) req.body.artisan = req.user.id;
  nxt();
};

exports.createFilterObj = (req, res, nxt) => {
  let filterObj = {};
  if (req.params.userId) filterObj = { artisan: req.params.userId };
  req.filterObj = filterObj;
  nxt();
};

// @desc     Get a list of products
// @route    GET /api/v1/products
// @access   Public

exports.getProducts = getAll(Product, "Product");

// @desc    Create Product
// @route   POST  /api/v1/products
// @access  Private/Admin-Artisan
exports.createProduct = createOne(Product);

// @desc    Get specific Product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = getOne(Product, { path: "reviews" });

// @desc    Update specific Product
// @route   PATCH /api/v1/products/:id
// @access  Private/Admin-Artisan
// exports.updateProduct = updateOne(Product);
exports.updateProduct = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return nxt(new AppError(`No Product found with that ID :${id}`, 404));
  }

  // console.log(product.artisan)
  if (
    req.user.role !== "admin" &&
    product.artisan._id.toString() !== req.user.id
  ) {
    return nxt(
      new AppError("You are not authorized to update this product", 403)
    );
  }
  const updatedDocument = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "Success",
    data: updatedDocument,
  });
});

// @desc    Delete specific Product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return nxt(new AppError(`No Product found with that ID :${id}`, 404));
  }

  if (
    req.user.role !== "admin" &&
    product.artisan._id.toString() !== req.user.id
  ) {
    return nxt(
      new AppError("You are not authorized to update this product", 403)
    );
  }
  await Product.findByIdAndDelete(id);
  res.status(204).send();
});
