import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const ImportProducts = ({
  userInfo,
  setIsLoader,
  brandList, // Pass brand list directly from parent component
  categoryList, // Pass category list directly from parent component
  subCategories
}) => {
  const [brandMap, setBrandMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [subCategoryMap, setSubCategoryMap] = useState({});

  // Create case-insensitive maps when component mounts or lists change
  useEffect(() => {
    // Create brand map with case-insensitive keys
    const newBrandMap = brandList?.reduce((acc, brand) => {
      acc[brand.name.trim().toLowerCase()] = brand;
      return acc;
    }, {});
    setBrandMap(newBrandMap || {});

    // Create category map with case-insensitive keys
    const newCategoryMap = categoryList?.reduce((acc, category) => {
      acc[category.name.trim().toLowerCase()] = category;
      return acc;
    }, {});
    setCategoryMap(newCategoryMap || {});

    // Create subCategory map with case-insensitive keys
    const newSubCategoryMap = subCategories?.reduce((acc, subCategory) => {
      acc[subCategory.name.trim().toLowerCase()] = subCategory;
      return acc;
    }, {});
    setSubCategoryMap(newCategoryMap || {});

  }, [brandList, categoryList,subCategories]);


  const findCaseInsensitiveMatch = (map, name) => {
    // First, try exact match (preserving original case)
    let match = map[name];

    // If no exact match, try case-insensitive match
    if (!match) {
      match = map[name.trim().toLowerCase()];
    }

    return match;
  };

  const fetchBrandAndCategoryIds = (brandName, categoryName,subCategoryName) => {
    const brand = findCaseInsensitiveMatch(brandMap, brandName);
    const category = findCaseInsensitiveMatch(categoryMap, categoryName);
    const subCategory = findCaseInsensitiveMatch(subCategoryMap, subCategoryName);


    return {
      brandId: brand ? brand._id : null,
      categoryId: category ? category._id : null,
      brandName: brand ? brand.name : brandName,
      categoryName: category ? category.name : categoryName,
      subCategoryId: category ? category._id : null,
      subCategoryName: subCategory ? subCategory.name : subCategoryName
      
    };
  };

  const normalizeFields = (data) => {
    return data.map((row) => ({
      name: row.Name || row.name || "Unknown",
      description: row.Description || row.description || "",
      category: row.Category || row.category || "Default Category",
      subCategory: row.subCategory || row.Subcategory || "Default Category",
      brand: row.Brand || row.brand || "Default Brand",
      createdBy: row.CreatedBy || row.createdBy || "Unknown",
      mrp: row.MRP || row.mrp || 0,
      offerPrice: row.OfferPrice || row.offerPrice || 0,
      countInStock: row.CountInStock || row.countInStock || 0,
      specification: row.Specification || row.specification || "",
      aboutTheBrand: row.AboutTheBrand || row.aboutTheBrand || "",
      lowStockThreshold: row.LowStockThreshold || row.lowStockThreshold || 0,
      outOfStock: row.OutOfStock || row.outOfStock || false,
      isEnable: row.IsEnabled || row.isEnabled || true,
      createdAt: row.CreatedAt || row.createdAt || new Date().toISOString(),
      updatedAt: row.UpdatedAt || row.updatedAt || new Date().toISOString(),
      height: row.Height || row.height || 0,
      width: row.Width || row.width || 0,
      weight: row.Weight || row.weight || 0,
      breadth: row.Breadth || row.breadth || 0,
      tax: row.Tax || row.tax || 0,
    }));
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoader(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheet);

        jsonData = normalizeFields(jsonData);

        // Convert brand & category names to ObjectIds
        const transformedData = jsonData.map((item) => {
          const { brandId, categoryId, subCategoryId,brandName, categoryName , subCategoryName } =
            fetchBrandAndCategoryIds(item.brand, item.category, item.subCategory);

          return {
            ...item,
            brand: brandId || item.brand,
            category: categoryId || item.category,
            subCategory : subCategoryId || item.subCategory,
            createdBy: userInfo._id,
          };
        });

        // Additional validation and warning for unmatched brands/categories
        const unmatchedItems = transformedData.filter(
          (item) =>
            typeof item.brand === "string" || typeof item.category === "string" || typeof item.subCategory === "string"
        );

        if (unmatchedItems.length > 0) {
          const unmatchedDetails = unmatchedItems.map((item) => ({
            brand: typeof item.brand === "string" ? item.brand : "Matched",
            category:
              typeof item.category === "string" ? item.category : "Matched",
            subCategory:
              typeof item.subCategory === "string" ? item.subCategory : "Matched",
          }));

          const warningMessage =
            unmatchedItems.length > 0
              ? `Warning: The following brands/categories could not be matched:\n${unmatchedDetails
                  .map(
                    (detail) =>
                      `Brand: ${detail.brand}, Category: ${detail.category}, Sub-Category: ${detail.subCategory}`
                  )
                  .join("\n")}\n\nThese will be created as new entries.`
              : "";

          if (unmatchedItems.length > 0) {
            alert(warningMessage);
          }
        }

        if (transformedData.length === 0) {
          alert("No valid rows to import. Please check your data.");
          setIsLoader(false);
          return;
        }

        // Send to backend
        const response = await axios.post(
          `${BASE_URL}/api/products/import-products`,
          { products: transformedData },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 201) {
          alert("Products imported successfully!");
          setIsLoader(false);
        } else {
          alert("Some products could not be imported.");
          setIsLoader(false);
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error importing products:", error);
      alert("An error occurred while importing the products.");
      setIsLoader(false);
    }
  };

  return (
    <label className="bg-customBlue text-white px-4 sm:px-6 py-2 rounded-full hover:bg-customBlue/80 cursor-pointer text-sm sm:text-base">
      Import
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleImport}
        className="hidden"
      />
    </label>
  );
};

export default ImportProducts;
