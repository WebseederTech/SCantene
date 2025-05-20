import { useState, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const AllCategories = () => {
  const { data: fetchedCategories } = useFetchCategoriesQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const createdBy = userInfo._id;
  const navigate = useNavigate()

  const [categoriesList, setCategoriesList] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingImage, setUpdatingImage] = useState(null);
  const [updatingKeywords, setUpdatingKeywords] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  useEffect(() => {
    if (fetchedCategories) {
      const filteredCategories =
        userInfo.role === "Seller"
          ? fetchedCategories.filter((cate) => cate.createdBy === createdBy)
          : fetchedCategories;
      setCategoriesList(filteredCategories);
    }
  }, [fetchedCategories, createdBy, userInfo.role]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("createdBy", createdBy);
    formData.append("keywords", keywords);
    if (image) {
      formData.append("image", image);
    }

    try {
      const result = await createCategory(formData).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setCategoriesList((prev) => [...prev, result]);
        setName("");
        setImage(null);
        setKeywords("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", updatingName);
    formData.append("keywords", updatingKeywords);
    if (updatingImage) {
      formData.append("image", updatingImage);
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: formData,
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        setCategoriesList((prev) =>
          prev.map((cat) =>
            cat._id === selectedCategory._id
              ? {
                  ...cat,
                  name: result.name,
                  image: result.image,
                  keywords: result.keywords,
                }
              : cat
          )
        );
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setUpdatingImage(null);
        setUpdatingKeywords("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setCategoriesList((prev) =>
          prev.filter((cat) => cat._id !== selectedCategory._id)
        );
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdatingImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUpdatingImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center darktheme px-6">
      <section className="w-full lg:w-[85%] darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600">
        {/* <div className="md:w-1/4 p-3 mt-2"><AdminMenu /></div> */}
        <h2 className="text-2xl font-semibold mb-6 text-center text-customBlue">
          All Categories
        </h2>

        <hr className="my-4 border-gray-600" />

        <h3 className="text-xl font-medium mb-4 text-white">Category List</h3>
        <div className="bg-white min-h-screen">
          {/* Categories grid */}
          <div className="px-4 py-2">
            <div className="grid  grid-cols-2 md:grid-cols-4  gap-4">
              {categoriesList?.map((category) => (
                <div
                  key={category._id}
                  className="flex flex-col items-center"
                  onClick={() => navigate(`/category/${category.name}/${category._id}`)}
                  >
                  <div className="bg-blue-50 rounded-full h-40 w-40 flex items-center justify-center mb-4 overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="object-cover h-40 w-40"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <p className="text-center text-md font-medium truncate w-full">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllCategories;
