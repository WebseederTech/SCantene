import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({ product }) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  console.log(product, "data");
  return (
    <div className="flex flex-col md:flex-row">
      <section className="mr-[5rem]">
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 1 ? "font-bold" : ""
            }`}
          onClick={() => handleTabClick(1)}
        >
          Specifications
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 2 ? "font-bold" : ""
            }`}
          onClick={() => handleTabClick(2)}
        >
          About the Brand{" "}
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${activeTab === 3 ? "font-bold" : ""
            }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      {/* Second Part */}
      <section>
        {activeTab === 1 && (
          <div className="mt-4">
            <div className="my-4">
              {/* <h3 className="text-xl font-semibold mb-2">Specifications</h3> */}
              <p>{product.specification.replace(/<\/?[^>]+(>|$)/g, "") || "No specifications available."}</p>
            </div>

            <div className="my-4">
              {/* <h3 className="text-xl font-semibold mb-2">About the Brand</h3> */}
              <p className="mt-2">
                {product.aboutTheBrand.replace(/<\/?[^>]+(>|$)/g, "") || "No information about the brand."}
              </p>
            </div>
          </div>
        )}
      </section>

      <section>
        {activeTab === 2 && (
          <>
            <div>{product.reviews.length === 0 && <p>No Reviews</p>}</div>

            <div>
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="dark:bg-[#1A1A1A] bg-gray-200 p-4 rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[50rem] sm:w-[24rem] mb-5"
                >
                  <div className="flex justify-between">
                    <strong className="dark:text-[#B0B0B0] text-black">{review.name}</strong>
                    <p className="dark:text-[#B0B0B0] text-black">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>

                  <p className="my-4">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section>
        {activeTab === 3 && (
          <section className="ml-[4rem] flex flex-wrap">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
