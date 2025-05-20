import React from 'react';
import * as ExcelJS from 'exceljs';
import moment from 'moment';
import { htmlToText } from 'html-to-text';

const ExportProducts = ({ 
  filteredProducts, 
  brandList, 
  categoryList 
}) => {
  const handleExportToExcel = async () => {
    // Prepare the data for export
    const data = filteredProducts.map((product) => ({
      Name: product.name,
      Description: product.description,
      // Format: BrandName - BrandId
      Brand: product.brand
        ? `${product.brand.name} - ${product.brand._id}`
        : "",
      Category: product.category
        ? `${product.category.name} - ${product.category._id}`
        : "",
      MRP: product.mrp,
      OfferPrice: product.offerPrice,
      CountInStock: product.countInStock,
      Specification: htmlToText(product.specification || "", {
        wordwrap: false,
      }),
      AboutTheBrand: htmlToText(product.aboutTheBrand || "", {
        wordwrap: false,
      }),
      LowStockThreshold: product.lowStockThreshold,
      CreatedBy: product.createdBy,
      OutOfStock: product.outOfStock,
      IsEnabled: product.isEnable,
      Height: product.height,
      Width: product.width,
      Weight: product.weight,
      Breadth: product.breadth,
      Tax: product.tax,
      CreatedAt: moment(product.createdAt).format("YYYY-MM-DD"),
      UpdatedAt: moment(product.updatedAt).format("YYYY-MM-DD"),
    }));

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    // Prepare dropdown data (using display names only)
    const brandDropdownOptions = brandList.map((brand) => {
      return brand.name + " - " + brand._id;
    });
    const categoryDropdownOptions = categoryList.map((category) => {
      return category.name + " - " + category._id;
    });

    // Add headers
    const headers = [
      "Name", "Description", "Brand", "Category", "MRP", "OfferPrice", 
      "CountInStock", "Specification", "AboutTheBrand", "LowStockThreshold", 
      "CreatedBy", "OutOfStock", "IsEnabled", "Height", "Width", "Weight", 
      "Breadth", "Tax", "CreatedAt", "UpdatedAt"
    ];
    worksheet.addRow(headers);

    // Set column widths and style header
    worksheet.columns.forEach((column) => {
      column.width = 18;
    });

    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFADD8E6" },
    };

    // Add data rows
    data.forEach((item) => {
      worksheet.addRow(Object.values(item));
    });

    // Add data validations for Brand dropdown
    worksheet.dataValidations.add("C2:C99999", {
      type: "list",
      allowBlank: false,
      formulae: [`"${brandDropdownOptions.join(",")}"`],
    });

    // Add data validations for Category dropdown
    worksheet.dataValidations.add("D2:D99999", {
      type: "list",
      allowBlank: false,
      formulae: [`"${categoryDropdownOptions.join(",")}"`],
    });

    // Style cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = {
          name: "Inter",
          size: 8,
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });
    });

    // Generate and download the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.xlsx";
    document.body.appendChild(link);
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExportToExcel}
      className="bg-customBlue text-white px-4 sm:px-6 py-2 rounded-full hover:bg-customBlue/80 text-sm sm:text-base"
    >
      Export
    </button>
  );
};

export default ExportProducts;