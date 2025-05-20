import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const Favorites = () => {
  const favoritesFromRedux = useSelector(selectFavoriteProduct);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from wherever you store it (localStorage, Redux, etc.)
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/wishlist/${userId}`);
        setWishlistItems(response.data.wishlist.products);
        console.log(response, "wishlist")
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setError("Failed to load your favorites. Please try again later.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchWishlist();
    } else {
      // If no userId, use Redux data instead
      setWishlistItems(favoritesFromRedux);
      setLoading(false);
    }
  }, [userId, favoritesFromRedux]);

  const removeFromWishlist = async (productId) => {
    try {
      if (!userId) return;

      // First remove the item from the UI for immediate feedback
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));

      // Then update the server
      await axios.delete(`${BASE_URL}/api/wishlist/${userId}`);

      // You might want to implement a more specific endpoint to remove just one product
      // This current implementation will remove the entire wishlist
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      // Revert the UI change if the API call fails
      const response = await axios.get(`/api/wishlist/${userId}`);
      setWishlistItems(response.data.wishlist.products);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h1 className="text-3xl font-bold text-customBlue dark:text-blue-400">
            My Favorites
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your collection of favorite products
          </p>
        </div>

        <div className="px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-t-customBlue border-gray-200 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your favorites...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                <p className="font-medium">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-customBlue text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                className="w-24 h-24 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              <p className="mt-4 text-xl font-medium text-gray-600 dark:text-gray-300">No favorites yet</p>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Products you love will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Product product={product} onRemove={() => removeFromWishlist(product._id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;