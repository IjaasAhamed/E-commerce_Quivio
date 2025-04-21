import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { allCategoryNames } from '../data/categories';

type SideBarProps = {
  onBrandFilterChange: (brands: string[]) => void;
  onRatingFilterChange: (ratings: number[]) => void;
  onPriceFilterChange: (min: number, max: number) => void;
};

const isMobileView = () => window.innerWidth < 768;

export const SideBar = ({ onBrandFilterChange, onRatingFilterChange, onPriceFilterChange }: SideBarProps) => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState<{ brand: string; ratings: number; strike_price: number }[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(!isMobileView());
  const [isRatingsExpanded, setIsRatingsExpanded] = useState(!isMobileView());
  const [isPriceRangeExpanded, setIsPriceRangeExpanded] = useState(!isMobileView());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [priceRanges, setPriceRanges] = useState<number[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (searchQuery && allCategoryNames.includes(searchQuery)) {
        setCategoryName(searchQuery);
        return;
      }
      if (searchQuery) {
        try {
          const response = await axios.get(
            `${API}/filters-category-name?search=${encodeURIComponent(searchQuery)}`
          );
          setCategoryName(response.data.categoryName);
        } catch (error) {
          console.error("Error fetching category name:", error);
        }
      } else if (category) {
        setCategoryName(category);
      }
    };

    fetchCategoryName();
  }, [category, searchQuery]);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      let url = `${API}/filters?`;
      let filterCategory = category;

      const lowerCaseSearchQueryWithoutSpace = searchQuery.toLowerCase().replace(/\s/g, '');

      const matchedCategory = allCategoryNames.find(cat =>
        cat.toLowerCase().replace(/\s/g, '') === lowerCaseSearchQueryWithoutSpace
      );

      if (searchQuery && matchedCategory) {
        filterCategory = matchedCategory;
      }

      if (filterCategory) {
        url += `category=${encodeURIComponent(filterCategory)}`;
      } else if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}`;
      } else {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(url);
        setFilters(response.data);

        if (response.data && response.data.length > 0) {
          const prices = response.data.map((item: any) => item.actual_price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          const generatePriceRanges = (min: number, max: number) => {
            const range = max - min;
            let ranges = [];

            if (range < 100) {
              ranges = [min, min + range / 4, min + range / 2, max];
            } else if (range < 500) {
              ranges = [min, min + 100, min + 250, max];
            } else if (range < 1000) {
              ranges = [min, min + 250, min + 500, max];
            } else {
              ranges = [min, min + 500, min + 1000, max];
            }

            const roundedRanges = ranges.map((price) => {
              if (price < 100) {
                return Math.ceil(price / 10) * 10;
              } else if (price < 500) {
                return Math.ceil(price / 50) * 50;
              } else {
                return Math.ceil(price / 100) * 100;
              }
            });

            return [...new Set(roundedRanges)].sort((a, b) => a - b);
          };
          setPriceRanges(generatePriceRanges(minPrice, maxPrice));
        } else {
          setPriceRanges([]);
        }
        setLoading(false);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching filters:", error);
        setFilters([]);
        setPriceRanges([]);
        setError("Failed to load filters.");
        setLoading(false);
      }
    };

    fetchFilters();
  }, [category, searchQuery, allCategoryNames]);


  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) => {
      const newSelection = prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand];
      onBrandFilterChange(newSelection);
      return newSelection;
    });
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) => {
      const newSelection = prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating];
      onRatingFilterChange(newSelection);
      return newSelection;
    });
  };

  const handlePriceRangeChange = (price: number) => {
    setSelectedPriceRanges((prev) => {
      const newSelection = prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price];
      let maxPrice = Infinity;

      if (newSelection.length > 0) {
        maxPrice = Math.max(...newSelection);
        onPriceFilterChange(0, maxPrice);
      } else {
        onPriceFilterChange(0, Infinity);
      }
      return newSelection;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobileView();
      setIsPriceRangeExpanded(!mobile);
      setIsBrandsExpanded(!mobile);
      setIsRatingsExpanded(!mobile);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log("log:", loading);
  console.log("err:", error);
  
  return (
    <>
      <style>
        {`
          button:focus {
            outline: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            width: 0;
            background: transparent;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .filter-section-content {
            overflow: hidden;
            transition: opacity 0.2s ease-in-out, max-height 0.2s ease-in-out;
            opacity: 1;
            max-height: 500px; /* Adjust as needed */
          }
          .filter-section-content.collapsed {
            opacity: 0;
            max-height: 0;
          }
          .filter-section-content-mobile {
            overflow: hidden;
            transition: opacity 0.2s ease-in-out, max-height 0.2s ease-in-out;
            opacity: 1;
            max-height: 500px; /* Adjust as needed */
          }
          .filter-section-content-mobile.collapsed {
            opacity: 0;
            max-height: 0;
          }
        `}
      </style>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-1/4 bg-white shadow-sm" style={{ minHeight: '100vh', position: 'sticky', top: '80px', alignSelf: 'flex-start', scrollBehavior: "smooth" }}>
        <div className="overflow-y-auto hide-scrollbar" style={{ maxHeight: "calc(100vh - 80px)" }}>
          <h2 className="text-xl font-semibold border-b border-b-gray-300 py-4 px-5">Filters</h2>
          <div className="border-b border-b-gray-300 py-4">
            <h2 className="uppercase font-semibold py-1 px-5">Categories</h2>
            <div className=" py-1 px-5">{category || categoryName}</div>
          </div>

          {filters.length > 0 && (
            <div className="mb-4 border-b border-b-gray-300 py-5 px-5">
              <button
                onClick={() => setIsPriceRangeExpanded(!isPriceRangeExpanded)}
                className="flex justify-between uppercase w-full cursor-pointer text-left font-medium text-gray-700 hover:text-blue-500"
                style={{ outline: "none !important" }}
              >
                Price Range
                <span>{isPriceRangeExpanded ? "▲" : "▼"}</span>
              </button>
              <div className={`mt-2 filter-section-content ${!isPriceRangeExpanded ? 'collapsed' : ''}`}>
                {priceRanges.map((price) => (
                  <label key={price} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedPriceRanges.includes(price)}
                      onChange={() => handlePriceRangeChange(price)}
                    />
                    <span className="cursor-pointer">Under ${price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {filters.length > 0 && category && (
            <div className="mb-4 border-b border-b-gray-300 py-5 px-5">
              <button
                onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                className="flex justify-between uppercase w-full cursor-pointer text-left font-medium text-gray-700 hover:text-blue-500"
                style={{ outline: "none !important" }}
              >
                Brands
                <span>{isBrandsExpanded ? "▲" : "▼"}</span>
              </button>
              <div className={`mt-2 filter-section-content ${!isBrandsExpanded ? 'collapsed' : ''}`}>
                {[...new Set(filters.map((filter) => filter.brand))].map((brand, index) => (
                  <label key={`${brand}-${index}`} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span className="cursor-pointer">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {filters.length > 0 && (
            <div className=" py-3 px-5 mb-8">
              <button
                onClick={() => setIsRatingsExpanded(!isRatingsExpanded)}
                className="flex justify-between uppercase w-full cursor-pointer text-left font-medium text-gray-700 hover:text-blue-500"
              >
                Customer Ratings
                <span>{isRatingsExpanded ? "▲" : "▼"}</span>
              </button>
              <div className={`mt-2 filter-section-content ${!isRatingsExpanded ? 'collapsed' : ''}`}>
                {[4, 3, 2].map((rating) => (
                  <label key={rating} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-checkbox checked:text-blue-600"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingChange(rating)}
                    />
                    <span className=" cursor-pointer">{rating} ★ ratings</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE VIEW */}
      <div className="md:hidden w-full pt-35 pb-4 px-4 gap-3 h-auto " >
        <div className="flex flex-row justify-around gap-2 whitespace-nowrap">

          {/* Price Range Button + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPriceRangeExpanded(!isPriceRangeExpanded)}
              className="bg-gray-100 px-4 py-2 rounded-full border text-sm font-medium text-gray-700"
            >
              Price Range {isPriceRangeExpanded ? "▲" : "▼"}
            </button>
            <div className={`absolute top-full left-0 mt-2 bg-gray-50 rounded-lg shadow-2xl px-4 py-2 z-10 w-40 filter-section-content-mobile ${!isPriceRangeExpanded ? 'collapsed' : ''}`}>
              {priceRanges.map((price) => (
                <label key={price} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedPriceRanges.includes(price)}
                    onChange={() => handlePriceRangeChange(price)}
                  />
                  <span>Under ${price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands Button + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
              className="bg-gray-100 px-4 py-2 rounded-full border text-sm font-medium text-gray-700"
            >
              Brands {isBrandsExpanded ? "▲" : "▼"}
            </button>
            <div className={`absolute top-full left-0 mt-2 bg-gray-50 rounded-lg shadow-2xl px-4 py-2 z-10 w-45 max-h-48 overflow-auto filter-section-content-mobile ${!isBrandsExpanded ? 'collapsed' : ''}`}>
              {[...new Set(filters.map((filter) => filter.brand))].map((brand, index) => (
                <label key={`${brand}-${index}`} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ratings Button + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRatingsExpanded(!isRatingsExpanded)}
              className="bg-gray-100 px-4 py-2 rounded-full border text-sm font-medium text-gray-700"
            >
              Ratings {isRatingsExpanded ? "▲" : "▼"}
            </button>
            <div className={`absolute top-full right-0 mt-2 bg-gray-50 rounded-lg shadow-2xl px-4 py-2 z-10 w-40 filter-section-content-mobile ${!isRatingsExpanded ? 'collapsed' : ''}`}>
              {[4, 3, 2].map((rating) => (
                <label key={rating} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingChange(rating)}
                  />
                  <span>{rating} ★ ratings</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

    </>
  );
};