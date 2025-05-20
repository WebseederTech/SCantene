import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../../redux/constants";

function CategoryDetails() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cid, cname } = useParams();

  // Filter States
  const [priceRange, setPriceRange] = useState([0, 10000]); // Example range
  const [brand, setBrand] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); // "low-to-high" or "high-to-low"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/category/${cid}`);
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [cid]);

  // Apply filters when any filter state changes
  useEffect(() => {
    let filtered = [...products];

    // Price Range Filter
    filtered = filtered.filter(
      (p) => p.offerPrice >= priceRange[0] && p.offerPrice <= priceRange[1]
    );

    // Stock Filter
    if (inStock) {
      filtered = filtered.filter((p) => !p.outOfStock);
    }

    // Brand Filter
    if (brand) {
      filtered = filtered.filter((p) => p?.brand?.name === brand);
    }

    // Sorting
    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    setFilteredProducts(filtered);
  }, [priceRange, brand, inStock, sortOrder, products]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-400">Error: {error}</div>;

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h2 className="text-2xl font-semibold textcolor mb-4">
        {cname} : {filteredProducts.length} Products
      </h2>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6 dark:bg-gray-800 bg-gray-400 p-4 rounded-lg">
        {/* Price Range */}
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

        {/* Stock Availability */}
        {/* <div className="flex items-center">
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => setInStock(!inStock)}
            className="mr-2"
          />
          <label className="text-white text-sm">In Stock Only</label>
        </div> */}

        {/* Brand Filter */}
        <select
          className="px-3 py-1 rounded-md dark:bg-gray-700 bg-gray-200 text-sm"
          onChange={(e) => setBrand(e.target.value)}
          value={brand}
        >
          <option value="">All Brands</option>
          {[...new Set(products.map((p) => p?.brand?.name))].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Sorting */}
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

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center darklabel">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="max-w-sm relative cardbg rounded-lg shadow"
            >
              <section className="relative">
                <Link to={`/product/${p._id}`}>
                  <span className="absolute bottom-3 right-3 bg-purple-100 text-customBlue/80 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {p?.brand?.name || "N/A"}
                  </span>
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
                  <p className="font-semibold text-customBlue">
                    ₹{p?.offerPrice?.toLocaleString("en-IN")}
                  </p>
                </div>

                <p className="mb-3 font-normal dark:text-[#CFCFCF] text-black">
                  {stripHtml(p?.description?.substring(0, 60))}...
                </p>

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

export default CategoryDetails;
