const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/categoryController");

const {
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  getCategoryValidator,
} = require("../utils/validators/categoryValidator");

const { protect, restrictTo } = require("../controller/authController");

const subCategoryRouter = require("./SubCategory");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRouter);

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    restrictTo("admin", "artisan"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .delete(
    deleteCategoryValidator,
    protect,
    restrictTo("admin", "artisan"),
    deleteCategory
  )
  .patch(
    updateCategoryValidator,
    protect,
    restrictTo("admin", "artisan"),
    uploadCategoryImage,
    resizeImage,
    updateCategory
  );

module.exports = router;
