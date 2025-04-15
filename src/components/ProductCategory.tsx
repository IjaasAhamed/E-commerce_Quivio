import { useNavigate } from 'react-router-dom';
import { electronicsCategories, fashionCategories } from '../data/categories'; // Import here
import '../styles/Buttons.css';

export const ProductCategory = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/searchResults?category=${encodedCategory}`);
  };

  return (
    <section className='container relative mx-auto px-4 py-25 transition-all duration-300'>
      <h2 className='text-4xl font-bold mb-8'>Product Categories</h2>

      {/* Electronics Section */}
      <div>
        <p className="text-3xl relative after:content-[''] after:block after:w-20 after:h-[3px] after:bg-indigo-500 after:mt-2">
          Electronics
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 my-10'>
        {electronicsCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className='relative group rounded-lg bg-white shadow-xl cursor-pointer w-[160px] h-[160px] flex flex-col justify-center items-center transition-all duration-300 hover:bg-indigo-500 hover:scale-105'
          >
            <img src={category.image} alt={category.name} className='w-[80px] h-full mx-auto object-contain transition-all duration-300 group-hover:invert' />
            <h3 className='w-full text-center whitespace-nowrap uppercase text-sm font-semibold text-black tracking-wide mx-auto mb-5 transition-all duration-300 group-hover:invert' style={{ fontFamily: "Poppins" }}>
              {category.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Fashion Section */}
      <div className='mt-15'>
        <p className="text-3xl relative after:content-[''] after:block after:w-20 after:h-[3px] after:bg-indigo-500 after:mt-2">
          Fashion & Lifestyle
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 my-10'>
        {fashionCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className='relative group rounded-lg bg-white shadow-xl cursor-pointer w-[160px] h-[160px] flex flex-col justify-center items-center transition-all duration-300 hover:bg-indigo-500 hover:scale-105'
          >
            <img src={category.image} alt={category.name} className='w-[80px] h-full mx-auto object-contain transition-all duration-300 group-hover:invert' />
            <h3 className='w-full text-center whitespace-nowrap uppercase text-sm font-semibold text-black tracking-wide mx-auto mb-5 transition-all duration-300 group-hover:invert' style={{ fontFamily: "Poppins" }}>
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};