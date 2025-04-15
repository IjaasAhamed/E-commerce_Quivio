import undo from "../assets/undo.png";
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const ReturnPolicy = () => {
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
    <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen pt-40 md:pt-30 pb-15 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-8 animate-fade-in">
        <h1 className="text-3xl font-semibold text-[#925DF0] mb-6">
          Our Simple 7-Day Return Policy
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <img src={undo} alt='Undo' className="w-fit h-auto object-contain" />
          <h2 className="text-2xl font-bold text-gray-900">Hassle-Free Returns</h2>
        </div>

        <p className="text-gray-700 mb-4 text-lg">
          At Quivio, we want you to be completely satisfied with your purchase.
          That's why we offer a straightforward 7-day return program. If
          you're not entirely happy with your order, you can return it to us
          within 7 days of receiving it.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          How Our 7-Day Return Policy Works:
        </h2>

        <ol className="list-decimal list-inside text-gray-700 mb-4 text-lg">
          <li>
            <strong>Eligibility:</strong> Our 7-day return policy applies to most
            products sold on Quivio. Please note that certain items may have
            specific return conditions (e.g., for hygiene reasons or perishable
            goods). These exceptions, if any, will be clearly stated on the
            product page.
          </li>
          <li>
            <strong>Timeframe:</strong> You have 7 days from the date you
            receive your order to initiate a return.
          </li>
          <li>
            <strong>Condition of the Item:</strong> To be eligible for a full
            refund, the item(s) must be returned in their original condition,
            unworn, unused, and with all original tags, packaging, and
            accessories included.
          </li>
          <li>
            <strong>Initiating a Return:</strong> To start a return, You will need to provide your order number and the reason for the
            return.
          </li>
          <li>
            <strong>Return Shipping:</strong> Once your return request is approved,
            we will provide you with instructions on how to return the item(s).
          </li>
          <li>
            <strong>Inspection and Processing:</strong> Once we receive your
            returned item(s), our team will inspect them to ensure they meet our
            return conditions. After inspection, we will process your refund.
          </li>
          <li>
            <strong>Refund Method:</strong> Refunds will be issued to the original
            payment method used for the purchase. Please allow [number] business
            days for the refund to reflect in your account, depending on your
            bank or payment provider.
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          Exceptions and Special Cases:
        </h2>

        <p className="text-gray-700 mb-4 text-lg">
          While our 7-day return policy covers most items, there might be
          specific exceptions. These could include:
        </p>

        <ul className="list-disc list-inside text-gray-700 mb-4 text-lg">
          <li>Items marked as non-returnable.</li>
          <li>Personalized or custom-made products.</li>
          <li>Perishable goods.</li>
          <li>Hygiene-sensitive items (if the packaging has been opened).</li>
          <li>Digital downloads or services.</li>
        </ul>

        <p className="text-gray-700 mb-4 text-lg">
          Any exceptions will be clearly stated on the product page before you
          make your purchase.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          Questions?
        </h2>

        <p className="text-gray-700 text-lg">
          If you have any questions about our 7-day return policy, please don't
          hesitate to contact our friendly support team:
        </p>

        <ul className="list-disc list-inside text-gray-700 text-lg">
          <li>Email: <a href="mailto:support@quivio.com" className="text-blue-500 underline">info@quivio.com</a></li>
          <li>Phone: +1 (917) 5556-0123</li>
          <li>Visit our <a href="/contact" className="text-blue-500 underline">Contact Us</a> page for more options.</li>
        </ul>

        <p className="text-gray-700 mt-8 text-sm">
          Last updated: April 1st, 2025
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
};
