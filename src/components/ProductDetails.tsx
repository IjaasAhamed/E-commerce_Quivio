import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import '../styles/Buttons.css'
import truck from '../assets/truck.png';
import undo from "../assets/undo.png";
import CartIcon from '../assets/cart icon.png'
import BuyNow from '../assets/lightning.png'
import Tag from '../assets/green-tag.webp'
import QVerified from '../assets/Q_verified.png'
import { Loading } from "./Loading";
import { HeartButton } from "./HeartButton";
import { Reviews } from "./Reviews";
import toast from "react-hot-toast";
import { warningToast } from "./WarningToast";
import { useCart } from "../context/cartContext";

interface Product {
  isInWishlist: any;
  id: number;
  name: string;
  description: string;
  category: string;
  color_name: string;
  product_color_img: string;
  actual_price: number;
  strike_price: number;
  stocks: number;
  offers: string | string[];
  ratings: any;
  reviews: number;
  in_box_content: string;
  product_specifications: Record<string, string>;
  trending_score: number;
  views_count: number;
}

interface Review {
  name: string;
  rating: number;
  comment: string;
}

const generateFakeName = () => {
  const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Jona", "Grace", "Henry", "Ivy", "Kevin"];
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomRating = () => Math.floor(Math.random() * 5) + 1;

export const ProductDetails = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const { id, name } = useParams<{ id: string; name: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [colorVariants, setColorVariants] = useState<Product[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [generatedReviews, setGeneratedReviews] = useState<Review[]>([]);
  const [showZoom, setShowZoom] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const zoomRef = useRef<HTMLDivElement>(null);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const productCardRef = useRef<HTMLDivElement>(null);
  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  const { setCartCount } = useCart();

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product is already in cart
    const existingItem = cartItems.find((item: Product) => item.id === product?.id);
    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity
    } else {
      cartItems.push({ ...product, quantity: 1 }); // Add new item
    }

    localStorage.setItem("cart", JSON.stringify(cartItems)); // Save cart data
    setCartCount(cartItems.length);
    navigate("/cart"); // Redirect to cart page
  };

  let offersArray: string[] = [];
  let errorMsg: string | null = null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product by ID
        const response = await axios.get(`${API}/product-details/${id}`);
        setProduct(response.data);
        setSelectedImage(`${API}/${response.data.product_color_img}`); // Set default image

        if (response.data?.reviews > 0) {
          const initialReviewCount = Math.min(5, response.data.reviews); // Show up to 5 initial reviews
          setGeneratedReviews(generateRandomReviews(initialReviewCount, response.data.name));
        }

        // Fetch product color variants by Name
        const colorResponse = await axios.get(`${API}/product-variants/${name}`);
        setColorVariants(colorResponse.data); // Set color variants

        // ✅ Fetch similar products based on category (excluding current product)
        const similarResponse = await axios.get(`${API}/similar-products?category=${response.data.category}&excludeId=${response.data.id}`);
        setSimilarProducts(similarResponse.data);
      } catch (err) {
        setError("Failed to fetch Product Details");
      } finally {
        setLoading(false);
      }
    };

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
    fetchProduct();
    fetchWishlist();
  }, [id, name, userId]);

  const generateRandomReviews = (count: number, productName: string): Review[] => {
    const adjectives = ["Excellent", "Great", "Good", "Amazing", "Fantastic", "Satisfied", "Impressed", "Decent", "Okay", "Disappointed"];
    const aspects = ["quality", "price", "performance", "design", "features", "usability", "comfort", "sound", "battery life", "camera"];
    const sentiments = ["love it", "really like it", "it's okay", "could be better", "not great"];

    const reviews: Review[] = [];
    for (let i = 0; i < count; i++) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const aspect1 = aspects[Math.floor(Math.random() * aspects.length)];
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      reviews.push({
        name: generateFakeName(),
        rating: generateRandomRating(),
        comment: `${adjective} ${productName}! The ${aspect1} is ${sentiment}.`,
      });
    }
    return reviews;
  };

  const handleShowReviews = () => {
    if (reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (product) {
      const numberOfReviewsToShow = Math.min(5, product.reviews);
      setGeneratedReviews(generateRandomReviews(numberOfReviewsToShow, product.name));
      setTimeout(() => {
        reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current && productCardRef.current) {
      const cardWidth = productCardRef.current.offsetWidth + 16; // Adjust for margin
      const scrollAmount = window.innerWidth < 768 ? -cardWidth : -cardWidth * 4;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current && productCardRef.current) {
      const cardWidth = productCardRef.current.offsetWidth + 16; // Adjust for margin
      const scrollAmount = window.innerWidth < 768 ? cardWidth : cardWidth * 4;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Check if the scroll position is at the start or end
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  const handleProductClick = (id: string, name: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/product-details/${id}/${name}`);
  };

  useEffect(() => {
    // Initialize the scroll state
    handleScroll();
  }, [similarProducts.length]);

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
  if (!product) return <p className="text-center mt-10">No product found.</p>;

  console.log("Product:", product);
  console.log("Product Offers:", product?.offers); // Use optional chaining

  if (product?.offers) {
    if (typeof product.offers === 'string') {
      if (product.offers.trim() === "") {
        offersArray = [];
      } else {
        try {
          const parsedOffers = JSON.parse(product.offers);
          if (Array.isArray(parsedOffers)) {
            offersArray = parsedOffers;
          } else {
            errorMsg = "Parsed offers is not an array.";
          }
        } catch (parseError) {
          errorMsg = "Error parsing offers.";
        }
      }
    } else if (Array.isArray(product.offers)) {
      offersArray = product.offers;
    } else {
      errorMsg = "Invalid offers data.";
    }
  }

  const handleBuyNow = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      warningToast("Please Login to continue!")
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    try {
      // Fetch user address from backend
      const userResponse = await axios.get(`${API}/shipping-address/${userId}`);
      const userData = userResponse.data;

      const userAddress = {
        street: userData?.street,
        city: userData?.city,
        state: userData?.state,
        zip: userData?.zip,
        country: userData?.country,
      };

      console.log("User address", userAddress);

      // Check if any address component is missing
      if (
        !userAddress.street ||
        !userAddress.city ||
        !userAddress.state ||
        !userAddress.zip ||
        !userAddress.country
      ) {
        setShowAddressModal(true);
        setTimeout(() => {
          navigate('/profile');
        }, 2500);
        return;
      }

      // Create order data
      const orderDetails = {
        userId,
        productId: product?.id,
        quantity: 1,
        price: product?.actual_price,
        address: userAddress,
        color_name: product?.color_name,
        product_color_img: product?.product_color_img,
        name: product?.name,
      };

      navigate(`/checkout?productId=${orderDetails.productId}&quantity=${orderDetails.quantity}&price=${orderDetails.price}&color_name=${encodeURIComponent(orderDetails.color_name)}&product_color_img=${encodeURIComponent(orderDetails.product_color_img)}&name=${encodeURIComponent(orderDetails.name)}`);

    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };


  const handleRemoveFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
  };

  // Product Image Magnify
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <>
      <style>
        {`
          body {
            display: block !important;
          }
            .no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

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

@media (max-width:768px) {
.mob-no-con{
padding-left: 0px;
padding-right: 0px;
}
}

            @media (max-width:1030px) {
            .mob-noflex{
            display:block;
            }
            .mob-nopad{
            padding: 0;
            }
            .mob-fullwd{
            width: 100%;
            }
            .mob-restxt{
            font-size: 30px;
            }
            .mob-py{
            padding-top: 120px;
            padding-bottom: 10px;
            }
            }
            
        `}
      </style>
      <Navbar />
      <section className=" bg-gray-50 py-25 mob-py">
        <div className="container w-full mx-auto mob-no-con">
          <div className="bg-white shadow-lg md:rounded-md p-8 flex gap-15 mob-noflex animate-fade-in">

            {/* Left Side - Product Image & Buttons */}
            <div className="w-1/2 flex flex-col items-start p-10 mob-nopad mob-fullwd xl:sticky top-20 self-start">
              <div className="rounded-md border border-gray-300 mx-auto relative"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}>
                <HeartButton
                  userId={userId}
                  productEntryId={product.id}
                  initialLiked={wishlistItems.includes(product.id)}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                />
                <img src={`${API}/${product.product_color_img}`} alt={product.name} className="w-115 h-auto mx-auto p-10 cursor-zoom-in" loading="lazy" />
                {showZoom && (
                  <div
                    ref={zoomRef}
                    className="absolute left-full top-0 w-full h-full border border-gray-400 bg-no-repeat bg-white shadow-xl z-50 ml-4"
                    style={{
                      backgroundImage: `url(${API}/${product.product_color_img})`,
                      backgroundSize: "200%",
                      backgroundPosition: backgroundPosition,
                    }}
                  />
                )}
              </div>
              <div className="flex gap-4 w-full sm:w-full md:w-auto lg:w-auto mt-0 md:mt-4 md:mx-auto">
                <button onClick={handleAddToCart} className="cenhov3 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded">
                  <img src={CartIcon} className="w-4 md:w-5 h-4 md:h-5 mr-2 invert" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="cenhov4 flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded">
                  <img src={BuyNow} className="w-4 md:w-5 h-4 md:h-5 mr-2 invert" /> Buy Now
                </button>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="w-1/2 mob-fullwd">
              <h1 className="text-2xl font-bold mob-restxt">{product.name} {product.color_name}</h1>
              <p className="text-gray-700 my-2">{product.description}</p>
              {/* Verified */}
              <div className="flex italic py-1">
                <img src={QVerified} className="w-5 h-5" alt="Quivio Verified Badge"></img>
                <p className="text-md">Quivio<span className="text-[#AB00FF]">.</span>Verified<span className="text-[#AB00FF]">.</span></p>
              </div>
              {/* Rating */}
              <div className="flex gap-2">
                <p className="bg-green-600 text-white text-md my-1 w-13 rounded-sm text-center flex items-center justify-center gap-1 p-1">
                  {parseFloat(product.ratings).toFixed(1)} <span className="text-white">★</span>
                </p>

                <p onClick={handleShowReviews} className="my-2 font-semibold text-gray-600 cursor-pointer hover:text-black">{product.reviews} Reviews</p>
              </div>

              <div className="flex gap-3">
                <p className="text-4xl font-bold mt-2">${product.actual_price}</p>
                <p className="text-xl text-gray-500 mt-[17px] line-through">${product.strike_price}</p>
                <p className="text-lg text-green-600 font-semibold mt-[17px]">
                  {Math.round(((product.strike_price - product.actual_price) / product.strike_price) * 100)}% Off
                </p>
              </div>

              <div className={`my-2 ${product.stocks < 55 ? 'text-red-600 font-semibold' : 'text-gray-700 font-semibold'}`}>
                <p>
                  {product.stocks < 55 && "Only "}
                  {product.stocks} Stocks Left
                  {product.stocks < 55 && " Hurry Up!"}
                </p>
              </div>

              {/* Offers Section */}
              <div className="mt-6 rounded-sm border border-gray-300 p-2">
                <h3 className="font-bold text-lg m-2">Available Offers</h3>
                <div className=" p-1">
                  {errorMsg ? (
                    <p>{errorMsg}</p>
                  ) : offersArray.length > 0 ? (
                    offersArray.map((offer, index) => (
                      <p key={index} className="font-semibold text-md text-gray-500 mt-1 flex">
                        <span><img src={Tag} className="w-[18px] h-[18px] mt-[6px] mr-2"></img></span> {offer}
                      </p>
                    ))
                  ) : (
                    <p>No offers available.</p>
                  )}
                </div>
              </div>

              {/* Available Colors Section */}
              <div className="mt-6 rounded-sm p-3 border border-gray-300 ">
                <h3 className="font-bold text-lg my-2">Available Colors</h3>
                <div className="flex gap-4 mt-5">
                  {colorVariants?.map((variant) => (
                    <div className="w-20">
                      <img
                        key={variant.id}
                        src={`${API}/${variant.product_color_img}`}
                        alt={variant.color_name}
                        className={`w-16 h-auto rounded p-1.5 mx-auto cursor-pointer border-2 ${selectedImage === `${API}/${variant.product_color_img}` ? "border-blue-500" : "border-gray-300"
                          }`}
                        onClick={() => {
                          setSelectedImage(`${API}/${variant.product_color_img}`);
                          setProduct(variant); // Update selected product
                          if (window.innerWidth <= 768) {
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        }}
                      />
                      <p className="text-center font-light">{variant.color_name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div className="mt-6 rounded-sm p-3 border border-gray-300">
                <div className='container mx-auto w-full'>
                  <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1'>
                    <div className="flex gap-3 w-full md:w-full">
                      <img src={truck} alt='Truck' className="w-8 h-auto object-contain sm:mt-0 md:-mt-7" />
                      <div>
                        <h2 className="text-lg font-bold py-1">Free Shipping</h2>
                        <p className="text-gray-600 text-md">We'll ship your order for free, right to your door.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-full">
                      <img src={undo} alt='Undo' className="w-7 h-auto object-contain sm:mt-0 md:-mt-7" />
                      <div>
                        <h2 className="text-lg font-bold py-1">7 Day Return</h2>
                        <p className="text-gray-600 text-md">We offer a 7 day return on all eligible items.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-sm border border-gray-300 ">
                {/* Box content */}
                <div className="my-8 px-5">
                  <h3 className="font-bold text-lg my-2">In Box Contents</h3>
                  <p>{product.in_box_content}</p>
                </div>

                {/* Product Specifications */}
                <div className="my-8 px-5">
                  <h3 className="font-bold text-lg my-2">Product Specifications</h3>
                  {product.product_specifications && Object.keys(product.product_specifications).length > 0 ? (
                    <ul className="list-disc pl-5">
                      {Object.entries(product.product_specifications).map(([key, value], index) => (
                        <li key={index}>
                          <span className="font-semibold">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No specifications available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="container w-full mx-auto mt-2 md:mt-10 mob-no-con">
          {similarProducts.length > 0 && (
            <div className="bg-white shadow-lg md:rounded-md p-8 gap-15">
              <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
              <div className="relative">
                {/* Scroll Buttons */}
                {!isAtStart && (
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-[0_0px_20px_0px_rgba(150,150,150,0.5)] p-3 rounded z-10 cursor-pointer"
                    onClick={handleScrollLeft}
                  >
                    ◀
                  </button>
                )}
                {!isAtEnd && (
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-[0_0px_20px_0px_rgba(150,150,150,0.5)] p-3 rounded z-10 cursor-pointer"
                    onClick={handleScrollRight}
                  >
                    ▶
                  </button>
                )}

                <div
                  ref={scrollContainerRef}
                  id="scrollContainer"
                  className="overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar"
                  onScroll={handleScroll}
                >
                  {similarProducts.map((item) => (
                    <div
                      ref={productCardRef}
                      key={item.id}
                      onClick={() => handleProductClick(item.id.toString(), item.name)}
                      className="inline-block w-70 mx-2 cursor-pointer border border-gray-300 rounded shadow-sm p-4 bg-white hover:shadow-lg hover:border-blue-600 transition duration-200"
                    >
                      <img
                        src={`${API}/${item.product_color_img}`}
                        alt={item.name}
                        className="w-full h-45 object-contain p-2"
                        loading="lazy"
                      />
                      <h3 className="mt-2 font-semibold truncate">{item.name} {item.color_name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      <div className="flex gap-1">
                        <p className="text-xl font-bold mt-4">${item.actual_price}</p>
                        <p className="text-sm text-gray-500 mt-[20px] line-through">${item.strike_price}</p>
                        <p className="text-sm text-green-600 font-semibold mt-[20px]">
                          {Math.round(((item.strike_price - item.actual_price) / item.strike_price) * 100)}% Off
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="container w-full mx-auto mt-2 md:mt-10 mob-no-con" ref={reviewsSectionRef}>
          <div className="bg-white shadow-lg md:rounded-md p-8 gap-15">
            {product && generatedReviews.length > 0 && (
              <Reviews reviews={generatedReviews} productName={product.name} />
            )}
          </div>
        </div>
        {/* Address not found Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg animate-fade-in">
              <h2 className="text-lg font-semibold mb-4">Address Not Found</h2>
              <p className="mb-4 text-gray-600">
                Redirecting you to your profile to update your address...
              </p>
              {/* Animated Spinner */}
              <div className="relative w-12 h-12 mx-auto mb-4">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-gray-400">Please wait a moment.</p>
            </div>
          </div>
        )}

      </section>

      <Footer />
    </>
  );
};
