import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Deal1 from '../assets/weeklyDeal_Pic1.jpg';
import Deal2 from '../assets/weeklyDeal_Pic2.jpg';
import Deal3 from '../assets/weeklyDeal_Pic3.jpg';
import Deal4 from '../assets/weeklyDeal_Pic4.jpg';
import percentage from '../assets/percentage.png';

export const WeeklyDeal = () => {
const navigate = useNavigate();

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

  return (
    <section className="relative py-25 bg-gray-50 transform transition-all duration-300">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
        
        {/* Deal Info */}
        <div className="md:w-1/3 text-center md:text-left z-10">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Weekly Deals</h2>
          <p className="text-lg text-gray-700 font-medium">
            Exciting discounts on home essentials this week!  
            Don't miss out on these limited-time offers.
          </p>
          <time className="block text-lg font-medium text-red-600 my-2">
            Ends in: {formatTime(timeLeft)}
          </time>
          <button onClick={() => navigate('/weekly-deal-page')} className="mt-4 cenhov2">
            Shop Now
          </button>
        </div>

        {/* Images */}
        <div className="md:w-2/3 flex justify-center relative z-10">
          <div className="grid grid-cols-2 gap-3">
            <img className="w-full h-50 object-cover rounded-lg" src={Deal1} alt="Curtain" />
            <img className="w-full h-50 object-cover rounded-lg" src={Deal2} alt="Storage Box" />
            <img className="w-full h-50 object-cover rounded-lg" src={Deal3} alt="Kitchen Products" />
            <img className="w-full h-50 object-cover rounded-lg" src={Deal4} alt="Mattress" />
          </div>
        </div>

        <span>
          <img src={percentage} alt='percenrage' className='absolute right-0 top-[25%] z-0'></img>
        </span>

      </div>
    </section>
  );
};
