const express = require("express");

const productRouter = require("./Product");

const {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getMe,
  updateMe,
  uploadUserPhoto,
  resizeUserPhoto,
  requestArtisanRole,
  getPendingRequests,
  updateRequestStatus,
} = require("../controller/userController");

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  deleteMe,
  restrictTo,
} = require("../controller/authController");

const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  updateMeValidator,
} = require("../utils/validators/userValidator");

const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.use("/:userId/products", productRouter);

router.post("/signUp", signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);

router.patch("/updateMyPassword/:id", updatePassword);

router.get("/me", getMe, getUser);

router.patch(
  "/updateMe",
  uploadUserPhoto,
  resizeUserPhoto,
  updateMeValidator,
  updateMe
);
router.delete("/deleteMe", deleteMe);

router.route("/request-artisan").post(restrictTo("user"), requestArtisanRole);

router.use(restrictTo("admin"));

router.route("/").post(createUserValidator, createUser).get(getUsers);

router.get("/artisan-requests", getPendingRequests);

// Admin updates request status (approve/reject)
router.patch("/artisan-requests/:userId", updateRequestStatus);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .patch(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

// Admin views pending requests

module.exports = router;
