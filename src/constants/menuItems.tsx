import {
  faBox,
  faChartBar,
  faCog,
  faTachometerAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const menuItems = [
  {
    id: 1,
    icon: faTachometerAlt,
    label: "Dashboard",
    path: "",
  },
  {
    id: 2,
    icon: faBox,
    label: "Sản phẩm",
    path: "products",
    children: [
      {
        id: 21,
        label: "Sản phẩm",
        path: "products",
      },
      {
        id: 22,
        label: "Danh mục",
        path: "categories",
      },
    ],
  },
  {
    id: 4,
    icon: faUsers,
    label: "Khách hàng",
    path: "customer",
  },
  {
    id: 5,
    icon: faChartBar,
    label: "Báo cáo",
    path: "report",
  },
  {
    id: 6,
    icon: faCog,
    label: "Cá nhân",
    path: "profile",
  },
  {
    id: 7,
    icon: faCog,
    label: "Cài đặt",
    path: "setting",
  },
];
