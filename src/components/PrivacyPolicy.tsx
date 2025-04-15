import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const PrivacyPolicy = () => {
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
      <section className="w-full flex justify-center bg-gradient-to-r from-gray-100 to-gray-200 pt-40 md:pt-30 pb-15 px-4 sm:px-6 lg:px-8">
      <div className="container rounded-lg animate-fade-in"
        style={{
          minHeight: "100vh",
          padding: "50px",
          background: "#ffffff",
          color: "#333",
          lineHeight: "1.6",
        }}
      >
        <h1 style={{ color: "#925DF0", marginBottom: "20px" }}>
          Privacy Policy for <span className="text-black">Quivio</span>.
        </h1>
        <p>
          <strong>Last Updated:</strong> April 1st, 2025
        </p>
        <p>
          This Privacy Policy describes how Quivio we collects,
          uses, and shares information about you when you visit our website{" "}
          Quivio.com or use our services. We
          are committed to protecting your privacy and ensuring the security of
          your personal information.
        </p>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>
          1. Information We Collect
        </h2>
        <p>
          We collect various types of information to provide and improve our
          Services.
        </p>
        <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
          <li>
            <strong>Information You Provide Directly:</strong>
            <ul style={{ listStyleType: "circle", marginLeft: "20px" }}>
              <li>
                <strong>Account Information:</strong> When you create an account,
                we collect your name, email address, password, and any other
                information you provide during registration.
              </li>
              <li>
                <strong>Order Information:</strong> When you place an order, we
                collect your billing address, shipping address, payment
                information, and order details.
              </li>
              <li>
                <strong>Communication Information:</strong> When you contact us
                for customer support or feedback, we collect your name, email
                address, and any other information you provide in your
                communication.
              </li>
              <li>
                <strong>User-Generated Content:</strong> If you post reviews,
                comments, or other content on our Site, we collect that
                information.
              </li>
              <li>
                <strong>Profile Information:</strong> If you upload a profile
                picture or add personal details to your profile.
              </li>
            </ul>
          </li>
          <li>
            <strong>Information We Collect Automatically:</strong>
            <ul style={{ listStyleType: "circle", marginLeft: "20px" }}>
              <li>
                <strong>Log Data:</strong> We collect information about your use
                of our Site, including your IP address, browser type, operating
                system, access times, and pages viewed.
              </li>
              <li>
                <strong>Device Information:</strong> We collect information about
                the device you use to access our Site, including the device
                type, unique device identifiers, and mobile network information.
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> We use cookies,
                web beacons, and similar technologies to collect information
                about your browsing activity.
              </li>
              <li>
                <strong>Location Data:</strong> With your consent, we may collect
                information about your location.
              </li>
            </ul>
          </li>
          <li>
            <strong>Information from Third Parties:</strong>
            <p>
              We may receive information about you from third-party sources, such
              as payment processors, shipping providers, and marketing partners.
            </p>
          </li>
        </ul>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>
          2. How We Use Your Information
        </h2>
        <p>We use your information for various purposes, including:</p>
        <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
          <li>To provide and maintain our Services.</li>
          <li>To improve our Services.</li>
          <li>To communicate with you.</li>
          <li>To personalize your experience.</li>
          <li>To prevent fraud.</li>
          <li>To comply with legal obligations.</li>
          <li>For marketing purposes.</li>
        </ul>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>
          3. Sharing Your Information
        </h2>
        <p>We may share your information with:</p>
        <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
          <li>Service Providers.</li>
          <li>Business Partners.</li>
          <li>Legal Authorities.</li>
          <li>Business Transfers.</li>
          <li>With your consent.</li>
        </ul>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>
          4. Data Security
        </h2>
        <p>
          We implement reasonable security measures to protect your information.
          However, no method of transmission over the internet or electronic
          storage is completely secure.
        </p>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>5. Your Rights</h2>
        <p>You have the following rights regarding your personal information:</p>
        <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
          <li>Access.</li>
          <li>Correction.</li>
          <li>Deletion.</li>
          <li>Opt-out.</li>
          <li>Data Portability.</li>
        </ul>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>
          6. Cookies and Tracking Technologies
        </h2>
        <p>
          We use cookies and similar technologies to collect information about
          your browsing activity. You can control cookies through your browser
          settings.
        </p>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>
          7. Children's Privacy
        </h2>
        <p>
          Our Services are not intended for children under 13. We do not
          knowingly collect personal information from children under 13.
        </p>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>
          8. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 style={{ color: "#101828", marginTop: "30px", fontWeight: "600", fontSize: "20px" }}>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>info@quivio.com</p>
        
        <p>
          <strong>Important Considerations:</strong>
        </p>
        <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
          <li>Ensure your policy complies with relevant privacy laws.</li>
          <li>Clearly disclose the third-party services you use.</li>
          <li>Specify data retention practices.</li>
          <li>Disclose international data transfers, if applicable.</li>
          <li>Obtain explicit user consent.</li>
          <li>Regularly update your privacy policy.</li>
          <li>Consult with a legal professional.</li>
        </ul>
      </div>
      </section>
      <Footer />
    </>
  );
};