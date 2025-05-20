import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { BASE_URL } from "../../redux/constants";
import axios from "axios";
import { useState } from "react";
import { useSaveSlabSelectionMutation } from "../../redux/api/productApiSlice";

const ProductCard = ({ p }) => {
  const [quantityMethod, setQuantityMethod] = useState("manual");
  const dispatch = useDispatch();
  const [saveSlabSelection] = useSaveSlabSelectionMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;

  const addToCartHandler = async () => {
    // Default to 1 if no slab/custom quantity logic
    const qtyToSave = 1;
    const price = p.offerPrice || p.price;

    try {
      const payload = {
        productId: p._id,
        userId: userInfo._id,
        qty: qtyToSave,
        price: price,
      };

      await saveSlabSelection(payload).unwrap();
      toast.success("Item added to cart successfully");
      navigate("/cart");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

 
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="w-64 relative rounded-lg shadow dark:bg-gray-800 bg-gray-100 border-gray-700 flex flex-col h-full">
      <section className="relative flex-grow">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-gray-100 text-customBlue/80 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full"
            src={BASE_URL + p.images[0]}
            alt={p.name}
            // style={{ height: "200px", objectFit: "cover" }}
            style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="flex justify-between">
          <h5 className="mb-2 text-lg truncate">{p?.name}</h5>

          <p className="text-black font-semibold">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-3 font-normal text-gray-400 truncate">
          {stripHtml(p?.description?.substring(0, 60))} ...
        </p>

        {/* Display "Out of Stock" badge if the product is out of stock */}
        {p.outOfStock && (
          <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        <section className="flex justify-between items-center mt-4">
          {p.outOfStock ? (
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed">
              Read More
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </span>
          ) : (
            <Link
              to={`/product/${p._id}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-customBlue/80 rounded-lg hover:bg-customBlue/80 focus:ring-4 focus:outline-none  dark:bg-customBlue/80 dark:hover:bg-customBlue/80 dark:focus:ring-customBlue/80"
            >
              Read More
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          )}

          <button
            className="p-2 rounded-full"
            disabled={p.outOfStock}
            onClick={addToCartHandler} // Removed arrow function
            >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
