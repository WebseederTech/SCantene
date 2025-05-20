// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import Navigation from "./pages/Auth/Navigation";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import RetailerNav from "./pages/Retailer/RetailerNav";
// import RetailerFooter from "./pages/Retailer/RetailerFooter";

// const App = () => {
//   const location = useLocation();
//   const { userInfo } = useSelector((state) => state.auth);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(userInfo?.role === "Admin");

//   useEffect(() => {
//     if (userInfo?.role === "Admin") {
//       setIsSidebarOpen(true); // Admin sidebar is always open
//     }
//   }, [userInfo]);

//   // Redirect logic based on user role and current path
//   if (!userInfo && location.pathname !== "/login" && location.pathname !== "/register") {
//     // If not authenticated, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   // If authenticated as Admin and at root path, redirect to admin dashboard
//   if (userInfo?.role === "Admin" && location.pathname === "/") {
//     return <Navigate to="/admin/dashboard" replace />;
//   }

//   // If authenticated as Buyer and at root path, keep them at root (or redirect to appropriate buyer landing page)
//   // This is where you can change the default page for Buyers if needed

//   return (
//     <>
//       <ToastContainer />

//       {/* Sidebar Navigation */}
//       {userInfo && <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
//       {userInfo && userInfo?.role === "Buyer" && <RetailerNav />}
      
//       {/* Main Content */}
//       <main
//         className={`min-h-screen transition-all ${
//           userInfo?.role === "Admin" || isSidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         {/* Divider for Layout Spacing */}
//         {userInfo && location.pathname !== "/admin/dashboard" && (
//           <div className="mb-8 mt-2"></div>
//         )}

//         <Outlet />
//       </main>
      
//       {userInfo && userInfo?.role === "Buyer" && <RetailerFooter />}
//     </>
//   );
// };

// export default App;


// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import Navigation from "./pages/Auth/Navigation";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import RetailerNav from "./pages/Retailer/RetailerNav";
// import RetailerFooter from "./pages/Retailer/RetailerFooter";
// import Navbar from "./pages/Auth/Navbar";

// const App = () => {
//   const location = useLocation();
//   const { userInfo } = useSelector((state) => state.auth);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(userInfo?.role === "Admin");

//   useEffect(() => {
//     if (userInfo?.role === "Admin") {
//       setIsSidebarOpen(true); // Admin sidebar is always open
//     }
//   }, [userInfo]);

//   // Redirect logic based on user role and current path
//   if (!userInfo && location.pathname !== "/login" && location.pathname !== "/register") {
//     // If not authenticated, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   // If authenticated as Admin and at root path, redirect to admin dashboard
//   if (userInfo?.role === "Admin" && location.pathname === "/") {
//     return <Navigate to="/admin/dashboard" replace />;
//   }

//   // Determine if we should show sidebar
//   const showSidebar = userInfo && (userInfo.role === "Admin" || isSidebarOpen);
  
//   return (
//     <div className="flex flex-col min-h-screen">
//       <ToastContainer />
      
//       {/* Navigation Components */}
//       <div className="flex">
//         {/* Sidebar Navigation - conditional rendering */}
//         {userInfo && (
//           <Navigation />
//         )}

//         {/* Main Content Area */}
//         <main className={`flex-grow min-h-screen transition-all duration-300 ${
//           showSidebar ? "lg:ml-64" : "ml-0"
//         }`}>
//           {/* Top Retailer Navigation */}
//           {userInfo && userInfo?.role === "Buyer" && <RetailerNav />}
          
//           {/* Content Spacing */}
//           {userInfo && location.pathname !== "/admin/dashboard" && (
//             <div className="mb-8 mt-2"></div>
//           )}
          
//           {/* Main Page Content */}
//           <div className="px-4">
//             <Outlet />
//           </div>
          
//           {/* Retailer Footer */}
//           {userInfo && userInfo?.role === "Buyer" && <RetailerFooter />}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default App;

// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import Navigation from "./pages/Auth/Navigation";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import RetailerNav from "./pages/Retailer/RetailerNav";
// import RetailerFooter from "./pages/Retailer/RetailerFooter";
// import Navbar from "./pages/Auth/Navbar";

