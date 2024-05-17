import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import styles from "../styles/styles";

const UserOrderDetails = () => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const userId = localStorage.getItem("userid");
  const [userOrders, setUserOrders] = useState([]);
  const [productId,setProductId]=useState('')
  
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/userorder/${userId}`);
        setUserOrders(response.data);
       
        console.log(userOrders)
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    };

    fetchUserOrders();
  }, [userId]);
 
  const reviewHandler = async () => {
    try {
      // Send POST request to backend API to add review
      const response = await axios.post("http://localhost:8000/addreviews", {
        rating,
        comment,
        productId,
      });
      

      toast.success("Review added");
      // Handle success (e.g., show a success message to the user)
    } catch (error) {
      toast.error("Error adding review");
      // Handle error (e.g., show an error message to the user)
    }
  };
  console.log(productId)
  return (
    <div className="py-4 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="ml-2 text-3xl font-bold text-gray-800">Order Details</h1>
          </div>
        </div>

        {userOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-sm text-gray-600">Order ID: {order._id.slice(0, 8)}</h5>
              <h5 className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</h5>
            </div>
            <div className="flex items-center mb-4">
              <img src={order.product.images} alt={order.product.name} className="w-40 h-30 object-cover rounded-md mr-4 ml-5" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{order.product.name}</h2>

                <p className="text-sm text-gray-600">status : {order.status}</p>
              </div>
            </div>
            <div className="border-t pt-4 text-right">
              <h5 className="text-lg font-semibold text-gray-800">Total Price: <strong>${order.totalPrice}</strong></h5>
            </div>
            <button onClick={() => { setOpen(true); setSelectedItem(order.product); setProductId(order.product._id) }} className={`${styles.button} text-white w- py-2 mt-4 bg-indigo-600 hover:bg-indigo-700`}>
              Leave a Review
            </button>
          </div>
        ))}

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
              <div className="flex justify-end">
                <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-800">
                < RxCross1 />
                </button>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Give a Review</h2>
              <div className="flex items-center mb-4">
                <img src={selectedItem.images} alt={selectedItem?.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{selectedItem?.name}</h3>
                  
                </div>
              </div>
              <div className="flex items-center mb-4">
                <p className="mr-2 text-lg font-semibold text-gray-800">Rating:</p>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} onClick={() => setRating(i)}>
                    {rating >= i ? <AiFillStar size={24} className="text-yellow-500 cursor-pointer" /> : <AiOutlineStar size={24} className="text-yellow-500 cursor-pointer" />}
                  </span>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full h-24 border border-gray-300 rounded p-2 mb-4"
              ></textarea>
              <button
                onClick={reviewHandler}
                className={`${styles.button} text-white w-full py-2 bg-indigo-600 hover:bg-indigo-700`}
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        <Link to="/">
          <button className={`${styles.button} text-white w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700`}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserOrderDetails;
