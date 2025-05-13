import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import searchIcon from "../assets/icon search.png"

// Define Product Type
interface Product {
  id: number;
  name: string;
  product_color_img: string;
  category: string;
}

export const Search = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]); // Specify type explicitly
  const navigate = useNavigate();

  // Debounce API Call
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]); // Clear results when input is empty
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchProducts(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Fetch Products
  const fetchProducts = async (searchTerm: string) => {
    try {
      const response = await axios.get<{ data: Product[] }>(
        `${API}/products?search=${searchTerm}`
      );

      console.log("API Response:", response.data); // Debugging

      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        setResults([]); // Avoid breaking if data structure is incorrect
      }
    } catch (error) {
      console.error("Error fetching search results", error);
      setResults([]); // Handle API errors
    }
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/searchResults?search=${encodeURIComponent(query)}`);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleSearch();
    }
  }

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <div ref={dropdownRef} className="relative sm:w-full md:w-md lg:w-2xl xl:w-3xl mx-auto transform transition-all duration-300 z-40">
      {/* Search Bar */}
      <div className=" flex items-center border border-gray-300 bg-white/50 rounded-md px-3 sm:px-5">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full outline-none p-2 text-sm sm:text-base"
        />
        <div className="flex gap-2 sm:gap-4">
          <button onClick={() => setQuery("")} className="ml-2 text-gray-600 cursor-pointer">
            ✖
          </button>
          <div className="w-4 cursor-pointer " onClick={handleSearch} onChange={() => fetchProducts(query)}>
            <img src={searchIcon} alt="Search Icon" className="w-full h-auto my-2 opacity-60 object-fit"></img>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && query.trim() && (
        <div className="absolute top-full left-0 w-full max-h-70 overflow-y-auto mt-4 bg-white shadow-lg rounded-md p-2 z-50">
          <div onClick={handleSearch} className="text-gray-700 font-semibold p-2 last:border-none flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md">
          <img src={searchIcon} alt="Search Icon" className="w-4 h-4 m-1 opacity-60 object-fit"></img>
            <span className="font-bold">{query}</span>
          </div>
          {results.map((product) => (
            <div key={product.id} onClick={() =>navigate(`/product-details/${product.id}/${product.name}`)} className="p-2 last:border-none flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md ">
              <img src={`${API}/${product.product_color_img}`} alt={product.name} className="w-11 h-11 object-fit " />
              <p className="text-gray-700">{product.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
