import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BsEye, BsHeart, BsBag } from "react-icons/bs";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/allitems");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  const pageCount = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  const handlePageChange = (page) => {
    setPageNumber(page);
  };

  return (
    <>
      <Header activeHeading={3} />
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <Loader />
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => (
                <Link key={index} to={`/product/${product._id}`} className="hover:no-underline">
                  <div className="relative">
                    <img src={product.images} alt={product.name}  className="h-64 w-full object-cover rounded-lg shadow-lg" />
                    <div className="absolute top-2 right-2 flex flex-col space-y-2">
                      <BsEye size={24} className="text-gray-700 cursor-pointer hover:text-blue-500" />
                      <BsBag size={24} className="text-gray-700 cursor-pointer hover:text-blue-500" />
                      <BsHeart size={24} className="text-gray-700 cursor-pointer hover:text-red-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-700">Category: {product.category}</p>
                        <p className="text-green-600 font-bold">${product.discountPrice}</p>
                      </div>
                      <p className="text-gray-700 mb-4">Stock: {product.stock}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`mx-2 px-4 py-2 rounded ${
                    page === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        ) : (
          <h1 className="text-center text-2xl text-gray-800 mt-8">No products found!</h1>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
