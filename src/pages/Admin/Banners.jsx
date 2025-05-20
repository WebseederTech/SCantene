import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/constants";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch banners
  const fetchBanners = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/banner`);
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleFileChange = (e) => {
    const validFiles = Array.from(e.target.files).filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );
    if (validFiles.length !== e.target.files.length) {
      alert("Only JPEG and PNG files are allowed.");
    }
    setImages(validFiles);
  };

  const uploadBanner = async (url, successMessage) => {
    if (!images.length) return alert("Please select images to upload.");

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    setLoading(true);
    try {
      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(successMessage);
      setImages([]);
      fetchBanners();
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Failed to upload banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => uploadBanner(`${BASE_URL}/api/banner`, "Banner created successfully");
  const handleEdit = (id) => uploadBanner(`${BASE_URL}/api/banner/${id}`, "Banner updated successfully");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/banner/${id}`);
      alert("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center darktheme p-8">
      <section className="relative w-full max-w-7xl darktheme bg-opacity-50 rounded-xl shadow-xl p-8 border-2 border-gray-700">
        <h1 className="text-2xl font-semibold mb-8 text-center text-customBlue tracking-wide">
          Banner Manager
        </h1>

        {/* Upload New Banner */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Banner</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="px-4 py-2 dark:text-white text-black rounded-md focus:outline-none shadow-md transition duration-300 ease-in-out"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-2 px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition transform duration-300 ease-in-out disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                    />
                  </svg>
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>

        {/* Existing Banners */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Existing Banners</h2>
          {banners.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="border border-gray-600 dark:bg-gray-800 bg-gray-300 rounded-lg shadow-xl p-6 dark:hover:bg-gray-700 hover:bg-gray-200 transition duration-300"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {banner.images.map((image, index) => (
                      <img
                        key={index}
                        src={`/${image}`}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md shadow-md"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 space-x-4">
                    <button
                      onClick={() => setSelectedBanner(banner._id)}
                      className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-4">No banners available.</p>
          )}
        </div>

        {/* Edit Banner */}
        {selectedBanner && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Banner</h2>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="px-4 py-2 dark:bg-gray-700 bg-gray-300 dark:text-white text-black rounded-md focus:outline-none shadow-md"
              />
              <button
                onClick={() => handleEdit(selectedBanner)}
                disabled={loading}
                className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 transition duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                      />
                    </svg>
                  </div>
                ) : (
                  "Update"
                )}
              </button>
              <button
                onClick={() => setSelectedBanner(null)}
                className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default BannerManager;