// const App = () => {
//   const location = useLocation();
//   const { userInfo } = useSelector((state) => state.auth);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(userInfo?.role === "Admin");

//   useEffect(() => {
//     if (userInfo?.role === "Admin") {
//       setIsSidebarOpen(true); // Admin sidebar is always open
//     }
//   }, [userInfo]);

//   // Redirect logic based on user role and current path
//   if (!userInfo && location.pathname !== "/login" && location.pathname !== "/register") {
//     // If not authenticated, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   // If authenticated as Admin and at root path, redirect to admin dashboard
//   if (userInfo?.role === "Admin" && location.pathname === "/") {
//     return <Navigate to="/admin/dashboard" replace />;
//   }

//   // Determine if we should show sidebar
//   const showSidebar = userInfo && (userInfo.role === "Admin" || isSidebarOpen);
  
//   return (
//     <div className="flex flex-col min-h-screen">
//       <ToastContainer />
      
//       {/* Global Navbar - always visible at the top */}
//       <Navbar />
      
//       <div className="flex">
//         {/* Sidebar Navigation - conditional rendering */}
//         {userInfo && (
//           <Navigation />
//         )}

//         {/* Main Content Area */}
//         <main className={`flex-grow min-h-screen transition-all duration-300 ${
//           showSidebar ? "lg:ml-64" : "ml-0"
//         }`}>
//           {/* Top Retailer Navigation - only for Buyers */}
//           {userInfo && userInfo?.role === "Buyer" && <RetailerNav />}
          
//           {/* Content Spacing */}
//           {userInfo && location.pathname !== "/admin/dashboard" && (
//             <div className="mb-8 mt-2"></div>
//           )}
          
//           {/* Main Page Content */}
//           <div className="px-4">
//             <Outlet />
//           </div>
          
//           {/* Retailer Footer */}
//           {userInfo && userInfo?.role === "Buyer" && <RetailerFooter />}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default App;


import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";
import Navbar from "./pages/Auth/Navbar";
import RetailerNav from "./pages/Retailer/RetailerNav";
import RetailerFooter from "./pages/Retailer/RetailerFooter";
import AdminMenu from "./pages/Admin/AdminMenu";

const App = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(userInfo?.role === "Admin");
  const [activeMenuItem, setActiveMenuItem] = useState("");

  useEffect(() => {
    if (userInfo?.role === "Admin") {
      setIsSidebarOpen(true); // Admin sidebar is always open
    }
  }, [userInfo]);

  // Handle active menu item change from Navigation
  const handleActiveItemChange = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  // Redirect logic based on user role and current path
  if (!userInfo && location.pathname !== "/login" && location.pathname !== "/register") {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated as Admin and at root path, redirect to admin dashboard
  if (userInfo?.role === "Admin" && location.pathname === "/") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Determine if we should show sidebar
  const showSidebar = userInfo && (userInfo.role === "Admin" || isSidebarOpen);
  
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      
      {/* Global Navbar - always visible at the top */}
      { location.pathname !== "/login" &&(
         <Navbar activeMenuItem={activeMenuItem} />
      )}
     
      
      <div className="flex">
        {/* Sidebar Navigation - conditional rendering */}
        {userInfo &&  (
          <Navigation onActiveItemChange={handleActiveItemChange} />
        )}
        {/* <AdminMenu/> */}

        {/* Main Content Area */}
        <main className={`flex-grow min-h-screen transition-all duration-300 ${
          showSidebar ? "lg:ml-64" : "ml-0"
        }`}>
          {/* Top Retailer Navigation - only for Buyers */}
          {userInfo && userInfo?.role === "Buyer" && <RetailerNav />}
          
          {/* Content Spacing */}
          {userInfo && location.pathname !== "/admin/dashboard" && (
            <div className="mb-8 mt-2"></div>
          )}
          
          {/* Main Page Content */}
          <div className="px-4">
            <Outlet />
          </div>
          
          {/* Retailer Footer */}
          {userInfo && userInfo?.role === "Buyer" && <RetailerFooter />}
        </main>
      </div>
    </div>
  );
};

export default App;