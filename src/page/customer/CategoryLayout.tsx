import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlugs } from "../../api/category.api";
import { useState } from "react";
import Footer from "../../components/Footer";

function CategoryLayout() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const slugs = pathSegments.slice(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories-by-slugs", slugs],
    queryFn: () => getCategoryBySlugs(slugs),
    enabled: slugs.length > 0,
    retry: 2,
  });

  return (
    <div className="overflow-hidden">
      <Header />

      <div className="flex items-center space-x-2 text-[1.4rem] mt-[20rem] md:mt-[16.5rem] px-[1.5rem] md:px-[15rem] overflow-x-auto pb-2">
        <Link
          to="/"
          className="flex items-center space-x-2 text-blue-800 flex-shrink-0"
        >
          <span>Home</span>
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-gray-400 cursor-pointer"
          />
        </Link>
        {isLoading && (
          <div className="flex-shrink-0 text-gray-500">Đang tải...</div>
        )}
        {isError && (
          <div className="flex-shrink-0 text-red-600">
            {error instanceof Error ? error.message : "Có lỗi xảy ra"}
          </div>
        )}
        {!isLoading &&
          !isError &&
          categories &&
          slugs.map((slug, index) => {
            const category = categories[index];
            const name = category.categoryName;
            const path = "/category/" + slugs.slice(0, index + 1).join("/");
            return (
              <span key={slug} className="flex items-center flex-shrink-0">
                <Link
                  to={path}
                  className="text-blue-800 text-[1.4rem] whitespace-nowrap"
                >
                  {name}
                </Link>
                {index < slugs.length - 1 && (
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className="text-gray-400 mx-2"
                  />
                )}
              </span>
            );
          })}
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-8 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform"
      >
        <FontAwesomeIcon icon={faBars} className="text-[2rem]" />
      </button>

      <div className="flex gap-[2rem] px-[1.5rem] md:px-[12rem] mt-[1rem] relative">
        <div
          className={`
            fixed md:static 
            top-0 left-0 
            h-full md:h-auto
            w-[85%] max-w-[32rem] md:w-auto
            bg-white md:bg-transparent 
            z-50 md:z-auto
            transition-transform duration-300 md:transition-none
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            overflow-y-auto md:overflow-visible
            shadow-2xl md:shadow-none
          `}
        >
          <div className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
            <h3 className="text-[1.8rem] font-semibold">Danh mục</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full active:scale-95"
            >
              <FontAwesomeIcon icon={faTimes} className="text-[2rem]" />
            </button>
          </div>

          <div className="p-4 md:p-0">
            <Sidebar />
          </div>
        </div>

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 w-full pb-[10rem] md:pb-0">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CategoryLayout;
