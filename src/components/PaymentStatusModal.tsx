import { useState } from "react";
import { Link } from "react-router-dom";

interface PaymentStatusModalProps {
    showModalPaymentStatus: boolean;
    setShowModalPaymentStatus: (show: boolean) => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({ showModalPaymentStatus, setShowModalPaymentStatus }) => {
    const [isSuccess, setIsSuccess] = useState(true);
    if (!showModalPaymentStatus) return null;

    return (
        <>
            <style>
                {`
                /* Common Styles */
                .status-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    position: relative;
                    animation: pop-in 0.5s ease-out forwards;
                }

                /* Success Styles */
                .success-icon { background: #4caf50; }
                .checkmark {
                    width: 20px;
                    height: 40px;
                    border: solid white;
                    border-width: 0 6px 6px 0;
                    transform: rotate(45deg);
                    position: absolute;
                    top: 20%;
                    left: 35%;
                    animation: checkmark-draw 0.3s ease-in-out forwards;
                }

                /* Failure Styles */
                .failure-icon { background: #e53935; }
                .crossmark {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                }
                .crossmark:before, .crossmark:after {
                    content: "";
                    position: absolute;
                    width: 6px;
                    height: 40px;
                    background: white;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .crossmark:before { transform: translateX(-50%) rotate(45deg); }
                .crossmark:after { transform: translateX(-50%) rotate(-45deg); }

                /* Animations */
                @keyframes pop-in {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes checkmark-draw {
                    0% { width: 0; height: 0; }
                    100% { width: 20px; height: 40px; }
                }
            `}
            </style>
            {showModalPaymentStatus && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(10px)"}}>
                    <div className="bg-white p-8 rounded-xl shadow-xl text-center w-96 relative overflow-hidden">

                        {/* Dynamic Status Icon */}
                        <div className={`status-icon ${isSuccess ? "success-icon" : "failure-icon"}`}>
                            {isSuccess ? (
                                <div className="checkmark"></div>
                            ) : (
                                <div className="crossmark"></div>
                            )}
                        </div>

                        {/* Dynamic Title */}
                        <h2 className={`text-3xl font-semibold mt-6 ${isSuccess ? "text-[#0092fb]" : "text-red-600"}`}>
                            {isSuccess ? "Order Successful!" : "Order Failed!"}
                        </h2>

                        {/* Dynamic Message */}
                        <p className="text-gray-600 mt-2">
                            {isSuccess
                                ? "Your order has been placed successfully."
                                : "Something went wrong. Please try again later."}
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            {/* Back to Orders Button */}
                            <Link
                                to="/orders"
                                className={`px-6 py-2 ${isSuccess ? "bg-[#0092fb] hover:bg-[#007de3]" : "bg-red-500 hover:bg-red-600"} text-white rounded-lg shadow-md transition-all duration-300`}
                            >
                                View Orders
                            </Link>

                            {/* Back to Home Button */}
                            <Link
                                to="/"
                                className={`px-6 py-2 ${isSuccess ? "bg-[#0092fb] hover:bg-[#007de3]" : "bg-red-500 hover:bg-red-600"} text-white rounded-lg shadow-md transition-all duration-300`}
                            >
                                Back to Home
                            </Link>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
