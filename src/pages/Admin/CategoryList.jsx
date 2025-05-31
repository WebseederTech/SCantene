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

// const CategoryList = () => {
//   const { data: fetchedCategories } = useFetchCategoriesQuery();
//   const { userInfo } = useSelector((state) => state.auth);
//   const createdBy = userInfo._id;

//   const [categoriesList, setCategoriesList] = useState([]);
//   const [name, setName] = useState("");
//   const [image, setImage] = useState(null);
//   const [keywords, setKeywords] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [updatingName, setUpdatingName] = useState("");
//   const [updatingImage, setUpdatingImage] = useState(null);
//   const [updatingKeywords, setUpdatingKeywords] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);

//   const [createCategory] = useCreateCategoryMutation();
//   const [updateCategory] = useUpdateCategoryMutation();
//   const [deleteCategory] = useDeleteCategoryMutation();

//   useEffect(() => {
//     if (fetchedCategories) {
//       const filteredCategories =
//         userInfo.role === "Seller"
//           ? fetchedCategories.filter((cate) => cate.createdBy === createdBy)
//           : fetchedCategories;
//       setCategoriesList(filteredCategories);
//     }
//   }, [fetchedCategories, createdBy, userInfo.role]);

//   const handleCreateCategory = async (e) => {
//     e.preventDefault();

//     if (!name) {
//       toast.error("Category name is required");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("createdBy", createdBy);
//     formData.append("keywords", keywords);
//     if (image) {
//       formData.append("image", image);
//     }

//     try {
//       const result = await createCategory(formData).unwrap();
//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         setCategoriesList((prev) => [...prev, result]);
//         setName("");
//         setImage(null);
//         setKeywords("");
//         toast.success(`${result.name} is created.`);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Creating category failed, try again.");
//     }
//   };

//   const handleUpdateCategory = async (e) => {
//     e.preventDefault();

//     if (!updatingName) {
//       toast.error("Category name is required");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", updatingName);
//     formData.append("keywords", updatingKeywords);
//     if (updatingImage) {
//       formData.append("image", updatingImage);
//     }

//     try {
//       const result = await updateCategory({
//         categoryId: selectedCategory._id,
//         updatedCategory: formData,
//       }).unwrap();

//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         setCategoriesList((prev) =>
//           prev.map((cat) =>
//             cat._id === selectedCategory._id
//               ? { ...cat, name: result.name, image: result.image, keywords: result.keywords }
//               : cat
//           )
//         );
//         toast.success(`${result.name} is updated`);
//         setSelectedCategory(null);
//         setUpdatingName("");
//         setUpdatingImage(null);
//         setUpdatingKeywords("");
//         setModalVisible(false);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDeleteCategory = async () => {
//     try {
//       const result = await deleteCategory(selectedCategory._id).unwrap();
//       if (result.error) {
//         toast.error(result.error);
//       } else {
//         setCategoriesList((prev) => prev.filter((cat) => cat._id !== selectedCategory._id));
//         toast.success(`${result.name} is deleted.`);
//         setSelectedCategory(null);
//         setModalVisible(false);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Category deletion failed. Try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center darktheme px-6">
//       <section className="w-full lg:w-[85%] darktheme bg-opacity-50 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-gray-600 ">
//         <div className="md:w-1/4 p-3 mt-2">
//           <AdminMenu />
//         </div>
//         <h2 className="text-2xl font-semibold mb-6 text-center text-customBlue">Manage Categories</h2>
//         <CategoryForm
//           value={name}
//           setValue={setName}
//           handleSubmit={handleCreateCategory}
//           image={image}
//           setImage={setImage}
//           keywords={keywords}
//           setKeywords={setKeywords}
//         />

//         <hr className="my-4" />

//         <div className="flex flex-wrap">
//           {categoriesList?.map((category) => (
//             <div key={category._id}>
//               <button
//                 className="bg-white border border-customBlue text-customBlue py-2 px-4 rounded-lg m-3 hover:bg-customBlue hover:text-white focus:outline-none focus:ring-2 focus:ring-customBlue focus:ring-opacity-50"
//                 onClick={() => {
//                   setModalVisible(true);
//                   setSelectedCategory(category);
//                   setUpdatingName(category.name);
//                   setUpdatingImage(null);
//                   setUpdatingKeywords(category.keywords || "");
//                 }}
//               >
//                 {category.name}
//               </button>
//             </div>
//           ))}
//         </div>

//         <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
//           <CategoryForm
//             value={updatingName}
//             setValue={setUpdatingName}
//             handleSubmit={handleUpdateCategory}
//             image={updatingImage}
//             setImage={setUpdatingImage}
//             keywords={updatingKeywords}
//             setKeywords={setUpdatingKeywords}
//             buttonText="Update"
//             handleDelete={handleDeleteCategory}
//           />
//         </Modal>
//       </section>
//     </div>
//   );
// };

// export default CategoryList;


const CategoryList = () => {
  const { data: fetchedCategories } = useFetchCategoriesQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const createdBy = userInfo._id;

  const [categoriesList, setCategoriesList] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingImage, setUpdatingImage] = useState(null);
  const [updatingKeywords, setUpdatingKeywords] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

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
              ? { ...cat, name: result.name, image: result.image, keywords: result.keywords }
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
        setCategoriesList((prev) => prev.filter((cat) => cat._id !== selectedCategory._id));
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Category deletion failed. Try again.");
    }
  };

  // Added AdminMenu component as a placeholder
  // const AdminMenu = () => (
  //   <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  //     <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Menu</h3>
  //     <nav className="flex flex-col space-y-1">
  //       <a href="#" className="px-4 py-2 text-sm rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium">Categories</a>
  //       <a href="#" className="px-4 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Products</a>
  //       <a href="#" className="px-4 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Orders</a>
  //       <a href="#" className="px-4 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Users</a>
  //     </nav>
  //   </div>
  // );

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4">
         {/* <AdminMenu /> */}
        <div className="w-full  gap-6">
        
          
          <div className="md:col-span-3">
            <div className="bg-white overflow-hidden dark:bg-gray-800 rounded-lg shadow ">
              {/* <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Manage Categories</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create, update or delete categories for your products
                </p>
              </div> */}
              
              <div className="">
                <CategoryForm
                  value={name}
                  setValue={setName}
                  handleSubmit={handleCreateCategory}
                  image={image}
                  setImage={setImage}
                  keywords={keywords}
                  setKeywords={setKeywords}
                />
              </div>

              
              <div className="px-6 py-5 bg-gray-50 dark:bg-gray-900 mt-5">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Your Categories
                </h3>
                
                {categoriesList?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No categories found. Create your first category above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categoriesList?.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => {
                          setModalVisible(true);
                          setSelectedCategory(category);
                          setUpdatingName(category.name);
                          setUpdatingImage(null);
                          setUpdatingKeywords(category.keywords || "");
                        }}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-2"
                      >
                        {/* {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded-full border-2 border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Tag size={24} className="text-gray-400" />
                          </div>
                        )} */}
                        <span className="font-medium text-gray-800 dark:text-white">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <CategoryForm
          value={updatingName}
          setValue={setUpdatingName}
          handleSubmit={handleUpdateCategory}
          image={updatingImage}
          setImage={setUpdatingImage}
          keywords={updatingKeywords}
          setKeywords={setUpdatingKeywords}
          buttonText="Update"
          handleDelete={handleDeleteCategory}
        />
      </Modal>
    </div>
  );
};

export default CategoryList;