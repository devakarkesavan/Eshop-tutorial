import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = ({ setOpenCart }) => {
  const userId = localStorage.getItem('userid');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`);
        setUser(response.data);
        setItems(response.data.user.cart);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error.response.data);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleQuantityChange = (item, newQuantity) => {
    const updatedItems = items.map((cartItem) => {
      if (cartItem._id === item._id) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    setItems(updatedItems);
  };

  const removeFromCart = (itemId) => {
    const updatedItems = items.filter((cartItem) => cartItem._id !== itemId);
    setItems(updatedItems);
  };

  useEffect(() => {
    // Calculate total price based on cart items
    const total = items.reduce((acc, cartItem) => {
      return acc + cartItem.product.discountPrice * cartItem.quantity;
    }, 0);
    setTotalPrice(total);
  }, [items]);

  if (loading) {
    return <div className="p-4">Loading user data...</div>;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-30 z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] md:w-[25%] bg-white flex flex-col justify-between shadow-sm overflow-y-scroll">
        <div className="flex justify-end pt-5 pr-5">
          <RiCloseLine
            size={25}
            className="cursor-pointer"
            onClick={() => setOpenCart(false)}
          />
        </div>
        <div className="p-2 flex items-center">
          <IoBagHandleOutline size={25} />
          <h5 className="pl-2 text-2xl font-semibold">
            {items.length} items
          </h5>
        </div>
        <div className="border-t">
          {items.map((item, index) => (
            <CartSingle
              key={index}
              item={item}
              handleQuantityChange={handleQuantityChange}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
        <div className="px-5 mb-3">
          <Link to="/checkout/:id">
            <div className="h-12 flex items-center justify-center bg-red-500 rounded-md text-white font-semibold cursor-pointer">
              Checkout Now (USD ${totalPrice})
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CartSingle = ({ item, handleQuantityChange, removeFromCart }) => {
  const { product, quantity } = item;

  const incrementQuantity = () => {
    handleQuantityChange(item, quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(item, quantity - 1);
    }
  };

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between ">
        <div className="flex items-center ">
          <div className="flex flex-col items-center">
            <img
              src={product.images}
              alt={product.name}
              className="w-20 h-20 ml-20 mb-6 rounded "
            />
            <div className="flex flex-row ">
              <div
                className="bg-red-500 ml-12 rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer"
                onClick={decrementQuantity}
              >
                <HiMinus />
              </div>
              <span className="px-4">{quantity}</span>
              <div
                className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 cursor-pointer"
                onClick={incrementQuantity}
              >
                <HiPlus />
              </div>
            </div>


          </div>
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-500">${product.discountPrice} * {quantity}</p>
          </div>
        </div>
        <RiCloseLine
          size={20}
          className="cursor-pointer"
          onClick={() => removeFromCart(item._id)}
        />
      </div>
    </div>
  );
};

export default Cart;
