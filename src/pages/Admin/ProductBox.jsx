import React, { useState } from "react";
import Select from "react-select";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { BASE_URL } from "../../redux/constants";

const ProductBox = ({ products, formData, setFormData }) => {
  // ✅ Handle adding a new product box
  const addProductBox = () => {
    setFormData((prev) => ({
      ...prev,
      productBox: [...prev.productBox, { boxHeading: "", products: [] }],
    }));
  };

  // ✅ Handle removing a product box
  const removeProductBox = (boxIndex) => {
    setFormData((prev) => ({
      ...prev,
      productBox: prev.productBox.filter((_, i) => i !== boxIndex),
    }));
  };

  // ✅ Handle input changes (boxHeading, productName)
  const handleInputChange = (e, boxIndex, productIndex, field) => {
    setFormData((prev) => {
      const updatedProductBox = [...prev.productBox];

      if (productIndex !== null) {
        updatedProductBox[boxIndex].products[productIndex][field] = e.target.value;
      } else {
        updatedProductBox[boxIndex][field] = e.target.value;
      }

      return { ...prev, productBox: updatedProductBox };
    });
  };

  // ✅ Handle product selection
  const handleProductChange = (boxIndex, productIndex, selectedOption) => {
    setFormData((prev) => {
      const updatedProductBox = prev.productBox.map((box, i) => ({
        ...box,
        products: box.products.map((product, j) =>
          i === boxIndex && j === productIndex
            ? { ...product, productId: selectedOption.value, productName: selectedOption.label }
            : product
        ),
      }));
  
      return { ...prev, productBox: updatedProductBox };
    });
  };
  

  // ✅ Handle image upload
  const handleProductImageChange = (e, boxIndex, productIndex) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setFormData((prev) => {
      const updatedProductBox = prev.productBox.map((box, i) => ({
        ...box,
        products: box.products.map((product, j) =>
          i === boxIndex && j === productIndex
            ? { ...product, productImage: file } // ✅ Create a new object before updating
            : product
        ),
      }));
  
      return { ...prev, productBox: updatedProductBox };
    });
  };
  

  // ✅ Handle image removal
  const removeProductImage = (boxIndex, productIndex) => {
    setFormData((prev) => {
      const updatedProductBox = prev.productBox.map((box, i) => ({
        ...box,
        products: box.products.map((product, j) =>
          i === boxIndex && j === productIndex
            ? { ...product, productImage: null } // ✅ Ensure immutability
            : product
        ),
      }));
  
      return { ...prev, productBox: updatedProductBox };
    });
  };
  

  // ✅ Handle adding a new product inside a box
  const addProduct = (boxIndex) => {
    setFormData((prev) => {
      const updatedProductBox = [...prev.productBox];
      updatedProductBox[boxIndex].products.push({
        productId: "",
        productName: "",
        productImage: null,
      });

      return { ...prev, productBox: updatedProductBox };
    });
  };

  // ✅ Handle removing a product inside a box
  const removeProduct = (boxIndex, productIndex) => {
    setFormData((prev) => {
      const updatedProductBox = [...prev.productBox];
      updatedProductBox[boxIndex].products = updatedProductBox[boxIndex].products.filter(
        (_, i) => i !== productIndex
      );

      return { ...prev, productBox: updatedProductBox };
    });
  };

  return (
    <div>
      <div className="mb-6 mt-4">
        <label className="block text-lg font-medium">Product Boxes</label>
      </div>

      {/* Add Product Box Button */}
      <button
        type="button"
        onClick={addProductBox}
        className="mb-4 py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center space-x-2"
      >
        <FiPlus className="h-5 w-5" />
        <span>Add Product Box</span>
      </button>

      {formData.productBox.map((box, boxIndex) => (
        <div key={boxIndex} className="mb-6 p-4 border rounded-md bg-gray-100">
          {/* Remove Product Box Button */}
          <button
            type="button"
            onClick={() => removeProductBox(boxIndex)}
            className="mb-2 py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 float-right"
          >
            <FiMinus className="h-5 w-5" />
          </button>

          {/* Product Box Heading */}
          <label className="block text-lg font-medium mb-1">Box Heading</label>
          <input
            type="text"
            value={box.boxHeading}
            onChange={(e) => handleInputChange(e, boxIndex, null, "boxHeading")}
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter Product Box Heading"
          />

          {/* Products List */}
          {box.products.map((product, productIndex) => (
            <div key={productIndex} className="mb-4 p-2 border rounded-md flex flex-col sm:flex-row gap-4">
              {/* Product Selector */}
              <Select
                options={products?.map((prod) => ({
                  value: prod._id,
                  label: prod.name,
                }))}
                value={
                  product.productId
                    ? { value: product.productId, label: product.productName }
                    : null
                }
                onChange={(selectedOption) =>
                  handleProductChange(boxIndex, productIndex, selectedOption)
                }
                className="w-full sm:w-1/3"
              />

              {/* Product Image Upload */}
              <input
                type="file"
                onChange={(e) => handleProductImageChange(e, boxIndex, productIndex)}
                className="w-full sm:w-1/3 p-1 border rounded-md"
              />

              {/* Image Preview */}
              {product.productImage && (
                <div className="relative w-24 h-24 border rounded-md">
                  <img
                    src={
                      product.productImage instanceof File
                        ? URL.createObjectURL(product.productImage)
                        : `${BASE_URL}/${product.productImage}`
                    }
                    alt="Product Preview"
                    className="w-full h-full object-cover rounded-md"
                  />

                  {/* Remove Image Button */}
                  <button
                    type="button"
                    onClick={() => removeProductImage(boxIndex, productIndex)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Remove Product Button */}
              <button
                type="button"
                onClick={() => removeProduct(boxIndex, productIndex)}
                className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FiMinus className="h-5 w-5" />
              </button>
            </div>
          ))}

          {/* Add Product Button */}
          <button
            type="button"
            onClick={() => addProduct(boxIndex)}
            className="mb-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductBox;
