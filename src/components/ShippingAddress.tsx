import { useState, useEffect } from 'react';
import axios from 'axios';
import addressImg from '../assets/selected-address.png';
import address from "../assets/address.png";
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { warningToast } from './WarningToast';
import toast from 'react-hot-toast';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const ShippingAddress = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');

  const [isStreetFocused, setIsStreetFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isStateFocused, setIsStateFocused] = useState(false);
  const [isZipFocused, setIsZipFocused] = useState(false);
  const [isCountryFocused, setIsCountryFocused] = useState(false);
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
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
  }, []);

  const handleSaveAddress = async () => {
    if (!street || !city || !state || !zip || !country) {
      warningToast('Please fill in all address fields.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found in local storage.');
        warningToast('User ID not found. Please log in.');
        return;
      }

      const response = await axios.post('${API}/shipping-address', {
        userId,
        street,
        city,
        state,
        zip,
        country,
      });

      console.log('Address saved successfully!', response.data);
      toast.success('Address saved successfully!');

      setStreet('');
      setCity('');
      setState('');
      setZip('');
      setCountry('');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const handleCloseButton = () => {
    setShowModal(false);
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
      <section className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 pt-35 pb-15 px-5 md:px-0 transition-all duration-300"' style={{ minHeight: '100vh' }}>
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 text-center my-4 flex justify-center flex-wrap gap-2 sm:gap-3">
            <span><img src={address} className='w-15 h-15 mx-auto'></img></span> Shipping Address
          </h1>
          <div className="flex justify-center">
            <button onClick={() => setShowModal(true)} className="bg-[#0092fb] text-white px-3 py-2 cursor-pointer rounded-md">
              {savedAddress ? "Edit Address" : "+ Add New Address"}
            </button>

          </div>
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
      </section>
      {/* Modal for Adding Address */}
      {showModal && (
        <section
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xs z-50"
          style={{ minHeight: '100vh', backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(10px)" }}
        >
          <div className="md:flex w-full sm:w-full md:w-[75%] lg:w-[55%] h-auto shadow-none md:shadow-lg pl-15 md:pl-0 animate-fade-in">
            {/* Left Side */}
            <div className="w-full md:w-1/2 h-auto md:h-[35rem] p-4 md:p-7 px-7 bg-[#0092fb] text-white">
              <h2 className="text-xl md:text-3xl my-2 md:my-4 font-semibold">Shipping Address</h2>
              <p className="text-sm md:text-md text-gray-100">Where should we send it?</p>
              <img
                src={addressImg}
                alt="Shipping Address Image"
                className="hidden md:block w-75 h-auto object-contain mx-auto pt-15 filter drop-shadow-2xl"
              />
            </div>

            {/* Right Side */}
            <div className="w-full md:w-1/2 h-auto p-7 bg-white">
              <div className="relative my-7">
                <label
                  htmlFor="street"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${isStreetFocused || street ? 'text-xs -top-4 text-[#0092fb]' : 'text-base top-2'
                    }`}
                >
                  Enter Street
                </label>
                <input
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  onFocus={() => setIsStreetFocused(true)}
                  onBlur={(e) => !e.target.value && setIsStreetFocused(false)}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
              </div>
              <div className="relative my-7">
                <label
                  htmlFor="city"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${isCityFocused ||  city ? 'text-xs -top-4 text-[#0092fb]' : 'text-base top-2'
                    }`}
                >
                  Enter City
                </label>
                <input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => setIsCityFocused(true)}
                  onBlur={(e) => !e.target.value && setIsCityFocused(false)}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
              </div>
              <div className="relative my-7">
                <label
                  htmlFor="state"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${isStateFocused || state ? 'text-xs -top-4 text-[#0092fb]' : 'text-base top-2'
                    }`}
                >
                  Enter State
                </label>
                <input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  onFocus={() => setIsStateFocused(true)}
                  onBlur={(e) => !e.target.value && setIsStateFocused(false)}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
              </div>
              <div className="relative my-7">
                <label
                  htmlFor="zip"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${isZipFocused || zip ? 'text-xs -top-4 text-[#0092fb]' : 'text-base top-2'
                    }`}
                >
                  Enter Zip
                </label>
                <input
                  id="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  onFocus={() => setIsZipFocused(true)}
                  onBlur={(e) => !e.target.value && setIsZipFocused(false)}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
              </div>
              <div className="relative my-7">
                <label
                  htmlFor="country"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${isCountryFocused || country ? 'text-xs -top-4 text-[#0092fb]' : 'text-base top-2'
                    }`}
                >
                  Enter Country
                </label>
                <input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onFocus={() => setIsCountryFocused(true)}
                  onBlur={(e) => !e.target.value && setIsCountryFocused(false)}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
              </div>
              <button
                onClick={handleSaveAddress}
                className="bg-[#0092fb] text-white mt-3 p-2 rounded-md w-full cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </div>
          <div>
            <button onClick={handleCloseButton} className="cls-btn"></button>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};