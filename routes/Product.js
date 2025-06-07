const express = require("express");
const reviewRouter = require("./Review");

const {
  createProduct,
  getProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  aliasTopProducts,
  uploadProductImages,
  resizeProductImages,
  createFilterObj,
  setArtisanIdToBody,
} = require("../controller/productController");



const {
  getProductValidator,
  deleteProductValidator,
  updateProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");

const { protect, restrictTo } = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router.use("/:productId/reviews", reviewRouter);

router.route("/top-rated").get(aliasTopProducts, getProducts);

router
  .route("/")
  .get(createFilterObj, getProducts)
  .post(
    protect,
    restrictTo("artisan", "admin"),
    uploadProductImages,
    resizeProductImages,
    setArtisanIdToBody,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(
    protect,
    restrictTo("admin", "artisan"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    deleteProductValidator,
    protect,
    restrictTo("admin", "artisan"),
    deleteProduct
  );

module.exports = router;
