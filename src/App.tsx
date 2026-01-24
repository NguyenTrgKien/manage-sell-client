import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginAdmin from "./page/Dashboard/auth/LoginAdmin";
import Login from "./page/customer/Auth/Login/login";
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
import { UserRole } from "@nguyentrungkien/shared";
import Unauthorized from "./components/unauthorized";
import CustomerRoute from "./components/CustomerRoute";
import Register from "./page/customer/Auth/Register";
import CustomerProfile from "./page/customer/CustomerProfile";
import CustomerOnlyHeader from "./page/customer/CustomerOnlyHeader";
import CustomerOrder from "./page/customer/CustomerProfile/CustomerOrder";
import CartDetail from "./page/customer/CartDetail";
import Checkout from "./page/customer/Checkout";
import Address from "./page/customer/CustomerProfile/Account/Address";
import Privacy from "./page/customer/CustomerProfile/Account/Privacy";
import ProfileCustomer from "./page/customer/CustomerProfile/Account/Profile";
import DashboardLoginRoute from "./components/DashboardLoginRoute";
import OrderConfirmation from "./page/customer/OrderConfirmation";
import ProductDetail from "./page/customer/ProductDetail";
import LookUpOrder from "./page/customer/LookUpOrder";
import RedirectUrlMomo from "./page/customer/RedirectUrlMomo";
import BannerSlide from "./page/Dashboard/banner-slide";
import Main from "./page/customer/Main";
import HomePage from "./page/customer/HomePage";
import CategoryLayout from "./page/customer/CategoryLayout";
import ProductList from "./page/customer/ProductList";
import Discount from "./page/Dashboard/Discount";
import FavoriteProduct from "./page/customer/CustomerProfile/favoriteProduct";
import MyVoucher from "./page/customer/CustomerProfile/MyVoucher";
import CustomerManage from "./page/Dashboard/customer";
import Customers from "./page/Dashboard/customer/Customers";
import Purchased from "./page/Dashboard/customer/Purchased";
import NoOrder from "./page/Dashboard/customer/NoOrder";
import Statistic from "./page/Dashboard/customer/Statistic";
import CustomerDetail from "./page/Dashboard/customer/CustomerDetail";
import GuestCustomers from "./page/Dashboard/guest-customer";
import StatisticGuest from "./page/Dashboard/guest-customer/StatisticGuest";
import GuestDetail from "./page/Dashboard/guest-customer/DetailGuest";
import ActionFlashSale from "./page/Dashboard/flashsale/ActionFlashSale";
import FlashSale from "./page/Dashboard/flashsale";
import DetailFlashSale from "./page/Dashboard/flashsale/DetailFlashSale";
import FlashSaleDetail from "./page/customer/FlashSaleDetail";
import DetailProductAdmin from "./page/Dashboard/products/DetailProductAdmin";
import ActionProduct from "./page/Dashboard/products/components/ActionProduct";
import SearchProducts from "./page/customer/Search";
import ProductsPage from "./page/customer/ProductsPage";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <CustomerRoute>
              <HomePage />
            </CustomerRoute>
          }
        >
          <Route index element={<Main />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        <Route path="category" element={<CategoryLayout />}>
          <Route path=":slug1" element={<ProductList />} />
          <Route path=":slug1/:slug2" element={<ProductList />} />
          <Route path=":slug1/:slug2/:slug3" element={<ProductList />} />
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
            <Route path="my-voucher" element={<MyVoucher />} />
            <Route path="favorite" element={<FavoriteProduct />} />
          </Route>

          <Route path="cart/detail" element={<CartDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-momo-redirect" element={<RedirectUrlMomo />} />
          <Route
            path="order-confirmation/:orderCode"
            element={<OrderConfirmation />}
          />
          <Route path="look-up-order" element={<LookUpOrder />} />
          <Route
            path="product-detail/:productSlug"
            element={<ProductDetail />}
          />
          <Route path="products" element={<ProductsPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="flash-sale/:slug" element={<FlashSaleDetail />} />
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
          <Route path="products/detail/:id" element={<DetailProductAdmin />} />
          <Route path="products/action" element={<ActionProduct />} />
          <Route path="products/action/:id" element={<ActionProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders/list-order" element={<Order />} />
          <Route path="staff" element={<Staffs />} />
          <Route path="customers" element={<CustomerManage />}>
            <Route index element={<Customers />} />
            <Route path="purchased" element={<Purchased />} />
            <Route path="no-order" element={<NoOrder />} />
            <Route path="statistic" element={<Statistic />} />
          </Route>
          <Route
            path="detail-customer/:customerCode"
            element={<CustomerDetail />}
          />
          <Route path="guest-detail/:guestEmail" element={<GuestDetail />} />
          <Route path="guest-customers" element={<GuestCustomers />}>
            <Route path="statistic" element={<StatisticGuest />} />
          </Route>
          <Route path="banner-slide" element={<BannerSlide />} />
          <Route path="discount" element={<Discount />} />
          <Route path="flashsale" element={<FlashSale />} />
          <Route path="flashsale/create" element={<ActionFlashSale />} />
          <Route path="flashsale/edit/:id" element={<ActionFlashSale />} />
          <Route path="flashsale/detail/:id" element={<DetailFlashSale />} />
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
