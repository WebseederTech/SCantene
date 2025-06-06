// pages/admin/SubCategoryList.js
import { useState, useEffect } from "react";
import {
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useFetchSubCategoriesQuery,
} from "../../redux/api/subCategoryApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SubCategoryForm from "../../components/SubCategoryForm";
import Modal from "../../components/Modal";
import { BASE_URL } from "../../redux/constants";
import { Tag } from "lucide-react";

const SubCategoryList = () => {
  const { data: categories = [] } = useFetchCategoriesQuery();
  const { data: fetchedSubCategories = [] } = useFetchSubCategoriesQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const createdBy = userInfo._id;

  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingImage, setUpdatingImage] = useState(null);
  const [updatingKeywords, setUpdatingKeywords] = useState("");
  const [updatingCategoryId, setUpdatingCategoryId] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  useEffect(() => {
  console.log("Fetched categories:", categories);
}, [categories]);

  useEffect(() => {
    const filtered = userInfo.role === "Seller"
      ? fetchedSubCategories.filter((sc) => sc.createdBy === createdBy)
      : fetchedSubCategories;

    setSubCategoriesList(filtered);
  }, [fetchedSubCategories, createdBy, userInfo.role]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !categoryId) {
      toast.error("Name and Category are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("keywords", keywords);
    formData.append("createdBy", createdBy);
    formData.append("category", categoryId);
    if (image) formData.append("image", image);

    console.log(categories);
    try {
      const res = await createSubCategory(formData).unwrap();
      setSubCategoriesList((prev) => [...prev, res]);
      setName("");
      setImage(null);
      setKeywords("");
      setCategoryId("");
      toast.success("SubCategory created");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", updatingName);
    formData.append("keywords", updatingKeywords);
    formData.append("category", updatingCategoryId);
    if (updatingImage) formData.append("image", updatingImage);

    try {
      const res = await updateSubCategory({
        subCategoryId: selectedSubCategory._id,
        updatedSubCategory: formData,
      }).unwrap();

      setSubCategoriesList((prev) =>
        prev.map((sc) =>
          sc._id === selectedSubCategory._id ? res.data : sc
        )
      );

      toast.success("Updated successfully");
      setModalVisible(false);
      resetUpdateFields();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteSubCategory(selectedSubCategory._id).unwrap();
      setSubCategoriesList((prev) =>
        prev.filter((sc) => sc._id !== selectedSubCategory._id)
      );
      toast.success("Deleted successfully");
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const resetUpdateFields = () => {
    setSelectedSubCategory(null);
    setUpdatingName("");
    setUpdatingImage(null);
    setUpdatingKeywords("");
    setUpdatingCategoryId("");
  };

  return (
    <div className="min-h-screen px-6">
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Manage SubCategories</h2>
        <SubCategoryForm
          name={name}
          setName={setName}
          image={image}
          setImage={setImage}
          keywords={keywords}
          setKeywords={setKeywords}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          handleSubmit={handleCreate}
          categoryOptions={categories}
        />

        <hr className="my-6" />

<div className="px-6 py-5 bg-gray-50 dark:bg-gray-900 mt-5">
  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
    Your Subcategories
  </h3>

  {subCategoriesList?.length === 0 ? (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <p>No subcategories found. Create your first subcategory above.</p>
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {subCategoriesList.map((sub) => (
        <button
          key={sub._id}
          onClick={() => {
            setSelectedSubCategory(sub);
            setUpdatingName(sub.name);
            setUpdatingKeywords(sub.keywords || "");
            setUpdatingCategoryId(sub.category._id);
            setUpdatingImage(sub.image || null);
            setModalVisible(true);
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-2"
        >
          {sub.image ? (
            <img
              src={`${BASE_URL}/${sub.image}`}
              alt={sub.name}
              className="w-16 h-16 object-cover rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Tag size={24} className="text-gray-400" />
            </div>
          )}
<span
  title={sub.name}
  className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm md:text-base text-center break-words leading-tight w-full"
>
  {sub.name}
</span>

        </button>
      ))}
    </div>
  )}
</div>


        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <SubCategoryForm
            name={updatingName}
            setName={setUpdatingName}
            image={updatingImage}
            setImage={setUpdatingImage}
            keywords={updatingKeywords}
            setKeywords={setUpdatingKeywords}
            categoryId={updatingCategoryId}
            setCategoryId={setUpdatingCategoryId}
            handleSubmit={handleUpdate}
            handleDelete={handleDelete}
            buttonText="Update"
            categoryOptions={categories}
          />
        </Modal>
      </div>
    </div>
  );
};

export default SubCategoryList;
