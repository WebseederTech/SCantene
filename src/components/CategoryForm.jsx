// const CategoryForm = ({
//   value,
//   setValue,
//   keywords,
//   setKeywords,
//   handleSubmit,
//   buttonText = "Submit",
//   handleDelete,
//   image,
//   setImage
// }) => {
//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           type="text"
//           className="py-3 px-4 border border-gray-400 rounded-lg w-full darkthemeinput mb-4"
//           placeholder="Write category name"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//         />

//         <input
//           type="text"
//           className="py-3 px-4 border border-gray-400 rounded-lg w-full darkthemeinput mb-4"
//           placeholder="Enter keywords (comma separated)"
//           value={keywords}
//           onChange={(e) => setKeywords(e.target.value)}
//         />

//         <input
//           type="file"
//           accept="image/*"
//           className="py-3 px-4 border border-gray-400 rounded-lg w-full darkthemeinput mb-4"
//           onChange={(e) => setImage(e.target.files[0])}
//         />

//         {image && (
//           <div className="mb-4">
//             <img
//               src={URL.createObjectURL(image)}
//               alt="Category Preview"
//               className="w-32 h-32 object-cover rounded-lg border"
//             />
//           </div>
//         )}

//         <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 justify-center">
//           <button
//             type="submit"
//             className="bg-customBlue text-white py-2 px-4 rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50 w-full sm:w-auto"
//           >
//             {buttonText}
//           </button>

//           {handleDelete && (
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-full sm:w-auto"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CategoryForm;
const CategoryForm = ({
  value,
  setValue,
  keywords,
  setKeywords,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  image,
  setImage
}) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-whiterounded-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category Name
          </label>
          <input
            type="text"
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md w-full dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Write category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Keywords (comma separated)
          </label>
          <input
            type="text"
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md w-full dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        {/* Upload Image with dashed border */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Image
          </label>
          <div className="relative flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-md p-4 cursor-pointer hover:border-gray-500 transition-all h-[150px]">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <p className="text-sm text-gray-600 dark:text-gray-300 z-10 pointer-events-none">
              Drag & drop or click to upload
            </p>
          </div>
        </div>


        {/* Preview */}
        {image && (
          <div className="mt-4">
            <img
              src={URL.createObjectURL(image)}
              alt="Category Preview"
              className="w-32 h-32 object-cover rounded-lg border shadow-md ring-1 ring-gray-300"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
