const express = require("express");
const { protect, restrictTo } = require("../controller/authController");
const {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} = require("../controller/couponController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("admin", "artisan"), getCoupons)
  .post(restrictTo("admin", "artisan"), createCoupon);
router
  .route("/:id")
  .get(restrictTo("admin", "artisan"), getCoupon)
  .delete(restrictTo("admin", "artisan"), deleteCoupon)
  .patch(restrictTo("admin", "artisan"), updateCoupon);

module.exports = router;
