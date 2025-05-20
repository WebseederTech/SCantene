import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-auto rounded"
          style={{ height: "200px", width: "250px", objectFit: "cover" }}
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="bg-purple-100 text-customBlue/80 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
              &#8377;{product.mrp}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
