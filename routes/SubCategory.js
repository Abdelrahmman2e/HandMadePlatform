const express = require("express");

const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  uploadSubCategoryImage,
  resizeImage,
  createFilterObj,
  setCategoryIdToBody,
} = require("../controller/subCategoryController");

const {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
  getSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const { protect, restrictTo } = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    setCategoryIdToBody,
    protect,
    restrictTo("admin", "artisan"),
    uploadSubCategoryImage,
    resizeImage,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .delete(
    deleteSubCategoryValidator,
    protect,
    restrictTo("admin", "artisan"),
    deleteSubCategory
  )
  .patch(
    protect,
    restrictTo("admin", "artisan"),
    uploadSubCategoryImage,
    resizeImage,
    updateSubCategoryValidator,
    updateSubCategory
  );

module.exports = router;
