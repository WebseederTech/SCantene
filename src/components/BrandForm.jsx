import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";

const BrandForm = ({
  value,
  setValue,
  aboutTheBrand,
  setAboutTheBrand,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  const quillRef = useRef(null);

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
