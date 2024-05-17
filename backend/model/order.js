const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
   
    shippingAddress:{
        type: Object,
        required: true,
    },
    product:{
        type:Object,
        required:true,
    },
    user:{
        type: Object,
        required: true,
    },
    totalPrice:{
        type: Number, 
        required: true,
    },
    status:{
        type: String,
        default: "Processing",
    },
    paidAt:{
        type: Date,
        default: Date.now(), 
    },
    deliveredAt: {
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Order", orderSchema);