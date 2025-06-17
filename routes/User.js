const express = require("express");
const productRouter = require("./Product");

// Import controllers
const {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getMe,
  updateMe,
  uploadUserImage,
  resizeImage,
  requestArtisanRole,
  getPendingRequests,
  updateRequestStatus,
  deleteProfilePicture,
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

// Import validators
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

// Public routes
router.post("/signUp", uploadUserImage, resizeImage, signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Protected routes (require authentication)
router.use(protect);

// User profile management
router.get("/me", getMe, getUser);
router.patch(
  "/updateMe",
  uploadUserImage,
  resizeImage,
  updateMeValidator,
  updateMe
);
router.delete("/deleteMe", deleteMe);
router.delete("/deleteProfilePicture", deleteProfilePicture);
router.patch("/updateMyPassword/:id", updatePassword);

// Artisan role request
router.route("/request-artisan").post(restrictTo("user"), requestArtisanRole);

// Nested routes
router.use("/:userId/products", productRouter);

// Admin only routes
router.use(restrictTo("admin"));

// Admin user management
router.route("/").post(createUserValidator, createUser).get(getUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .patch(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

// Admin artisan request management
router.get("/artisan-requests", getPendingRequests);
router.patch("/artisan-requests/:userId", updateRequestStatus);

module.exports = router;
