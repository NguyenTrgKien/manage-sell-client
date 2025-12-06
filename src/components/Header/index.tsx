import {
  faBars,
  faBox,
  faEnvelope,
  faHeart,
  faSearch,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import Cart from "../Cart";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "@my-project/shared";
import { useCartCount } from "../../hooks/useCartCount";
import { useUser } from "../../hooks/useUser";

function Header() {
  const [showCart, setShowCart] = useState(false);
  const { user } = useUser();
  const { logout } = useAuth();
  const cartCount = useCartCount();
  const [showFlashSale, setShowFlashSale] = useState(true);
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowFlashSale(false);
      } else {
        setShowFlashSale(true);
      }
    };
    if (!location.pathname.includes("/customer")) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const handleAccountClick = (redirect: string) => {
    if (!user) {
      return navigate(`/${redirect}`);
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) {
      return navigate("/dashboard");
    }

    return navigate("/customer");
  };

  return (
    <header
      className={`${!location.pathname.includes("/customer") ? "fixed top-0 left-0" : ""} w-full  bg-white z-[999] ${!location.pathname.includes("/customer") ? (showFlashSale ? " shadow-none" : "shadow-xl") : ""}`}
    >
      <div
        className={`px-[12rem] bg-gradient-to-r from-pink-600 to-red-500 w-full ${showFlashSale ? "h-[3.5rem] opacity-[1]" : "opacity-0 h-[0] overflow-hidden"} flex items-center justify-between transition-all duration-300`}
      >
        <p className="text-[1.4rem] text-white">
          🔥 FLASH SALE - Giảm đến 50% toàn bộ sản phẩm
        </p>
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-white cursor-pointer"
          />
          <span className="text-[1.4rem] text-white block pl-[1rem] ml-[1rem] border-l border-l-gray-300 cursor-pointer">
            Tìm cửa hàng
          </span>
        </div>
      </div>
      <div className="px-[12rem] py-[1rem]">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-pink-500 to-red-600 text-white w-[3.5rem] h-[3.5rem] rounded-lg flex items-center justify-center font-bold text-xl">
                K
              </div>
              <div>
                <div className="text-[2.2rem] font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  NTK.
                </div>
                <div className="text-[1.2rem] text-gray-500 -mt-1">
                  Style Your Life
                </div>
              </div>
            </a>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                className="text-[1.4rem] w-full h-[4rem] pl-[3.4rem] pr-4 border-2 border-gray-300 rounded-full outline-none focus:border-pink-500 transition-colors"
                placeholder="Tìm áo thun, quần jean, giày sneaker..."
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div
                className="relative flex flex-col items-center justify-center gap-1 group transition-colors"
                onMouseEnter={() => setShowAccountMenu(true)}
                onMouseLeave={() => setShowAccountMenu(false)}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-600 group-hover:text-pink-600"
                />
                <span className="text-[1.2rem] hover:underline cursor-pointer group-hover:text-pink-600">
                  {user.username}
                </span>

                <div
                  className={`absolute top-full  mt-2 w-[22rem] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ${
                    showAccountMenu
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="py-2">
                    <button
                      onClick={() => handleAccountClick("customer/profile")}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition-colors text-left hover:text-pink-600 text-gray-600 "
                    >
                      <FontAwesomeIcon icon={faUser} className="w-[1.6rem]" />
                      <span className="text-[1.4rem] ">Tài khoản của tôi</span>
                    </button>

                    <button
                      onClick={() => handleAccountClick("customer/orders")}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition-colors text-left hover:text-pink-600 text-gray-600 "
                    >
                      <FontAwesomeIcon icon={faBox} className=" w-[1.6rem]" />
                      <span className="text-[1.4rem]">Đơn hàng của tôi</span>
                    </button>

                    <button
                      onClick={() => handleAccountClick("customer/like")}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition-colors text-left hover:text-pink-600 text-gray-600 "
                    >
                      <FontAwesomeIcon icon={faHeart} className=" w-[1.6rem]" />
                      <span className="text-[1.4rem] ">Sản phẩm yêu thích</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left text-gray-600 hover:text-red-600"
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className=" w-[1.6rem]"
                      />
                      <span className="text-[1.4rem]">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="relative flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-pink-600 transition-colors group"
                onMouseEnter={() => setShowAccountMenu(true)}
                onMouseLeave={() => setShowAccountMenu(false)}
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="text-[1.2rem] hover:underline cursor-pointer">
                  Tài khoản
                </span>
                <div
                  className={`absolute top-[100%] mt-2 w-[18rem] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ${
                    showAccountMenu
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => handleAccountClick("login")}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left text-gray-600 hover:text-red-600"
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className=" w-[1.6rem]"
                      />
                      <span className="text-[1.4rem]">Đăng nhập</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => handleAccountClick("register")}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left text-gray-600 hover:text-red-600"
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className=" w-[1.6rem]"
                      />
                      <span className="text-[1.4rem]">Đăng ký</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <a
              href="/"
              className="flex flex-col items-center gap-1 hover:text-pink-600 transition-colors relative group"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-[1.2rem]">Yêu thích</span>
              <span className="absolute -top-2 left-[3rem] bg-red-500 text-white text-[10px] w-[1.5rem] h-[1.5rem] rounded-full flex items-center justify-center">
                5
              </span>
            </a>

            <div
              className="relative flex flex-col items-center gap-1 group transition-colors cursor-pointer"
              onClick={() => setShowCart(true)}
            >
              <svg
                className="w-6 h-6 group-hover:text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-[1.2rem] group-hover:text-pink-600">
                Giỏ hàng
              </span>
              <span className="absolute -top-2 left-[3rem] bg-red-500 text-white text-[10px] w-[1.5rem] h-[1.5rem] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-t-gray-300 py-[1rem] px-[12rem]">
        <nav className="flex items-center justify-between h-12">
          <ul className="flex items-center gap-8">
            <li className="relative group">
              <button className="flex items-center gap-1 text-[1.4rem] font-semibold text-pink-600 hover:text-pink-700">
                <FontAwesomeIcon icon={faBars} />
                DANH MỤC
              </button>
            </li>
            <li>
              <a
                href="/"
                className="font-medium text-[1.4rem] hover:text-pink-600 transition-colors"
              >
                NAM
              </a>
            </li>
            <li>
              <a
                href="/"
                className="font-medium text-[1.4rem] hover:text-pink-600 transition-colors"
              >
                NỮ
              </a>
            </li>
            <li>
              <a
                href="/"
                className="font-medium text-[1.4rem] hover:text-pink-600 transition-colors"
              >
                TRẺ EM
              </a>
            </li>
            <li>
              <a
                href="/"
                className="font-medium text-[1.4rem] hover:text-pink-600 transition-colors"
              >
                GIÀY DÉP
              </a>
            </li>
            <li>
              <a
                href="/"
                className="font-medium text-[1.4rem] hover:text-pink-600 transition-colors"
              >
                PHỤ KIỆN
              </a>
            </li>
            <li>
              <a
                href="/"
                className="font-medium text-[1.4rem] text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                🔥 SALE
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4 text-[1.4rem">
            <a
              href="/"
              className="hover:text-pink-600 text-gray-600 transition-colors"
            >
              Giới thiệu
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/"
              className="hover:text-pink-600 text-gray-600 transition-colors flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faFacebook} />
              Facebook
            </a>
            <a
              href="/"
              className="hover:text-pink-600 text-gray-600 transition-colors flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faInstagram} />
              Instagram
            </a>
          </div>
        </nav>
      </div>
      <Cart setShowCart={setShowCart} showCart={showCart} />
    </header>
  );
}

export default Header;
