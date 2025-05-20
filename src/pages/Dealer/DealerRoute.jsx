import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
const SellerRoute = ()=>{
    const { userInfo } = useSelector((state) => state.auth);
  
    return userInfo && (userInfo.role === "Seller") ? (
      <Outlet />
    ) : (
      <Navigate to="/login" replace />
    );
  };

export default SellerRoute;