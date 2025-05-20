import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../../redux/constants";

function BrandDetails() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bid, bname } = useParams();

  // Filter States
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [inStock, setInStock] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/brand/${bid}`);
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [bid]);

  useEffect(() => {
    let filtered = [...products];

    filtered = filtered.filter(
      (p) => p.offerPrice >= priceRange[0] && p.offerPrice <= priceRange[1]
    );

    if (inStock) {
      filtered = filtered.filter((p) => !p.outOfStock);
    }

    if (category) {
      filtered = filtered.filter((p) => p?.category?.name === category);
    }

    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    setFilteredProducts(filtered);
  }, [priceRange, inStock, sortOrder, category, products]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-400">Error: {error}</div>;

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h2 className="text-2xl font-semibold textcolor mb-4">
        {bname} : {filteredProducts.length} Products
      </h2>

      <div className="flex flex-wrap gap-4 mb-6 dark:bg-gray-800 bg-gray-400 p-4 rounded-lg">
        <div className="flex flex-col">
          <label className="text-white text-sm">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="cursor-pointer"
          />
        </div>

        <select
          className="px-3 py-1 rounded-md dark:bg-gray-700 bg-gray-200 text-sm"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((p) => p?.category?.name))].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="px-3 py-1 rounded-md dark:bg-gray-700 bg-gray-200 text-sm"
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="">Sort By</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center darklabel">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div key={p._id} className="max-w-sm relative cardbg rounded-lg shadow">
              <section className="relative">
                <Link to={`/product/${p._id}`}>
                  <img
                    className="cursor-pointer w-full"
                    src={p.images.length > 0 ? `${BASE_URL}${p.images[0]}` : "/placeholder-image.png"}
                    alt={p.name}
                    style={{ height: "200px", width: "250px", objectFit: "cover" }}
                  />
                </Link>
              </section>
              <div className="p-5">
                <div className="flex justify-between">
                  <h5 className="mb-2 text-xl textcolor">{p?.name}</h5>
                  <p className="font-semibold text-customBlue">₹{p?.offerPrice?.toLocaleString("en-IN")}</p>
                </div>
                {p.outOfStock && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
                <section className="flex justify-between items-center">
                  {p.outOfStock ? (
                    <span className="inline-flex items-center px-3 py-2 text-sm text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed">
                      Read More
                    </span>
                  ) : (
                    <Link
                      to={`/product/${p._id}`}
                      className="inline-flex items-center px-3 py-2 text-sm text-white bg-customBlue/80 rounded-lg hover:bg-customBlue/80"
                    >
                      Read More
                    </Link>
                  )}
                </section>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrandDetails;
