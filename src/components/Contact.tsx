import fb from '../assets/facebook.png'
import insta from '../assets/instagram.png'
import LinkedIn from '../assets/linkedin.png'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export const Contact = () => {
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
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 animate-fade-in">
        <h1 className="text-2xl font-semibold text-[#925DF0] mb-6">Contact Us</h1>

        <p className="text-gray-700 mb-4">
          We're here to help! Choose from the options below to get in touch with
          Quivio.
        </p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Our Location</h2>
          <div className="flex items-center text-gray-700">
            <span className="mr-2">📍</span>
            <p>
              789 Boulevard, Long Island City, NY 11101, Queens, New York.
              <br />
            </p>
          </div>
          <div className="rounded-md overflow-hidden shadow-sm mt-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.27999497616!2d-74.2598673343879!3d40.6976700638833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1712621837896!5m2!1sen!2sus"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map of New York"
            ></iframe>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h2>
          <div className="flex items-center text-gray-700">
            <span className="mr-2">📞</span>
            <p>
              Phone: <a href="tel:+1 (917) 5556-0123" className="text-blue-500">
              +1 (917) 5556-0123
              </a>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h2>
          <div className="flex items-center text-gray-700">
            <span className="mr-2">✉️</span>
            <p>
              Email: <a href="mailto:info@quivio.com" className="text-blue-500">
                info@quivio.com
              </a>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Connect With Us</h2>
          <div className="flex gap-5 mt-5">
            <img src={fb} alt="Facebook" className="h-5 w-5"/>
            <img src={insta} alt="Instagram" className="h-5 w-5"/>
            <img src={LinkedIn} alt="LinkedIn" className="h-5 w-5"/>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};