const express = require("express");
const { protect, restrictTo } = require("../controller/authController");
const {
  createCashOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
  findAllOrders,
  filterOrderForLoggedUser,
  checkoutSession,
} = require("../controller/orderController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(
    filterOrderForLoggedUser,
    restrictTo("user", "admin", "artisan"),
    findAllOrders
  );
router.get("/checkout-session/:cartId", checkoutSession);

router.route("/:cartId").post(restrictTo("user"), createCashOrder);

router.put("/:id/pay", restrictTo("admin"), updateOrderToPaid);
router.put("/:id/deliver", restrictTo("admin"), updateOrderToDelivered);

module.exports = router;
