const mongoose = require("mongoose");

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    productId:{
        type:String,
        required:true,
    },
    
  },
)

module.exports = mongoose.model("Review", reviewSchema);