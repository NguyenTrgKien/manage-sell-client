import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBoxOpen,
  faEdit,
  faHeart,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";

const navCustomerProfile = [
  {
    id: 1,
    icon: faUser,
    iconColor: "text-blue-500",
    label: "Tài khoản của tôi",
    path: "account",
    children: [
      {
        id: 11,
        label: "Hồ sơ",
        path: "account/profile",
      },
      {
        id: 12,
        label: "Địa chỉ",
        path: "account/address",
      },
      {
        id: 13,
        label: "Thiết lập riêng",
        path: "account/privacy",
      },
    ],
  },
  {
    id: 2,
    icon: faBoxOpen,
    iconColor: "text-blue-500",
    label: "Đơn hàng của tôi",
    path: "order",
  },
  {
    id: 3,
    icon: faTicket,
    iconColor: "text-pink-500",
    label: "Voucher của tôi",
    path: "my-voucher",
  },
  {
    id: 4,
    icon: faHeart,
    iconColor: "text-red-500",
    label: "Sản phẩm yêu thích",
    path: "favorite",
  },
];

function CustomerProfile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showChildren, setShowChildren] = useState<number[]>([]);

  useEffect(() => {
    const currentPath = location.pathname;
    navCustomerProfile.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          currentPath.includes(child.path)
        );
        if (hasActiveChild && !showChildren.includes(item.id)) {
          setShowChildren((prev) => [...prev, item.id]);
        }
      }
    });
  }, [location.pathname]);

  const handleToggleChild = (item: any) => {
    if (!item.children) return navigate(item.path);
    setShowChildren((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const isActivePath = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem] mt-[15rem] md:mt-[1rem]">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
        <div className="hidden md:block w-full lg:w-[24rem] h-auto py-[1rem] px-[1rem] sm:px-[2rem] bg-white lg:bg-transparent rounded-md lg:rounded-none shadow-md lg:shadow-none">
          <div className="flex items-center gap-[1rem] pb-[2rem] border-b border-b-gray-200">
            <div className="w-[4rem] h-[4rem] sm:w-[5rem] sm:h-[5rem] rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt={`avatar`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-400 text-[1.6rem] sm:text-[2rem]"
                />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-[.2rem] min-w-0">
              <p className="font-bold truncate">{user?.username}</p>
              <div className="text-[1.4rem] text-gray-600">
                <FontAwesomeIcon icon={faEdit} />
                <span className="ml-1">Chỉnh sửa hồ sơ</span>
              </div>
            </div>
          </div>
          <nav className="mt-[2rem] sm:mt-[3rem] space-y-2">
            {navCustomerProfile.map((item) => {
              return (
                <div
                  key={item.id}
                  className="text-gray-800"
                  onClick={() => handleToggleChild(item)}
                >
                  <div className="flex items-center gap-[1rem] cursor-pointer group py-2">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`${item.iconColor} flex-shrink-0`}
                    />
                    <span className="group-hover:text-red-500 transition duration-150">
                      {item.label}
                    </span>
                  </div>
                  <div
                    className={`mt-[1.2rem] ${
                      showChildren &&
                      showChildren.length > 0 &&
                      showChildren?.includes(item.id)
                        ? "h-auto"
                        : "h-[0rem] overflow-hidden"
                    } transition duration-300`}
                  >
                    {item.children &&
                      item.children?.map((child) => {
                        const isActive = isActivePath(child.path);
                        return (
                          <Link
                            to={child.path}
                            key={child.id}
                            className="block pl-[2rem] sm:pl-[3rem] space-y-6 text-start text-gray-600 cursor-pointer group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span
                              className={`block group-hover:text-red-500 transition duration-150 ${
                                isActive ? "text-red-500" : "text-gray-600"
                              }`}
                            >
                              {child.label}
                            </span>
                            <div></div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 w-full min-h-[calc(100vh-20rem)] bg-white shadow-md mb-[2rem] rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
