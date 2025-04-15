import { Footer } from "./Footer"
import { Navbar } from "./Navbar"

export const TermsAndConditions = () => {
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
          Terms and Conditions for <span className="text-black">Quivio</span>.
        </h1>

        <p className="text-gray-700 mb-4">
          Please read these Terms and Conditions carefully before using
          the Quivio e-commerce web application operated by Quivio.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 mb-4">
          By accessing or using the Service, you agree to be bound by these Terms.
          If you disagree with any part of the terms, then you may not access the
          Service.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          2. Products and Pricing
        </h2>
        <p className="text-gray-700 mb-4">
          We strive to provide accurate product descriptions and pricing. However,
          we do not warrant that product descriptions or other content of the
          Service are accurate, complete, reliable, current, or error-free. Prices
          are subject to change without notice.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          3. Orders and Payments
        </h2>
        <p className="text-gray-700 mb-4">
          When you place an order, it constitutes an offer to purchase the
          products. We reserve the right to accept or reject your order for any
          reason. Payments are processed through secure payment gateways. You agree
          to provide accurate and complete payment information.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          4. Shipping and Delivery
        </h2>
        <p className="text-gray-700 mb-4">
          Our shipping policies and delivery timelines are outlined on our
          Shipping Information page. Please refer to that page for details.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          5. Returns and Refunds
        </h2>
        <p className="text-gray-700 mb-4">
          Our return and refund policy is detailed on our Returns and Refunds
          page. Please review this policy carefully before making a purchase.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          6. User Accounts
        </h2>
        <p className="text-gray-700 mb-4">
          If you create an account on the Service, you are responsible for
          maintaining the confidentiality of your account and password and for
          restricting access to your computer. You agree to accept responsibility
          for all activities that occur under your account or password.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          7. Intellectual Property
        </h2>
        <p className="text-gray-700 mb-4">
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of [Your Company Name] and its
          licensors. The Service is protected by copyright, trademark, and other
          laws.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          8. User Content
        </h2>
        <p className="text-gray-700 mb-4">
          Users may be permitted to post reviews, comments, or other content. You
          are solely responsible for the content you post and grant us a
          non-exclusive, royalty-free, worldwide, perpetual, irrevocable, and
          sub-licensable right to use, reproduce, modify, adapt, publish, translate,
          create derivative works from, distribute, and display such content.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          9. Prohibited Conduct
        </h2>
        <p className="text-gray-700 mb-4">
          You agree not to use the Service for any unlawful purpose or in any way
          that could harm, disable, overburden, or impair the Service. Prohibited
          conduct includes, but is not limited to:
          <ul className="list-disc list-inside mt-2">
            <li>Violating any applicable laws or regulations.</li>
            <li>Infringing upon the intellectual property rights of others.</li>
            <li>Transmitting any viruses or malicious code.</li>
            <li>Attempting to gain unauthorized access to the Service.</li>
          </ul>
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          10. Limitation of Liability
        </h2>
        <p className="text-gray-700 mb-4">
          To the maximum extent permitted by applicable law, [Your Company Name]
          shall not be liable for any indirect, incidental, special, consequential,
          or punitive damages arising out of or relating to your use of the
          Service.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          11. Governing Law
        </h2>
        <p className="text-gray-700 mb-4">
          These Terms shall be governed by and construed in accordance with the
          laws of [Your Country/Region, e.g., Uganda]. Any disputes arising under
          or in connection with these Terms shall be subject to the exclusive
          jurisdiction of the courts of [Your City/Region, e.g., Kampala].
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          12. Changes to These Terms
        </h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify or replace these Terms at any time. If a
          revision is material, we will try to provide at least [Number] days'
          notice prior to any new terms taking effect. What constitutes a material
          change will be determined at our sole discretion.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          13. Contact Us
        </h2>
        <p className="text-gray-700">
          If you have any questions about these Terms, please contact us at{' '}
          <a href="mailto:[Your Email Address]" className="text-blue-500 underline">
          info@quivio.com
          </a>{' '}
          or +1 (917) 5556-0123 or 789 Boulevard, Long Island City, NY 11101, Queens, New York.
        </p>

        <p className="text-gray-700 mt-8 text-sm">
          Last updated: April 1st, 2025
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
};
