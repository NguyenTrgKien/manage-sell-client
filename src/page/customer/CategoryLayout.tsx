import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlugs } from "../../api/category.api";

function CategoryLayout() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const slugs = pathSegments.slice(1);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories-by-slugs", slugs],
    queryFn: () => getCategoryBySlugs(slugs),
    enabled: slugs.length > 0,
  });

  return (
    <div className="overflow-hidden">
      <Header />
      <div className="flex items-center space-x-2 text-[1.4rem] mt-[16.5rem] px-[15rem]">
        <Link to="/" className="block space-x-2 text-blue-800 ">
          <span>Home</span>
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-gray-400 cursor-pointer"
          />
        </Link>
        {isLoading ? (
          <div>Đang tải...</div>
        ) : (
          slugs.map((slug, index) => {
            const category = categories[index];
            const name = category.categoryName;
            const path = "/category/" + slugs.slice(0, index + 1).join("/");
            return (
              <span key={slug}>
                <Link to={path} className="text-blue-800 text-[1.4rem]">
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
          })
        )}
      </div>
      <div className="flex gap-[2rem] px-[12rem] mt-[1rem]">
        <Sidebar />
        <div className="w-[80%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CategoryLayout;
