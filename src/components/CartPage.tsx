import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { DeliveryDateGenerator } from "./DeliveryDateGenerator";
import toast from "react-hot-toast";
import { warningToast } from "./WarningToast";
import EmptyCart from '../assets/empty-cart.png';
import QVerified from '../assets/Q_verified.png'
import "../styles/Buttons.css";


interface CartItem {
  id: number;
  name: string;
  color_name: string;
  category: string;
  actual_price: number;
  strike_price: number;
  quantity: number;
  product_color_img: string;
  product_specifications: Record<string, string>;
  description: string;
}

export const CartPage = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchDiscount(userId);
    }
  }, []);

  const fetchDiscount = async (userId: string) => {
    try {
      const response = await axios.get(`${API}/users/${userId}`);
      setDiscount(response.data.sp_discount);
    } catch (error) {
      console.error("Error fetching discount:", error);
    }
  };

  // Function to update cart in localStorage
  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Increase quantity
  const increaseQuantity = (id: number) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  // Decrease quantity (remove item if quantity is 1)
  const decreaseQuantity = (id: number) => {
    const updatedCart = cart
      .map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0); // Remove items with quantity 0
    updateCart(updatedCart);
  };

  // Calculate total price of all items in cart BEFORE discount
  const calculateOriginalTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + item.actual_price * item.quantity;
    }, 0);
  };

  // Calculate total price of all items in cart with discount
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      let itemPrice = item.actual_price;
      if (discount !== null && discount > 0) {
        itemPrice = itemPrice * (1 - discount / 100);
      }
      return total + itemPrice * item.quantity;
    }, 0);
  };

  // Calculate total quantity of items in cart
  const calculateTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const convenienceFee = 1; // Example convenience fee

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "/login";
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

      if (cart.length > 0) {
        const firstItem = cart[0];
        navigate(
          `/checkout?productId=${String(firstItem.id)}&quantity=${String(firstItem.quantity)}&price=${String(calculateOriginalTotalPrice().toFixed(2))}&color_name=${encodeURIComponent(firstItem.color_name)}&product_color_img=${encodeURIComponent(firstItem.product_color_img)}&name=${encodeURIComponent(firstItem.name)}`
        );
      } else {
        warningToast("Your cart is empty. Add items to proceed.");
      }

    } catch (error) {
      console.error("Error navigating to checkout:", error);
      toast.error("Failed to proceed to checkout. Please try again.");
    }
  };

  return (
    <>
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

      @media (max-width: 768px){
      .mob-noflex{
      display: block;
      }
      }
      `}
      </style>
      <Navbar />
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="bg-gray-50 flex gap-5 px-5 py-30 animate-fade-in" style={{ minHeight: '100vh' }}>
          {cart.length === 0 ? (
            <div className="w-full place-items-center place-self-center">
              <img src={EmptyCart} alt="Empty Cart" className="w-75 h-auto"></img>
              <p className="text-gray-600 text-lg">No product added to cart.</p>
            </div>
          ) : (
            <>
              <ul>
                {cart.map(item => (
                  <li key={item.id} className="bg-white border border-gray-300 w-full p-4 flex items-start">
                    <div className="w-[30%] place-items-center place-self-center">
                      <img
                        src={`${API}/${item.product_color_img}`}
                        className="w-50 h-40 ml-1.5 object-contain"
                        alt={`${item.name} ${item.color_name}`}
                      />
                      <div className="flex items-center my-2">
                        <button onClick={() => decreaseQuantity(item.id)} className="bg-gray-300 px-3 py-1 rounded-[50%] cursor-pointer">-</button>
                        <p className="px-4 py-1 mx-2 border border-gray-300">{item.quantity}</p>
                        <button onClick={() => increaseQuantity(item.id)} className="bg-gray-300 px-3 py-1 rounded-[50%] cursor-pointer">+</button>
                      </div>
                    </div>
                    <div className="w-[50%]">
                      <p className="font-bold text-3xl">{item.name} {item.color_name}</p>
                      <p className="text-gray-500">{item.category}</p>
                      <div className="my-1">
                        {item.product_specifications && Object.keys(item.product_specifications).length > 0 ? (
                          <ul className="list-disc pl-5">
                            {Object.entries(item.product_specifications).map(([key, value], index) => (
                              <li key={index}><span className="font-semibold">{key}:</span> {value}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No specifications available.</p>
                        )}
                      </div>
                      <p>{item.description}</p>
                    </div>
                    <div className="w-[15%] mx-auto">
                      <p className="text-2xl font-semibold">${(item.actual_price * item.quantity).toFixed(2)}</p>
                      <p className="line-through text-gray-400">${(item.strike_price * item.quantity).toFixed(2)}</p>
                      <p className="text-md text-green-600 font-semibold mt-1 whitespace-nowrap">
                        {Math.round(((item.strike_price - item.actual_price) / item.strike_price) * 100)}% Off
                      </p>
                      <div className="flex italic py-1">
                        <img src={QVerified} className="w-5 h-5" alt="Quivio Verified Badge"></img>
                        <p className="text-sm">Quivio<span className="text-[#AB00FF]">.</span>Verified<span className="text-[#AB00FF]">.</span></p>
                      </div>
                    </div>
                    <div className="w-[15%] text-right">
                      <div className="text-md"><DeliveryDateGenerator /></div>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Price Details */}
              <div className="bg-white w-1/4 h-full border border-gray-300" style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start' }}>
                <div className="p-4">
                  <h2 className="border-b border-b-gray-300 text-xl text-gray-400 uppercase my-4">Price Details</h2>
                  <div className="flex justify-between my-2">
                    <p>Price ({calculateTotalQuantity()} Items)</p>
                    <p>${calculateOriginalTotalPrice().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between my-2">
                    <p>Convenience Fee</p>
                    <p>${convenienceFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between my-2">
                    <p>Delivery Charges</p>
                    <p className="text-green-600">Free</p>
                  </div>
                  {discount !== null && (
                    <div className="flex justify-between my-2">
                      <p>Discount Applied</p>
                      <p className="text-green-600">20%</p>
                    </div>
                  )}
                  <div className="flex justify-between my-4 py-4 font-semibold text-lg border-y border-dashed border-y-gray-300">
                    <h2>Total Amount</h2>
                    <h2>${(calculateTotalPrice() + convenienceFee).toFixed(2)}</h2>
                  </div>
                  <div>
                    <button onClick={handlePlaceOrder} className="plcorder">Place Order</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="bg-gray-50 px-5 pt-35 md:pt-30 animate-fade-in" style={{ minHeight: '100vh' }}>
          {cart.length === 0 ? (
            <div className="w-full place-items-center place-self-center">
              <img src={EmptyCart} alt="Empty Cart" className="w-75 h-auto"></img>
              <p className="text-gray-600 text-lg">No product added to cart.</p>
            </div>
          ) : (
            <>
              <ul>
                {cart.map(item => (
                  <li key={item.id} className="bg-white border border-gray-300 w-full p-4 flex items-start">
                    <div className="w-fit place-items-center place-self-center px-2">
                      <img
                        src={`${API}/${item.product_color_img}`}
                        className="w-50 h-40 object-contain"
                        alt={`${item.name} ${item.color_name}`}
                      />
                      <div className="flex items-center my-2">
                        <button onClick={() => decreaseQuantity(item.id)} className="bg-gray-300 px-3 py-1 rounded-[50%] cursor-pointer">-</button>
                        <p className="px-4 py-1 mx-2 border border-gray-300">{item.quantity}</p>
                        <button onClick={() => increaseQuantity(item.id)} className="bg-gray-300 px-3 py-1 rounded-[50%] cursor-pointer">+</button>
                      </div>
                    </div>
                    <div className="w-full">
                      <p className="font-bold text-2xl">{item.name} {item.color_name}</p>
                      <p className="text-gray-500">{item.category}</p>
                      <div className="flex space-x-2 flex-wrap">
                        <p className="text-xl font-semibold my-1">${(item.actual_price * item.quantity).toFixed(2)}</p>
                        <p className="line-through text-gray-400 my-1 text-md">${(item.strike_price * item.quantity).toFixed(2)}</p>
                        <p className="text-md text-green-600 font-semibold my-1 whitespace-nowrap">
                          {Math.round(((item.strike_price - item.actual_price) / item.strike_price) * 100)}% Off
                        </p>
                      </div>
                      <div className="flex italic py-1">
                        <img src={QVerified} className="w-5 h-5" alt="Quivio Verified Badge"></img>
                        <p className="text-sm">Quivio<span className="text-[#AB00FF]">.</span>Verified<span className="text-[#AB00FF]">.</span></p>
                      </div>
                      <div className="text-md"><DeliveryDateGenerator /></div>

                    </div>

                  </li>
                ))}
              </ul>
              {/* Price Details */}
              <div className="bg-white w-full my-5 h-full border border-gray-300">
                <div className="p-4">
                  <h2 className="border-b border-b-gray-300 text-xl text-gray-400 uppercase my-4">Price Details</h2>
                  <div className="flex justify-between my-2">
                    <p>Price ({calculateTotalQuantity()} Items)</p>
                    <p>${calculateOriginalTotalPrice().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between my-2">
                    <p>Convenience Fee</p>
                    <p>${convenienceFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between my-2">
                    <p>Delivery Charges</p>
                    <p className="text-green-600">Free</p>
                  </div>
                  {discount !== null && (
                    <div className="flex justify-between my-2">
                      <p>Discount Applied</p>
                      <p className="text-green-600">20%</p>
                    </div>
                  )}
                  <div className="flex justify-between my-4 py-4 font-semibold text-lg border-y border-dashed border-y-gray-300">
                    <h2>Total Amount</h2>
                    <h2>${(calculateTotalPrice() + convenienceFee).toFixed(2)}</h2>
                  </div>
                  <div>
                    <button onClick={handlePlaceOrder} className="plcorder">Place Order</button>
                  </div>
                </div>
              </div>
            </>
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
      <Footer />
    </>
  );
};