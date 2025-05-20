import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";
import { setFavorites } from "../../redux/features/favorites/favoriteSlice";

const FavoritesCount = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites);
  const userId = userInfo?._id;
  
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return; // Prevent API call if user isn't logged in

      try {
        const response = await axios.get(`${BASE_URL}/api/wishlist/${userId}`);
        dispatch(setFavorites(response.data.wishlist.products));
        setFavoriteCount(response.data.wishlist.products.length);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []); // Re-run when `userId` or `favorites` change

  return (
    <div className="absolute left-2 top-8">
      {/* {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-customBlue rounded-full">
          {favoriteCount}
        </span>
      )} */}
    </div>
  );
};

export default FavoritesCount;
