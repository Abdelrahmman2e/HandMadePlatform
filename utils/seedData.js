const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const cloudinary = require("../config/cloudinary");
const csv = require("csv-parse/sync");
const slugify = require("slugify");

// Import your models
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoryModel");

// Database configuration
const DB_URI =
  "mongodb+srv://abdelRahman2e:0Me5nWhMjRkQWnir@cluster0.0y2yjaw.mongodb.net/handMade?retryWrites=true&w=majority&appName=Cluster0";

// Function to upload image to Cloudinary
const uploadImage = async (imagePath, productId, isCoverImage = false) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: isCoverImage ? "imageCover_products" : "images_products",
      public_id: `${productId}-${Date.now()}`,
      transformation: [
        { width: 800, height: 800, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

const seedDB = async () => {
  try {
    await mongoose.connect(DB_URI);

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: "Abdelrahman Mostafa Said",
      email: "amostafa12e1@gmail.com",
      password: "password",
      passwordConfirm: "password",
      role: "admin",
    });
    console.log("Admin user created successfully");

    // Read CSV data
    const csvData = await fs.readFile(
      path.join(__dirname, "dummayData/egyptian_handmade_crafts (1).csv"),
      "utf-8"
    );
    const records = csv.parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    // Create artisans (unique names from CSV)
    const artisanNames = [...new Set(records.map((record) => record.artisan))];
    const artisans = await User.create(
      artisanNames.map((name) => ({
        name,
        email: `${name.toLowerCase().replace(/\s+/g, "")}@example.com`,
        password: "password123",
        passwordConfirm: "password123",
        role: "artisan",
      }))
    );
    console.log("Artisans created successfully");

    // Create categories from unique values in CSV
    const uniqueCategories = [
      ...new Set(records.map((record) => record.category_name)),
    ];
    const categories = await Category.create(
      uniqueCategories.map((name) => ({
        name,
        slug: slugify(name, { lower: true }),
      }))
    );
    console.log("Categories created successfully");

    // Create subcategories with proper category relationships
    const subcategories = [];
    for (const record of records) {
      // Skip if no subcategory
      if (!record.subcategories) continue;

      // Find the corresponding category
      const category = categories.find((c) => c.name === record.category_name);
      if (!category) {
        console.log(
          `Warning: No category found for subcategory: ${record.subcategories}`
        );
        continue;
      }

      // Check if this subcategory already exists for this category
      const existingSubcategory = subcategories.find(
        (s) =>
          s.name === record.subcategories &&
          s.category.toString() === category._id.toString()
      );

      if (!existingSubcategory) {
        // Create new subcategory
        const subcategory = await Subcategory.create({
          name: record.subcategories,
          category: category._id,
          slug: slugify(record.subcategories, { lower: true }),
        });
        subcategories.push(subcategory);
      }
    }
    console.log(`Created ${subcategories.length} subcategories successfully`);

    // Create products
    for (const record of records) {
      const artisan = artisans.find((a) => a.name === record.artisan);
      const category = categories.find((c) => c.name === record.category_name);

      // Create product
      const product = await Product.create({
        title: record.title,
        slug: slugify(record.title, { lower: true }),
        description: record.description,
        price: record.price,
        priceAfterDiscount: record.priceAfterDiscount,
        category: category._id,
        subcategories: [
          subcategories.find((s) => s.name === record.subcategories)?._id,
        ].filter(Boolean),
        colors: record.colors
          ? record.colors
              .replace(/"/g, "") // Remove all quotes
              .split(",")
              .map((color) => color.trim())
          : [],
        size: record.size,
        weight: record.weight,
        quantity: record.quantity,
        sold: record.sold,
        ratingsAverage: record.ratingsAverage,
        ratingsQuantity: record.ratingsQuantity,
        location: record.location,
        artisan: artisan._id,
        currency: record.currency,
        imageCover: record.imageCover,
        images: record.images ? record.images.split(",") : [],
      });
    }

    console.log("Products created successfully");

    // Create some sample reviews
    const products = await Product.find();
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per product

      for (let i = 0; i < numReviews; i++) {
        await Review.create({
          review: "Great quality and beautiful craftsmanship!",
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
          user_id: admin._id,
          product: product._id,
        });
      }
    }

    console.log("Reviews created successfully");
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
