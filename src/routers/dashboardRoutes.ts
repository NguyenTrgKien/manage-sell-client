import Order from "../page/Dashboard/order/ListOrders";
import Products from "../page/Dashboard/products";
import Categories from "../page/Dashboard/products/categories";
import Profile from "../page/Dashboard/profile";
import Staffs from "../page/Dashboard/staffs";

export const dashboardRoute = [
  {
    path: "products",
    element: Products,
  },
  {
    path: "categories",
    element: Categories,
  },
  {
    path: "profile",
    element: Profile,
  },
  {
    path: "orders/list-order",
    element: Order,
  },
  {
    path: "staff",
    element: Staffs,
  },
];

export default dashboardRoute;
