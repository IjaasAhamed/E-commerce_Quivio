import truck from '../assets/truck.png';
import headphoneSupport from '../assets/headphoneSupport.png';
import undo from "../assets/undo.png";
// import '../styles/supportLive.css'

export const SupportLive = () => {
  return (
    <section className='bg-blue-50 py-20 relative'>
    <div className='container mx-auto'>
        {/* <span className='circle1'></span> */}
        <div className='flex flex-col md:flex-row justify-between gap-6'>
            {/* Shipping */}
            <div className="flex items-center gap-5 p-4 w-full md:w-1/3">
                <img src={truck} alt='Truck' className="w-auto h-auto object-contain sm:mt-0 md:-mt-7" />
                <div>
                    <h2 className="text-2xl font-bold py-2">100% Free Shipping</h2>
                    <p className="text-gray-600 text-lg">We ship all our products for free around the World.</p>
                </div>
            </div>

            {/* Support */}
            <div className="flex items-center gap-4 p-4 w-full md:w-1/3">
                <img src={headphoneSupport} alt='Headphone' className="w-auto h-auto object-contain sm:mt-0 md:-mt-7" />
                <div>
                    <h2 className="text-2xl font-bold py-2">24/7 Support</h2>
                    <p className="text-gray-600 text-lg">Our support team is extremely active, you will get a response within 2 minutes.</p>
                </div>
            </div>

            {/* Return */}
            <div className="flex items-center gap-4 p-4 w-full md:w-1/3">
                <img src={undo} alt='Undo' className="w-auto h-auto object-contain sm:mt-0 md:-mt-7" />
                <div>
                    <h2 className="text-2xl font-bold py-2">7 Day Return</h2>
                    <p className="text-gray-600 text-lg">Our 7-day return program is open for customers. Provide your order number and reason.</p>
                </div>
            </div>
        </div>
    {/* <span className='circle2'></span> */}
    </div>
    </section>
  );
};
