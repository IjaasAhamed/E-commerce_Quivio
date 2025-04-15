import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { DeliveryDateGenerator } from "./DeliveryDateGenerator";
import box from "../assets/box.png";
import QVerified from '../assets/Q_verified.png'
import { Loading } from "./Loading";

interface Order {
  id: number;
  user_id: number;
  product_id: number;
  order_id: string;
  quantity: number;
  final_price: number;
  address: string; // Address is a JSON string
  created_at: string;
  color_name: string;
  product_color_img: string;
  name: string;
}

export const Orders = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API}/orders/${userId}`);
        // Sort orders by created_at in descending order
        const sortedOrders = response.data.sort((a: Order, b: Order) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setOrders(sortedOrders);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6" style={{ fontFamily: "Poppins" }}>
          <p>Loading Your Orders...</p>
          <Loading />
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6" style={{ fontFamily: "Poppins" }}>
          <p className="text-red-500">{error}</p>
        </section>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
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
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 pt-35 pb-15 px-5 md:px-0">
        <div className="container bg-white shadow-lg rounded-lg p-8 w-full animate-fade-in">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 text-center my-4 flex justify-center flex-wrap gap-2 sm:gap-3">
            <span><img src={box} className='w-15 h-15 mx-auto'></img></span> Your Orders
          </h1>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg bg-gray-50">
              <p className="text-gray-500">No purchases found.</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white cursor-pointer rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const addressObj = JSON.parse(order.address);
                return (
                  <div key={order.order_id} className="p-4 border border-gray-300 rounded-lg flex flex-col md:flex-row gap-4">
                    <div className="mx-auto md:mx-5 w-full md:w-auto flex justify-center">
                      <img src={`${API}/${order.product_color_img}`} className="w-70 h-auto object-contain" alt={order.name}></img>
                    </div>
                    <div className="md:mx-5 w-full">
                      <h2 className="text-xl md:text-2xl font-bold">{order.name} {order.color_name}</h2>
                      <h3 className="text-md md:text-lg font-semibold"><span className="text-gray-400">Order ID: </span>{order.order_id}</h3>
                      <p><span className="text-gray-400">Product ID: </span>{order.product_id}</p>
                      <p><span className="text-gray-400">Quantity: </span>{order.quantity}</p>
                      <p><span className="text-gray-400">Price: </span>${order.final_price}</p>
                      <p>
                        <span className="text-gray-400">Address: </span>{addressObj.street}, {addressObj.city}, {addressObj.state}, {addressObj.zip}, {addressObj.country}
                      </p>
                      <p><span className="text-gray-400">Order Date: </span>{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-sm text-right w-full md:w-[35%] flex flex-col sm:flex-row md:flex-col justify-between sm:justify-between md:justify-start items-end">
                    <DeliveryDateGenerator />
                      <div className="flex italic sm:py-0 md:py-2 mx-0 sm:mx-2 md:mx-0 items-center">
                        <img src={QVerified} className="w-5 h-5 mr-2" alt="Quivio Verified Badge"></img>
                        <p className="text-sm">Quivio<span className="text-[#AB00FF]">.</span>Verified<span className="text-[#AB00FF]">.</span></p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};