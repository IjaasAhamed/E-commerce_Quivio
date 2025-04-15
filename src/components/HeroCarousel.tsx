import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeroCarousel.css';
import slide1 from "../assets/slide1.webp";
import slide2 from "../assets/slide2.webp";
import slide3 from "../assets/slide3.webp";
import slide4 from "../assets/slide4.webp";
import slide5 from "../assets/slide5.webp"

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      image: slide1,
      title: "Luxury Handbags for Every Occasion",
      description: "Upgrade your style with our premium handbags. Limited-time offers!",
      cta: "Shop Handbags",
      style: "slide-1",
      name: "Handbags"
    },
    {
      image: slide2,
      title: "Experience the Power of True Wireless",
      description: "Crystal-clear sound & long-lasting battery. Get your perfect TWS today!",
      cta: "Shop TWS Earbuds",
      style: "slide-2",
      name: "TWS"
    },
    {
      image: slide3,
      title: "Step Into Comfort & Style",
      description: "Top-selling sneakers & formal shoes at unbeatable prices!",
      cta: "Shop Shoes",
      style: "slide-3",
      name: "Sneakers"
    },
    {
      image: slide4,
      title: "Smartwatches for Smarter Living",
      description: "Track fitness, stay connected & look stylish. Shop now!",
      cta: "Shop Smartwatches",
      style: "slide-4",
      name: "Smart Watch"
    },
    {
      image: slide5,
      title: "Beauty That Speaks for Itself",
      description: "Premium skincare & beauty essentials for a flawless glow!",
      cta: "Shop Beauty Products",
      style: "slide-5",
      name: "Skincare"
    }
  ];


  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    startAutoSlide();
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    startAutoSlide();
  };

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/searchResults?category=${encodedCategory}`);
  };

  // Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchEndX.current - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) goToPrev();
      else goToNext();
    }
  };


  return (
    <section className="hero-carousel z-10" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* The flex container holding all images */}
      <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className={`slide ${slide.style}`}>
            <div className="content">
              <h2 className="title">{slide.title}</h2>
              <p className="description">{slide.description}</p>
              <button onClick={() => handleCategoryClick(slide.name)} className="cta-button">
                {slide.cta}
              </button>
            </div>
            <div className='img-container'>
              <img src={slide.image} alt={`Slide ${index + 1}`} />
            </div>
          </div>
        ))}
      </div>


      {/* Navigation Buttons */}
      <div className="nav-buttons-wrapper">
        <button onClick={goToPrev} className="nav-button">
          ◀
        </button>
        <button onClick={goToNext} className="nav-button">
          ▶
        </button>
      </div>


      {/* Dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              startAutoSlide();
            }}
            className={`dot ${currentIndex === index ? "active" : ""}`}
          ></span>
        ))}
      </div>
    </section>
  );
};
