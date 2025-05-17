const User = require("../models/userModel");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/AppError");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMW");

const {
  deleteOne,
  getAll,
  getOne,
  updateOne,
  createOne,
} = require("./handlersFactory");
const AppError = require("../utils/AppError");

exports.uploadUserPhoto = uploadSingleImage("profile_picture");

// Image processing
exports.resizeUserPhoto = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`public/img/users/${filename}`);

    // Save image into our db
    req.body.profile_picture = filename;
  }

  next();
});

exports.getMe = (req, res, nxt) => {
  req.params.id = req.user.id;
  nxt();
};

exports.getUsers = getAll(User);

exports.createUser = createOne(User);

exports.getUser = getOne(User);

// @desc    Update specific User
// @route   PATCH /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = updateOne(User);

// @desc    Delete specific User
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = deleteOne(User);

exports.updateMe = asyncHandler(async (req, res, nxt) => {
  if (req.body.password || req.body.passwordConfirm) {
    return nxt(
      new ApiError(
        "This route is not for password updates. please use /updatePassword",
        400
      )
    );
  }

  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });

  if (!user) {
    return nxt(new ApiError(`No User for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

exports.requestArtisanRole = asyncHandler(async (req, res, nxt) => {
  const user = await User.findById(req.user.id);

  if (user.artisanRequest.status === "pending") {
    return nxt(new AppError("You already have a pending request.", 400));
  }

  user.artisanRequest = {
    status: "pending",
    reason: req.body.reason || "",
    requestedAt: new Date(),
  };

  await user.save({ validateBeforeSave: false });
  res.json({ message: "Artisan role request submitted." });
});

exports.getPendingRequests = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({
    "artisanRequest.status": "pending",
  }).select("name email artisanRequest");
  res.json(pendingUsers);
});

// Controller: admin updates the artisanRequest status + user role
exports.updateRequestStatus = asyncHandler(async (req, res, nxt) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return nxt(new AppError(`Invalid Status..!!`, 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return nxt(new AppError(`No user for this id`, 404));
  }
  if (user.artisanRequest.status !== "pending") {
    return nxt(new AppError("No pending request found.", 400));
  }

  user.artisanRequest.status = status;
  if (status === "approved") {
    user.role = "artisan";
  }
  await user.save({ validateBeforeSave: false });

  res.json({ message: `Request ${status}`, user });
});
