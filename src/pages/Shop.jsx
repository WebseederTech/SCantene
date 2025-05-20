import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [brandsExpanded, setBrandsExpanded] = useState(false);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on price filter and isEnable status
        const filteredProducts = filteredProductsQuery.data
          .filter((product) => product.isEnable) // Only show enabled products
          .filter((product) => {
            return (
              product.mrp.toString().includes(priceFilter) ||
              product.mrp === parseInt(priceFilter, 10)
            );
          });

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.isEnable && product.brand?._id === brand._id
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Get unique brands from enabled products only
  const uniqueBrands = useMemo(() => {
    if (!filteredProductsQuery.data) return [];

    const enabledProducts = filteredProductsQuery.data.filter(
      (product) => product.isEnable
    );
    const brandsMap = new Map();

    enabledProducts.forEach((product) => {
      if (product.brand && !brandsMap.has(product.brand._id)) {
        brandsMap.set(product.brand._id, product.brand);
      }
    });

    return Array.from(brandsMap.values());
  }, [filteredProductsQuery.data]);

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };


  return (
    <>
      <div className=" mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters - Now with max height and scrolling */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg">
            <div className="sticky top-20 max-h-[90vh] overflow-y-auto pb-4">
              {/* Categories Filter with See More */}
              <h2 className="text-lg font-semibold text-center py-3 bg-customBlue text-white rounded-t-lg sticky top-0 z-10">
                Filter by Categories
              </h2>

              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                {categories?.slice(0, categoriesExpanded ? categories.length : 5).map((c) => (
                  <div key={c._id} className="mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${c._id}`}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="w-4 h-4 text-customBlue bg-gray-100 border-gray-300 rounded focus:ring-customBlue dark:focus:ring-customBlue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={`category-${c._id}`}
                        className="ml-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                      >
                        {c.name}
                      </label>
                    </div>
                  </div>
                ))}

                {categories?.length > 5 && (
                  <button
                    onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                    className="text-sm text-customBlue hover:text-purple-800 font-medium mt-2"
                  >
                    {categoriesExpanded ? "See Less" : "See More"}
                  </button>
                )}
              </div>

              {/* Brands Filter with See More */}
              <h2 className="text-lg font-semibold text-center py-3 bg-customBlue text-white sticky top-0 z-10">
                Filter by Brands
              </h2>

              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                {uniqueBrands.slice(0, brandsExpanded ? uniqueBrands.length : 5).map((brand) => (
                  <div key={brand._id} className="flex items-center mb-3">
                    <input
                      type="radio"
                      id={`brand-${brand._id}`}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-customBlue bg-gray-100 border-gray-300 focus:ring-customBlue dark:focus:ring-customBlue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`brand-${brand._id}`}
                      className="ml-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                    >
                      {brand.name}
                    </label>
                  </div>
                ))}

                {uniqueBrands?.length > 5 && (
                  <button
                    onClick={() => setBrandsExpanded(!brandsExpanded)}
                    className="text-sm text-customBlue hover:text-purple-800 font-medium mt-2"
                  >
                    {brandsExpanded ? "See Less" : "See More"}
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <h2 className="text-lg font-semibold text-center py-3 bg-customBlue text-white sticky top-0 z-10">
                Filter by Price
              </h2>

              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Enter Price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Reset Button */}
              <div className="p-4">
                <button
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition duration-150 ease-in-out"
                  onClick={() => window.location.reload()}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-center mb-6 text-customBlue">
              {products?.length} Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader />
                </div>
              ) : (
                products?.map((p) => (
                  <div key={p._id}>
                    <ProductCard
                      p={{
                        ...p,
                        brand: p.brand?.name,
                        category: p.category?.name,
                        outOfStock: p.outOfStock,
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
