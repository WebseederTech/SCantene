import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const DashboardCreationForm = () => {
  const [formData, setFormData] = useState({
    category: [],
    recommended: [],
    categories: [],
    dealsStores: [],
    seasonSpecial: [],
    newProducts: [],
    featureAds: [],
    exclusiveProductOffer: {
      sectionHeading: "",
      products: [
        { productId: "", productName: "", productImage: "" },
        { productId: "", productName: "", productImage: "" },
        { productId: "", productName: "", productImage: "" },
        { productId: "", productName: "", productImage: "" },
      ],
    },
    bannerBottom: {
      title: "",
      images: [],
    },
    mobileAppLink: {
      heading: "",
      subHeading: "",
      productId: "",
    },
    massiveSell: {
      heading: "",
      subHeading: "",
      image: "",
      productId: "",
    },
  });

  const [files, setFiles] = useState({
    bannerTop: [],
    dealsStores: [],
    seasonSpecial: [],
    newProducts: [],
    featureAdsProductImage: [],
    exclusiveProductOfferImage: [],
    bannerBottom: [],
    massiveSellImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle text input changes
  const handleInputChange = (e, section, index, field) => {
    const { value } = e.target;

    if (section === "exclusiveProductOffer") {
      const updatedProducts = [...formData.exclusiveProductOffer.products];
      updatedProducts[index][field] = value;

      setFormData({
        ...formData,
        exclusiveProductOffer: {
          ...formData.exclusiveProductOffer,
          products: updatedProducts,
        },
      });
    } else if (section === "exclusiveProductOfferHeading") {
      setFormData({
        ...formData,
        exclusiveProductOffer: {
          ...formData.exclusiveProductOffer,
          sectionHeading: value,
        },
      });
    } else if (section === "bannerBottom" && field === "title") {
      setFormData({
        ...formData,
        bannerBottom: {
          ...formData.bannerBottom,
          title: value,
        },
      });
    } else if (section === "mobileAppLink") {
      setFormData({
        ...formData,
        mobileAppLink: {
          ...formData.mobileAppLink,
          [field]: value,
        },
      });
    } else if (section === "massiveSell") {
      setFormData({
        ...formData,
        massiveSell: {
          ...formData.massiveSell,
          [field]: value,
        },
      });
    } else if (section === "featureAds") {
      const updatedFeatureAds = [...formData.featureAds];
      if (!updatedFeatureAds[index]) {
        updatedFeatureAds[index] = {
          productId: "",
          description: "",
          productImage: "",
        };
      }
      updatedFeatureAds[index][field] = value;

      setFormData({
        ...formData,
        featureAds: updatedFeatureAds,
      });
    } else {
      // Handle other simple fields
      setFormData({
        ...formData,
        [section]: value,
      });
    }
  };

  // Handle adding items to arrays
  const handleAddItem = (section) => {
    if (section === "category" || section === "categories") {
      setFormData({
        ...formData,
        [section]: [...formData[section], ""],
      });
    } else if (section === "recommended") {
      setFormData({
        ...formData,
        recommended: [
          ...formData.recommended,
          { boxHeading: "", products: [] },
        ],
      });
    } else if (section === "featureAds") {
      setFormData({
        ...formData,
        featureAds: [
          ...formData.featureAds,
          { productId: "", description: "", productImage: "" },
        ],
      });
    }
  };

  // Handle adding a product to a recommended box
  const handleAddProductToRecommended = (boxIndex) => {
    const updatedRecommended = [...formData.recommended];
    updatedRecommended[boxIndex].products.push({
      productId: "",
      productName: "",
      productImage: "",
    });

    setFormData({
      ...formData,
      recommended: updatedRecommended,
    });
  };

  // Handle changing a recommended box heading
  const handleRecommendedHeadingChange = (e, boxIndex) => {
    const { value } = e.target;
    const updatedRecommended = [...formData.recommended];
    updatedRecommended[boxIndex].boxHeading = value;

    setFormData({
      ...formData,
      recommended: updatedRecommended,
    });
  };

  // Handle changes to a product in a recommended box
  const handleRecommendedProductChange = (e, boxIndex, productIndex, field) => {
    const { value } = e.target;
    const updatedRecommended = [...formData.recommended];
    updatedRecommended[boxIndex].products[productIndex][field] = value;

    setFormData({
      ...formData,
      recommended: updatedRecommended,
    });
  };

  // Handle file input changes
  const handleFileChange = (e, fileType) => {
    const selectedFiles = Array.from(e.target.files);

    if (fileType === "massiveSellImage") {
      setFiles({
        ...files,
        [fileType]: selectedFiles[0],
      });
    } else {
      setFiles({
        ...files,
        [fileType]: selectedFiles,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formDataToSend = new FormData();

      // Add JSON data
      formDataToSend.append("category", JSON.stringify(formData.category));
      formDataToSend.append(
        "recommended",
        JSON.stringify(formData.recommended)
      );
      formDataToSend.append("categories", JSON.stringify(formData.categories));
      formDataToSend.append(
        "dealsStores",
        JSON.stringify(formData.dealsStores)
      );
      formDataToSend.append(
        "seasonSpecial",
        JSON.stringify(formData.seasonSpecial)
      );
      formDataToSend.append(
        "newProducts",
        JSON.stringify(formData.newProducts)
      );
      formDataToSend.append("featureAds", JSON.stringify(formData.featureAds));
      formDataToSend.append(
        "exclusiveProductOffer",
        JSON.stringify(formData.exclusiveProductOffer)
      );
      formDataToSend.append(
        "bannerBottom",
        JSON.stringify(formData.bannerBottom)
      );
      formDataToSend.append(
        "mobileAppLink",
        JSON.stringify(formData.mobileAppLink)
      );
      formDataToSend.append(
        "massiveSell",
        JSON.stringify(formData.massiveSell)
      );

      // Add files
      if (files.bannerTop.length > 0) {
        files.bannerTop.forEach((file) => {
          formDataToSend.append("bannerTop[]", file);
        });
      }

      if (files.dealsStores.length > 0) {
        files.dealsStores.forEach((file) => {
          formDataToSend.append("dealsStores[]", file);
        });
      }

      if (files.seasonSpecial.length > 0) {
        files.seasonSpecial.forEach((file) => {
          formDataToSend.append("seasonSpecial[]", file);
        });
      }

      if (files.newProducts.length > 0) {
        files.newProducts.forEach((file) => {
          formDataToSend.append("newProducts[]", file);
        });
      }

      if (files.featureAdsProductImage.length > 0) {
        files.featureAdsProductImage.forEach((file) => {
          formDataToSend.append("featureAdsProductImage[]", file);
        });
      }

      if (files.exclusiveProductOfferImage.length > 0) {
        files.exclusiveProductOfferImage.forEach((file) => {
          formDataToSend.append("exclusiveProductOfferImage[]", file);
        });
      }

      if (files.bannerBottom.length > 0) {
        files.bannerBottom.forEach((file) => {
          formDataToSend.append("bannerBottom[]", file);
        });
      }

      if (files.massiveSellImage) {
        formDataToSend.append("massiveSellImage", files.massiveSellImage);
      }

      const response = await axios.post(`${BASE_URL}/api/Buyer-dashboard`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Dashboard created successfully!");

      // Reset form after successful submission
      setFormData({
        category: [],
        recommended: [],
        categories: [],
        dealsStores: [],
        seasonSpecial: [],
        newProducts: [],
        featureAds: [],
        exclusiveProductOffer: {
          sectionHeading: "",
          products: [
            { productId: "", productName: "", productImage: "" },
            { productId: "", productName: "", productImage: "" },
            { productId: "", productName: "", productImage: "" },
            { productId: "", productName: "", productImage: "" },
          ],
        },
        bannerBottom: {
          title: "",
          images: [],
        },
        mobileAppLink: {
          heading: "",
          subHeading: "",
          productId: "",
        },
        massiveSell: {
          heading: "",
          subHeading: "",
          image: "",
          productId: "",
        },
      });

      setFiles({
        bannerTop: [],
        dealsStores: [],
        seasonSpecial: [],
        newProducts: [],
        featureAdsProductImage: [],
        exclusiveProductOfferImage: [],
        bannerBottom: [],
        massiveSellImage: null,
      });
    } catch (err) {
      console.error("Error creating dashboard:", err);
      setError(err.response?.data?.message || "Failed to create dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Dashboard</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Top */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Banner Top</h2>
          <div className="mb-4">
            <label className="block mb-2">Upload Banner Images (max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "bannerTop")}
              className="border p-2 w-full"
              max="5"
            />
            {files.bannerTop.length > 0 && (
              <div className="mt-2">
                <p>{files.bannerTop.length} files selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <div className="mb-4">
            <label className="block mb-2">
              Category IDs (MongoDB ObjectIDs)
            </label>
            {formData.category.map((cat, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => {
                    const newCategories = [...formData.category];
                    newCategories[index] = e.target.value;
                    setFormData({ ...formData, category: newCategories });
                  }}
                  placeholder="Category ID"
                  className="border p-2 flex-grow"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newCategories = formData.category.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, category: newCategories });
                  }}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("category")}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Recommended Products</h2>
          {formData.recommended.map((box, boxIndex) => (
            <div key={boxIndex} className="mb-6 border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Box {boxIndex + 1}</h3>
              <div className="mb-2">
                <label className="block mb-1">Box Heading</label>
                <input
                  type="text"
                  value={box.boxHeading}
                  onChange={(e) => handleRecommendedHeadingChange(e, boxIndex)}
                  placeholder="Box Heading"
                  className="border p-2 w-full"
                />
              </div>

              {box.products.map((product, productIndex) => (
                <div key={productIndex} className="mb-4 p-2 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">
                    Product {productIndex + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1">Product ID</label>
                      <input
                        type="text"
                        value={product.productId}
                        onChange={(e) =>
                          handleRecommendedProductChange(
                            e,
                            boxIndex,
                            productIndex,
                            "productId"
                          )
                        }
                        placeholder="Product ID"
                        className="border p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Product Name</label>
                      <input
                        type="text"
                        value={product.productName}
                        onChange={(e) =>
                          handleRecommendedProductChange(
                            e,
                            boxIndex,
                            productIndex,
                            "productName"
                          )
                        }
                        placeholder="Product Name"
                        className="border p-2 w-full"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedRecommended = [...formData.recommended];
                      updatedRecommended[boxIndex].products =
                        updatedRecommended[boxIndex].products.filter(
                          (_, i) => i !== productIndex
                        );
                      setFormData({
                        ...formData,
                        recommended: updatedRecommended,
                      });
                    }}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Remove Product
                  </button>
                </div>
              ))}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleAddProductToRecommended(boxIndex)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updatedRecommended = formData.recommended.filter(
                      (_, i) => i !== boxIndex
                    );
                    setFormData({
                      ...formData,
                      recommended: updatedRecommended,
                    });
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Remove Box
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddItem("recommended")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Recommended Box
          </button>
        </div>

        {/* Categories List */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Categories List</h2>
          <div className="mb-4">
            <label className="block mb-2">
              Category IDs (MongoDB ObjectIDs)
            </label>
            {formData.categories.map((cat, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => {
                    const newCategories = [...formData.categories];
                    newCategories[index] = e.target.value;
                    setFormData({ ...formData, categories: newCategories });
                  }}
                  placeholder="Category ID"
                  className="border p-2 flex-grow"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newCategories = formData.categories.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, categories: newCategories });
                  }}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("categories")}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Deals Stores */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Deals Stores</h2>
          <div className="mb-4">
            <label className="block mb-2">
              Upload Deals Stores Images (max 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "dealsStores")}
              className="border p-2 w-full"
              max="5"
            />
            {files.dealsStores.length > 0 && (
              <div className="mt-2">
                <p>{files.dealsStores.length} files selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Season Special */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Season Special</h2>
          <div className="mb-4">
            <label className="block mb-2">
              Upload Season Special Images (max 12)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "seasonSpecial")}
              className="border p-2 w-full"
              max="12"
            />
            {files.seasonSpecial.length > 0 && (
              <div className="mt-2">
                <p>{files.seasonSpecial.length} files selected</p>
              </div>
            )}
          </div>
        </div>

        {/* New Products */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">New Products</h2>
          <div className="mb-4">
            <label className="block mb-2">
              Upload New Products Images (max 4)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "newProducts")}
              className="border p-2 w-full"
              max="4"
            />
            {files.newProducts.length > 0 && (
              <div className="mt-2">
                <p>{files.newProducts.length} files selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Ads */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Feature Ads</h2>
          {formData.featureAds.map((ad, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Ad {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block mb-1">Product ID</label>
                  <input
                    type="text"
                    value={ad.productId || ""}
                    onChange={(e) =>
                      handleInputChange(e, "featureAds", index, "productId")
                    }
                    placeholder="Product ID"
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <input
                    type="text"
                    value={ad.description || ""}
                    onChange={(e) =>
                      handleInputChange(e, "featureAds", index, "description")
                    }
                    placeholder="Description"
                    className="border p-2 w-full"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updatedFeatureAds = formData.featureAds.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, featureAds: updatedFeatureAds });
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Remove Ad
              </button>
            </div>
          ))}
          <div className="mb-4">
            <label className="block mb-2">
              Upload Feature Ads Images (max 2)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "featureAdsProductImage")}
              className="border p-2 w-full"
              max="2"
            />
            {files.featureAdsProductImage.length > 0 && (
              <div className="mt-2">
                <p>{files.featureAdsProductImage.length} files selected</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleAddItem("featureAds")}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Feature Ad
          </button>
        </div>

        {/* Exclusive Product Offer */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">
            Exclusive Product Offer
          </h2>
          <div className="mb-4">
            <label className="block mb-1">Section Heading</label>
            <input
              type="text"
              value={formData.exclusiveProductOffer.sectionHeading}
              onChange={(e) =>
                handleInputChange(e, "exclusiveProductOfferHeading")
              }
              placeholder="Section Heading"
              className="border p-2 w-full"
            />
          </div>

          {formData.exclusiveProductOffer.products.map((product, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Product {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Product ID</label>
                  <input
                    type="text"
                    value={product.productId}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "exclusiveProductOffer",
                        index,
                        "productId"
                      )
                    }
                    placeholder="Product ID"
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Product Name</label>
                  <input
                    type="text"
                    value={product.productName}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "exclusiveProductOffer",
                        index,
                        "productName"
                      )
                    }
                    placeholder="Product Name"
                    className="border p-2 w-full"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-2">
              Upload Exclusive Product Images (max 4)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, "exclusiveProductOfferImage")
              }
              className="border p-2 w-full"
              max="4"
            />
            {files.exclusiveProductOfferImage.length > 0 && (
              <div className="mt-2">
                <p>{files.exclusiveProductOfferImage.length} files selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Banner Bottom */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Banner Bottom</h2>
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={formData.bannerBottom.title}
              onChange={(e) =>
                handleInputChange(e, "bannerBottom", null, "title")
              }
              placeholder="Title"
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Upload Banner Bottom Images (max 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "bannerBottom")}
              className="border p-2 w-full"
              max="5"
            />
            {files.bannerBottom.length > 0 && (
              <div className="mt-2">
                <p>{files.bannerBottom.length} files selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile App Link */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Mobile App Link</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Heading</label>
              <input
                type="text"
                value={formData.mobileAppLink.heading}
                onChange={(e) =>
                  handleInputChange(e, "mobileAppLink", null, "heading")
                }
                placeholder="Heading"
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Sub Heading</label>
              <input
                type="text"
                value={formData.mobileAppLink.subHeading}
                onChange={(e) =>
                  handleInputChange(e, "mobileAppLink", null, "subHeading")
                }
                placeholder="Sub Heading"
                className="border p-2 w-full"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block mb-1">Product ID</label>
            <input
              type="text"
              value={formData.mobileAppLink.productId}
              onChange={(e) =>
                handleInputChange(e, "mobileAppLink", null, "productId")
              }
              placeholder="Product ID"
              className="border p-2 w-full"
            />
          </div>
        </div>

        {/* Massive Sell */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Massive Sell</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Heading</label>
              <input
                type="text"
                value={formData.massiveSell.heading}
                onChange={(e) =>
                  handleInputChange(e, "massiveSell", null, "heading")
                }
                placeholder="Heading"
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Sub Heading</label>
              <input
                type="text"
                value={formData.massiveSell.subHeading}
                onChange={(e) =>
                  handleInputChange(e, "massiveSell", null, "subHeading")
                }
                placeholder="Sub Heading"
                className="border p-2 w-full"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block mb-1">Product ID</label>
            <input
              type="text"
              value={formData.massiveSell.productId}
              onChange={(e) =>
                handleInputChange(e, "massiveSell", null, "productId")
              }
              placeholder="Product ID"
              className="border p-2 w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-2">Upload Massive Sell Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "massiveSellImage")}
              className="border p-2 w-full"
            />
            {files.massiveSellImage && (
              <div className="mt-2">
                <p>File selected: {files.massiveSellImage.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white px-6 py-3 rounded-lg font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? "Creating Dashboard..." : "Create Dashboard"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardCreationForm;
