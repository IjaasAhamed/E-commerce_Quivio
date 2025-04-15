import { useState, useEffect } from "react";
import "../styles/Buttons.css";
import "../styles/CreditCardForm.css";
import mail from "../assets/mail.png";
import axios from "axios";
import { CreditCardImg } from "./CreditCardImg";
import { warningToast } from "./WarningToast";
import toast from "react-hot-toast";

export const Discount = () => {
    const API = import.meta.env.VITE_API_BASE_URL;
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
    const [discountClaimed, setDiscountClaimed] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    console.error("User ID not found in localStorage.");
                    return;
                }

                const response = await axios.get(`${API}/users-email/${userId}`);
                console.log("API Response:", response.data);
                setLoggedInEmail(response.data.email);
                setDiscountClaimed(response.data.sp_discount === 1);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleEmailSubmit = () => {
        if (email === loggedInEmail) {
            setIsEmailValid(true);
            setShowModal(true);
        } else {
            setIsEmailValid(false);
        }
    };

    const formatCardNumber = (value: string) => {
        const cleanedValue = value.replace(/\D/g, "");
        let formattedValue = "";
        for (let i = 0; i < cleanedValue.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += " ";
            }
            formattedValue += cleanedValue[i];
        }
        return formattedValue;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(formatCardNumber(e.target.value));
    };

    const formatExpiry = (value: string) => {
        const cleanedValue = value.replace(/\D/g, "").substring(0, 4);
        if (cleanedValue.length <= 2) {
            const month = parseInt(cleanedValue, 10);
            if (isNaN(month)) {
                return cleanedValue;
            }
            if (month > 12) {
                return "12";
            }
            return cleanedValue;
        }

        const month = parseInt(cleanedValue.substring(0, 2), 10);
        if (isNaN(month)) {
            return cleanedValue.substring(0, 2);
        }
        if (month > 12) {
            return "12";
        }

        return `${cleanedValue.substring(0, 2)}/${cleanedValue.substring(2)}`;
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpiry(formatExpiry(e.target.value));
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").substring(0, 3);
        setCvv(value);
    };

    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Card number:", cardNumber.replace(/\D/g, ""));
        console.log("Expiry:", expiry.replace(/\D/g, ""));
        console.log("CVV:", cvv);

        if (cardNumber.replace(/\D/g, "").length !== 16 || expiry.replace(/\D/g, "").length !== 4 || cvv.length !== 3) {
            warningToast("Invalid card details. Please check the card number, expiry date, and CVV.");
            return;
        }

        const userId = localStorage.getItem("userId");

        if (!userId) {
            warningToast("User ID not found. Please log in.");
            return;
        }

        setLoading(true);

        try {
            const [month, year] = expiry.split("/");
            const expiryMonth = parseInt(month, 10);
            const expiryYear = parseInt('20' + year, 10);

            const cardData = {
                cardNumber: cardNumber.replace(/\D/g, ""),
                expiryMonth: expiryMonth,
                expiryYear: expiryYear,
                cvv: cvv,
                id: userId,
            };
            console.log("Card data being sent:", cardData);
            const response = await axios.post("${API}/card-details", cardData);

            console.log("Payment processed:", response.data);

            setLoading(false);
            setPaymentSuccess(true);
            localStorage.setItem("SubsciptionSuccess", "active");
        } catch (error) {
            console.error("Payment failed:", error);
            setLoading(false);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(`Payment failed: ${error.response.data.error || 'An unexpected error occurred'}`);
                } else {
                    toast.error('Network error occurred. Please try again.');
                }
            } else {
                toast.error("Payment failed. Please try again.");
            }
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
        <section className="bg-blue-50 py-30 relative transition-all duration-300">
            <div className="container mx-auto text-center px-4 transition-all duration-300">
                <div className="absolute top-[35%] left-[13%] z-0">
                    <img src={mail} alt="Mail" className="w-35 sm:w-35 md:w-40" />
                </div>
                <div>
                    <h2 className="text-4xl font-bold mb-15">
                        Get Discount 20% Off
                    </h2>
                </div>
                {!discountClaimed ? (
                    <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-7 relative">
                        <input
                            type="email"
                            placeholder="YOUR EMAIL"
                            className="self-center bg-white text-gray-300 px-7 w-full sm:w-full md:w-[400px] h-[50px] outline-0 tracking-wider text-md font-bold leading-12"
                            style={{ boxShadow: "0px 7px 20px 0px rgba(150, 176, 203, 0.2)" }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="cenhov w-fit self-center" onClick={handleEmailSubmit}>
                            SUBSCRIBE
                        </button>
                    </div>
                ) : (
                    <p className="flex items-center justify-center mx-auto text-lg font-semibold rounded-lg px-6 py-3 w-fit"
                        style={{
                            background: 'linear-gradient(135deg, #42a5f5, #2563eb)',
                            color: 'white',
                            border: '1px solid #0092fb',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <svg className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Discount of 20% applied to {loggedInEmail}
                    </p>
                )}
                {isEmailValid === false && (
                    <p className="text-red-500 mt-3">Please enter the email associated with your account to proceed with the subscription.</p>
                )}
            </div>

            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xs z-50"
                    style={{ minHeight: '100vh', backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(10px)" }}>
                    <div className="md:flex w-full sm:w-full md:w-fit lg:w-fit h-auto shadow-none md:shadow-lg pl-10 md:px-0 py-2 md:py-0 animate-fade-in">
                        <div className="w-full md:w-1/2 h-auto p-4 md:p-7 bg-[#0092fb] text-white">
                            <h2 className="text-3xl my-4 font-semibold">Card Details</h2>
                            <p className="text-gray-100">Enter your card details securely.</p>
                            <CreditCardImg cardNumber={cardNumber} expiry={expiry} cvv={cvv} />
                        </div>

                        <div className="w-full md:w-1/2 p-8 bg-white">
                            {!paymentSuccess ? (
                                <form onSubmit={handlePayment}>
                                    <div className="input-field-cardForm">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            maxLength={19}
                                            className="w-full border p-2 mb-2"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            required
                                        />
                                        <label>Card Number (16 digits)</label>
                                    </div>
                                    <div className="input-field-cardForm">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            maxLength={5}
                                            className="w-full border p-2 mb-2"
                                            value={expiry}
                                            onChange={handleExpiryChange}
                                            required
                                        />
                                        <label>MM/YY</label>
                                    </div>
                                    <div className="input-field-cardForm">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            maxLength={3}
                                            className="w-full border p-2 mb-4"
                                            value={cvv}
                                            onChange={handleCvvChange}
                                            required
                                        />
                                        <label>CVV (3 digits)</label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-[#0092fb] text-white w-full py-2 rounded cursor-pointer hover:bg-[#0077d1]"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Pay Now"}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center md: mt-20 p-8 rounded-lg shadow-lg bg-blue-50">
                                    <div className="flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 text-green-500 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <h3 className="text-2xl font-semibold text-green-600">
                                            20% Coupon Activated!
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 mb-6">
                                        Your 20% discount coupon is now active. Enjoy savings on your next purchase!
                                    </p>
                                    <a
                                        href="/"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full transition duration-300 ease-in-out"
                                    >
                                        Continue Shopping
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        className="cls-card-btn"
                        onClick={() => {
                            setShowModal(false);
                            setCardNumber("");
                            setExpiry("");
                            setCvv("");
                            setPaymentSuccess(false);
                        }}
                    ></button>
                </div>
            )}
        </section>
        </>
    );
};