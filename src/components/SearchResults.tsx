import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SideBar } from "./SideBar";
import axios from "axios";
import NoProductFoundImg from '../assets/no_product_found.png'
import QVerified from '../assets/Q_verified.png'
import { Loading } from "./Loading";
import { HeartButton } from "./HeartButton";

type AllProducts = {
  id: number;
  product_id: string;
  name: string;
  description: string;
  category: string;
  color_name: string;
  product_color_img: string;
  actual_price: number;
  strike_price: number;
  reviews: number;
  stocks: number;
  ratings: number;
  product_specifications: Record<string, string>;
  trending_score: number;
  views_count: number;
  brand: string;
};

export const SearchResults = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<AllProducts[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<AllProducts[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [minPriceFilter, setMinPriceFilter] = useState<number>(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(Infinity);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);


  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);

      try {
        let response;
        if (searchQuery) {
          response = await axios.get(`${API}/products`, {
            params: { search: searchQuery },
          });
        } else if (category) {
          response = await axios.get(`${API}/category-products`, {
            params: { category: category },
          });
        }
        setAllProducts(response?.data || []);
        setFilteredProducts(response?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${API}/wishlist?userId=${userId}`);
          const wishlistedIds = response.data.map((item: any) => item.id); // Assuming your wishlist fetch returns products with their IDs
          setWishlistItems(wishlistedIds);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          setWishlistItems([]); // Default to empty if error
        }
      } else {
        setWishlistItems([]);
      }
    };
    fetchAllProducts();
    fetchWishlist();
  }, [category, searchQuery, userId]);

  useEffect(() => {
    if (allProducts) {
      let filtered = allProducts;

      if (selectedBrands.length > 0) {
        filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
      }

      if (selectedRatings.length > 0) {
        filtered = filtered.filter((product) => selectedRatings.includes(Math.floor(product.ratings)));
      }
      //Filter by price
      filtered = filtered.filter((product) => product.actual_price >= minPriceFilter && product.actual_price <= maxPriceFilter);

      setFilteredProducts(filtered);
    }
  }, [selectedBrands, selectedRatings, allProducts, minPriceFilter, maxPriceFilter]);

  if (loading) {
    return (
      <div
        className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Loading />
      </div>
    );
  }
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!filteredProducts || filteredProducts.length === 0) return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <img src={NoProductFoundImg} className="w-80 h-auto" alt="No products found" />
        <p className="text-center text-lg">No products found.</p>
      </div>
      <Footer />
    </>
  );

  const handleBrandFilterChange = (brands: string[]) => setSelectedBrands(brands);
  const handleRatingFilterChange = (ratings: number[]) => setSelectedRatings(ratings);
  const handlePriceFilter = (min: number, max: number) => {
    console.log('Price filter applied:', min, max);
    setMinPriceFilter(min);
    setMaxPriceFilter(max);
  };

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
  };


  return (
    <>
      <Navbar />
      <style>
        {`
        @keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

        @media (max-width: 768px) {
        .mob-grid{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
.mob-fullwd{
width: 100%;
}
.mob-noflex{
display: block;
}
        `}
      </style>
      <section className="bg-gray-100 mt-0 md:mt-20 flex mob-noflex animate-fade-in" style={{ minHeight: '100vh' }}>
        <SideBar onBrandFilterChange={handleBrandFilterChange} onRatingFilterChange={handleRatingFilterChange} onPriceFilterChange={handlePriceFilter} />
        <div className="w-3/4 p-6 mob-fullwd">
          <h2 className="text-2xl font-bold mb-4">
            Search Results for{" "}
            {category && !searchQuery ? `"${category}"` : ""}
            {searchQuery && !category ? `"${searchQuery}"` : ""}
            {category && searchQuery ? `"${searchQuery}" in "${category}"` : ""}
          </h2>
          {/* Desktop View */}
          <div className="hidden md:block">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product-details/${product.id}/${product.name}`)}
                className="flex my-6 bg-white shadow-xs border border-gray-300 cursor-pointer mob-grid transition-all duration-300 hover:border-blue-600"
              >
                <div className="w-1/4 p-3 flex-shrink-0 relative mob-fullwd">
                  <HeartButton
                    userId={userId}
                    productEntryId={product.id}
                    initialLiked={wishlistItems.includes(product.id)}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                  <img
                    src={`${API}/${product.product_color_img}`}
                    alt={product.name}
                    className="w-50 h-auto object-contain mx-auto"
                  />
                </div>
                <div className="w-2/4 flex-grow p-3 mob-fullwd">
                  <h3 className="text-xl text-black font-semibold">{product.name} {product.color_name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="flex gap-2">
                    <p className="bg-green-600 text-white text-md my-1 w-13 h-7 p-1 rounded-sm text-center flex items-center justify-center gap-1">
                      {parseFloat(product.ratings).toFixed(1)} <span className="text-white">★</span>
                    </p>
                    <p className="my-2 font-semibold text-gray-600">{product.reviews} Reviews</p>
                  </div>
                  <div className="my-1">
                    {product.product_specifications && Object.keys(product.product_specifications).length > 0 ? (
                      <ul className="list-disc pl-5">
                        {Object.entries(product.product_specifications).map(([key, value], index) => (
                          <li key={index}>
                            <span className="font-semibold">{key}:</span> {value as string}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No specifications available.</p>
                    )}
                  </div>
                </div>
                <div className="w-1/4 p-5 flex flex-col justify-baseline items-end flex-shrink-0 mob-fullwd">
                  <p className="text-black text-3xl font-bold p-1">${product.actual_price}</p>
                  <div className="flex gap-0.5">
                    <p className="text-gray-500 text-md line-through p-1">${product.strike_price}</p>
                    <p className="text-md text-green-600 font-semibold mt-1 whitespace-nowrap">
                      {Math.round(((product.strike_price - product.actual_price) / product.strike_price) * 100)}% Off
                    </p>
                  </div>
                  <div className="flex italic py-1">
                    <img src={QVerified} className="w-5 h-5" alt="Quivio Verified Badge"></img>
                    <p className="text-sm">Quivio<span className="text-[#AB00FF]">.</span>Verified<span className="text-[#AB00FF]">.</span></p>
                  </div>
                  {product.stocks < 55 && (
                    <div className="my-2 text-red-600 text-[12px] font-semibold">
                      <p>Only few stocks Left</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Mobile Grid View */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product-details/${product.id}/${product.name}`)}
                className="bg-white border border-gray-300 p-2 rounded-md shadow-sm"
              >
                <div className="relative">
                  <HeartButton
                    userId={userId}
                    productEntryId={product.id}
                    initialLiked={wishlistItems.includes(product.id)}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                  />
                  <img
                    src={`${API}/${product.product_color_img}`}
                    alt={product.name}
                    className="w-full h-[120px] object-contain"
                  />
                </div>
                <h3 className="text-sm font-semibold mt-1 line-clamp-2">{product.name} {product.color_name}</h3>
                <p className="text-xs text-gray-500">{product.brand}</p>
                <div className="text-sm flex items-center gap-1">
                  <p className="bg-green-600 text-white text-xs my-1 w-11 h-5 p-1 rounded-sm text-center flex items-center justify-center gap-1">
                    {parseFloat(product.ratings).toFixed(1)} <span className="text-white">★</span>
                  </p>
                  <p className="my-2 font-medium text-gray-600">{product.reviews} Reviews</p>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-base font-bold text-black">${product.actual_price}</p>
                  <p className="line-through text-xs text-gray-500">${product.strike_price}</p>
                  <p className="text-xs text-green-600 font-semibold">
                    {Math.round(((product.strike_price - product.actual_price) / product.strike_price) * 100)}% Off
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};
