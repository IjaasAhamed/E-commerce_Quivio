import { Link } from 'react-router-dom'
import Logo from '../assets/Quivio Logo.png'
import fb from '../assets/facebook.png'
import insta from '../assets/instagram.png'
import LinkedIn from '../assets/linkedin.png'
import '../styles/Footer.css'

export const Footer = () => {
  return (
    <footer className="bg-white text-black py-20 transform transition-all duration-300">
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & Description */}
        <div>
          <div>
            <img src={Logo} alt="Quivio Logo" className="h-12 mb-4"/>
          </div>
          <p className="text-gray-400 text-sm">
            Your one-stop shop for premium home essentials.
          </p>
          <div className="flex gap-5 mt-5">
            <img src={fb} alt="Facebook" className="h-5 w-5"/>
            <img src={insta} alt="Instagram" className="h-5 w-5"/>
            <img src={LinkedIn} alt="LinkedIn" className="h-5 w-5"/>
          </div>
        </div>

        {/* Account */}
        <nav aria-label="Account">
          <h2 className="text-xl font-bold tracking-wide mb-4">Account</h2>
          <ul className="space-y-2">
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/profile" className="text-gray-400 hover:text-blue-600">
                Profile
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/login?signup=false" className="text-gray-400 hover:text-blue-600">
                Log in
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/login?signup=true" className="text-gray-400 hover:text-blue-600">
                Sign Up
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/orders" className="text-gray-400 hover:text-blue-600 ">
                Orders
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/wishlist" className="text-gray-400 hover:text-blue-600 ">
                Wishlist
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/shipping-address" className="text-gray-400 hover:text-blue-600 ">
                Shipping Address
              </a>
            </li>
          </ul>
        </nav>

        {/* Useful Links */}
        <nav aria-label="Useful Links">
          <h2 className="text-xl font-bold tracking-wide mb-4">Useful Links</h2>
          <ul className="space-y-2">
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/privacy-policy" className="text-gray-400 hover:text-blue-600" style={{transition: 'transform 0.3 ease'}}>
                Privacy Policy
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/return-policy" className="text-gray-400 hover:text-blue-600">
                Return Policy
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/contact" className="text-gray-400 hover:text-blue-600">
                Contact
              </a>
            </li>
            <li className="transform transition-all duration-300 hover:translate-x-2">
              <a href="/terms&conditions" className="text-gray-400 hover:text-blue-600">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </nav>

        

        {/* Contact & Address */}
        <address className="not-italic">
          <h2 className="text-xl font-bold tracking-wide mb-4">Contact & Address</h2>
          <p className="text-gray-400">789 Boulevard, Long Island City, NY 11101, Queens, New York.</p>
          <p className="text-gray-400 mt-2">📞 Phone: <a href="tel:+1 (917) 5556-0123" className="hover:text-blue-600">+1 (917) 5556-0123</a></p>
          <p className="text-gray-400">📧 Email: <a href="mailto:info@quivio.com" className="hover:text-blue-600">info@quivio.com</a></p>
        </address>

      </section>
    </footer>
  );
};

  