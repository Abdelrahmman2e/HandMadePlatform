const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinary");
const { uploadSingleImage } = require("../middlewares/uploadImageMW");
const { deleteOne, updateOne, getOne, getAll } = require("./handlersFactory");
const AppError = require("../utils/AppError");
const approveArtisanEmailHtml = require("../utils/templates/approveArtisanEmail");
const rejectArtisanEmailHtml = require("../utils/templates/rejectArtisanEmail");
const sendEmail = require("../utils/email");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profile_picture");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64Data, {
    folder: "user_images",
    public_id: `user-${uuidv4()}-${Date.now()}`,
    transformation: [
      { width: 600, height: 600, crop: "fill" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  // Save image into our db
  req.body.profile_picture = result.secure_url;
  next();
});

// const streamifier = require("streamifier");

// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   if (!req.file) return next();

//   const streamUpload = () =>
//     new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "user_images",
//           public_id: `user-${uuidv4()}-${Date.now()}`,
//           transformation: [
//             { width: 600, height: 600, crop: "fill" },
//             { quality: "auto" },
//             { fetch_format: "auto" },
//           ],
//         },
//         (error, result) => {
//           if (result) {
//             resolve(result);
//           } else {
//             reject(error);
//           }
//         }
//       );
//       streamifier.createReadStream(req.file.buffer).pipe(stream);
//     });

//   const result = await streamUpload();
//   req.body.profile_picture = result.secure_url;
//   next();
// });


exports.getMe = (req, res, nxt) => {
  req.params.id = req.user.id;
  nxt();
};

exports.getUsers = getAll(User);

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ data: user });
});

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
      new AppError(
        "This route is not for password updates. please use /updatePassword",
        400
      )
    );
  }

  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });

  if (!user) {
    return nxt(new AppError(`No User for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

exports.requestArtisanRole = asyncHandler(async (req, res, nxt) => {
  const user = await User.findById(req.user.id);
  console.log(user);

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

  const subject =
    status === "approved"
      ? "تمت الموافقة على طلبك لتصبح حرفي"
      : "تم رفض طلبك لتصبح حرفي";

  const message =
    status === "approved"
      ? `تهانينا ${user.name}، تمت الموافقة على طلبك لتصبح حرفيًا.`
      : `مرحبًا ${user.name}، نأسف، تم رفض طلبك لتصبح حرفيًا.`;

  const html =
    status === "approved"
      ? approveArtisanEmailHtml(user.name)
      : rejectArtisanEmailHtml(user.name);

  await sendEmail({
    email: user.email,
    subject,
    message,
    html,
  });

  res.json({ message: `Request ${status}`, user });
});
