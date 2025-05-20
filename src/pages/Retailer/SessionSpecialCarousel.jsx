import React, { useState } from "react";
import { BASE_URL } from "../../redux/constants";
import { FaShoppingCart } from "react-icons/fa";

import { Link } from "react-router-dom";

const SeasonSpecialCarousel = ({ title, products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle product click
  const handleProductClick = (productId) => {
    console.log(`Navigate to product: ${productId}`);
    // For example: window.location.href = `/product/${productId}`;
  };

  if (!products || products.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No {title.toLowerCase()} available
      </p>
    );
  }

  // Calculate how many items to show per slide based on screen size
  // Show 4 items per slide on desktop, fewer on smaller screens
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // Auto-advance slides every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  // Create dots for navigation
  const dots = Array.from({ length: totalSlides }, (_, i) => (
    <button
      key={i}
      onClick={() => setCurrentSlide(i)}
      className={`w-2 h-2 rounded-full mx-1 ${
        currentSlide === i ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
      }`}
      aria-label={`Go to slide ${i + 1}`}
    />
  ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
        {title}
      </h2>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Create groups of items for each slide */}
            {Array.from({ length: totalSlides }, (_, slideIndex) => (
              <div key={slideIndex} className="min-w-full flex-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {products
                    .slice(
                      slideIndex * itemsPerSlide,
                      slideIndex * itemsPerSlide + itemsPerSlide
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <div
                          onClick={() => handleProductClick(item.productId)}
                          className="text-center block hover:scale-105 transition-transform cursor-pointer"
                        >
                          <div className="bg-blue-50 dark:bg-gray-600 rounded-lg  mb-3">
                            <div
                              className="relative w-full   h-[27vh]"
                              style={{ paddingTop: "62.37%" }}
                            >
                              <img
                                src={`${BASE_URL}/${item.image}`}
                                alt={`${title} ${index + 1}`}
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                            {item.productId?.name ||
                              item.name ||
                              `Product ${
                                slideIndex * itemsPerSlide + index + 1
                              }`}
                          </h3>
                          <Link
                            to={`/product/${item.productId._id}`}
                            className="text-blue-600 hover:underline flex items-center justify-center mt-2"
                          >
                            Shop Now <FaShoppingCart className="ml-2" />
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots for navigation */}
        <div className="flex justify-center mt-4">{dots}</div>
      </div>
    </div>
  );
};

export default SeasonSpecialCarousel;
