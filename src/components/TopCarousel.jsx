import { useNavigate } from "react-router";
import { BASE_URL } from "../redux/constants";

const ProductCarousel = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between gap-4 w-full">
      {category.map((cate) => (
        <div
          key={cate._id}
          className="text-center p-2 cursor-pointer"
          onClick={() => navigate(`/category/${cate.name}/${cate._id}`)}
        >
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-3xl">
            <img
              src={
                cate?.image ? `${BASE_URL}/${cate.image}` : "/placeholder-image.png"
              }
              alt={cate.name}
              className="w-full h-full object-cover transform transition-all duration-300 hover:scale-110"
            />
          </div>
          <p className="mt-4 text-lg font-semibold text-customBlue hover:text-blue-400 transition-all duration-300">
            {cate.name}
          </p>
        </div>
      ))}
      
      {/* All categories section */}
      <div
        className="text-center p-2 cursor-pointer"
        onClick={() => navigate('/all-categories')}
      >
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center bg-gray-100">
          <span className="text-2xl font-bold text-customBlue">All</span>
        </div>
        <p className="mt-4 text-lg font-semibold text-customBlue hover:text-blue-400 transition-all duration-300">
          All Category
        </p>
      </div>
    </div>
  );
};

export default ProductCarousel;