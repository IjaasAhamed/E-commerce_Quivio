import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { PaymentStatusModal } from "./PaymentStatusModal";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PaymentMode } from "./PaymentMode";
import { warningToast } from "./WarningToast";
import toast from "react-hot-toast";

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

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const Checkout = () => {
  const location = useLocation();
  const API = import.meta.env.VITE_API_BASE_URL;
  const queryParams = new URLSearchParams(location.search);

  const orderDetails = {
    productId: queryParams.get("productId"),
    quantity: queryParams.get("quantity"),
    price: queryParams.get("price"),
    color_name: queryParams.get("color_name"),
    product_color_img: queryParams.get("product_color_img"),
    name: queryParams.get("name"),
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalPaymentStatus, setShowModalPaymentStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [orderProcessed, setOrderProcessed] = useState<boolean>(false);


  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);


  useEffect(() => {

    sessionStorage.setItem('checkoutSessionActive', 'true');

    const fetchAddress = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found.');
          return;
        }
        const response = await axios.get(`${API}/shipping-address/${userId}`);

        if (response.data) {
          const { street, city, state, zip, country } = response.data;
          setSavedAddress(response.data);
          setStreet(street);
          setCity(city);
          setState(state);
          setZip(zip);
          setCountry(country);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();

    return () => {
      sessionStorage.removeItem('checkoutSessionActive');
      sessionStorage.removeItem('orderProcessed');
    }
  }, []);

  useEffect(() => {
    const wasOrderProcessed = sessionStorage.getItem('orderProcessed');
    if (wasOrderProcessed === 'true') {
      setOrderProcessed(true);
      setShowModalPaymentStatus(true);
    }
  }, []);

  const convenienceFee = 1;
  const fixedDiscountPercentage = 20;

  const calculateDiscountedPrice = () => {
    const price = parseFloat(orderDetails.price || "0");
    const discountAmount = price * (fixedDiscountPercentage / 100);
    return price - discountAmount;
  };

  const handlePlaceOrder = async () => {
    console.log("Cart contents:", cart);
    console.log("setCart:", setCart);
    console.log("orderProcessed:", orderProcessed);
    console.log("street:", street);
    console.log("city:", city);
    console.log("state:", state);
    console.log("zip:", zip);
    console.log("country:", country);

    let itemsToOrder = [...cart];

    if (orderDetails.productId) {
      const tempItem = {
        id: parseInt(orderDetails.productId),
        name: decodeURIComponent(orderDetails.name || ''),
        color_name: decodeURIComponent(orderDetails.color_name || ''),
        category: '',
        actual_price: parseFloat(orderDetails.price || '0'),
        strike_price: parseFloat(orderDetails.price || '0'),
        quantity: parseInt(orderDetails.quantity || '1'),
        product_color_img: decodeURIComponent(orderDetails.product_color_img || ''),
        product_specifications: {},
        description: '',
      };
      itemsToOrder = [tempItem];
    }

    if (itemsToOrder.length === 0) {
      warningToast("Your cart is empty. Please add items to your cart before placing an order.");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    try {
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

      if (!userAddress.street || !userAddress.city || !userAddress.state || !userAddress.zip || !userAddress.country) {
        warningToast("Address not found. Please update your profile.");
        return;
      }

      const finalPrice = calculateDiscountedPrice().toFixed(2);

      const orderData = itemsToOrder.map((item) => ({
        userId,
        productId: item.id,
        quantity: item.quantity,
        price: parseFloat(orderDetails.price || "0"), // Send the original price for record
        final_price: finalPrice, // Send the discounted price
        address: userAddress,
        color_name: item.color_name,
        product_color_img: item.product_color_img,
        name: item.name,
      }));

      console.log("Order Data:", orderData);

      setShowModal(true);

      // Immediately destroy the session when the modal is opened
      sessionStorage.removeItem('checkoutSessionActive');

      setTimeout(async () => {
        const response = await axios.post(`${API}/orders-cart`, { orders: orderData });

        if (response.status === 200) {
          localStorage.removeItem("cart");
          setCart([]);
          setShowModal(false);
          setShowModalPaymentStatus(true);
          setOrderProcessed(true);
          sessionStorage.setItem('orderProcessed', 'true');
        }
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
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

      `}
    </style>
      <Navbar />
      {/* Desktop View */}
      <section className="hidden lg:block pt-30 p-20 bg-gray-50">
        <div className="flex justify-center gap-5 animate-fade-in">
          <div className="border border-gray-300 w-fit h-full">
            <div>
              <PaymentMode />
            </div>
            <div>
              <div className='bg-white p-6 w-full max-w-2xl'>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Shipping Address
                </h2>

                {loading ? (
                  <p className="text-gray-500 text-center mt-4">Loading...</p>
                ) : savedAddress ? (
                  <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 mt-4">
                    <h3 className="font-semibold text-gray-700">Saved Address:</h3>
                    <p className="text-gray-600">{`${savedAddress.street}, ${savedAddress.city}, ${savedAddress.state}, ${savedAddress.zip}, ${savedAddress.country}`}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center mt-4">No address found. Please add your address.</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white w-1/4 h-auto border border-gray-300 whitespace-normal">
            <div className="p-4">
              <h2 className="border-b border-b-gray-300 text-xl text-gray-400 uppercase my-4">Price Details</h2>
              <div className="flex justify-between my-2">
                <p>Price</p>
                <p>${orderDetails.price}</p>
              </div>
              <div className="flex justify-between my-2">
                <p>Convenience Fee</p>
                <p>${convenienceFee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between my-2">
                <p>Delivery Charges</p>
                <p className="text-green-600">Free</p>
              </div>
              <div className="flex justify-between my-2">
                <p>Discount Applied</p>
                <p className="text-green-600">
                  - ${(parseFloat(orderDetails.price || "0") * (fixedDiscountPercentage / 100)).toFixed(2)} ({fixedDiscountPercentage}%)
                </p>
              </div>
              <div className="flex justify-between my-4 py-4 font-semibold text-lg border-y border-dashed border-y-gray-300">
                <h2>Total Amount</h2>
                <h2>${(calculateDiscountedPrice() + convenienceFee).toFixed(2)}</h2>
              </div>
              <div>
                <button onClick={handlePlaceOrder} className="plcorder">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Mobile View */}
      <section className="lg:hidden pt-35 md:pt-30 p-6 bg-gray-50">
        <div className="animate-fade-in">
          <div className="border border-gray-300 w-fit">
            <div>
              <PaymentMode />
            </div>
            <div>
              <div className='bg-white p-6 w-full max-w-2xl'>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Shipping Address
                </h2>

                {loading ? (
                  <p className="text-gray-500 text-center mt-4">Loading...</p>
                ) : savedAddress ? (
                  <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 mt-4">
                    <h3 className="font-semibold text-gray-700">Saved Address:</h3>
                    <p className="text-gray-600">{`${savedAddress.street}, ${savedAddress.city}, ${savedAddress.state}, ${savedAddress.zip}, ${savedAddress.country}`}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center mt-4">No address found. Please add your address.</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white w-full max-w-xl my-5 h-auto border border-gray-300 whitespace-nowrap">
            <div className="p-4">
              <h2 className="border-b border-b-gray-300 text-xl text-gray-400 uppercase my-4">Price Details</h2>
              <div className="flex justify-between my-2">
                <p>Price</p>
                <p>${orderDetails.price}</p>
              </div>
              <div className="flex justify-between my-2">
                <p>Convenience Fee</p>
                <p>${convenienceFee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between my-2">
                <p>Delivery Charges</p>
                <p className="text-green-600">Free</p>
              </div>
              <div className="flex justify-between my-2">
                <p>Discount Applied</p>
                <p className="text-green-600">
                  - ${(parseFloat(orderDetails.price || "0") * (fixedDiscountPercentage / 100)).toFixed(2)} ({fixedDiscountPercentage}%)
                </p>
              </div>
              <div className="flex justify-between my-4 py-4 font-semibold text-lg border-y border-dashed border-y-gray-300">
                <h2>Total Amount</h2>
                <h2>${(calculateDiscountedPrice() + convenienceFee).toFixed(2)}</h2>
              </div>
              <div>
                <button onClick={handlePlaceOrder} className="plcorder">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(10px)" }}>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-xl font-bold">Processing Payment...</h2>
            <p className="text-gray-600 mt-2">Please wait while we complete your purchase.</p>
            <div className="mt-4">
              <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          </div>
        </div>
      )}
      <PaymentStatusModal showModalPaymentStatus={showModalPaymentStatus} setShowModalPaymentStatus={setShowModalPaymentStatus} />
      <Footer />
    </>
  );
};