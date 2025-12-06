export const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    path: "",
  },
  {
    id: 2,
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
    id: 5,
    label: "Đơn hàng",
    path: "orders",
    children: [
      {
        id: 23,
        label: "Danh sách đơn hàng",
        path: "orders/list-order"
      }
    ]
  },
  {
    id: 6,
    label: "Nhân viên",
    path: "staff",
  },
  {
    id: 7,
    label: "Khách hàng",
    path: "customer",
  },
  {
    id: 8,
    label: "Cá nhân",
    path: "profile",
  },
  {
    id: 9,
    label: "Cài đặt",
    path: "setting",
  },
];
