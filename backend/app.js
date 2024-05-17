const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors({
  origin: ['http://localhost:3000',],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");
const Products = require("./model/product");
const Order = require('./model/order')
const Review = require("./model/review");
const User = require("./model/user");
const Messages = require("./model/messages")
app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);

app.post('/createproducts', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId,
      images
    } = req.body;

    // Create a new product instance
    const newProduct = new Products({
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId,
      images
    });

    // Save the new product to the database
    await newProduct.save();

    // Respond with success message and the newly created product
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});

//to get all products

app.get('/allitems', async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Products.find();

    // Respond with the array of products
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

app.put('/edititem/:id' ,async (req, res) => {
  const { id } = req.params;
  const { name, description, category, tags, originalPrice, discountPrice, stock } = req.body;

  try {
    const product = await Products.findByIdAndUpdate(
      id,
      { name, description, category, tags, originalPrice, discountPrice, stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.delete('/deleteitem/:id',async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get("/singlepdt/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID in the database
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If the product is found, send it in the response
    res.status(200).json( product );
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post('/neworder', async (req, res) => {
  const order = new Order({
    shippingAddress: req.body.shippingAddress,
    product: req.body.product,
    user: req.body.user,
    totalPrice: req.body.totalPrice,
  });
  

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get data for single users
app.get('/userorder/:user', async (req, res) => {
  const userId = req.params.user;

  try {
    const orders = await Order.find({ 'user': user });
    res.json(orders);
    console.log(orders)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/addreviews", async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    console.log(req.body)
    // Create a new review instance
    const newReview = new Review({ rating, comment, productId });

    // Save the review to the database
    const savedReview = await newReview.save();

    res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/users/:userId/cart', async (req, res) => {
  const userId = req.params.userId;
  const { product, quantity } = req.body; // Assuming req.body contains product and quantity

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Append new cart item to user's cart array
    user.cart.push({ product, quantity });

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Cart updated successfully', user });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(req.body)

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } 

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/getreviews/:id', async (req, res) => {
  const { id } = req.params; // Extract productId from request parameters

  try {
    const reviews = await Review.find({ productId: id });
     console.log(reviews)
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/orders/shop/:shopid", async (req, res) => {
  const { shopid } = req.params;

  try {
    // Fetch orders by shopid from the database
    const orders = await Order.find({ "product.shopId": shopid });
    console.log(orders)
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}); 

app.get("/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/obtain/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Messages.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/messages', async (req, res) => {
  const { sender, receiver, message } = req.body;
  const newMessage = new Messages({ sender, receiver, message });
  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/allchats/:receiverId', async (req, res) => {
  const receiverId = req.params.receiverId;

  try {
    const chats = await Messages.find({ receiver: receiverId })
      .populate('sender', 'username') 
      .select('sender')
      .distinct('sender');

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat threads.' });
  }
});

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
