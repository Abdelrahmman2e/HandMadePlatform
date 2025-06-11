const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 32,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "artisan", "admin"],
      default: "user",
    },
    artisanRequest: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },
      reason: String,
      requestedAt: Date,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dpgetgkkd/image/upload/v1749266254/296fe121-5dfa-43f4-98b5-db50019738a7_wwm1ym.jpg",
    },
    Phone: { 
      type: String,
       required: true },
    birthDate: Date,

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        alias: {
          type: String,
        },
        details: {
          type: String,
          required: true,
          minLength: 3,
          maxLength: 50,
        },
        phone: {
          type: String,
          required: true,
        },
        city: { type: String, required: true },
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (nxt) {
  if (!this.isModified("password") || this.isNew) return nxt();

  this.passwordChangedAt = Date.now() - 1000;

  nxt();
});

userSchema.pre("save", async function (nxt) {
  if (!this.isModified("password")) return nxt();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  nxt();
});

userSchema.pre(/^find/, function (nxt) {
  this.find({ active: { $ne: false } });
  nxt();
});

userSchema.methods.checkPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTime;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 100;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
