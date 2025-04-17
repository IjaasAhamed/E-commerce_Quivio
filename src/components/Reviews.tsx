import React from 'react';
import ReviewPic from '../assets/placeholder-profile.png';
import StarIcon from '../assets/star.png';
import GrayStarIcon from '../assets/gray_star.png';

interface Review {
  name: string;
  rating: number;
  comment: string;
}

interface ReviewsProps {
  reviews: Review[];
  productName: string;
}

const generateFakeName = () => {
  const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Jona", "Grace", "Henry", "Ivy", "Kevin"];
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomRating = () => Math.floor(Math.random() * 5) + 1;

const Star = ({ filled }: { filled: boolean }) => (
  <span style={{ marginRight: '3px', display: 'inline-flex', alignItems: 'center' }}>
    <img
      src={filled ? StarIcon : GrayStarIcon}
      alt={filled ? 'Filled Star' : 'Unfilled Star'}
      style={{ width: '1.1em', height: '1.1em' }}
    />
  </span>
);

console.log("name:", generateFakeName);
console.log("rating:", generateRandomRating);

export const Reviews: React.FC<ReviewsProps> = ({ reviews, productName }) => {
  if (reviews.length === 0) {
    return <p className="text-gray-500 italic">No reviews available for {productName} yet.</p>;
  }

  return (
    <div className="bg-white rounded-lg md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
      <ul>
        {reviews.map((review, index) => (
          <li key={index} className="py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start space-x-3">
              <div
                className="flex-shrink-0 rounded-full overflow-hidden"
                style={{ width: '40px', height: '40px', backgroundColor: '#e0e0e0' }}
              >
                <img
                  src={ReviewPic}
                  alt={`${review.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">{review.name}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < review.rating} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};