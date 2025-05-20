import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product, onRemove }) => {
  // Function to handle removing item from favorites
  const handleRemove = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the remove button
    if (onRemove) {
      onRemove(product._id);
    }
  };

  // Calculate discount percentage if both prices are available
  const discountPercentage = product.mrp && product.offerPrice
    ? Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100)
    : null;

  return (
    <div className="relative overflow-hidden group">
      {/* Product Image with Overlay */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Heart icon positioned in top-right */}
        <div className="absolute top-3 right-3 z-10" onClick={handleRemove}>
          <HeartIcon product={product} />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <Link to={`/product/${product._id}`} className="block group-hover:text-customBlue transition-colors">
          <h2 className="font-medium text-gray-900 dark:text-white text-lg truncate mb-1">{product.name}</h2>

          <div className="flex flex-col mt-2">
            {/* Show offer price if available, otherwise show MRP */}
            <div className="flex items-center">
              <span className="text-customBlue dark:text-blue-400 font-bold text-lg">
                ₹{(product.offerPrice || product.mrp).toLocaleString('en-IN')}
              </span>

              {/* Show original MRP as strikethrough if offer price exists */}
              {product.offerPrice && product.offerPrice < product.mrp && (
                <span className="ml-2 text-gray-500 line-through text-sm">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Display discount percentage if calculated */}
            {discountPercentage && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300 inline-block w-fit mt-1">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Display category if available */}
          {product.category && typeof product.category === 'string' && (
            <span className="inline-block mt-2 text-xs text-gray-500 dark:text-gray-400">
              {product.category}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Product;