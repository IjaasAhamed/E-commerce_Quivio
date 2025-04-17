import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import EmptyCart from '../assets/empty-cart.png';
import WeeklyDealImg from '../assets/weekly-deals.webp';
import { HeartButton } from './HeartButton';

export const WeeklyDealPage = () => {
    const API = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [weeklyDeals, setWeeklyDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [wishlistItems, setWishlistItems] = useState<number[]>([]);

    useEffect(() => {
        const fetchWeeklyDeals = async () => {
            setLoading(true);
            setError(null); // Reset error on new fetch
            try {
                const response = await axios.get(`${API}/weekly-deals`);
                setWeeklyDeals(response.data);
            } catch (err) {
                console.error('Error Fetching Weekly Deals:', err);
                setError('Failed to load weekly deals. Please try again.');
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);

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

        fetchWeeklyDeals();
        fetchWishlist();
    }, [userId]);

    // Get the deal expiry time (next Sunday)
    const getEndTime = () => {
        const now = new Date();
        const nextSunday = new Date();
        nextSunday.setDate(now.getDate() + (7 - now.getDay())); // Next Sunday
        nextSunday.setHours(23, 59, 59, 999); // End of the day
        return nextSunday.getTime();
    };

    const [timeLeft, setTimeLeft] = useState(getEndTime() - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getEndTime() - Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
        const days = Math.floor(ms / 1000 / 60 / 60 / 24);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const handleRemoveFromWishlist = (productId: number) => {
        setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="p-5 mt-10">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10 mt-8">
                        {weeklyDeals.length > 0 && // Corrected conditional rendering
                            weeklyDeals.map((_, index) => (
                                <div key={index} className="skeleton__card">
                                    <div className="skeleton__card__skeleton skeleton__card__description"></div>
                                    <div className="skeleton__card__skeleton skeleton__card__title"></div>
                                </div>
                            ))}
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <section className="p-4">
                    <p className="text-center text-red-500 text-lg">{error}</p>
                </section>
                <Footer />
            </>
        );
    }

    if (weeklyDeals.length === 0) {
        return (
            <>
                <Navbar />
                <section className="p-4">
                    <div className="flex flex-col items-center justify-center p-10">
                        <img src={EmptyCart} alt="Empty Cart" className="w-50 h-auto" />
                        <p className="text-center text-gray-500">No weekly deals available.</p>
                    </div>
                </section>
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

            @media (max-width:768px) {
            .mob-pad{
            padding: 10px;
            }
            .mob-noflex{
            display: block;
            }
            }
            @media (max-width: 1030px) {
            .mob-noflex{
            display: block;
            }
            .mob-txt{
            white-space: normal;
            word-break: normal;
            width: 60%;
            }
            }
            `}
            </style>
            <Navbar />
            <section className="p-15 mt-20 md:mt-10 bg-gray-50 mob-pad animate-fade-in">
                <div className='hidden md:block'>
                    <div className='flex justify-center w-full my-10'>
                        <div className='w-[55%] bg-[#0092fb]' style={{ clipPath: 'polygon(0 0, calc(100% - 0px) 0, calc(100% - 60px) 100%, 0 100%)' }}>
                            <h2 className="text-6xl font-bold text-white mt-10 ml-10 mob-txt">Weekly Deals</h2>
                            <p className="text-lg text-white ml-10 mt-2 mob-txt">
                                Save big on your favorite products this week.
                            </p>
                            <time className="block text-xl font-semibold text-gray-800 my-2 ml-10 mt-5">
                                Ends in: {formatTime(timeLeft)}
                            </time>
                        </div>
                        <div className='w-[20%] bg-[#0484e0] mx-[-65px]' style={{ clipPath: 'polygon(60px 0, calc(100% - 0px) 0, calc(100% - 60px) 100%, 0 100%)' }}></div>
                        <div className='w-[35%]'>
                            <img src={WeeklyDealImg} alt='Weekly Deal Image' className='w-full h-full object-cover' />
                        </div>
                    </div>
                </div>
                <div className='md:hidden px-4 sm:px-6 md:px-10 relative'>
                    <div className='w-full my-15 relative'>
                        <div className='w-full relative'>
                            <img src={WeeklyDealImg} alt='Weekly Deal Image' className='w-full h-full object-cover' />
                        </div>
                        <div className='absolute z-10 top-0 left-0 w-full h-full flex flex-col justify-center items-start p-3'>
                            <div className='bg-white/01 backdrop-blur-xs rounded-md w-fit max-w-full'>
                                <h2 className="text-4xl font-bold text-white mt-0 break-words">Weekly Deals</h2>
                                <p className="text-lg text-[#0092fb] mt-2 break-words">
                                    Save big on your favorite products this week.
                                </p>
                                <time className="block text-md font-semibold text-gray-800 my-1 mt-2">
                                    Ends in: {formatTime(timeLeft)}
                                </time>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 px-4 sm:px-6 md:px-10 pb-10">
                    {weeklyDeals.map((product: any) => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/product-details/${product.id}/${product.name}`)}
                            className="p-4 rounded-lg shadow-lg flex flex-col h-full bg-white transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
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
                            <p className="bg-green-600 text-white text-md my-1 w-20 rounded-xs text-center font-semibold flex items-center justify-center gap-1">
                                {Math.round(((product.strike_price - product.actual_price) / product.strike_price) * 100)}% Off
                            </p>
                            <div className="flex gap-2 mob-noflex">
                                <p className="text-2xl font-bold">${product.actual_price}</p>
                                <p className="text-lg text-gray-500 mt-[3px] line-through">${product.strike_price}</p>
                            </div>

                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    );
};