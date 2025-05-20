import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";
import { useNavigate } from "react-router";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      // Reset if the query is too short
      setProducts([]);
      setCategory(null);
      setBrand(null);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setError("");

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/search/product-search`,
          {
            params: { query },
            withCredentials: true,
          }
        );

        setProducts(response.data.products);
        setCategory(response.data.category);
        setBrand(response.data.brand);
        setSearchPerformed(true);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(debounceTimeout.current);
  }, [query]); // Runs every time `query` changes

  const handleSelection = (path) => {
    navigate(path);
    setQuery("");
    setProducts([]);
    setCategory(null);
    setBrand(null);
    setSearchPerformed(false);
  };

  return (
    <div className="relative max-w-md w-full">
      {/* Search Bar */}
      <div className="flex items-center bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search for products, brands, and more..."
          className="flex-grow px-4 py-2 text-gray-900 dark:text-white bg-transparent focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
              <button
          className="bg-gray-800 px-4 py-2 text-white font-medium hover:bg-gray-900 transition-all"
        >
          Search
        </button>
      </div>

      {/* Search Results Dropdown */}
      {searchPerformed && !loading && (
        <div className="absolute left-0 w-full bg-white dark:bg-gray-800 mt-2 rounded-lg shadow-lg overflow-hidden z-50">
          {error && <p className="text-center text-red-500 p-2">{error}</p>}

          {category && (
            <div
              className="p-3 border-b dark:bg-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() =>
                handleSelection(`/category/${category.name}/${category._id}`)
              }
            >
              <p className="font-semibold text-gray-900 dark:text-white">
                {category.name}
              </p>
            </div>
          )}

          {brand && (
            <div
              className="p-3 border-b dark:bg-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray600"
              onClick={() =>
                handleSelection(`/brand/${brand.name}/${brand._id}`)
              }
            >
              <p className="font-semibold text-gray-900 dark:text-white">
                {brand.name}
              </p>
            </div>
          )}

          {products.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="p-3 border-b dark:bg-gray-700 bg-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSelection(`/product/${product._id}`)}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            !category &&
            !brand && (
              <p className="text-center text-gray-500 p-2">No results found.</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
