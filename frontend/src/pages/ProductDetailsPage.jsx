import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import axios from "axios";
import { toast } from "react-toastify";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  const [showReviews, setShowReviews] = useState(false);
  const [shopid,setShopid] = useState('')
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/singlepdt/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await response.json();
        setProduct(productData);
        setShopid(productData.shopId)
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const viewReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/getreviews/${id}`);
      setReviews(response.data);
      setShowReviews(true);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`);
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/users/${userId}/cart`, {
        product,
        quantity: 1,
      });
      toast.success("Product added to cart successfully");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-8">
        {product ? (
          <div className="bg-white rounded-lg shadow-lg p-8 grid gap-6 md:grid-cols-2">
            <div>
              <img
                src={product.images}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-md"
                style={{ maxWidth: "100%" }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
              <p className="text-lg mb-4">{product.description}</p>
              <p className="text-gray-600 mb-4">Category: {product.category}</p>
              <p className="text-xl font-semibold text-blue-600 mb-4">
                Price: ${product.originalPrice}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleBuyNow}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add to Cart
                </button>
                <button
                  onClick={viewReviews}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {showReviews ? "Hide Reviews" : "View Reviews"}
                </button>
                <button
                  onClick={() => navigate(`/chat/${shopid}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Chat with Seller
                </button>
              </div>
              {loading ? (
                <p className="text-gray-600 mt-4">Loading reviews...</p>
              ) : showReviews && reviews.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mt-4">Reviews:</h3>
                  <ul className="list-disc pl-6">
                    {reviews.map((review, index) => (
                      <li key={index} className="mt-2">
                        <strong>{review.rating} stars:</strong> {review.comment}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : showReviews ? (
                <p className="text-gray-600 mt-4">No reviews available.</p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-xl mt-8">Loading...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;
