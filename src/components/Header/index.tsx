import {
  faBars,
  faBookJournalWhills,
  faBox,
  faEdit,
  faHeart,
  faSignOutAlt,
  faTicket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useRef, useState } from "react";
import Cart from "../Cart";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserRole, VoucherType } from "@nguyentrungkien/shared";
import { useCartCount } from "../../hooks/useCartCount";
import { useUser } from "../../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../../api/category.api";
import type { CategoriesType } from "../../utils/types";
import { getVouchers } from "../../api/voucher.api";
import type { VoucherT } from "../../utils/voucher.type";
import ShowVouchers from "../ShowVouchers";
import RequireLogin from "../RequireLogin";
import Sidebar from "../Sidebar";
import SearchInput from "../SearchInput";
import Logo from "../Logo";

function Header() {
  const [showCart, setShowCart] = useState(false);
  const { user } = useUser();
  const { logout } = useAuth();
  const cartCount = useCartCount();
  const [showFlashSale, setShowFlashSale] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSideBar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showVouchers, setShowVouchers] = useState<{
    open: boolean;
    data: VoucherT[] | null;
  }>({
    open: false,
    data: null,
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: dataVoucher, isLoading: isLoadingVoucher } = useQuery({
    queryKey: ["vouchers"],
    queryFn: () => getVouchers(),
  });
  const vouchers = dataVoucher && dataVoucher.data;

  const { data: listCategory, isLoading } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: () => getAllCategory(),
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => {
      window.addEventListener("resize", onResize);
    };
  }, []);

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

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e?.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);

    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  const handleAccountClick = (redirect: string) => {
    if (!user) {
      return navigate(`/${redirect}`);
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) {
      return navigate("/dashboard");
    }

    return navigate(`/${redirect}`);
  };

  const handleClickCate = (slug?: string) => {
    if (slug) {
      navigate(`/category/${slug}`);
    } else {
      if (listCategory) {
        const defaultSlug = listCategory[0];
        navigate(`/category/${defaultSlug.slug}`);
      }
    }
  };

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <header
      className={`${!location.pathname.includes("/customer") ? "fixed top-0 left-0" : "fixed top-0 left-0 md:relative"} w-full bg-white z-[999] ${!location.pathname.includes("/customer") ? (showFlashSale ? " shadow-none" : "shadow-xl") : ""}`}
    >
      {isLoadingVoucher ? (
        <></>
      ) : (
        vouchers?.map((voucher: VoucherT, index: number) => {
          if (index >= 1) return;
          return (
            <div
              key={voucher.id}
              className={`px-4 md:px-8 lg:px-12 xl:px-[12rem] bg-gradient-to-r from-pink-600 to-red-500 w-full ${showFlashSale ? "h-[3.5rem] opacity-[1]" : "opacity-0 h-[0] overflow-hidden"} flex items-center justify-between transition-all duration-300 cursor-pointer`}
              onClick={() => {
                if (user) {
                  setShowVouchers({ open: true, data: vouchers });
                } else {
                  setShowLogin(true);
                }
              }}
            >
              <p className="text-[1rem] sm:text-[1.2rem] md:text-[1.4rem] text-white whitespace-nowrap overflow-hidden text-ellipsis px-2">
                🔥 {voucher.name} - Giảm{" "}
                {voucher.type === VoucherType.PERCENT
                  ? `${voucher.value}%`
                  : `${formatPrice(voucher.value)}`}{" "}
                {voucher.minOrderValue > 0 &&
                  `- Đơn từ ${formatPrice(voucher.minOrderValue)}`}
              </p>
            </div>
          );
        })
      )}
      <div className="relative md:px-8 lg:px-12 xl:px-[12rem] py-2 md:py-[1rem]">
        <div className="px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <Logo />
            </div>

            <div className="md:hidden flex items-center space-x-12">
              <div
                className=" relative flex flex-col items-center gap-1 group transition-colors cursor-pointer"
                onClick={() => setShowCart(true)}
              >
                <svg
                  className="w-8 h-8 group-hover:text-pink-600"
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
                {user && (
                  <span className="absolute -top-3 left-[1.5rem] bg-red-500 text-white text-[10px] w-[1.5rem] h-[1.5rem] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div
                className={`w-15 h-15 ${user ? "border-1" : "border-2"} border-gray-400 rounded-full flex flex-col items-center justify-center gap-1 group transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`avatar user`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUser}
                    className={`${user ? "text-pink-500" : "text-gray-400"} group-hover:text-pink-600 text-[1.6rem]`}
                  />
                )}
              </div>
            </div>

            <div className="relative hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <SearchInput isMobile={false} />
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6 z-[900]">
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
                  <span className="text-[1.2rem] group-hover:underline cursor-pointer group-hover:text-pink-600 whitespace-nowrap">
                    {user.username}
                  </span>

                  <div
                    className={`absolute top-full mt-2 w-[22rem] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 ${
                      showAccountMenu
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <div className="py-2">
                      <button
                        onClick={() =>
                          handleAccountClick("customer/account/profile")
                        }
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition-colors text-left hover:text-pink-600 text-gray-600 "
                      >
                        <FontAwesomeIcon icon={faUser} className="w-[1.6rem]" />
                        <span className="text-[1.4rem] ">
                          Tài khoản của tôi
                        </span>
                      </button>

                      <button
                        onClick={() => handleAccountClick("customer/order")}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition-colors text-left hover:text-pink-600 text-gray-600 "
                      >
                        <FontAwesomeIcon icon={faBox} className=" w-[1.6rem]" />
                        <span className="text-[1.4rem]">Đơn hàng của tôi</span>
                      </button>

                      <button
                        onClick={() => handleAccountClick("customer/favorite")}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition-colors text-left hover:text-pink-600 text-gray-600 "
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className=" w-[1.6rem]"
                        />
                        <span className="text-[1.4rem] ">
                          Sản phẩm yêu thích
                        </span>
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
                <>
                  <div
                    className="relative flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-pink-600 transition-colors group"
                    onMouseEnter={() => setShowAccountMenu(true)}
                    onMouseLeave={() => setShowAccountMenu(false)}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span className="text-[1.2rem] group-hover:underline cursor-pointer whitespace-nowrap">
                      Tài khoản
                    </span>
                    <div
                      className={`absolute top-[100%] mt-2 w-[18rem] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 z-[1000] ${
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
                  <div
                    className="relative flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-pink-600 transition-colors group"
                    onClick={() => navigate("/look-up-order")}
                  >
                    <FontAwesomeIcon icon={faBookJournalWhills} />
                    <span className="text-[1.2rem] group-hover:underline cursor-pointer whitespace-nowrap">
                      Đơn hàng
                    </span>
                  </div>
                </>
              )}

              <Link
                to="/"
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
                <span className="text-[1.2rem] group-hover:underline whitespace-nowrap">
                  Yêu thích
                </span>
                <span className="absolute -top-2 left-[3rem] bg-red-500 text-white text-[10px] w-[1.5rem] h-[1.5rem] rounded-full flex items-center justify-center">
                  5
                </span>
              </Link>

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
                <span className="text-[1.2rem] group-hover:text-pink-600 group-hover:underline whitespace-nowrap">
                  Giỏ hàng
                </span>
                {user && (
                  <span className="absolute -top-2 left-[3rem] bg-red-500 text-white text-[10px] w-[1.5rem] h-[1.5rem] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden mt-4 mb-2">
            <SearchInput isMobile={true} />
          </div>
        </div>

        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 md:hidden w-full h-full bg-[#3e3e3e6f] border-t border-gray-200 z-[100]`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileMenu(false);
            }}
          >
            <div
              className="flex flex-col gap-8 bg-white w-[80%] h-full p-[2rem]"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {user ? (
                <>
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
                      <div
                        className="text-[1.4rem] text-gray-600 cursor-pointer"
                        onClick={() => {
                          navigate("customer/account/profile");
                          setShowMobileMenu(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        <span className="ml-1">Chỉnh sửa hồ sơ</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleAccountClick("customer/account/profile");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5" />
                    Tài khoản của tôi
                  </button>
                  <button
                    onClick={() => {
                      handleAccountClick("customer/order");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faBox} className="w-5" />
                    Đơn hàng của tôi
                  </button>
                  <button
                    onClick={() => {
                      handleAccountClick("customer/favorite");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faHeart} className="w-5" />
                    Sản phẩm yêu thích
                  </button>
                  <button
                    onClick={() => {
                      handleAccountClick("customer/account/address");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faHeart} className="w-5" />
                    Địa chỉ
                  </button>
                  <button
                    onClick={() => {
                      handleAccountClick("customer/my-voucher");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faTicket} className="w-5" />
                    Voucher của tôi
                  </button>
                  <button
                    onClick={() => {
                      navigate("/customer/account/privacy");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon
                      icon={faBookJournalWhills}
                      className="w-5"
                    />
                    Thiết lập riêng
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-red-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleAccountClick("login");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5" />
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      handleAccountClick("register");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5" />
                    Đăng ký
                  </button>
                  <button
                    onClick={() => {
                      navigate("/look-up-order");
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 hover:text-pink-600 text-[1.4rem]"
                  >
                    <FontAwesomeIcon
                      icon={faBookJournalWhills}
                      className="w-5"
                    />
                    Tra cứu đơn
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="md:block w-[100%] border-t border-t-gray-300 py-[1rem] px-4 md:px-8 lg:px-12 xl:px-[12rem]">
        <nav className="flex items-center justify-between h-12">
          <ul className="flex items-center gap-4 lg:gap-8 overflow-x-auto scrollbar-hide">
            <li className="relative group shrink-0 gap-2">
              <button
                className="flex items-center text-[1.2rem] lg:text-[1.4rem] font-medium text-pink-600 hover:text-pink-700 whitespace-nowrap mt-1"
                onClick={() => {
                  if (isMobile) {
                    setShowSideBar(true);
                  } else {
                    handleClickCate();
                  }
                }}
              >
                <FontAwesomeIcon icon={faBars} />
                <span>DANH MỤC</span>
              </button>
            </li>
            {!isLoading ? (
              listCategory &&
              listCategory.length > 0 &&
              listCategory
                .filter((c: any) => !c.parentId)
                .map((cate: CategoriesType) => {
                  return (
                    <li
                      key={cate.id}
                      onClick={() => handleClickCate(cate.slug)}
                      className="shrink-0"
                    >
                      <Link
                        to={`/category/${cate.slug}`}
                        className="font-medium text-[1.2rem] lg:text-[1.4rem] hover:text-pink-600 transition-colors uppercase whitespace-nowrap"
                      >
                        {cate.categoryName}
                      </Link>
                    </li>
                  );
                })
            ) : (
              <></>
            )}
          </ul>

          <div className="hidden lg:flex items-center gap-4 text-[1.4rem] shrink-0">
            <Link
              to="/about-us"
              className="hover:text-pink-600 text-gray-600 transition-colors whitespace-nowrap"
            >
              Giới thiệu
            </Link>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.facebook.com/kien.trung.732841/"
              className="hover:text-pink-600 text-gray-600 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faFacebook} />
              Facebook
            </a>
            <a
              href="https://www.instagram.com/trungkien4420/"
              className="hover:text-pink-600 text-gray-600 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faInstagram} />
              Instagram
            </a>
          </div>
        </nav>
      </div>
      <Cart setShowCart={setShowCart} showCart={showCart} />
      {isMobile && showSidebar && (
        <div
          className="fixed top-0 left-0 h-full w-full bg-[#36363650] z-[999]"
          onClick={() => setShowSideBar(false)}
        >
          <div
            className="w-[85%] max-w-[36rem] h-full bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onClose={() => setShowSideBar(false)} />
          </div>
        </div>
      )}
      <ShowVouchers
        open={showVouchers.open}
        onClose={() =>
          setShowVouchers({
            open: false,
            data: null,
          })
        }
        vouchers={showVouchers.data}
      />
      <RequireLogin open={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  );
}

export default Header;
