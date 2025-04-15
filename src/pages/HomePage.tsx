import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar'
import {HeroCarousel} from '../components/HeroCarousel';
import { ProductCategory } from '../components/ProductCategory';
import { SupportLive } from '../components/supportLive';
import { MostPopular } from '../components/MostPopular';
import { WeeklyDeal } from '../components/WeeklyDeal';
import { Discount } from '../components/Discount';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { Loading } from '../components/Loading';

export const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div
        className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <>
    <Navbar />
      <HeroCarousel />
      <ProductCategory />
      <SupportLive />
      <MostPopular />
      <WeeklyDeal />
      <Discount />
      <Footer />
      <ScrollToTop />
    </>
  )
}
