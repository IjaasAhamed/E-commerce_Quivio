import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "./Search";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Quivio Logo.png";
import profileIcon from "../assets/profile icon.png";
import cartIcon from "../assets/cart icon.png";
import user from "../assets/user.png";
import box from "../assets/box.png";
import address from "../assets/address.png";
import logout from "../assets/out.png";
import wishlist from "../assets/wishlist.png";

interface UserProfile {
  profile_pic?: string;
}

export const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleCartClick = () => {
    navigate("/cart");
  };

  const toggleDropDown = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const closeDropDown = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".account-dropdown")) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener("click", closeDropDown);
    return () => document.removeEventListener("click", closeDropDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    const localProfilePic = localStorage.getItem("profile_pic");

    if (localProfilePic) {
      setProfile({ profile_pic: localProfilePic });
    }

    if (storedUserId) {
      setIsLoggedIn(true);
      if (storedName) {
        setUserName(storedName);
      } else {
        axios
          .get(`${API}/users/${storedUserId}`)
          .then((response) => {
            if (response.data.name) {
              setUserName(response.data.name);
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        const response = await axios.get<UserProfile>(`${API}/users/${userId}`);
        setProfile(response.data);
        if (response.data.profile_pic) {
          localStorage.setItem("profile_pic", response.data.profile_pic);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("profile_pic");
    setUserName(null);
    setIsDropDownOpen(false);
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    window.location.href = ("/");
  };

useEffect(() => {
  if (isMobileMenuOpen) {
    setIsMenuVisible(true);
  } else {
    const timeout = setTimeout(() => setIsMenuVisible(false), 300);
    return () => clearTimeout(timeout);
  }
}, [isMobileMenuOpen]);

  console.log("log:", loading);
  console.log("err:", error);

  return (
    <header>
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
@keyframes slideDown {
  0% {
    max-height: 0;
    opacity: 0;
    transform: translateY(-1px);
  }
  100% {
    max-height: 300px;
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  0% {
    max-height: 300px;
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    max-height: 0;
    opacity: 0;
    transform: translateY(-1px);
  }
}

.menu-open {
  animation: slideDown 0.3s ease-out forwards;
  overflow: hidden;
}

.menu-close {
  animation: slideUp 0.3s ease-in forwards;
  overflow: hidden;
}

        `}
      </style>
      <nav
        className={`backdrop-blur-xs shadow-md w-full tracking-wide fixed top-0 left-0 z-40 p-2 animate-fade-in transition-all duration-300 ${isScrolled ? "bg-white" : "bg-white md:bg-transparent"
          }`}
      >
        <div className="mx-auto flex justify-between sm:justify-between md:justify-between lg:justify-around items-center p-2">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="max-w-30 cursor-pointer">
            <img src={logo} alt="Logo" className="w-full h-auto" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-5">
            <div>
              <Search />
            </div>
            <div className="relative account-dropdown">
              <div
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                onClick={toggleDropDown}
              >
                <div className="relative inline-block">
                  <img
                    src={
                      profile && profile.profile_pic
                        ? `${API}${profile.profile_pic}`
                        : profileIcon
                    }
                    alt="Profile"
                    className="w-6 h-6 rounded-[50%]"
                  />
                  <div
                    className="absolute -top-1 -left-1 w-8 h-8 rounded-full border-1 border-gray-400 pointer-events-none"
                  />
                </div>
                <span className="hidden md:block text-black hover:text-blue-600 uppercase font-bold">
                  {userName ? userName : "Account"}
                </span>
              </div>

              <div
                className={`absolute right-[-30px] mt-2 w-fit bg-white shadow-xl rounded-md overflow-hidden transition-all duration-200 ${isDropDownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
              >
                <ul className="text-gray-700 whitespace-nowrap">
                  {!isLoggedIn && (
                    <li className="flex gap-5 p-5 text-center bg-gray-100 border-b border-b-gray-200">
                      <p className="text-sm text-gray-500 whitespace-nowrap place-content-center">Already a User?</p>
                      <button onClick={() => navigate("/login")} className="loginbtnnav">
                        Login
                      </button>
                    </li>
                  )}

                  <>
                    <li onClick={() => navigate("/profile")} className="px-5 py-2 cursor-pointer hover:text-blue-600 transform transition-all duration-300 hover:translate-x-1 hover:bg-gray-50">
                      <span className="flex gap-2"><img src={user} className="w-4 h-4 mt-1" />Profile</span>
                    </li>
                    <li onClick={() => navigate("/orders")} className="px-5 py-2 cursor-pointer hover:text-blue-600 transform transition-all duration-300 hover:translate-x-1 hover:bg-gray-50">
                      <span className="flex gap-2"><img src={box} className="w-4 h-4 mt-1" />Orders</span>
                    </li>
                    <li onClick={() => navigate("/wishlist")} className="px-5 py-2 cursor-pointer hover:text-blue-600 transform transition-all duration-300 hover:translate-x-1 hover:bg-gray-50">
                      <span className="flex gap-2"><img src={wishlist} className="w-4 h-4 mt-1" />Wishlist</span>
                    </li>
                    <li onClick={() => navigate("/shipping-address")} className="px-5 py-2 cursor-pointer hover:text-blue-600 transform transition-all duration-300 hover:translate-x-1 hover:bg-gray-50">
                      <span className="flex gap-2 mr-3"><img src={address} className="w-4 h-4 mt-1" />Shipping Address</span>
                    </li>
                    <li onClick={handleLogout} className="px-5 py-2 cursor-pointer hover:text-red-500 transform transition-all duration-300 hover:translate-x-1 hover:bg-gray-50">
                      <span className="flex gap-2"><img src={logout} className="w-4 h-4 mt-1" />Logout</span>
                    </li>
                  </>
                </ul>
              </div>
            </div>
            <div onClick={handleCartClick} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
              <img src={cartIcon} alt="Cart" className="w-6 h-6" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <div className="flex flex-row-reverse gap-5">
              <button onClick={toggleMobileMenu}>
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <button onClick={() => { handleCartClick(); setIsMobileMenuOpen(false); }} className="flex gap-2 items-center">
                <img src={cartIcon} className="w-5 h-5" alt="Cart" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Below Logo and Hamburger) */}
        <div className="md:hidden mt-2 px-2">
          <Search />
        </div>

        {/* Mobile Menu */}
        {isMenuVisible && (
          <div className={`md:hidden  z-30 mt-2 p-4 flex flex-col space-y-4 transition-all duration-300 ${isMobileMenuOpen ? 'menu-open' : 'menu-close'}`}>
            <button onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }} className="flex gap-2 items-center">
              <img src={user} className="w-4 h-4" alt="Profile" /> Profile
            </button>
            <button onClick={() => { navigate("/orders"); setIsMobileMenuOpen(false); }} className="flex gap-2 items-center">
              <img src={box} className="w-4 h-4" alt="Orders" /> Orders
            </button>
            <button onClick={() => { navigate("/wishlist"); setIsMobileMenuOpen(false); }} className="flex gap-2 items-center">
              <img src={wishlist} className="w-4 h-4" alt="Wishlist" /> Wishlist
            </button>
            <button onClick={() => { navigate("/shipping-address"); setIsMobileMenuOpen(false); }} className="flex gap-2 items-center">
              <img src={address} className="w-4 h-4" alt="Shipping Address" /> Shipping Address
            </button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex gap-2 items-center text-red-500">
                <img src={logout} className="w-4 h-4" alt="Logout" /> Logout
              </button>
            ) : (
              <div className="w-full text-center py-4 border border-gray-300 rounded bg-gray-100">
                <p className="text-md text-gray-500 whitespace-nowrap py-2 w-full">Already a User?</p>
              <button onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }} className="w-[200px] sm:w-sm mx-5 bg-[#0092fb] text-white py-2 rounded">
                Login
              </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
