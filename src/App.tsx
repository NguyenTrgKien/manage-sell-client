import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginAdmin from "./page/Dashboard/auth/LoginAdmin";
import HomePage from "./page/customer/Home";
import Login from "./page/customer/Auth/Login/login";
import CustomerLayout from "./page/customer/CustomerLayout";
import AboutPage from "./page/customer/About";
import CustomerNoSidebar from "./page/customer/CustomerNoSidebar";
import Dashboard from "./page/Dashboard";
import DashboardHome from "./page/Dashboard/DashboardHome/DashboardHome";
import Products from "./page/Dashboard/products";
import Categories from "./page/Dashboard/products/categories";
import Profile from "./page/Dashboard/profile";
import Order from "./page/Dashboard/order/ListOrders";
import Staffs from "./page/Dashboard/staffs";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { UserRole } from "@my-project/shared";
import Unauthorized from "./components/unauthorized";
import CustomerRoute from "./components/CustomerRoute";
import Register from "./page/customer/Auth/Register";
import CustomerProfile from "./page/customer/CustomerProfile";
import CustomerOnlyHeader from "./page/customer/CustomerOnlyHeader";
import CustomerOrder from "./page/customer/CustomerProfile/CustomerOrder";
import LikeOrder from "./page/customer/CustomerProfile/likeOrder";
import CartDetail from "./page/customer/CartDetail";
import Checkout from "./page/customer/Checkout";
import Address from "./page/customer/CustomerProfile/Account/Address";
import Privacy from "./page/customer/CustomerProfile/Account/Privacy";
import ProfileCustomer from "./page/customer/CustomerProfile/Account/Profile";
import DashboardLoginRoute from "./components/DashboardLoginRoute";
import OrderConfirmation from "./page/customer/OrderConfirmation";
import ProductDetail from "./page/customer/ProductDetail";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <CustomerRoute>
              <CustomerLayout />
            </CustomerRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Các route không có Sidebar và header */}
        <Route element={<CustomerNoSidebar />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Các route chỉ có header */}
        <Route element={<CustomerOnlyHeader />}>
          <Route
            path="customer"
            element={
              <PrivateRoute>
                <CustomerProfile />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={<Navigate to={"account/profile"} replace />}
            />
            <Route path="account/profile" element={<ProfileCustomer />} />
            <Route path="account/address" element={<Address />} />
            <Route path="account/privacy" element={<Privacy />} />

            <Route path="order" element={<CustomerOrder />} />
            <Route path="like" element={<LikeOrder />} />
          </Route>

          <Route path="cart/detail" element={<CartDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="order-confirmation/:orderid"
            element={<OrderConfirmation />}
          />
          <Route path="product-detail/:productid" element={<ProductDetail />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              roles={[UserRole.ADMIN, UserRole.STAFF]}
              redirectTo="/dashboard/login"
            >
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders/list-order" element={<Order />} />
          <Route path="staff" element={<Staffs />} />
        </Route>

        <Route
          path="/dashboard/login"
          element={
            <DashboardLoginRoute>
              <LoginAdmin />
            </DashboardLoginRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
