const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  images: {
        type: String,
        required: true,
      },

  // reviews: [
  //     rating: {
  //       type: Number,
  //     },
  //     comment: {
  //       type: String,
  //     },
  //     createdAt:{
  //       type: Date,
  //       default: Date.now(),
  //     }
  //   },
  // ],
  // ratings: {
  //   type: Number,
  // },
  shopId: {
    type: String,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
