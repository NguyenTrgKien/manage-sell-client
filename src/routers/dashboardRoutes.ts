import Products from "../page/Dashboard/products";
import Categories from "../page/Dashboard/products/categories";
import Profile from "../page/Dashboard/profile";

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
];

export default dashboardRoute;
