import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import LoginImg from "../assets/login-img.png";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const LoginSignup = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    loginIdentifier: "",
    signupMobileNumber: "",
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    loginIdentifier: "",
    signupMobileNumber: "",
    name: "",
    email: "",
    password: "",
  });

  const [isLoginIdentifierFocused, setIsLoginIdentifierFocused] = useState(false);
  const [isSignupMobileNumberFocused, setIsSignupMobileNumberFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const signupParam = searchParams.get('signup');
    if (signupParam === 'true') {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [searchParams]);

  console.log("log:", setSearchParams);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isPhoneNumber = (value: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  };

  const isNameValid = (value: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(value);
  };

  // const isPasswordValid = (value: string): boolean => {
  //   return value.length >= 6;
  // };

  const validateForm = () => {
    let valid = true;
    const newErrors = { loginIdentifier: "", signupMobileNumber: "", name: "", email: "", password: "" };

    if (!isSignup) {
      if (!formData.loginIdentifier.trim()) {
        newErrors.loginIdentifier = "This Field is required.";
        valid = false;
      } else if (!isEmail(formData.loginIdentifier) && !isPhoneNumber(formData.loginIdentifier)) {
        newErrors.loginIdentifier = "Enter a valid email or 10-digit phone number.";
        valid = false;
      }
      if (!formData.password.trim()) {
        newErrors.password = "Password is required.";
        valid = false;
      }
    } else {
      if (!formData.signupMobileNumber.trim()) {
        newErrors.signupMobileNumber = "This Field is required.";
        valid = false;
      } else if (!isPhoneNumber(formData.signupMobileNumber)) {
        newErrors.signupMobileNumber = "Enter a valid 10-digit mobile number.";
        valid = false;
      }

      if (!formData.name.trim()) {
        newErrors.name = "Name is required.";
        valid = false;
      } else if (!isNameValid(formData.name)) {
        newErrors.name = "Name should only contain letters and spaces.";
        valid = false;
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
        valid = false;
      } else if (!isEmail(formData.email)) {
        newErrors.email = "Enter a valid email address.";
        valid = false;
      }

      if (!formData.password.trim()) {
        newErrors.password = "Password is required.";
        valid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
        let endpoint = isSignup ? `${API}/signup-register` : `${API}/login-user`;
        let payload = isSignup
            ? {
                mobileNumber: formData.signupMobileNumber,
                name: formData.name,
                email: formData.email,
                password: formData.password,
            }
            : {
                identifier: formData.loginIdentifier,
                isEmail: isEmail(formData.loginIdentifier),
                password: formData.password,
            };

        console.log("Sending request to:", endpoint);
        console.log("Payload:", payload);

        const response = await axios.post(endpoint, payload);
        console.log("Response:", response);
        toast.success(response.data.message);

        if (response.data && response.data.user) { // Check if response.data.user exists
            localStorage.setItem("userId", response.data.user.id.toString());
            localStorage.setItem("userName", response.data.user.name);
            setFormData({
              loginIdentifier: "",
              signupMobileNumber: "",
              name: "",
              email: "",
              password: "",
            });
            navigate("/");
        } else {
            console.error("Error: User data is missing in the response", response.data);
            toast.error("Signup/Login successful, but user data was not received. Please try again.");
            // Optionally, you might want to redirect to a login page or an error page.
        }

    } catch (error: any) {
        console.error("Error:", error);

        if (error.response) {
            console.log("Error Response Data:", error.response.data);

            if (error.response.data && error.response.data.message) {
                if (!isSignup && error.response.data.message === "Incorrect password!") {
                    setErrors((prev) => ({
                        ...prev,
                        password: error.response.data.message,
                        loginIdentifier: "",
                    }));
                } else {
                    if (isSignup && error.response.data.errors) {
                        console.log("Error Fields:", Object.keys(error.response.data.errors));
                        const errorField = Object.keys(error.response.data.errors)[0];
                        const errorMessage = error.response.data.errors[errorField];
                        setErrors((prev) => ({
                            ...prev,
                            [errorField]: errorMessage,
                            password: "",
                        }));
                    } else {
                        setErrors((prev) => ({
                            ...prev,
                            loginIdentifier: error.response.data.message,
                            password: "",
                        }));
                    }
                }
            } else {
                setErrors((prev) => ({
                    ...prev,
                    loginIdentifier: "Something went wrong.",
                    password: "",
                }));
            }
        } else {
            setErrors((prev) => ({
                ...prev,
                loginIdentifier: "Something went wrong.",
                password: "",
            }));
        }
    } finally {
        setLoading(false);
    }
};

const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;
  // Allow only numeric input and limit to 10 digits
  const numericValue = value.replace(/\D/g, '').slice(0, 10);
  setFormData((prev) => ({ ...prev, [id]: numericValue }));
  setErrors((prev) => ({ ...prev, [id]: "" }));
};

const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;
  // Allow only letters and spaces
  const nameValue = value.replace(/[^a-zA-Z\s]/g, '');
  setFormData((prev) => ({ ...prev, [id]: nameValue }));
  setErrors((prev) => ({ ...prev, [id]: "" }));
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
      <section
        className="flex justify-center items-center bg-gradient-to-r from-gray-100 to-gray-200 pt-35 pb-10 transition-all duration-300"
        style={{ minHeight: "100vh" }}
      >
        <div className="md:flex w-full sm:w-full md:w-[75%] lg:w-[55%] px-5 sm:px-5 md:px-0 lg:px-0 h-auto shadow-none md:shadow-lg animate-fade-in">
          {/* Left Side */}
          <div className="w-full md:w-1/2 h-auto md:h-[35rem] p-4 md:p-7 px-7 bg-[#0092fb] text-white">
            <h2 className="text-xl md:text-3xl my-2 md:my-4 font-semibold">
              {isSignup ? "Signup" : "Login"}
            </h2>
            <p className="text-sm md:text-md text-gray-100">
              {isSignup
                ? "Looks like you're new here!"
                : "Get access to your Orders, Wishlist, and Recommendations"}
            </p>
            <img
              src={LoginImg}
              alt="Login Image"
              className="w-80 h-auto object-contain mx-auto pt-10 hidden md:block"
            />
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 h-auto p-7 bg-white">
            {/* Mobile Number/Email Input - Only Show in Login Mode */}
            {!isSignup && (
              <div className="relative my-7">
                <label
                  htmlFor="loginIdentifier"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${
                    isLoginIdentifierFocused ? "text-xs -top-4 text-[#0092fb]" : "text-base top-2"
                  }`}
                >
                  Enter Email/Mobile Number
                </label>
                <input
                  id="loginIdentifier"
                  type="text"
                  value={formData.loginIdentifier}
                  onChange={handleChange}
                  onFocus={() => setIsLoginIdentifierFocused(true)}
                  onBlur={(e) => !e.target.value && setIsLoginIdentifierFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
                {errors.loginIdentifier && (
                  <p className="text-red-500 text-xs mt-1">{errors.loginIdentifier}</p>
                )}
              </div>
            )}

            {/* Mobile Number Input - Only Show in Signup Mode */}
            {isSignup && (
              <div className="relative my-7">
                <label
                  htmlFor="signupMobileNumber"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${
                    isSignupMobileNumberFocused ? "text-xs -top-4 text-[#0092fb]" : "text-base top-2"
                  }`}
                >
                  Mobile Number
                </label>
                <input
                  id="signupMobileNumber"
                  type="text"
                  value={formData.signupMobileNumber}
                  onChange={handleMobileNumberChange}
                  onFocus={() => setIsSignupMobileNumberFocused(true)}
                  onBlur={(e) => !e.target.value && setIsSignupMobileNumberFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
                {errors.signupMobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.signupMobileNumber}</p>
                )}
              </div>
            )}

            {/* Name Input - Only Show in Signup Mode */}
            {isSignup && (
              <div className="relative my-7">
                <label
                  htmlFor="name"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${
                    isNameFocused ? "text-xs -top-4 text-[#0092fb]" : "text-base top-2"
                  }`}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={(e) => !e.target.value && setIsNameFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            )}
            {/* Email Input - Only Show in Signup Mode */}
            {isSignup && (
              <div className="relative my-7">
                <label
                  htmlFor="email"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${
                    isEmailFocused ? "text-xs -top-4 text-[#0092fb]" : "text-base top-2"
                  }`}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={(e) => !e.target.value && setIsEmailFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            )}
            {/* Password Input - Only Show in Signup Mode */}
            {isSignup && (
              <div className="relative my-7">
                <label
                  htmlFor="password"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${
                    isPasswordFocused ? "text-xs -top-4 text-[#0092fb]" : "text-base top-2"
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={(e) => !e.target.value && setIsPasswordFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            )}

            {/* Password Input - Only Show in Login Mode */}
            {!isSignup && (
              <div className="relative my-7">
                <label
                  htmlFor="password"
                  className={`absolute left-0 px-1 bg-white transition-all cursor-text ${
                    isPasswordFocused ? "text-xs -top-4 text-[#0092fb]" : "text-base top-2"
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password" // Changed to password type
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={(e) => !e.target.value && setIsPasswordFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full p-2 border-b transition-all focus:border-[#0092fb] focus:outline-none"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            )}

            <p className="text-gray-400 text-xs my-4">
              By continuing, you agree to Quivio's{" "}
              <a href="/privacy-policy" className="text-[#0092fb] cursor-pointer">Privacy Policy</a>.
            </p>

            {/* Toggle Between Login & Signup Buttons */}
            {isSignup ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="w-full p-2 bg-[#0092fb] text-white rounded-md font-semibold cursor-pointer hover:bg-[#007acc]"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
                <button
                  onClick={() => setIsSignup(false)}
                  className="w-full p-2 mt-2 border border-[#0092fb] text-[#0092fb] rounded-md font-semibold cursor-pointer hover:bg-[#0092fb] hover:text-white"
                >
                  Existing User? Login
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  className="w-full p-2 bg-[#0092fb] text-white rounded-md font-semibold cursor-pointer hover:bg-[#007acc]"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>

                {/* Show only in Login Mode */}
                <div
                  onClick={() => setIsSignup(true)}
                  className="text-[#0092fb] text-center font-medium mt-8 cursor-pointer"
                >
                  <p>New to Quivio? Create an Account</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};