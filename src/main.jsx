import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminRoute from "./pages/Admin/AdminRoute";
import Profile from "./pages/User/Profile";
import UserList from "./pages/Admin/UserList";

import CategoryList from "./pages/Admin/CategoryList";

import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";

import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";

import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";

import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Order from "./pages/Orders/Order.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import BrandList from "./pages/Admin/BrandList.jsx";
import LowStockProducts from "./pages/Admin/LowStock.jsx";
import DealerRoute from "./pages/Dealer/DealerRoute.jsx";
import DealerDashboard from "./pages/Dealer/DealerDashboard.jsx";
import UserManagement from "./pages/Admin/UserManagement.jsx";
import BankDetails from "./pages/Admin/BankDetails.jsx";
import SlabRequestList from "./pages/Admin/SlabRequestList.jsx";
import AddUser from "./pages/Admin/AddUser.jsx";
import Inventory from "./pages/Admin/Inventory.jsx";
import RetailerHome from "./pages/Retailer/RetailerHome.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import UserOrder from "./pages/User/UserOrder.jsx";
import PendingOrders from "./pages/Admin/PendingOrders.jsx";
import RegistrationSuccess from "./pages/Auth/RegistrationSuccess.jsx";
import NotificationList from "./pages/Auth/Notification.jsx";
import BannerManager from "./pages/Admin/Banners.jsx";
import HomePage from "./pages/Retailer/HomePage.jsx";
import RetailerDashboard from "./pages/Admin/RetailerDashboard.jsx";
import CategoryDetails from "./pages/Admin/CategoryDetails.jsx";
import AllUsers from "./pages/Admin/AllUsers.jsx";
import BrandDetails from "./pages/Admin/BrandDetails.jsx";
import SearchHistory from "./pages/Admin/SearchHistory.jsx";
import UserActivityPage from "./pages/Admin/UserActivityPage.jsx";
import BugReportsList from "./pages/Admin/BugReports.jsx";
import Coupon from "./pages/Coupons/Coupon.jsx";
import DashboardCreationForm from "./pages/Retailer/DashboardCreationForm.jsx";
import AdminBroadcastNotification from "./pages/Admin/AdminNotification.jsx";
import AllCategories from "./pages/Admin/AllCategories.jsx";
import UserCartList from "./pages/Admin/UserCart.jsx";
import SubCategoryList from "./pages/Admin/SubCategoryList.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/registration-success" element={<RegistrationSuccess />} />

      <Route element={<PrivateRoute />}>
        {/* <Route index={true} path="/" element={<Home />} /> */}
        <Route index={true} path="/" element={<RetailerHome />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/favorite" element={<Favorites />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />

        {/* Registered users */}
        <Route path="" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/yourorder" element={<UserOrder />} />
          <Route path="/notification" element={<NotificationList />} />
          <Route path="/all-categories" element={<AllCategories />} />
          

          <Route path="/category/:cname/:cid" element={<CategoryDetails />} />
          <Route path="/brand/:bname/:bid" element={<BrandDetails />} />

          <Route path="/order/:id" element={<Order />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="admin-inventory" element={<Inventory />} />
          <Route path="user-activity/:userId" element={<UserActivityPage />} />
          <Route path="admin-notification" element={<AdminBroadcastNotification />} />

          <Route path="all-users" element={<AllUsers />} />

          <Route path="userlist" element={<UserList />} />
          <Route path="buyer-home-page" element={<RetailerDashboard />} />
          {/* <Route path="buyer-home-page" element={<DashboardCreationForm />} /> */}

          <Route path="categorylist" element={<CategoryList />} />
          <Route path="subCategorylist" element={<SubCategoryList />} />
          <Route path="brandlist" element={<BrandList />} />
          <Route path="bank-details" element={<BankDetails />} />
          <Route path="slab-requests" element={<SlabRequestList />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="pending-order" element={<PendingOrders />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="search-history" element={<SearchHistory />} />
          <Route path="bug-reports" element={<BugReportsList />} />
          <Route path="coupon" element={<Coupon />} />

          <Route path="low-stock" element={<LowStockProducts />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-cart" element={<UserCartList />} />


          <Route path="productlist" element={<ProductList />} />
          <Route path="allproductslist" element={<AllProducts />} />
          <Route path="productlist/:pageNumber" element={<ProductList />} />
          <Route path="product/update/:_id" element={<ProductUpdate />} />
          <Route path="orderlist" element={<OrderList />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="/dealer" element={<DealerRoute />}>
          <Route path="dashboard" element={<DealerDashboard />}></Route>
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
