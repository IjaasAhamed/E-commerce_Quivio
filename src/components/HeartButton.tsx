
import React, { useState, useEffect } from "react";
import "../styles/HeartButton.css";
import axios from "axios";

interface HeartButtonProps {
  userId: string | null;
  productEntryId: number;
  initialLiked: boolean;
  onRemoveFromWishlist?: (productId: number) => void;
  className?: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
  userId,
  productEntryId,
  initialLiked,
  onRemoveFromWishlist,
  className = "",
}) => {
  const [liked, setLiked] = useState(false); // Initialize liked to false

  const API = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    if (initialLiked !== undefined) {
      setLiked(initialLiked);
    }
  }, [initialLiked]);
  

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setLiked(!liked);
    const action = liked ? 'remove' : 'add';
    const endpoint = (`${API}/wishlist/${action}`);

    try {
      const response = await axios.post(endpoint, { userId, productEntryId });
      if (response.status === 200) {
        console.log(`Product ${action}ed to wishlist for user ${userId}, product ${productEntryId}`);
        if (action === 'remove' && onRemoveFromWishlist) {
          onRemoveFromWishlist(productEntryId); // Call the callback on successful removal
        }
      } else {
        console.error(`Failed to ${action} product from wishlist (status: ${response.status})`);
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Error interacting with wishlist API:", error);
      setLiked(!liked);
    }
  };



  return (
    <svg
      viewBox="0 0 24 24"
      fill={liked ? "red" : "none"}
      className={`heart-icon ${liked ? "liked" : ""} ${className}`}
      onClick={handleLike}
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
};