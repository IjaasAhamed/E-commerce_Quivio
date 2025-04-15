import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HeartButton } from './HeartButton';
import EmptyWishlist from '../assets/empty-cart.png';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import wishlist from '../assets/wishlist.png'
import { Loading } from './Loading';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  final_price?: number;
  product_color_img: string;
}

export const Wishlist: React.FC = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistItemIds, setWishlistItemIds] = useState<number[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userId) {
          navigate('/login');
          return;
        }
        const response = await axios.get<Product[]>(`${API}/wishlist?userId=${userId}`);
        if (response.status === 200) {
          setWishlistItems(response.data);
          setWishlistItemIds(response.data.map(item => item.id)); 
        } else {
          setError('Failed to fetch wishlist');
        }
      } catch (err: any) {
        setError('Error fetching wishlist');
        console.error('Error fetching wishlist:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId, navigate]);

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    setWishlistItemIds(prevIds => prevIds.filter(id => id !== productId)); 
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{ fontFamily: 'Poppins' }}>
          <p>Loading Your Wishlist...</p>
          <div className="mt-4">
            <Loading />
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-35 pb-15 w-full h-full bg-gray-50">
          <img src={EmptyWishlist} alt="Your wishlist is empty" className="w-48 h-auto mb-4" />
          <p className="text-gray-600 mb-2 text-center">Your wishlist is empty. Start adding your favorite items!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </>
    );
  }

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
      <section className="px-4 pt-40 pb-10 bg-gradient-to-r from-gray-100 to-gray-200">
        <div className='container mx-auto bg-white p-10 rounded-xl animate-fade-in'>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 text-center my-4 flex justify-center flex-wrap gap-2 sm:gap-3">
            <span><img src={wishlist} className='w-15 h-15 mx-auto'></img></span> My Wishlist
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {wishlistItems.map(item => (
              <div
                key={item.id}
                className="bg-white border border-gray-300 rounded-lg overflow-hidden relative"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/product-details/${item.id}/${item.name}`)}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={`${API}/${item.product_color_img}`}
                      alt={item.name}
                      className="object-contain w-full h-full p-3 transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <HeartButton
                    userId={userId}
                    productEntryId={item.id}
                    initialLiked={wishlistItemIds.includes(item.id)}
                    onRemoveFromWishlist={handleRemoveFromWishlist} // Pass the callback
                  />
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