import { useState } from "react";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useFetchBrandsQuery,
} from "../../redux/api/brandApiSlice";

import { toast } from "react-toastify";
import BrandForm from "../../components/BrandForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import { useSelector } from "react-redux";

const BrandList = () => {
  const { data: brands = [], refetch } = useFetchBrandsQuery(); // Fetch brands
  const { userInfo } = useSelector((state) => state.auth);
  const createdBy = userInfo._id;

  // State for create form
  const [name, setName] = useState("");
  const [aboutTheBrandCreate, setAboutTheBrandCreate] = useState("");

  // State for update modal
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [aboutTheBrandUpdate, setAboutTheBrandUpdate] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const handleCreateBrand = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Brand name is required");
      return;
    }

    try {
      const result = await createBrand({ name, aboutTheBrand: aboutTheBrandCreate, createdBy }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setAboutTheBrandCreate(""); // Reset create form
        toast.success(`${result.name} is created.`);
        refetch(); // Refresh the brand list
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating brand failed, try again.");
    }
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Brand name is required");
      return;
    }

    try {
      const result = await updateBrand({
        brandId: selectedBrand._id,
        updatedBrand: { name: updatingName, aboutTheBrand: aboutTheBrandUpdate },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedBrand(null);
        setUpdatingName("");
        setAboutTheBrandUpdate("");
        setModalVisible(false);
        refetch(); // Refresh the brand list
      }
    } catch (error) {
      console.error(error);
      toast.error("Updating brand failed, try again.");
    }
  };

  const handleDeleteBrand = async () => {
    try {
      await deleteBrand(selectedBrand._id).unwrap();

      toast.success(`${selectedBrand.name} is deleted.`);
      setSelectedBrand(null);
      setAboutTheBrandUpdate("");
      setModalVisible(false);
      refetch(); // Refresh the brand list
    } catch (error) {
      console.error(error);
      toast.error("Brand deletion failed, try again.");
    }
  };

  const filteredBrands =
    brands && userInfo.role === "Seller"
      ? brands.filter((brand) => brand.createdBy === createdBy)
      : brands;

  return (
    <div className="flex flex-col items-center darktheme px-4">
      {/* <AdminMenu  /> */}
      <section className="w-full  darktheme bg-opacity-50 rounded-lg shadow-lg">
        
        {/* <h2 className="text-2xl font-semibold mb-6 text-center text-black">
          Manage Brands
        </h2> */}
        {/* Create form */}
        <BrandForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateBrand}
          aboutTheBrand={aboutTheBrandCreate}
          setAboutTheBrand={setAboutTheBrandCreate}
        />

        <hr className="my-4" />

        <div className="flex flex-wrap">
          {filteredBrands?.map((brand) => (
            <div key={brand._id}>
              <button
                className="bg-white border border-customBlue text-customBlue py-2 px-4 rounded-lg m-3 hover:bg-customBlue hover:text-white focus:outline-none foucs:ring-2 focus:ring-customBlue focus:ring-opacity-50"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedBrand(brand);
                  setUpdatingName(brand.name);
                  setAboutTheBrandUpdate(brand.aboutTheBrand); // Update modal state
                }}
              >
                {brand.name}
              </button>
            </div>
          ))}
        </div>

        {/* Update modal */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <BrandForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateBrand}
            buttonText="Update"
            handleDelete={handleDeleteBrand}
            aboutTheBrand={aboutTheBrandUpdate}
            setAboutTheBrand={setAboutTheBrandUpdate}
          />
        </Modal>
      </section>
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
