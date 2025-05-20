import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setFavorites } from "../../redux/features/favorites/favoriteSlice";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = useSelector((state) => state.auth.userInfo._id);

  useEffect(() => {
    setIsFavorite(favorites.some((p) => p._id === product._id));
  }, [favorites, product]);

  const toggleFavorites = async () => {
    if (!userId) return alert("Please log in to manage your wishlist");

    try {
      let updatedWishlist;
      if (isFavorite) {
        await axios.delete(`${BASE_URL}/api/wishlist/${userId}/product/${product._id}`);
      } else {
        await axios.post(`${BASE_URL}/api/wishlist/add`, {
          productId: product._id,
          userId: userId
        });
      }

      // Fetch updated wishlist
      const response = await axios.get(`${BASE_URL}/api/wishlist/${userId}`);
      updatedWishlist = response.data.wishlist.products;
      dispatch(setFavorites(updatedWishlist));

      // Update UI state
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <div className="absolute top-2 right-5 cursor-pointer" onClick={toggleFavorites}>
      {isFavorite ? <FaHeart className="text-customBlue" /> : <FaRegHeart className="text-customBlue" />}
    </div>
  );
};

export default HeartIcon;
