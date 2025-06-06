import { useState, useEffect } from "react";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useFetchBrandsQuery,
} from "../../redux/api/brandApiSlice";
import { toast } from "react-toastify";
import BrandForm from "../../components/BrandForm";
import Modal from "../../components/Modal";
import { useSelector } from "react-redux";
import { Tag } from "lucide-react";
import { BASE_URL } from "../../redux/constants";

const BrandList = () => {
  // Fetch all brands from the backend
  const { data: fetchedBrands } = useFetchBrandsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const createdBy = userInfo._id;

  // Local state to hold the filtered list of brands
  const [brandsList, setBrandsList] = useState([]);

  // State for the "create" form
  const [name, setName] = useState("");
  const [aboutTheBrand, setAboutTheBrand] = useState("");
  const [image, setImage] = useState(null);

  // State for the "update" modal
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingAbout, setUpdatingAbout] = useState("");
  const [updatingImage, setUpdatingImage] = useState(null);

  // Modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // RTK Query mutations
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  // Whenever fetchedBrands or the user's role changes, filter accordingly
  useEffect(() => {
    if (fetchedBrands) {
      const filtered =
        userInfo.role === "Seller"
          ? fetchedBrands.filter((brand) => brand.createdBy === createdBy)
          : fetchedBrands;
      setBrandsList(filtered);
    }
  }, [fetchedBrands, createdBy, userInfo.role]);

  // Handler to create a new brand
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Brand name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("aboutTheBrand", aboutTheBrand);
    formData.append("createdBy", createdBy);
    if (image) {
      formData.append("image", image);
    }

    try {
      const result = await createBrand(formData).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        // Append the newly created brand to local state
        setBrandsList((prev) => [...prev, result]);
        setName("");
        setAboutTheBrand("");
        setImage(null);
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating brand failed, try again.");
    }
  };

  // Handler to update an existing brand
  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Brand name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", updatingName);
    formData.append("aboutTheBrand", updatingAbout);
    if (updatingImage) {
      formData.append("image", updatingImage);
    }

    try {
      const result = await updateBrand({
        brandId: selectedBrand._id,
        updatedBrand: formData,
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        // Update the local brandsList with the updated data
        setBrandsList((prev) =>
          prev.map((b) =>
            b._id === selectedBrand._id
              ? { ...b, name: result.name, image: result.image, aboutTheBrand: result.aboutTheBrand }
              : b
          )
        );
        toast.success(`${result.name} is updated`);
        setSelectedBrand(null);
        setUpdatingName("");
        setUpdatingAbout("");
        setUpdatingImage(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Updating brand failed, try again.");
    }
  };

  // Handler to delete a brand
  const handleDeleteBrand = async () => {
    try {
      const result = await deleteBrand(selectedBrand._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        // Remove the deleted brand from local state
        setBrandsList((prev) => prev.filter((b) => b._id !== selectedBrand._id));
        toast.success(`${result.name} is deleted.`);
        setSelectedBrand(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Brand deletion failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Create Brand Form */}
        <div className="bg-white overflow-hidden dark:bg-gray-800 rounded-lg shadow">
          <div>
            <BrandForm
              value={name}
              setValue={setName}
              handleSubmit={handleCreateBrand}
              aboutTheBrand={aboutTheBrand}
              setAboutTheBrand={setAboutTheBrand}
              image={image}
              setImage={setImage}
              buttonText={isCreating ? "Creating..." : "Create"}
            />
          </div>

          {/* List of Brands */}
          <div className="px-6 py-5 bg-gray-50 dark:bg-gray-900 mt-5 rounded-b-lg">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
              Your Brands
            </h3>

            {brandsList?.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No brands found. Create your first brand above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {brandsList.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedBrand(brand);
                      setUpdatingName(brand.name);
                      setUpdatingAbout(brand.aboutTheBrand || "");
                      setUpdatingImage(brand.image || null);
                    }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-2"
                  >
                    {brand.image ? (
                      <img
                        src={`${BASE_URL}/${brand.image}`}
                        alt={brand.name}
                        className="w-16 h-16 object-cover rounded-full border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Tag size={24} className="text-gray-400" />
                      </div>
                    )}
                    <span className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm md:text-base text-center break-words leading-tight w-full">
                      {brand.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <BrandForm
          value={updatingName}
          setValue={setUpdatingName}
          handleSubmit={handleUpdateBrand}
          buttonText={isUpdating ? "Updating..." : "Update"}
          handleDelete={handleDeleteBrand}
          image={updatingImage}
          setImage={setUpdatingImage}
          aboutTheBrand={updatingAbout}
          setAboutTheBrand={setUpdatingAbout}
        />
      </Modal>
    </div>
  );
};

export default BrandList;


// import { useState } from "react";
// import {
//   useCreateBrandMutation,
//   useUpdateBrandMutation,
//   useDeleteBrandMutation,
//   useFetchBrandsQuery,
// } from "../../redux/api/brandApiSlice";

// import { toast } from "react-toastify";
// import BrandForm from "../../components/BrandForm";
// import Modal from "../../components/Modal";
// import AdminMenu from "./AdminMenu";
// import { useSelector } from "react-redux";
// import { Pencil, Trash2 } from "lucide-react";

// const BrandList = () => {
//   const { data: brands = [], refetch } = useFetchBrandsQuery();
//   const { userInfo } = useSelector((state) => state.auth);
//   const createdBy = userInfo._id;

//   const [name, setName] = useState("");
//   const [aboutTheBrandCreate, setAboutTheBrandCreate] = useState("");

//   const [selectedBrand, setSelectedBrand] = useState(null);
//   const [updatingName, setUpdatingName] = useState("");
//   const [aboutTheBrandUpdate, setAboutTheBrandUpdate] = useState("");

//   const [modalVisible, setModalVisible] = useState(false);

//   const [createBrand] = useCreateBrandMutation();
//   const [updateBrand] = useUpdateBrandMutation();
//   const [deleteBrand] = useDeleteBrandMutation();

//   const handleCreateBrand = async (e) => {
//     e.preventDefault();
//     if (!name) return toast.error("Brand name is required");

//     try {
//       const result = await createBrand({
//         name,
//         aboutTheBrand: aboutTheBrandCreate,
//         createdBy,
//       }).unwrap();

//       setName("");
//       setAboutTheBrandCreate("");
//       toast.success(`${result.name} created`);
//       refetch();
//     } catch {
//       toast.error("Creating brand failed, try again.");
//     }
//   };

//   const handleUpdateBrand = async (e) => {
//     e.preventDefault();
//     if (!updatingName) return toast.error("Brand name is required");

//     try {
//       const result = await updateBrand({
//         brandId: selectedBrand._id,
//         updatedBrand: {
//           name: updatingName,
//           aboutTheBrand: aboutTheBrandUpdate,
//         },
//       }).unwrap();

//       toast.success(`${result.name} updated`);
//       setSelectedBrand(null);
//       setUpdatingName("");
//       setAboutTheBrandUpdate("");
//       setModalVisible(false);
//       refetch();
//     } catch {
//       toast.error("Updating brand failed.");
//     }
//   };

//   const handleDeleteBrand = async () => {
//     try {
//       await deleteBrand(selectedBrand._id).unwrap();
//       toast.success(`${selectedBrand.name} deleted`);
//       setSelectedBrand(null);
//       setModalVisible(false);
//       refetch();
//     } catch {
//       toast.error("Deleting brand failed.");
//     }
//   };

//   const filteredBrands =
//     brands && userInfo.role === "Seller"
//       ? brands.filter((b) => b.createdBy === createdBy)
//       : brands;

//   return (
//     <div className="flex flex-col items-center darktheme px-4 py-6 sm:px-6 lg:px-8">
//       <AdminMenu />
//       <div className="w-full max-w-6xl space-y-8">
//         <div className="flex flex-col md:flex-row gap-6">

//           <div className="flex-1 bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-300 dark:border-gray-700 p-6">
//             <h2 className="text-2xl font-bold text-center text-customBlue mb-4">
//               Manage Brands
//             </h2>

//             <BrandForm
//               value={name}
//               setValue={setName}
//               handleSubmit={handleCreateBrand}
//               aboutTheBrand={aboutTheBrandCreate}
//               setAboutTheBrand={setAboutTheBrandCreate}
//             />

//             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {filteredBrands.map((brand) => (
//                 <div
//                   key={brand._id}
//                   className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition duration-200 flex justify-between items-center"
//                 >
//                   <span className="font-semibold text-lg text-customBlue">
//                     {brand.name}
//                   </span>
//                   <button
//                     onClick={() => {
//                       setSelectedBrand(brand);
//                       setUpdatingName(brand.name);
//                       setAboutTheBrandUpdate(brand.aboutTheBrand);
//                       setModalVisible(true);
//                     }}
//                     className="text-customBlue hover:text-blue-700"
//                     aria-label="Edit"
//                   >
//                     <Pencil size={18} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for update */}
//       <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
//         <BrandForm
//           value={updatingName}
//           setValue={setUpdatingName}
//           handleSubmit={handleUpdateBrand}
//           buttonText="Update"
//           handleDelete={handleDeleteBrand}
//           aboutTheBrand={aboutTheBrandUpdate}
//           setAboutTheBrand={setAboutTheBrandUpdate}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default BrandList;
