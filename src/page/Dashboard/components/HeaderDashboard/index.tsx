import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../../../hooks/useAuth";
import { UserRole } from "@my-project/shared";
import avatarDefault from "../../../../assets/images/avatar-default.png";
import { useEffect, useRef, useState } from "react";
import axiosConfig from "../../../../configs/axiosConfig";
import { useNavigate } from "react-router-dom";

function HeaderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    try {
      const res = await axiosConfig.get("/api/v1/auth/logout");
      if (res.status) {
        localStorage.removeItem("user");
        window.location.href = "/dashboard/login";
      }
    } catch (error) {
      console.log("Lỗi khi đăng xuất", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }
    if (openMenu) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <header className="fixed w-full h-[6rem] bg-white backdrop-blur-md bg-opacity-95 flex items-center justify-between px-[2rem] shadow-lg border-b border-gray-200 z-50">
      <div className="flex items-center gap-[1rem]">
        <h1 className="text-[2.4rem] font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
          NTK.
        </h1>
        <div className="h-[3rem] w-[0.2rem] bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
        <span className="text-[1.4rem] text-gray-600 font-medium">
          Admin Dashboard
        </span>
      </div>

      <div className="relative">
        <div className="relative w-[36rem] h-[4rem] border-2 border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 focus-within:border-amber-500 focus-within:shadow-lg">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
            className="text-[1.4rem] pl-[2rem] pr-[6rem] w-full h-full outline-none border-none bg-gray-50 focus:bg-white transition-colors"
          />
          <button
            className="w-[4rem] h-[4rem] absolute right-0 top-0 rounded-2xl border-none bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 flex items-center justify-center text-white shadow-lg hover:shadow-xl"
            type="submit"
          >
            <FontAwesomeIcon icon={faSearch} className="text-[1.6rem]" />
          </button>
        </div>
      </div>

      <div className="relative flex items-center gap-[2rem]" ref={menuRef}>
        <button
          className="flex items-center gap-[1.2rem] p-[0.8rem] rounded-xl transition-all duration-200 group cursor-pointer"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <img
            src={user.avatar ?? avatarDefault}
            alt="Admin Avatar"
            className="h-[4.8rem] w-[4.8rem] rounded-[50%] border border-amber-300 shadow-lg group-hover:border-amber-400 transition-all duration-200"
          />
          <div className="hidden md:block text-left">
            <div className="font-bold text-[1.4rem] text-gray-800">
              {user.username}
            </div>
            <div className="text-[1.2rem] text-amber-600 font-medium">
              {user.role === UserRole.ADMIN ? "Super Admin" : "Manager"}
            </div>
          </div>
          <svg
            className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {openMenu && (
          <div className="absolute right-0 top-[105%] w-[18rem] bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden animate-fadeIn z-10">
            <button
              className="w-full text-left px-[1.6rem] py-[1rem] text-[1.4rem] text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              onClick={() => {
                navigate("/dashboard/profile");
                setOpenMenu(false);
              }}
            >
              Trang cá nhân
            </button>
            <button
              className="w-full text-left px-[1.6rem] py-[1rem] text-[1.4rem] text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderDashboard;
