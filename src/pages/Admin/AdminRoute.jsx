import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  return userInfo && (userInfo.role === "Accounts" || userInfo.role === "Admin"||userInfo.role === "Inventory" || userInfo.role ==="Seller") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
