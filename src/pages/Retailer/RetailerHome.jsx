import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaShoppingCart } from "react-icons/fa";
import {
  useAllProductsQuery,
  useGetRetailerDashboardByIdQuery,
} from "../../redux/api/productApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../redux/constants";
import ProductCarousel from "../../components/TopCarousel";
import { Link } from "react-router-dom";
import SeasonSpecialCarousel from "./SessionSpecialCarousel";

const BuyerHome = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useAllProductsQuery();
  const {
    data: dashboard,
    error: dashboardError,
    isLoading: dashboardLoading,
  } = useGetRetailerDashboardByIdQuery();

  const navigate = useNavigate();

  if (productsLoading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (productsError || dashboardError || !dashboard) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <h2 className="text-2xl mb-4">Something went wrong</h2>
        <p>{productsError?.message || dashboardError?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    );
  }

  console.log(dashboard.data, "products");

  return (
    <div className="dark:bg-gray-900 bg-white min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Shop By Category */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
            Shop By Category
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Browse Our Exclusive Collections
          </p>
          <ProductCarousel category={dashboard.data.category} />
        </section>

        {/* Top Banner Carousel */}
        <section className="mb-12">
          <Carousel
            showArrows={false}
            infiniteLoop
            autoPlay
            interval={3000}
            showThumbs={false}
            className="rounded-lg shadow-lg"
          >
            {dashboard.data.bannerTop.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product.productId}`)}
                className="cursor-pointer"
              >
                <img
                  src={`${BASE_URL}/${product.image}`}
                  alt={product.name}
                  className="rounded-lg w-full object-cover aspect-[5/2]"
                />
              </div>
            ))}
          </Carousel>
        </section>

        {/* Recommended Products */}
        <section className="mb-10">
          <div>
            <div>
              {dashboard?.data?.recommended && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                    {dashboard.data.recommended.boxHeading ||
                      "Exclusive Product Offers"}
                  </h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Check out our top selling products with great discounts
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboard.data.recommended.products.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <div
                          onClick={() => handleProductClick(item.productId)}
                          className="text-center block hover:scale-105 transition-transform cursor-pointer"
                        >
                          <div className="bg-blue-50 dark:bg-gray-600 rounded-lg  mb-3 ">
                            <div
                              className="relative w-full  h-[27vh]"
                              // style={{ paddingTop: "62.37%" }}
                            >
                              <img
                                src={`${BASE_URL}/${item.productImage}`}
                                alt={item.productName}
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                            {item.productName}
                          </h3>
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-blue-600 hover:underline flex items-center justify-center mt-2"
                          >
                            Shop Now <FaShoppingCart className="ml-2" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="mb-12">
          <div>
            {dashboard?.data?.categories?.length > 0 ? (
              // Group categories into sets of 4
              Array.from(
                { length: Math.ceil(dashboard.data.categories.length / 4) },
                (_, boxIndex) => {
                  // Get current group of categories (up to 4)
                  const categoryGroup = dashboard.data.categories.slice(
                    boxIndex * 4,
                    boxIndex * 4 + 4
                  );

                  return (
                    <div
                      key={boxIndex}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
                    >
                      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                        Category
                      </h2>
                      <div className="flex justify-end items-center mb-6">
                        <Link
                          to="/all-categories"
                          className="text-blue-600 hover:underline"
                        >
                          See All
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categoryGroup.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              navigate(`/category/${item.name}/${item._id}`)
                            }
                            className="text-center hover:scale-105 transition-transform cursor-pointer "
                          >
                            <div className="bg-blue-50 dark:bg-gray-600 rounded-lg p-2  flex justify-center items-center h-[30vh]">
                              <img
                                src={`${BASE_URL}/${item.image}`}
                                alt={item.name}
                                className=" object-cover rounded-lg "
                              />
                            </div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                              {item.name}
                            </h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No categories available
              </p>
            )}
          </div>
        </section>
        {/* Best Deals */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
            Best Deals Curated from Stores Nearby
          </h2>
          <div className="flex justify-between items-center mb-6">
            {/* <Link to="/offers" className="text-blue-600 hover:underline">
              See All Offers
            </Link> */}
          </div>
          <Carousel
            showArrows={false}
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
            showIndicators={true}
            className="rounded-lg"
          >
            {dashboard.data.dealsStores?.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item.productId}`)}
                className="cursor-pointer"
              >
                <img
                  // src={BASE_URL + item.image}
                  src={`${BASE_URL}/${item.image}`}
                  alt={item.name}
                  className="rounded-lg w-full object-cover aspect-[5/2]"
                />
                <p className="text-center mt-2 text-gray-700 dark:text-gray-300">
                  {item.name}
                </p>
              </div>
            ))}
          </Carousel>
        </section>

        <section className="mb-12">
          <div className="w-full">
            {dashboard?.data?.seasonSpecial && (
              <SeasonSpecialCarousel
                title="Season Special"
                products={dashboard.data.seasonSpecial}
              />
            )}
          </div>
        </section>

        <section className="mb-12">
          <div>
            {dashboard?.data?.newProducts?.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                  New Products
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {dashboard.data.newProducts.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div
                        onClick={() => handleProductClick(item.productId)}
                        className="text-center block hover:scale-105 transition-transform cursor-pointer"
                      >
                        <div className="bg-blue-50 dark:bg-gray-600 rounded-lg  mb-2">
                          <div className="relative w-full  h-[27vh]">
                            <img
                              src={`${BASE_URL}/${item.image}`}
                              alt={`Product ${index + 1}`}
                              className="w-[372px] h-full object-cover rounded-lg mx-auto"
                            />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate overflow-hidden">
                          {item.productId?.name ||
                            item.name ||
                            `Product ${index + 1}`}
                        </p>
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
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No new products available
              </p>
            )}
          </div>
        </section>

        {/* Massive Sell Section */}
        {/* <section
          className="relative w-full h-[400px] bg-cover bg-center rounded-lg overflow-hidden mb-12"
          style={{
            backgroundImage: `url(${
              dashboard?.data?.massiveSell?.image
                ? `${BASE_URL}/${dashboard.data.massiveSell.image}`
                : "/placeholder-image.png"
            })`,
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute inset-0 flex justify-center items-center text-center px-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {dashboard?.data?.massiveSell.heading}
              </h1>
              <p className="text-xl text-white mb-6">
                {dashboard?.data?.massiveSell.subHeading}
              </p>
              <Link
                to={`/product/${dashboard?.data?.massiveSell.productId}`}
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section> */}

        {/* Featured Ads */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
            Featured Ads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {dashboard.data.featureAds.map((product) => {
              let description = "";
              try {
                const parsedDesc = JSON.parse(product.description);
                description = Array.isArray(parsedDesc)
                  ? parsedDesc[0]
                  : parsedDesc;
              } catch (e) {
                description = product.description;
              }

              return (
                <div
                  key={product._id}
                  className="dark:bg-gray-800 bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all cursor-pointer"
                  onClick={() => navigate(`/product/${product.productId}`)}
                >
                  <div className="relative" style={{ paddingBottom: "62.4%" }}>
                    <img
                      // src={BASE_URL + product.productImage}
                      src={`${BASE_URL}/${product.productImage}`}
                      alt={description}
                      className="absolute w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {description}
                    </h3>
                    <span className="text-blue-600 hover:underline">
                      Learn More
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Exclusive Product Offers */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Exclusive Product Offers
            </h2>
            <p className="text-lg text-gray-500">
              Check out our top selling products with great discounts
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboard.data.exclusiveProductOffer.products.map((product) => (
              <div
                key={product._id}
                className="dark:bg-gray-800 bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between h-[400px]"
              >
                <img
                  src={`${BASE_URL}/${product.productImage}`}
                  alt={product.productName}
                  className="w-full h-[232px] object-cover mb-3 rounded-lg"
                />

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center mb-2 line-clamp-2">
                  {product.productName}
                </h3>

                <div className="mt-auto flex justify-center">
                  <Link
                    to={`/product/${product.productId}`}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    Shop Now <FaShoppingCart className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-2 p-4">
          <h2 className="text-4xl font-bold mb-4 textcolor text-center">
            {dashboard.data.bannerBottom.title}
          </h2>
          <Carousel
            showArrows={false}
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
            showIndicators={false}
            className="rounded-lg"
          >
            {dashboard.data.bannerBottom.images.map((item, index) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item.productId}`)}
                className="cursor-pointer"
              >
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "40%" }}
                >
                  {" "}
                  {/* 2:5 ratio = 40% */}
                  <img
                    // src={BASE_URL + item.image} // Fix: Accessing image properly
                    src={`${BASE_URL}/${item.image}`}
                    alt={`Banner ${index}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg aspect-[5/2]"
                  />
                </div>
                <p className="text-center mt-2 mb-6 text-sm sm:text-base md:text-lg textcolor">
                  {/* Add product name here if needed */}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
      </main>
      <div className="dark:bg-slate-800 bg-gray-300 text-gray-900 dark:text-white p-6 shadow-xl text-center w-full  mx-auto mt-10 mb-6">
        <h2 className="text-4xl font-extrabold leading-tight tracking-widest mb-3 sm:text-3xl md:text-4xl">
          MORE KNOCKOUT OFFERS WAITING!
        </h2>
        <p className="text-lg font-medium italic opacity-80 sm:text-base">
          Only On The App
        </p>
        <p className="text-2xl font-semibold mt-2 sm:text-xl">
          Grab the Best Deals Now!
        </p>
        <p className="text-lg font-light mt-3 leading-relaxed sm:text-base">
          Download the app and explore exclusive offers.
        </p>
        <div className="flex justify-center mt-6">
          <a
            href="#"
            className="bg-white text-purple-600 font-semibold px-6 py-3 border-2 border-purple-600 rounded-full shadow-md hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            Get it on Google Play
          </a>
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
