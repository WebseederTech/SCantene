import React, { useState } from "react";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import { BASE_URL } from "../../redux/constants";

const BannerTop = ({ products, formData, setFormData }) => {

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    setFormData((prev) => {
      const updatedBanners = [
        ...prev.bannerTop, // ✅ Keep previous images
        ...files.map((file) => ({
          image: file, // Store File object
          productId: "", // Default empty
        })),
      ];
  
      return { ...prev, bannerTop: updatedBanners };
    });
  };
  

  const handleProductChange = (index, selectedOption) => {
    setFormData((prev) => {
      const updatedBannerTop = [...prev.bannerTop];
      updatedBannerTop[index].productId = selectedOption.value;
      return { ...prev, bannerTop: updatedBannerTop };
    });
  };

  const removeBannerTopImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      bannerTop: prev.bannerTop.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="my-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 ">
      <label className="block text-lg font-medium">Banner Top Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 pagination rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {formData.bannerTop.map((item, index) => {
          const imageUrl =
            item.image instanceof File ? URL.createObjectURL(item.image) : `${BASE_URL}/${item.image}`;

          return (
            <div key={index} className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <img src={imageUrl} alt="Banner" className="w-full h-24 object-cover rounded-md" />

              {/* Product Selector */}
              <Select
                options={products?.map((product) => ({
                  value: product._id,
                  label: product.name,
                }))}
                value={
                  products?.find((product) => product._id === item.productId)
                    ? {
                        value: item.productId,
                        label: products.find((product) => product._id === item.productId).name,
                      }
                    : null
                }
                onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                className="mt-2"
              />

              {/* Remove Image Button */}
              <button
                onClick={() => removeBannerTopImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BannerTop;
