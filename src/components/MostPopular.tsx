import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/SkeletonCard.css';
import EmptyCart from "../assets/empty-cart.png";
import { HeartButton } from "./HeartButton";

export const MostPopular = () => {
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 16;
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  const productGridRef = useRef<HTMLDivElement>(null);

  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchProducts = (category: string) => {
    setLoading(true);
    const url =
      category === "All"
        ? `${API}/popular-products`
        : `${API}/popular-products?category=${encodeURIComponent(category)}`;

    axios
      .get(url)
      .then((response) => {
        setTimeout(() => {
          setPopularProducts(response.data);
          setFilteredProducts(response.data);
          setCurrentPage(1);
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching popular products data", error);
        setLoading(false);
      });
  };

  console.log("Popular Products:", popularProducts);

  const fetchWishlist = async () => {
    if (userId) {
        try {
            const response = await axios.get(`${API}/wishlist?userId=${userId}`);
            const wishlistedIds = response.data.map((item: any) => item.id);
            setWishlistItems(wishlistedIds);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            setWishlistItems([]);
        }
    } else {
        setWishlistItems([]);
    }
};

  useEffect(() => {
    fetchProducts("All");
    fetchWishlist();
  }, [userId]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
};

  const skeletonCards = Array(16).fill(null);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => {
  setCurrentPage(pageNumber)
  if (productGridRef.current) {
    productGridRef.current.scrollIntoView({ behavior: 'smooth'});
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (pageNumbers.length <= maxPagesToShow) {
      startPage = 1;
      endPage = pageNumbers.length;
    } else {
      const middlePage = Math.ceil(maxPagesToShow / 2);
      if (currentPage <= middlePage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + middlePage - 1 >= pageNumbers.length) {
        startPage = pageNumbers.length - maxPagesToShow + 1;
        endPage = pageNumbers.length;
      } else {
        startPage = currentPage - middlePage + 1;
        endPage = currentPage + middlePage - 1;
      }
    }

    if (startPage > 1) {
      pages.push(
        <li key="ellipsis-start">
          <span className="px-3 py-2">...</span>
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => paginate(i)}
            className={`px-3 py-2 rounded-md cursor-pointer ${currentPage === i ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {i}
          </button>
        </li>
      );
    }

    if (endPage < pageNumbers.length) {
      pages.push(
        <li key="ellipsis-end">
          <span className="px-3 py-2">...</span>
        </li>
      );
    }

    return (
      <ul className="flex space-x-2">
        {currentPage > 1 && ( // Conditionally render "Previous"
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-2 rounded-md flex bg-gray-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          </li>
        )}
        {pages}
        {currentPage < pageNumbers.length && ( // Conditionally render "Next"
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-2 flex rounded-md bg-gray-200 cursor-pointer"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        )}
      </ul>
    );
  };


  return (
    <section className="container mx-auto px-4 py-10 transition-all duration-300" ref={productGridRef}>
      <h2 className="text-3xl font-bold mb-8">Most Popular Products</h2>

      <div className="space-y-3 space-x-4 mb-8 font-semibold">
        {["All", "Smart Phone", "Smart Watch", "TWS", "Drone", "Game Console", "Smart TV"].map((category) => (
          <button
            key={category}
            className={`px-4 py-1 shadow-xs rounded-xs cursor-pointer ${selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10">
          {skeletonCards.map((_, index) => (
            <div key={index} className="skeleton__card">
              <div className="skeleton__card__skeleton skeleton__card__description"></div>
              <div className="skeleton__card__skeleton skeleton__card__title"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10">
          {currentProducts.length > 0 ? (
            currentProducts.map((product: any) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product-details/${product.id}/${product.name}`)}
                className="p-4 rounded-lg shadow-lg flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <HeartButton
                  userId={userId}
                  productEntryId={product.id}
                  initialLiked={wishlistItems.includes(product.id)}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={`${API}/${product.product_color_img}`}
                    alt={product.name}
                    className="max-w-full max-h-[200px] object-contain"
                  />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-gray-500">{product.category}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-10">
              <img src={EmptyCart} alt="Empty Cart" className="w-50 h-auto" />
              <p className="text-center text-gray-500 col-span-full">No products found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <nav className="flex justify-end mt-10">
          {renderPagination()}
        </nav>
      )}
    </section>
  );
};