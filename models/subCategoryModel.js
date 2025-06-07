const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // unique: true,
      minLength: 3,
      maxLength: 32,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// Create compound unique index for name and category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

subCategorySchema.pre(/^find/, function (nxt) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  nxt();
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
