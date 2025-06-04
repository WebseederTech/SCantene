import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import { FaTrash } from "react-icons/fa";
import { BASE_URL } from "../redux/constants";

const BrandForm = ({
  value,
  setValue,
  aboutTheBrand,
  setAboutTheBrand,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  image,
  setImage
}) => {
  const quillRef = useRef(null);

  console.log(aboutTheBrand)
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // Clean background, color, font styles from pasted content
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      delta.ops.forEach((op) => {
        if (op.attributes) {
          delete op.attributes.background;
          delete op.attributes.color;
          delete op.attributes.font;
        }
      });
      return delta;
    });
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="brandName" className="my-5">
          Brand Name
        </label>
        <input
          type="text"
          id="brandName"
          className="py-3 px-4 border border-gray-400 rounded-lg w-full"
          placeholder="Write brand name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="space-y-3">
          <label htmlFor="aboutTheBrand">About the Brand</label>
          <ReactQuill
            ref={quillRef}
            value={aboutTheBrand}
            onChange={setAboutTheBrand}
            theme="snow"
            placeholder="Enter Specification"
            className="w-full mb-3"
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
          <div className="relative mt-4 w-32 h-32">
            <img
              src={typeof image === "string" ? `${BASE_URL}/${image}` : URL.createObjectURL(image)}
              alt="Category Preview"
              className="w-full h-full object-cover rounded-lg border shadow-md ring-1 ring-gray-300"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:text-red-800 hover:bg-gray-100 shadow"
            >
              <FaTrash size={16} />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50 w-full sm:w-auto"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-full sm:w-auto"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BrandForm;
