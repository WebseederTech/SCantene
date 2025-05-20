import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import {
  useAllProductsQuery,
  useAllProductsWithoutPaginationQuery,
} from "../../redux/api/productApiSlice";
import { BASE_URL, DASHBOARD_ID } from "../../redux/constants";
import Select from "react-select";
import { json } from "react-router";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { useGetRetailerDashboardByIdQuery } from "../../redux/api/productApiSlice";
import BannerTop from "./BannerTop";

const BuyerDashboardForm = () => {
  const fileInputRefs = {
    bannerBottom: useRef(null),
    dealsStores: useRef(null),
    productImage: useRef(null),
  };

  const productBoxInputRefs = useRef([]); // Create array ref for multiple inputs

  const { data: dashboard, error } = useGetRetailerDashboardByIdQuery();

  const [formData, setFormData] = useState({
    bannerTop: [],
    category: [],
    categories: [], // ✅ Added categories field

    recommended: {
      boxHeading: "",
      products: [],
    },
    dealsStores: [],
    featureAds: [
      {
        productId: "", // ✅ Added productId for featureAds
        productImage: [],
        description: [""],
      },
    ],
    seasonSpecial: [
      {
        image: null,
        productId: "", // ✅ Ensure productId is included
      },
    ],
    newProducts: [
      {
        image: null,
        productId: "",
      },
    ],
    massiveSell: {
      heading: "",
      subHeading: "",
      image: null,
      productId: "", // ✅ Added productId for massiveSell
    },
    exclusiveProductOffer: {
      sectionHeading: "",
      products: [],
    },
    mobileAppLink: {
      heading: "",
      subHeading: "",
      productId: "", // ✅ Added productId for mobileAppLink
    },
    bannerBottom: { title: "", images: [] },
  });

  // Corrected useEffect
  useEffect(() => {
    if (dashboard?.data) {
      // Process data to ensure File objects are properly handled
      // For existing data, we'll keep the image paths as strings
      // New uploads will be handled as File objects

      // Helper function to ensure each product/item has the correct structure
      const processProducts = (products = []) => {
        return products.map((product) => ({
          productId: product.productId || "",
          productName: product.productName || "",
          productImage: product.productImage || null,
        }));
      };

      setFormData((prevData) => ({
        ...prevData,
        bannerTop:
          dashboard.data.bannerTop?.map((item) => ({
            productId: item.productId || "",
            image: item.image || "",
          })) || [],

        category: dashboard.data.category || [],

        categories: dashboard.data.categories || [],

        recommended: {
          boxHeading: dashboard.data.recommended?.boxHeading || "",
          products: processProducts(dashboard.data.recommended?.products),
        },

        seasonSpecial:
          dashboard.data.seasonSpecial?.map((item) => ({
            productId: item.productId?.hasOwnProperty("_id")
              ? item.productId._id
              : item.productId || "",
            image: item.image || "",
          })) || [],

        newProducts:
          dashboard.data.newProducts?.map((item) => ({
            productId: item.productId?.hasOwnProperty("_id")
              ? item.productId._id
              : item.productId || "",
            image: item.image || "",
          })) || [],

        featureAds:
          dashboard.data.featureAds?.map((item) => ({
            productId: item.productId || "",
            productImage: item.productImage || null,
            description: item.description || "",
          })) || [],

        dealsStores:
          dashboard.data.dealsStores?.map((item) => ({
            productId: item.productId || "",
            image: item.image || "",
          })) || [],

        massiveSell: {
          heading: dashboard.data.massiveSell?.heading || "",
          subHeading: dashboard.data.massiveSell?.subHeading || "",
          image: dashboard.data.massiveSell?.image || null,
          productId: dashboard.data.massiveSell?.productId || "",
        },

        exclusiveProductOffer: {
          sectionHeading:
            dashboard.data.exclusiveProductOffer?.sectionHeading || "",
          products: processProducts(
            dashboard.data.exclusiveProductOffer?.products
          ),
        },

        mobileAppLink: {
          heading: dashboard.data.mobileAppLink?.heading || "",
          subHeading: dashboard.data.mobileAppLink?.subHeading || "",
          productId: dashboard.data.mobileAppLink?.productId || "",
        },

        bannerBottom: {
          title: dashboard.data.bannerBottom?.title || "",
          images:
            dashboard.data.bannerBottom?.images?.map((item) => ({
              productId: item.productId || "",
              image: item.image || "",
            })) || [],
        },
      }));
    }
  }, [dashboard?.data]);
  console.log(formData, "formData");

  const productOffers = formData.exclusiveProductOffer.products || [];

  const { data: categories } = useFetchCategoriesQuery();
  const { data: products } = useAllProductsWithoutPaginationQuery();
  const [fileInputs, setFileInputs] = useState({
    bannerTop: null,
    dealsStores: null,
    bannerBottom: null,
    featureAds: null,
    massiveSell: null,
  });
  const handleInputChange = (e, index, subIndex, name, section) => {
    const { value, files } = e.target;

    setFormData((prevFormData) => {
      switch (section) {
        case "massiveSell":
          if (name === "image" && files && files.length > 0) {
            return {
              ...prevFormData,
              massiveSell: {
                ...prevFormData.massiveSell,
                image: files[0],
              },
            };
          }
          return {
            ...prevFormData,
            massiveSell: {
              ...prevFormData.massiveSell,
              [name]: value,
            },
          };

        case "dealsStores":
          if (name === "image" && files && files.length > 0) {
            return {
              ...prevFormData,
              dealsStores: prevFormData.dealsStores.map((deal, i) =>
                i === index ? { ...deal, image: files[0] } : deal
              ),
            };
          }
          return {
            ...prevFormData,
            dealsStores: prevFormData.dealsStores.map((deal, i) =>
              i === index ? { ...deal, [name]: value } : deal
            ),
          };

        case "featureAds":
          if (name === "productImage" && files && files.length > 0) {
            return {
              ...prevFormData,
              featureAds: prevFormData.featureAds.map((ad, i) =>
                i === index ? { ...ad, productImage: files[0] } : ad
              ),
            };
          }
          return {
            ...prevFormData,
            featureAds: prevFormData.featureAds.map((ad, i) =>
              i === index ? { ...ad, [name]: value } : ad
            ),
          };

        case "bannerBottom":
          if (name === "title") {
            return {
              ...prevFormData,
              bannerBottom: {
                ...prevFormData.bannerBottom,
                title: value,
              },
            };
          }
          if (name === "image" && files && files.length > 0) {
            const updatedImages = [...prevFormData.bannerBottom.images];
            updatedImages[index] = {
              ...updatedImages[index],
              image: files[0],
            };
            return {
              ...prevFormData,
              bannerBottom: {
                ...prevFormData.bannerBottom,
                images: updatedImages,
              },
            };
          }
          return {
            ...prevFormData,
            bannerBottom: {
              ...prevFormData.bannerBottom,
              images: prevFormData.bannerBottom.images.map((img, i) =>
                i === index ? { ...img, [name]: value } : img
              ),
            },
          };

        case "mobileAppLink":
          return {
            ...prevFormData,
            mobileAppLink: {
              ...prevFormData.mobileAppLink,
              [name]: value,
            },
          };

        case "exclusiveProductOffer":
          if (subIndex !== null && subIndex !== undefined) {
            if (name === "productImage" && files && files.length > 0) {
              return {
                ...prevFormData,
                exclusiveProductOffer: {
                  ...prevFormData.exclusiveProductOffer,
                  products: prevFormData.exclusiveProductOffer.products.map(
                    (product, i) =>
                      i === subIndex
                        ? { ...product, productImage: files[0] }
                        : product
                  ),
                },
              };
            }
            return {
              ...prevFormData,
              exclusiveProductOffer: {
                ...prevFormData.exclusiveProductOffer,
                products: prevFormData.exclusiveProductOffer.products.map(
                  (product, i) =>
                    i === subIndex ? { ...product, [name]: value } : product
                ),
              },
            };
          }
          return {
            ...prevFormData,
            exclusiveProductOffer: {
              ...prevFormData.exclusiveProductOffer,
              [name]: value,
            },
          };

        case "recommended":
          if (subIndex !== null && subIndex !== undefined) {
            if (name === "productImage" && files && files.length > 0) {
              return {
                ...prevFormData,
                recommended: {
                  ...prevFormData.recommended,
                  products: prevFormData.recommended.products.map(
                    (product, i) =>
                      i === subIndex
                        ? { ...product, productImage: files[0] }
                        : product
                  ),
                },
              };
            }
            return {
              ...prevFormData,
              recommended: {
                ...prevFormData.recommended,
                products: prevFormData.recommended.products.map((product, i) =>
                  i === subIndex ? { ...product, [name]: value } : product
                ),
              },
            };
          }
          return {
            ...prevFormData,
            recommended: {
              ...prevFormData.recommended,
              [name]: value,
            },
          };

        case "seasonSpecial":
          if (name === "image" && files && files.length > 0) {
            return {
              ...prevFormData,
              seasonSpecial: prevFormData.seasonSpecial.map((special, i) =>
                i === index ? { ...special, image: files[0] } : special
              ),
            };
          }
          return {
            ...prevFormData,
            seasonSpecial: prevFormData.seasonSpecial.map((special, i) =>
              i === index ? { ...special, [name]: value } : special
            ),
          };

        case "newProducts":
          if (name === "image" && files && files.length > 0) {
            return {
              ...prevFormData,
              newProducts: prevFormData.newProducts.map((product, i) =>
                i === index ? { ...product, image: files[0] } : product
              ),
            };
          }
          return {
            ...prevFormData,
            newProducts: prevFormData.newProducts.map((product, i) =>
              i === index ? { ...product, [name]: value } : product
            ),
          };

        case "bannerTop":
          if (name === "image" && files && files.length > 0) {
            return {
              ...prevFormData,
              bannerTop: prevFormData.bannerTop.map((banner, i) =>
                i === index ? { ...banner, image: files[0] } : banner
              ),
            };
          }
          return {
            ...prevFormData,
            bannerTop: prevFormData.bannerTop.map((banner, i) =>
              i === index ? { ...banner, [name]: value } : banner
            ),
          };

        default:
          console.error("Unhandled section:", section);
          return prevFormData;
      }
    });
  };

  // Handle multi-select input changes
  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOptions.map((option) => ({
        _id: option.value,
        name: option.label,
      })),
    }));
  };

  useEffect(() => {
    console.log(fileInputs, "fileinout"); // Check the updated state after file change
    console.log(formData, "fff");
  }, [fileInputs, formData]);

  const handleProductBoxImageChange = (e, boxIndex, productIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      const updatedProductBox = [...prev.productBox];
      updatedProductBox[boxIndex].products[productIndex].productImage = file;

      // ✅ Create a preview URL for new images
      updatedProductBox[boxIndex].products[productIndex].preview =
        URL.createObjectURL(file);

      return { ...prev, productBox: updatedProductBox };
    });
  };

  const handleRemoveProductBoxImage = (boxIndex, productIndex) => {
    setFormData((prev) => {
      const updatedProductBox = prev.productBox.map((box, i) =>
        i === boxIndex
          ? {
              ...box,
              products: box.products.map((product, j) =>
                j === productIndex
                  ? { ...product, productImage: null, preview: null } // ✅ Clear both image and preview
                  : product
              ),
            }
          : box
      );

      return { ...prev, productBox: updatedProductBox };
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formDataToSubmit = new FormData();

  //   // Append non-file data as JSON strings
  //   formDataToSubmit.append("category", JSON.stringify(formData.category));

  //   formData.productBox.forEach((box, boxIndex) => {
  //     box.products.forEach((product, productIndex) => {
  //       if (product.productId) {
  //         formDataToSubmit.append(
  //           `productBox[${boxIndex}][products][${productIndex}][productId]`,
  //           product.productId
  //         );
  //       }
  //       if (product.productName) {
  //         formDataToSubmit.append(
  //           `productBox[${boxIndex}][products][${productIndex}][productName]`,
  //           product.productName
  //         );
  //       }
  //       if (product.productImage instanceof File) {
  //         formDataToSubmit.append("productImage[]", product.productImage); // ✅ Append unique images
  //       }
  //     });
  //   });

  //   const featureAdsData = formData.featureAds.map((ad) => ({
  //     productId: ad.productId, // MongoDB ObjectId
  //     description: ad.description.trim(), // Remove unwanted spaces
  //   }));
  //   formDataToSubmit.append("featureAds", JSON.stringify(featureAdsData));

  //   // ✅ Append Feature Ads Images Separately
  //   formData.featureAds.forEach((ad) => {
  //     if (ad.productImage instanceof File) {
  //       formDataToSubmit.append("featureAdsProductImage[]", ad.productImage);
  //     }
  //   });

  //   // ✅ Append Massive Sell Data (Heading, Subheading, ProductId)
  //   formDataToSubmit.append(
  //     "massiveSell",
  //     JSON.stringify({
  //       heading: formData.massiveSell.heading,
  //       subHeading: formData.massiveSell.subHeading,
  //       productId: formData.massiveSell.productId,
  //     })
  //   );

  //   // ✅ Append Massive Sell Image Separately
  //   if (formData.massiveSell.image instanceof File) {
  //     formDataToSubmit.append("massiveSellImage", formData.massiveSell.image);
  //   }

  //   // ✅ Convert `exclusiveProductOffer` to JSON string
  //   const exclusiveProductsData = formData.exclusiveProductOffer.products.map(
  //     (prod) => ({
  //       productId: prod.productId,
  //       productName: prod.productName,
  //     })
  //   );

  //   formDataToSubmit.append(
  //     "exclusiveProductOffer",
  //     JSON.stringify({
  //       sectionHeading: formData.exclusiveProductOffer.sectionHeading || "",
  //       products: exclusiveProductsData,
  //     })
  //   );

  //   // ✅ Append images separately
  //   formData.exclusiveProductOffer.products.forEach((prod) => {
  //     if (prod.productImage instanceof File) {
  //       formDataToSubmit.append(
  //         "exclusiveProductOfferImage[]",
  //         prod.productImage
  //       ); // ✅ Send as file
  //     }
  //   });

  //   formDataToSubmit.append(
  //     "mobileAppLink",
  //     JSON.stringify(formData.mobileAppLink)
  //   );

  //   // ✅ Convert `bannerBottom` to JSON string
  //   const bannerBottomData = formData.bannerBottom.images.map((img) => ({
  //     productId: img.productId,
  //   }));

  //   formDataToSubmit.append(
  //     "bannerBottom",
  //     JSON.stringify({
  //       title: formData.bannerBottom.title || "",
  //       images: bannerBottomData,
  //     })
  //   );

  //   // ✅ Append images separately
  //   formData.bannerBottom.images.forEach((img) => {
  //     if (img.image instanceof File) {
  //       formDataToSubmit.append("bannerBottom[]", img.image); // ✅ Send images separately
  //     }
  //   });

  //   // ✅ Append Deals Stores Product IDs separately
  //   const dealsStoresData = formData.dealsStores.map((deal) => ({
  //     productId: deal.productId,
  //   }));
  //   formDataToSubmit.append("dealsStores", JSON.stringify(dealsStoresData));

  //   // ✅ Append Deals Stores Images separately
  //   formData.dealsStores.forEach((deal) => {
  //     if (deal.image instanceof File) {
  //       formDataToSubmit.append("dealsStores[]", deal.image);
  //     }
  //   });

  //   if (fileInputs.bannerBottom && fileInputs.bannerBottom.length > 0) {
  //     fileInputs.bannerBottom.forEach((file) => {
  //       formDataToSubmit.append("bannerBottom[]", file);
  //     });
  //   }

  //   if (fileInputs.productBoxImages.length > 0) {
  //     fileInputs.productBoxImages.forEach((file) => {
  //       formDataToSubmit.append("productImage[]", file); // Match Multer field name
  //     });
  //   }

  //   if (fileInputs.featureAds && fileInputs.featureAds.length > 0) {
  //     fileInputs.featureAds.forEach((file) => {
  //       formDataToSubmit.append("featureAds[]", file);
  //     });
  //   }

  //   // Append massiveSell image file
  //   if (fileInputs.massiveSell) {
  //     formDataToSubmit.append("massiveSellImage", fileInputs.massiveSell); // Match Multer's field name
  //   }

  //   // ✅ Ensure each banner has either an existing image or a new file
  //   const bannerTopData = formData.bannerTop.map((banner) => ({
  //     productId: banner.productId,
  //     image: banner.image instanceof File ? "" : banner.image, // Set "" only if a new file is uploaded
  //   }));

  //   formDataToSubmit.append(
  //     "bannerTopProductIds",
  //     JSON.stringify(bannerTopData)
  //   );

  //   // ✅ Append new images under `bannerTop[]`
  //   formData.bannerTop.forEach((banner) => {
  //     if (banner.image instanceof File) {
  //       formDataToSubmit.append("bannerTop[]", banner.image);
  //     }
  //   });

  //   console.log(formDataToSubmit, "formdatatoSubmit");

  //   for (let pair of formDataToSubmit.entries()) {
  //     console.log(pair[0] + ": " + pair[1]);
  //   }

  //   try {
  //     const response = await axios.patch(
  //       `${BASE_URL}/api/Buyer-dashboard/${DASHBOARD_ID}`,
  //       formDataToSubmit,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log("Data and files uploaded successfully", response.data);
  //   } catch (error) {
  //     console.error("Error uploading data and files", error);
  //   }
  // };

  // Corrected handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    // Append categories and category data
    formDataToSubmit.append("category", JSON.stringify(formData.category));
    formDataToSubmit.append("categories", JSON.stringify(formData.categories));

    // Append recommended section
    const recommendedData = formData.recommended.products.map((prod) => ({
      productId: prod.productId,
      productName: prod.productName,
      productImage: prod.productImage instanceof File ? "" : prod.productImage,
    }));

    formDataToSubmit.append(
      "recommended",
      JSON.stringify({
        boxHeading: formData.recommended.boxHeading || "",
        products: recommendedData,
      })
    );

    // Append recommendedImage files separately
    formData.recommended.products.forEach((prod) => {
      if (prod.productImage instanceof File) {
        formDataToSubmit.append("recommendedImage[]", prod.productImage);
      }
    });

    // Append seasonSpecial data
    const seasonSpecialData = formData.seasonSpecial.map((special) => ({
      productId: special.productId,
      image: special.image instanceof File ? "" : special.image,
    }));

    formDataToSubmit.append("seasonSpecial", JSON.stringify(seasonSpecialData));

    // Append seasonSpecial images separately
    formData.seasonSpecial.forEach((special) => {
      if (special.image instanceof File) {
        formDataToSubmit.append("seasonSpecial[]", special.image);
      }
    });

    // Append newProducts data
    const newProductsData = formData.newProducts.map((product) => ({
      productId: product.productId,
      image: product.image instanceof File ? "" : product.image,
    }));

    formDataToSubmit.append("newProducts", JSON.stringify(newProductsData));

    // Append newProducts images separately
    formData.newProducts.forEach((product) => {
      if (product.image instanceof File) {
        formDataToSubmit.append("newProducts[]", product.image);
      }
    });

    // Handle featureAds data
    const featureAdsData = formData.featureAds.map((ad) => ({
      productId: ad.productId,
      productImage: ad.productImage instanceof File ? "" : ad.productImage,
      description: ad.description.trim(),
    }));

    formDataToSubmit.append("featureAds", JSON.stringify(featureAdsData));

    formData.featureAds.forEach((ad) => {
      if (ad.productImage instanceof File) {
        formDataToSubmit.append("featureAdsProductImage[]", ad.productImage);
      }
    });

    // Handle massiveSell data
    formDataToSubmit.append(
      "massiveSell",
      JSON.stringify({
        heading: formData.massiveSell.heading || "",
        subHeading: formData.massiveSell.subHeading || "",
        productId: formData.massiveSell.productId || "",
        image:
          formData.massiveSell.image instanceof File
            ? ""
            : formData.massiveSell.image,
      })
    );

    if (formData.massiveSell.image instanceof File) {
      formDataToSubmit.append("massiveSellImage", formData.massiveSell.image);
    }

    // Handle exclusiveProductOffer data
    const exclusiveProductsData = formData.exclusiveProductOffer.products.map(
      (prod) => ({
        productId: prod.productId,
        productName: prod.productName,
        productImage:
          prod.productImage instanceof File ? "" : prod.productImage,
      })
    );

    formDataToSubmit.append(
      "exclusiveProductOffer",
      JSON.stringify({
        sectionHeading: formData.exclusiveProductOffer.sectionHeading || "",
        products: exclusiveProductsData,
      })
    );

    formData.exclusiveProductOffer.products.forEach((prod) => {
      if (prod.productImage instanceof File) {
        formDataToSubmit.append(
          "exclusiveProductOfferImage[]",
          prod.productImage
        );
      }
    });

    // Append mobileAppLink
    formDataToSubmit.append(
      "mobileAppLink",
      JSON.stringify({
        heading: formData.mobileAppLink.heading || "",
        subHeading: formData.mobileAppLink.subHeading || "",
        productId: formData.mobileAppLink.productId || "",
      })
    );

    // Handle bannerBottom
    const bannerBottomData = formData.bannerBottom.images.map((img) => ({
      productId: img.productId,
      image: img.image instanceof File ? "" : img.image,
    }));

    formDataToSubmit.append(
      "bannerBottom",
      JSON.stringify({
        title: formData.bannerBottom.title || "",
        images: bannerBottomData,
      })
    );

    formData.bannerBottom.images.forEach((img) => {
      if (img.image instanceof File) {
        formDataToSubmit.append("bannerBottom[]", img.image);
      }
    });

    // Handle dealsStores
    const dealsStoresData = formData.dealsStores.map((deal) => ({
      productId: deal.productId,
      image: deal.image instanceof File ? "" : deal.image,
    }));

    formDataToSubmit.append("dealsStores", JSON.stringify(dealsStoresData));

    formData.dealsStores.forEach((deal) => {
      if (deal.image instanceof File) {
        formDataToSubmit.append("dealsStores[]", deal.image);
      }
    });

    // Handle bannerTop
    const bannerTopData = formData.bannerTop.map((banner) => ({
      productId: banner.productId,
      image: banner.image instanceof File ? "" : banner.image,
    }));

    formDataToSubmit.append("bannerTop", JSON.stringify(bannerTopData));

    formData.bannerTop.forEach((banner) => {
      if (banner.image instanceof File) {
        formDataToSubmit.append("bannerTop[]", banner.image);
      }
    });

    console.log("Form data to submit:", formDataToSubmit);

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/Buyer-dashboard/${DASHBOARD_ID}`,
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Data and files uploaded successfully", response.data);
      // Add success notification here
    } catch (error) {
      console.error("Error uploading data and files", error);
      // Add error notification here
    }
  };

  const [selectedImages, setSelectedImages] = useState([]);

  const handleRemoveImage = (field, index) => {
    setFormData((prevData) => {
      if (!prevData[field] || !Array.isArray(prevData[field])) {
        return prevData;
      }

      // Remove the selected image from the state
      const updatedImages = prevData[field].filter((_, i) => i !== index);

      return {
        ...prevData,
        [field]: updatedImages, // Ensure correct structure
      };
    });

    // Clear the input field to prevent re-selection issues
    if (fileInputRefs[field]?.current) {
      fileInputRefs[field].current.value = "";
    }
  };

  const handleRemoveDealsStoresImage = (index) => {
    setFormData((prevData) => {
      if (!prevData.dealsStores || !Array.isArray(prevData.dealsStores)) {
        return prevData;
      }

      const updatedImages = prevData.dealsStores.filter((_, i) => i !== index);

      return {
        ...prevData,
        dealsStores: updatedImages,
      };
    });

    // Clear input field
    if (fileInputRefs.dealsStores?.current) {
      fileInputRefs.dealsStores.current.value = "";
    }
  };

  const handleRemoveProductImage = (index) => {
    setProductOffers((prevOffers) => {
      const updatedOffers = [...prevOffers];
      // Get the product offer to update
      const productToUpdate = updatedOffers[index];

      // If there's an image preview (newly uploaded file), revoke the object URL
      if (productToUpdate.imagePreview) {
        URL.revokeObjectURL(productToUpdate.imagePreview);
        // Clear the image preview
        productToUpdate.imagePreview = null;
      }

      // Remove the product image reference
      productToUpdate.productImage = null;

      return updatedOffers;
    });

    // Also update the formData to reflect image removal
    setFormData((prevData) => {
      const updatedProducts = [...prevData.exclusiveProductOffer.products];
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          productImage: null,
        };
      }

      return {
        ...prevData,
        exclusiveProductOffer: {
          ...prevData.exclusiveProductOffer,
          products: updatedProducts,
        },
      };
    });

    // Clear the input field to allow re-selection of the same file
    if (fileInputRefs && fileInputRefs[`productImage-${index}`]?.current) {
      fileInputRefs[`productImage-${index}`].current.value = "";
    }
  };
  const handleRemoveFeatureAdImage = (index) => {
    setFormData((prev) => {
      const updatedFeatureAds = prev.featureAds.map((ad, i) =>
        i === index ? { ...ad, productImage: null } : ad
      );

      return { ...prev, featureAds: updatedFeatureAds };
    });
  };

  const handleFeatureAdImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      const updatedFeatureAds = prev.featureAds.map((ad, i) =>
        i === index ? { ...ad, productImage: file } : ad
      );

      return { ...prev, featureAds: updatedFeatureAds };
    });
  };

  const handleRemoveMassiveSellImage = () => {
    setFormData((prev) => ({
      ...prev,
      massiveSell: { ...prev.massiveSell, image: null },
    }));
  };
  const handleMassiveSellImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      massiveSell: { ...prev.massiveSell, image: file },
    }));
  };

  const handleProductChange = (index, selectedOption) => {
    const updatedProducts = [...productOffers];
    updatedProducts[index] = {
      ...updatedProducts[index],
      productId: selectedOption?.value || "",
      productName: selectedOption?.label || "",
    };

    setFormData({
      ...formData,
      exclusiveProductOffer: {
        ...formData.exclusiveProductOffer,
        products: updatedProducts,
      },
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedProducts = [...productOffers];
    updatedProducts[index] = {
      ...updatedProducts[index],
      productImage: file, // Store file object for upload
      imagePreview: URL.createObjectURL(file), // Preview image
    };

    setFormData({
      ...formData,
      exclusiveProductOffer: {
        ...formData.exclusiveProductOffer,
        products: updatedProducts,
      },
    });
  };

  const handleRemoveDealsStoreImage = (index) => {
    setFormData((prev) => {
      // ✅ Create a copy of the entire state object
      const updatedDealsStores = prev.dealsStores.map((store, i) =>
        i === index ? { ...store, image: null } : store
      );

      return { ...prev, dealsStores: updatedDealsStores };
    });
  };
  const handleRemoveSeasonSpecialImage = (index) => {
    setFormData((prev) => {
      // ✅ Create a copy of the entire state object
      const updatedSeasonSpecial = prev.seasonSpecial.map((store, i) =>
        i === index ? { ...store, image: null } : store
      );

      return { ...prev, seasonSpecial: updatedSeasonSpecial };
    });
  };
  const handleRemoveNewProductsImage = (index) => {
    setFormData((prev) => {
      // ✅ Create a copy of the entire state object
      const updatedNewProducts = prev.newProducts.map((store, i) =>
        i === index ? { ...store, image: null } : store
      );

      return { ...prev, newProducts: updatedNewProducts };
    });
  };

  const handleDealsStoreImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      dealsStores: prev.dealsStores.map((item, i) =>
        i === index ? { ...item, image: file } : item
      ),
    }));
  };

  const handleSeasonSpecialImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      seasonSpecial: prev.seasonSpecial.map((item, i) =>
        i === index ? { ...item, image: file } : item
      ),
    }));
  };

  const handleNewProductsImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      newProducts: prev.newProducts.map((item, i) =>
        i === index ? { ...item, image: file } : item
      ),
    }));
  };

  const handleExclusiveProductImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      const updatedProducts = prev.exclusiveProductOffer.products.map(
        (prod, i) => (i === index ? { ...prod, productImage: file } : prod)
      );

      return {
        ...prev,
        exclusiveProductOffer: {
          ...prev.exclusiveProductOffer,
          products: updatedProducts,
        },
      };
    });
  };
  const handleRecommendedChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      const updatedProducts = prev.recommended.products.map((prod, i) =>
        i === index ? { ...prod, productImage: file } : prod
      );

      return {
        ...prev,
        recommended: {
          ...prev.recommended,
          products: updatedProducts,
        },
      };
    });
  };

  const handleRemoveExclusiveProductImage = (index) => {
    setFormData((prev) => {
      const updatedProducts = prev.exclusiveProductOffer.products.map(
        (prod, i) => (i === index ? { ...prod, productImage: null } : prod)
      );

      return {
        ...prev,
        exclusiveProductOffer: {
          ...prev.exclusiveProductOffer,
          products: updatedProducts,
        },
      };
    });
  };
  const handleRemoverecommendedImage = (index) => {
    setFormData((prev) => {
      const updatedProducts = prev.exclusiveProductOffer.products.map(
        (prod, i) => (i === index ? { ...prod, productImage: null } : prod)
      );

      return {
        ...prev,
        exclusiveProductOffer: {
          ...prev.exclusiveProductOffer,
          products: updatedProducts,
        },
      };
    });
  };

  const handleBannerBottomImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      const updatedImages = prev.bannerBottom.images.map((img, i) =>
        i === index ? { ...img, image: file } : img
      );

      return {
        ...prev,
        bannerBottom: { ...prev.bannerBottom, images: updatedImages },
      };
    });
  };

  const handleRemoveBannerBottomImage = (index) => {
    setFormData((prev) => {
      const updatedImages = prev.bannerBottom.images.map((img, i) =>
        i === index ? { ...img, image: null } : img
      );

      return {
        ...prev,
        bannerBottom: { ...prev.bannerBottom, images: updatedImages },
      };
    });
  };

  const handleBannerTopImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      bannerTop: prev.bannerTop.map((item, i) =>
        i === index ? { ...item, image: file } : item
      ),
    }));
  };

  const handleRemoveBannerTop = (index) => {
    setFormData((prev) => ({
      ...prev,
      bannerTop: prev.bannerTop.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col items-center darktheme px-6">
      <section className="w-full lg:w-[85%] darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 lg:ml-[15%]">
        <h2 className="text-2xl font-bold text-center mb-8 text-customPurple">
          Update Buyer Dashboard
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-lg font-medium darklabel"
              >
                Category
              </label>
              <Select
                name="category"
                options={categories?.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
                isMulti
                onChange={(selectedOptions) =>
                  handleMultiSelectChange("category", selectedOptions)
                }
                value={formData.category.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
                isSearchable={true}
                className="mt-2 p-0 dark:bg-gray-700 dark:text-black pagination rounded-md border border-gray-600 shadow-md w-full focus:outline-none focus:ring-2 focus:ring-customPurple"
              />
            </div>
          </div>
          <div className="mt-5">
            <label
              htmlFor="bannerTop"
              className="block text-lg font-medium mb-3"
            >
              Banner Top
            </label>

            {formData.bannerTop.map((banner, index) => (
              <div
                key={index}
                className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Left Column - Product Selector */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((product) => ({
                        value: product._id,
                        label: product.name,
                      }))}
                      value={
                        banner.productId && {
                          value: banner.productId._id || banner.productId,
                          label:
                            products?.data.find(
                              (p) => p._id === banner.productId
                            )?.name || "Select Product",
                        }
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => {
                          const updatedBannerTop = prev.bannerTop.map(
                            (item, i) => {
                              if (i === index) {
                                // Create a new object instead of modifying the existing one
                                return {
                                  ...item,
                                  productId: selectedOption.value,
                                };
                              }
                              return item;
                            }
                          );
                          return { ...prev, bannerTop: updatedBannerTop };
                        });
                      }}
                      className="w-full p-0 dark:bg-gray-700 text-black rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />
                  </div>

                  {/* Right Column - Image Upload and Preview */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Banner Image
                    </label>
                    <input
                      type="file"
                      name="bannerImage"
                      onChange={(e) => handleBannerTopImage(e, index)}
                      className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                    />

                    {/* Image Preview */}
                    <div className="mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {formData.bannerTop[index].image ? (
                        <div className="relative h-full w-full">
                          <img
                            src={
                              formData.bannerTop[index].image instanceof File
                                ? URL.createObjectURL(
                                    formData.bannerTop[index].image
                                  )
                                : `${BASE_URL}/${formData.bannerTop[index].image}`
                            }
                            alt="Banner Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBannerTop(index)}
                            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
                            aria-label="Remove Banner"
                          >
                            <FiMinus className="h-4 w-4" />
                            <span className="ml-1">Remove</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-sm">No image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bannerTop: prev.bannerTop.filter((_, i) => i !== index),
                      }))
                    }
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
                    aria-label="Remove Banner"
                  >
                    <FiMinus className="h-4 w-4" />
                    <span className="ml-1">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add Banner Button */}
            <div className="mt-4 text-center sm:text-left">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    bannerTop: [
                      ...prev.bannerTop,
                      { image: null, productId: "" },
                    ],
                  }))
                }
                className="py-2 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add Banner</span>
              </button>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-gray-700"></div>

          {/* recommended  */}
          <div className="mt-5">
            <h2 className="mb-6 text-lg font-medium">Recommended</h2>

            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              {/*boxHeading*/}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">
                  boxHeading
                </label>
                <input
                  type="text"
                  name="boxHeading"
                  value={formData.recommended.boxHeading}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recommended: {
                        ...prev.recommended,
                        boxHeading: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple dark:bg-gray-700 dark:text-white"
                  placeholder="Enter section heading"
                />
              </div>

              {/* Product List */}
              {formData.recommended.products.map((product, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md mb-4 flex flex-col md:flex-row gap-4"
                >
                  {/* Left Side: Select Product */}
                  <div className="w-full md:w-1/2">
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((p) => ({
                        value: p._id,
                        label: p.name,
                      }))}
                      value={
                        product.productId
                          ? {
                              value: product.productId._id || product.productId,
                              label:
                                products?.data.find(
                                  (p) => p._id === product.productId
                                )?.name || "Select Product",
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => {
                          const updatedProducts = prev.recommended.products.map(
                            (prod, i) =>
                              i === index
                                ? {
                                    ...prod,
                                    productId: selectedOption.value,
                                    productName: selectedOption.label,
                                  }
                                : prod
                          );
                          return {
                            ...prev,
                            recommended: {
                              ...prev.recommended,
                              products: updatedProducts,
                            },
                          };
                        });
                      }}
                      className="w-full p-0 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />
                  </div>

                  {/* Right Side: Product Image Upload */}
                  <div className="w-full md:w-1/2">
                    <label className="text-sm font-medium mb-1 block">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      name="recommendedImage[]"
                      onChange={(e) => handleRecommendedChange(e, index)}
                      className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                    />

                    {/* Image Preview */}
                    {product.productImage && (
                      <div className="relative mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img
                          src={
                            product.productImage instanceof File
                              ? URL.createObjectURL(product.productImage)
                              : `${BASE_URL}/${product.productImage}`
                          }
                          alt="Exclusive Product Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoverecommendedImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Product List */}

              {/* Add Product Button */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    recommended: {
                      ...prev.recommended,
                      products: [
                        ...prev.recommended.products,
                        { productId: "", productName: "", productImage: null },
                      ],
                    },
                  }))
                }
                className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >
                Add Product
              </button>
            </div>
          </div>

          {/* product box */}
          {/* <div className="mb-8 mt-6">
            <div className="mb-4">
              <label
                htmlFor="products"
                className="block text-xl font-semibold darklabel"
              >
                Products
              </label>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  productBox: [
                    ...prev.productBox,
                    { boxHeading: "", products: [] },
                  ],
                }))
              }
              className="mb-6 py-2 px-5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2 shadow-md"
            >
              <FiPlus className="h-4 w-4" />
              <span>Product Box</span>
            </button>

            {formData.productBox.map((box, index) => (
              <div
                key={index}
                className="mb-8 p-6 dark:bg-gray-800 bg-gray-100 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
              >
            
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      productBox: prev.productBox.filter(
                        (_, boxIndex) => boxIndex !== index
                      ),
                    }))
                  }
                  className="py-1 px-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 float-right focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-1"
                >
                  <FiMinus className="h-3 w-3" />
                </button>

                <label
                  htmlFor={`productBox[${index}].boxHeading`}
                  className="block text-lg font-medium mb-2"
                >
                  Product Box Heading
                </label>
                <input
                  type="text"
                  name="boxHeading"
                  value={formData.productBox[index].boxHeading}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      index,
                      null,
                      "boxHeading",
                      "productBox"
                    )
                  }
                  className="w-full p-3  rounded-md border border-gray-600 shadow-md mb-5 focus:outline-none focus:ring-2 focus:ring-customPurple"
                  placeholder="Enter Product Heading"
                />

                <div className="mt-5">
                  <label
                    htmlFor={`productBox[${index}].products`}
                    className="block text-lg font-medium mb-3"
                  >
                    Products
                  </label>

                  {box.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    >

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Select Product
                          </label>
                          <Select
                            name={`productId`}
                            options={products?.data.map((product) => ({
                              value: product._id,
                              label: product.name,
                            }))}
                            value={
                              product.productId && {
                                value:
                                  product.productId._id || product.productId,
                                label:
                                  product.productId.name || product.productName,
                              }
                            }
                            onChange={(selectedOption) => {
                              setFormData((prev) => {
                                const updatedProductBox = prev.productBox.map(
                                  (box, i) =>
                                    i === index
                                      ? {
                                          ...box,
                                          products: box.products.map(
                                            (product, j) =>
                                              j === productIndex
                                                ? {
                                                    ...product,
                                                    productId:
                                                      selectedOption.value,
                                                    productName:
                                                      selectedOption.label,
                                                  }
                                                : product
                                          ),
                                        }
                                      : box
                                );

                                return {
                                  ...prev,
                                  productBox: updatedProductBox,
                                };
                              });
                            }}
                            className="w-full p-0 dark:bg-gray-700 text-black rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                          />

                          {product.productName && (
                            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-md">
                              <p className="text-sm font-medium">
                                {product.productName}
                              </p>
                            </div>
                          )}
                        </div>

           
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Product Image
                          </label>
                          <input
                            type="file"
                            name={`productImage`}
                            ref={(el) =>
                              (productBoxInputRefs.current[
                                `${index}-${productIndex}`
                              ] = el)
                            }
                            onChange={(e) =>
                              handleProductBoxImageChange(
                                e,
                                index,
                                productIndex
                              )
                            }
                            className="w-full p-2 pagination rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                          />

                       
                          <div className="mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            {formData.productBox[index].products[productIndex]
                              .productImage ? (
                              <div className="relative h-full w-full">
                                <img
                                  src={
                                    formData.productBox[index].products[
                                      productIndex
                                    ].preview ||
                                    (formData.productBox[index].products[
                                      productIndex
                                    ].productImage instanceof File
                                      ? URL.createObjectURL(
                                          formData.productBox[index].products[
                                            productIndex
                                          ].productImage
                                        )
                                      : `${formData.productBox[index].products[productIndex].productImage}`)
                                  }
                                  alt="Product Preview"
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveProductBoxImage(
                                      index,
                                      productIndex
                                    )
                                  }
                                  className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                                  aria-label="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <span className="text-sm">
                                  No image selected
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => {
                              const updatedProductBox = [...prev.productBox];
                              updatedProductBox[index].products =
                                updatedProductBox[index].products.filter(
                                  (_, prodIndex) => prodIndex !== productIndex
                                );
                              return {
                                ...prev,
                                productBox: updatedProductBox,
                              };
                            })
                          }
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
                          aria-label="Remove product"
                        >
                          <FiMinus className="h-4 w-4" />
                          <span className="ml-1">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}

              
                  <div className="mt-4 text-center sm:text-left">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => {
                          const updatedProductBox = [...prev.productBox];
                          updatedProductBox[index].products.push({
                            productId: "",
                            productName: "",
                            productImage: null,
                          });
                          return {
                            ...prev,
                            productBox: updatedProductBox,
                          };
                        })
                      }
                      className="py-2 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 shadow-md"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
          <div className="mt-8 border-t-2 border-gray-700"></div>

          {/* categories  */}
          <label
            htmlFor="categories"
            className="block my-4 text-lg font-medium darklabel"
          >
            Categories
          </label>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
            <div className="mb-6">
              <Select
                name="categories"
                options={categories?.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
                isMulti
                onChange={(selectedOptions) =>
                  handleMultiSelectChange("categories", selectedOptions)
                }
                value={formData.categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
                isSearchable={true}
                className="mt-2 p-0 dark:bg-gray-700 dark:text-black pagination rounded-md border border-gray-600 shadow-md w-full focus:outline-none focus:ring-2 focus:ring-customPurple"
              />
            </div>
          </div>

          <div className="mt-8 border-t-2 border-gray-700"></div>

          <div className="mt-5">
            <label
              htmlFor="dealsStores"
              className="block text-lg font-medium mb-3"
            >
              Deals Stores
            </label>

            {formData.dealsStores.map((deal, index) => (
              <div
                key={index}
                className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {/* Product Selector and Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Left Column - Product Selector */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((product) => ({
                        value: product._id,
                        label: product.name,
                      }))}
                      value={
                        deal.productId && {
                          value: deal.productId._id || deal.productId,
                          label:
                            products?.data.find((p) => p._id === deal.productId)
                              ?.name || "Select Product",
                        }
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => ({
                          ...prev,
                          dealsStores: prev.dealsStores.map((item, i) =>
                            i === index
                              ? { ...item, productId: selectedOption.value }
                              : item
                          ),
                        }));
                      }}
                      className="w-full p-0 dark:bg-gray-700 text-black rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />

                    {/* Display Product Name below selector */}
                    {deal.productId &&
                      products?.data.find((p) => p._id === deal.productId)
                        ?.name && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-md">
                          <p className="text-sm font-medium">
                            {
                              products?.data.find(
                                (p) => p._id === deal.productId
                              )?.name
                            }
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Right Column - Image Upload and Preview */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Deal Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => handleDealsStoreImageChange(e, index)}
                      className="w-full p-2 pagination rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                    />

                    {/* Image Preview */}
                    <div className="mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {formData.dealsStores[index].image ? (
                        <div className="relative h-full w-full">
                          <img
                            src={
                              formData.dealsStores[index].preview ||
                              (formData.dealsStores[index].image instanceof File
                                ? URL.createObjectURL(
                                    formData.dealsStores[index].image
                                  )
                                : `${BASE_URL}/${formData.dealsStores[index].image}`)
                            }
                            alt="Deal Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDealsStoreImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                            aria-label="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-sm">No image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dealsStores: prev.dealsStores.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
                    aria-label="Remove deal"
                  >
                    <FiMinus className="h-4 w-4" />
                    <span className="ml-1">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add Deals Store Button */}
            <div className="mt-4 text-center sm:text-left">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    dealsStores: [
                      ...prev.dealsStores,
                      { image: null, productId: "" },
                    ],
                  }))
                }
                className="py-2 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add Deals Store</span>
              </button>
            </div>
          </div>
          <div className="mt-5">
            <label
              htmlFor="seasonSpecial"
              className="block text-lg font-medium mb-3"
            >
              Season Special
            </label>

            {formData.seasonSpecial.map((special, index) => (
              <div
                key={index}
                className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {/* Product Selector and Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Left Column - Product Selector */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((product) => ({
                        value: product._id,
                        label: product.name,
                      }))}
                      value={
                        special.productId && {
                          value: special.productId._id || special.productId,
                          label:
                            products?.data.find(
                              (p) => p._id === special.productId
                            )?.name || "Select Product",
                        }
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => ({
                          ...prev,
                          seasonSpecial: prev.seasonSpecial.map((item, i) =>
                            i === index
                              ? { ...item, productId: selectedOption.value }
                              : item
                          ),
                        }));
                      }}
                      className="w-full p-0 dark:bg-gray-700 text-black rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />

                    {/* Display Product Name below selector */}
                    {special.productId &&
                      products?.data.find((p) => p._id === special.productId)
                        ?.name && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-md">
                          <p className="text-sm font-medium">
                            {
                              products?.data.find(
                                (p) => p._id === special.productId
                              )?.name
                            }
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Right Column - Image Upload and Preview */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Special Offer Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => handleSeasonSpecialImageChange(e, index)}
                      className="w-full p-2 pagination rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                    />

                    {/* Image Preview */}
                    <div className="mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {formData.seasonSpecial[index].image ? (
                        <div className="relative h-full w-full">
                          <img
                            src={
                              formData.seasonSpecial[index].preview ||
                              (formData.seasonSpecial[index].image instanceof
                              File
                                ? URL.createObjectURL(
                                    formData.seasonSpecial[index].image
                                  )
                                : `${BASE_URL}/${formData.seasonSpecial[index].image}`)
                            }
                            alt="Season Special Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSeasonSpecialImage(index)
                            }
                            className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                            aria-label="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-sm">No image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        seasonSpecial: prev.seasonSpecial.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
                    aria-label="Remove season special"
                  >
                    <FiMinus className="h-4 w-4" />
                    <span className="ml-1">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add Season Special Button */}
            <div className="mt-4 text-center sm:text-left">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    seasonSpecial: [
                      ...prev.seasonSpecial,
                      { image: null, productId: "" },
                    ],
                  }))
                }
                className="py-2 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add Season Special</span>
              </button>
            </div>
          </div>
          <div className="mt-5">
            <label
              htmlFor="newProducts"
              className="block text-lg font-medium mb-3"
            >
              New Products
            </label>

            {formData.newProducts.map((product, index) => (
              <div
                key={index}
                className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {/* Product Selector and Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Left Column - Product Selector */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((product) => ({
                        value: product._id,
                        label: product.name,
                      }))}
                      value={
                        product.productId && {
                          value: product.productId._id || product.productId,
                          label:
                            products?.data.find(
                              (p) => p._id === product.productId
                            )?.name || "Select Product",
                        }
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            newProducts: prev.newProducts.map((item, i) =>
                              i === index
                                ? { ...item, productId: selectedOption.value }
                                : item
                            ),
                          };
                        });
                      }}
                      className="w-full p-0 dark:bg-gray-700 text-black rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />

                    {/* Display Product Name below selector */}
                    {product.productId &&
                      products?.data.find((p) => p._id === product.productId)
                        ?.name && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-md">
                          <p className="text-sm font-medium">
                            {
                              products?.data.find(
                                (p) => p._id === product.productId
                              )?.name
                            }
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Right Column - Image Upload and Preview */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Product Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => handleNewProductsImageChange(e, index)}
                      className="w-full p-2 pagination rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                    />

                    {/* Image Preview */}
                    <div className="mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {formData.newProducts[index].image ? (
                        <div className="relative h-full w-full">
                          <img
                            src={
                              formData.newProducts[index].preview ||
                              (formData.newProducts[index].image instanceof File
                                ? URL.createObjectURL(
                                    formData.newProducts[index].image
                                  )
                                : `${BASE_URL}/${formData.newProducts[index].image}`)
                            }
                            alt="New Product Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewProductsImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                            aria-label="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-sm">No image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        newProducts: prev.newProducts.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
                    aria-label="Remove new product"
                  >
                    <FiMinus className="h-4 w-4" />
                    <span className="ml-1">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Product Button */}
            <div className="mt-4 text-center sm:text-left">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    newProducts: [
                      ...prev.newProducts,
                      { image: null, productId: "" },
                    ],
                  }))
                }
                className="py-2 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>
          <div className="mt-8 border-t-2 border-gray-700"></div>

          <div className="mt-5">
            <label
              htmlFor="featureAds"
              className="block text-lg font-medium mb-3"
            >
              Feature Ads
            </label>

            {formData.featureAds.map((ad, index) => (
              <div
                key={index}
                className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                {/* Product Selector, Description and Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Left Column - Product Selector and Description */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((product) => ({
                        value: product._id,
                        label: product.name,
                      }))}
                      value={
                        ad.productId && {
                          value: ad.productId._id || ad.productId,
                          label:
                            products?.data.find((p) => p._id === ad.productId)
                              ?.name || "Select Product",
                        }
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => {
                          const updatedFeatureAds = prev.featureAds.map(
                            (ad, i) =>
                              i === index
                                ? { ...ad, productId: selectedOption.value }
                                : ad
                          );
                          return { ...prev, featureAds: updatedFeatureAds };
                        });
                      }}
                      className="w-full p-0 dark:bg-gray-700 text-black rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />

                    {/* Display Product Name below selector */}
                    {/* {ad.productId && products?.data.find((p) => p._id === ad.productId)?.name && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-md">
              <p className="text-sm font-medium">
                {products?.data.find((p) => p._id === ad.productId)?.name}
              </p>
            </div>
          )} */}

                    {/* Description Field */}
                    <div className="mt-4">
                      <label className="text-sm font-medium mb-1 block">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={ad.description}
                        onChange={(e) => {
                          setFormData((prev) => {
                            const updatedFeatureAds = prev.featureAds.map(
                              (ad, i) =>
                                i === index
                                  ? { ...ad, description: e.target.value }
                                  : ad
                            );
                            return { ...prev, featureAds: updatedFeatureAds };
                          });
                        }}
                        className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple dark:bg-gray-700 dark:text-white"
                        placeholder="Enter description"
                        rows="3"
                      />
                    </div>
                  </div>

                  {/* Right Column - Image Upload and Preview */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Feature Ad Image
                    </label>
                    <input
                      type="file"
                      name="productImage"
                      onChange={(e) => handleFeatureAdImageChange(e, index)}
                      className="w-full p-2 pagination rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                    />

                    {/* Image Preview */}
                    <div className="mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {formData.featureAds[index].productImage ? (
                        <div className="relative h-full w-full">
                          <img
                            src={
                              formData.featureAds[index].preview ||
                              (formData.featureAds[index]
                                .productImage instanceof File
                                ? URL.createObjectURL(
                                    formData.featureAds[index].productImage
                                  )
                                : `${BASE_URL}/${formData.featureAds[index].productImage}`)
                            }
                            alt="Feature Ad Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeatureAdImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                            aria-label="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-sm">No image selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        featureAds: prev.featureAds.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center"
                    aria-label="Remove feature ad"
                  >
                    <FiMinus className="h-4 w-4" />
                    <span className="ml-1">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add Feature Ad Button */}
            <div className="mt-4 text-center sm:text-left">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    featureAds: [
                      ...prev.featureAds,
                      { productId: "", productImage: null, description: "" },
                    ],
                  }))
                }
                className="py-2 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                <span>Add Feature Ad</span>
              </button>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-gray-700"></div>

          <div className="mt-5">
            <label
              htmlFor="massiveSell"
              className="block text-lg font-medium mb-3"
            >
              Massive Sell
            </label>

            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              {/* Two Column Layout for Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Left Column - Heading, Subheading, and Product Selector */}
                <div className="space-y-4">
                  {/* Heading Field */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Heading
                    </label>
                    <input
                      type="text"
                      name="heading"
                      value={formData.massiveSell.heading}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          massiveSell: {
                            ...prev.massiveSell,
                            heading: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple dark:bg-gray-700 dark:text-white"
                      placeholder="Enter heading"
                    />
                  </div>

                  {/* Subheading Field */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Subheading
                    </label>
                    <input
                      type="text"
                      name="subHeading"
                      value={formData.massiveSell.subHeading}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          massiveSell: {
                            ...prev.massiveSell,
                            subHeading: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple dark:bg-gray-700 dark:text-white"
                      placeholder="Enter subheading"
                    />
                  </div>

                  {/* Product Selector */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((product) => ({
                        value: product._id,
                        label: product.name,
                      }))}
                      value={
                        formData.massiveSell.productId
                          ? {
                              value:
                                formData.massiveSell.productId._id ||
                                formData.massiveSell.productId,
                              label:
                                products?.data.find(
                                  (p) =>
                                    p._id === formData.massiveSell.productId
                                )?.name || "Select Product",
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => ({
                          ...prev,
                          massiveSell: {
                            ...prev.massiveSell,
                            productId: selectedOption.value,
                          },
                        }));
                      }}
                      className="w-full p-0 dark:bg-gray-700 text-black rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />
                  </div>
                </div>

                {/* Right Column - Image Upload and Preview */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Massive Sell Image
                  </label>
                  <input
                    type="file"
                    name="massiveSellImage"
                    onChange={(e) => handleMassiveSellImageChange(e)}
                    className="w-full p-2 pagination rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                  />

                  {/* Image Preview */}
                  <div className="mt-8 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {formData.massiveSell.image ? (
                      <div className="relative h-full w-full">
                        <img
                          src={
                            formData.massiveSell.preview ||
                            (formData.massiveSell.image instanceof File
                              ? URL.createObjectURL(formData.massiveSell.image)
                              : `${BASE_URL}/${formData.massiveSell.image}`)
                          }
                          alt="Massive Sell Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMassiveSellImage()}
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-sm">No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t-2 border-gray-700"></div>

          <div className="mt-5">
            <h2 className="mb-6 text-lg font-medium">
              Exclusive Product Offer
            </h2>

            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              {/* Section Heading */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">
                  Section Heading
                </label>
                <input
                  type="text"
                  name="sectionHeading"
                  value={formData.exclusiveProductOffer.sectionHeading}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      exclusiveProductOffer: {
                        ...prev.exclusiveProductOffer,
                        sectionHeading: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple dark:bg-gray-700 dark:text-white"
                  placeholder="Enter section heading"
                />
              </div>

              {/* Product List */}
              {formData.exclusiveProductOffer.products.map((product, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md mb-4 flex flex-col md:flex-row gap-4"
                >
                  {/* Left Side: Select Product */}
                  <div className="w-full md:w-1/2">
                    <label className="text-sm font-medium mb-1 block">
                      Select Product
                    </label>
                    <Select
                      name="productId"
                      options={products?.data.map((p) => ({
                        value: p._id,
                        label: p.name,
                      }))}
                      value={
                        product.productId
                          ? {
                              value: product.productId._id || product.productId,
                              label:
                                products?.data.find(
                                  (p) => p._id === product.productId
                                )?.name || "Select Product",
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        setFormData((prev) => {
                          const updatedProducts =
                            prev.exclusiveProductOffer.products.map((prod, i) =>
                              i === index
                                ? {
                                    ...prod,
                                    productId: selectedOption.value,
                                    productName: selectedOption.label,
                                  }
                                : prod
                            );
                          return {
                            ...prev,
                            exclusiveProductOffer: {
                              ...prev.exclusiveProductOffer,
                              products: updatedProducts,
                            },
                          };
                        });
                      }}
                      className="w-full p-0 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                      isSearchable={true}
                    />
                  </div>

                  {/* Right Side: Product Image Upload */}
                  <div className="w-full md:w-1/2">
                    <label className="text-sm font-medium mb-1 block">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      name="productImage"
                      onChange={(e) =>
                        handleExclusiveProductImageChange(e, index)
                      }
                      className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                    />

                    {/* Image Preview */}
                    {product.productImage && (
                      <div className="relative mt-2 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img
                          src={
                            product.productImage instanceof File
                              ? URL.createObjectURL(product.productImage)
                              : `${BASE_URL}/${product.productImage}`
                          }
                          alt="Exclusive Product Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveExclusiveProductImage(index)
                          }
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Product Button */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    exclusiveProductOffer: {
                      ...prev.exclusiveProductOffer,
                      products: [
                        ...prev.exclusiveProductOffer.products,
                        { productId: "", productName: "", productImage: null },
                      ],
                    },
                  }))
                }
                className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >
                Add Product
              </button>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-gray-700"></div>

          <div className="mb-6 mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
            <label
              htmlFor="mobileAppLink"
              className="block text-lg font-medium"
            >
              Mobile App Link
            </label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  placeholder="Enter heading"
                  value={formData.mobileAppLink.heading}
                  onChange={(e) =>
                    handleInputChange(e, null, null, "heading", "mobileAppLink")
                  }
                  className="p-3 dark:text-white inputbg rounded-md border border-gray-500 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-customPurple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subheading
                </label>
                <input
                  type="text"
                  name="subHeading"
                  placeholder="Enter subheading"
                  value={formData.mobileAppLink.subHeading}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      null,
                      null,
                      "subHeading",
                      "mobileAppLink"
                    )
                  }
                  className="p-3 dark:text-white inputbg rounded-md border border-gray-500 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-customPurple"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-gray-700"></div>

          <div className="mt-5">
            <h2 className="text-lg font-semibold mb-4">Banner Bottom</h2>

            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Left Column - Title and Product Selector */}
                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.bannerBottom.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bannerBottom: {
                            ...prev.bannerBottom,
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple dark:bg-gray-700 dark:text-white"
                      placeholder="Enter banner title"
                    />
                  </div>
                </div>

                {/* Right Column - Add Banner Image Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bannerBottom: {
                          ...prev.bannerBottom,
                          images: [
                            ...prev.bannerBottom.images,
                            { productId: "", image: null },
                          ],
                        },
                      }))
                    }
                    className="py-1 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                  >
                    + Banner
                  </button>
                </div>
              </div>

              {/* Banner Images List */}
              <div className="space-y-6">
                {formData.bannerBottom.images.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md relative"
                  >
                    {/* Remove Image Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          bannerBottom: {
                            ...prev.bannerBottom,
                            images: prev.bannerBottom.images.filter(
                              (_, i) => i !== index
                            ),
                          },
                        }))
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white text-sm py-1 px-3 rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Select Product */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Product
                        </label>
                        <Select
                          name="productId"
                          options={products?.data.map((p) => ({
                            value: p._id,
                            label: p.name,
                          }))}
                          value={
                            item.productId
                              ? {
                                  value: item.productId._id || item.productId,
                                  label:
                                    products?.data.find(
                                      (p) => p._id === item.productId
                                    )?.name || "Select Product",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            setFormData((prev) => {
                              const updatedImages =
                                prev.bannerBottom.images.map((img, i) =>
                                  i === index
                                    ? {
                                        ...img,
                                        productId: selectedOption.value,
                                      }
                                    : img
                                );

                              return {
                                ...prev,
                                bannerBottom: {
                                  ...prev.bannerBottom,
                                  images: updatedImages,
                                },
                              };
                            });
                          }}
                          className="w-full p-0 rounded-md border border-gray-600 shadow-md"
                          isSearchable={true}
                        />
                      </div>

                      {/* Upload Image */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          name="bannerBottomImage"
                          onChange={(e) =>
                            handleBannerBottomImageChange(e, index)
                          }
                          className="w-full p-2 rounded-md border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-customPurple"
                        />

                        {/* Image Preview */}
                        <div className="mt-8 h-32 w-full border border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          {item.image ? (
                            <div className="relative h-full w-full">
                              <img
                                src={
                                  item.image instanceof File
                                    ? URL.createObjectURL(item.image)
                                    : `${BASE_URL}/${item.image}`
                                }
                                alt="Banner Bottom Preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveBannerBottomImage(index)
                                }
                                className="absolute top-2 right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full w-6 h-6 flex items-center justify-center"
                                aria-label="Remove image"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <span className="text-sm">No image selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-customBlue text-white py-2 px-4 rounded-lg hover:bg-customBlue/80 focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50 w-full sm:w-auto"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default BuyerDashboardForm;
