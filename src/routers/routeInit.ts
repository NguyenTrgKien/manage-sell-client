import Dashboard from "../page/Dashboard";
import LoginAdmin from "../page/Dashboard/auth/Login";
import HomePage from "../page/Home";

const routerInits = [
  {
    path: "/",
    element: HomePage,
    isPrivate: false,
  },
  {
    path: "/dashboard/*",
    element: Dashboard,
    isPrivate: true,
  },
  {
    path: "/dashboard/login",
    element: LoginAdmin,
    isPrivate: false,
  },
];

export default routerInits;
