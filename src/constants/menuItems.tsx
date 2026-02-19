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
        path: "orders/list-order",
      },
    ],
  },
  {
    id: 6,
    label: "Nhân viên",
    path: "staff",
  },
  {
    id: 7,
    label: "Khách hàng thành viên",
    path: "customers",
  },
  {
    id: 8,
    label: "Khách vãng lai",
    path: "guest-customers",
  },
  {
    id: 9,
    label: "FlashSale",
    path: "flashsale",
  },
  {
    id: 10,
    label: "Giảm giá",
    path: "discount",
  },
  {
    id: 11,
    label: "Banner",
    path: "banner-slide",
  },
  {
    id: 12,
    label: "Collection",
    path: "collection",
  },
  {
    id: 13,
    label: "Cá nhân",
    path: "profile",
  },
];
