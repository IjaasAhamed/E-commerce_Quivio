import  { useState } from 'react';

export const PaymentMode = () => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('COD');

  return (
    <section className="bg-white p-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Payment Mode</h2>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-600"
              value="COD"
              checked={selectedPaymentMode === 'COD'}
              onChange={() => setSelectedPaymentMode('COD')}
              disabled // Disable the radio button since only COD is available
            />
            <span className="ml-2 text-gray-700">Cash on Delivery (COD)</span>
          </label>
        </div>
        <p className="text-sm italic bg-blue-50 border border-blue-300 text-blue-400 py-5 px-3 rounded-md flex items-center">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  Sorry for the inconvenience. Other payment modes will be added soon!
</p>
      </div>
    </section>
  );
};