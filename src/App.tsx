import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HomePage } from "./pages/HomePage";
import CategoryPage from "./pages/ProductCategoriesPage";
import { Search } from './components/Search';
import { ProductCategory } from './components/ProductCategory';
import { ProductDetails } from './components/ProductDetails';
import { SearchResults } from './components/SearchResults';
import { CartPage } from './components/CartPage';
import { LoginSignup } from './components/LoginSignup';
import { PaymentStatusModal } from './components/PaymentStatusModal';
import { Orders } from './components/Orders';
import { ShippingAddress } from './components/ShippingAddress';
import { Profile } from './components/Profile';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { WeeklyDealPage } from './components/WeeklyDealPage';
import { Checkout } from './components/Checkout';
import { Wishlist } from './components/Wishlist';
import { TermsAndConditions } from './components/TermsAndConditions';
import { Contact } from './components/Contact';
import { ReturnPolicy } from './components/ReturnPolicy';

function App() {
  const [showModalPaymentStatus, setShowModalPaymentStatus] = useState(false);
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/category/:name" element={<CategoryPage />} /> */}
        <Route path='/productCategory/:category' element={<ProductCategory />} />
        <Route path="/search" element={<Search />}/>
        <Route path='/product-details/:id/:name' element={<ProductDetails />} />
        <Route path="/searchResults" element={<SearchResults />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/login' element={<LoginSignup />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/shipping-address' element={<ShippingAddress />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/weekly-deal-page' element={<WeeklyDealPage />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='wishlist' element={<Wishlist />} />
        <Route path='/terms&conditions' element={<TermsAndConditions />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/return-policy' element={<ReturnPolicy />} />
      </Routes>
      <PaymentStatusModal
        showModalPaymentStatus={showModalPaymentStatus}
        setShowModalPaymentStatus={setShowModalPaymentStatus}
      />
    </Router>
  );
}

export default App;
