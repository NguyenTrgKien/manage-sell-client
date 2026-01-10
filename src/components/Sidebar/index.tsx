import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../../api/category.api";
import type { CategoriesType } from "../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faFolder,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentSlugs = pathSegments.length > 1 ? pathSegments.slice(1) : [];

  const { data: listCategory, isLoading } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: () => getAllCategory(),
  });

  const isInCurrentPath = (slugChain: string[]) => {
    if (slugChain.length === 0) return false;
    return slugChain.every((slug, index) => slug === currentSlugs[index]);
  };

  const goToCategory = (slugChain: string[]) => {
    if (slugChain.length === 0) return;
    navigate(`/category/${slugChain.join("/")}`);
    if (onClose) onClose();
  };

  const RenderSubCate = ({
    categories,
    parentSlugChain,
  }: {
    categories: CategoriesType[];
    parentSlugChain: string[];
  }) => {
    return (
      <>
        {categories.map((cate: CategoriesType) => {
          const slugsChain = [...parentSlugChain, cate.slug];
          const isActive = isInCurrentPath(slugsChain);
          const hasChild = cate.children && cate.children.length > 0;
          const isOpen =
            currentSlugs.length >= slugsChain.length &&
            isInCurrentPath(slugsChain);

          return (
            <div key={cate.id} className="my-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  goToCategory(slugsChain);
                }}
                className={`
                  flex items-center justify-between px-3 md:px-5 py-3 md:py-4 rounded-lg cursor-pointer
                  transition-all text-[1.3rem] md:text-[1.4rem]
                  ${isActive ? "bg-pink-50 text-pink-600 font-medium" : "hover:bg-gray-100"}
                `}
              >
                <span>{cate.categoryName}</span>
                {hasChild && (
                  <FontAwesomeIcon
                    icon={isOpen ? faAngleDown : faAngleRight}
                    className="text-[1.2rem]"
                  />
                )}
              </div>

              {hasChild && isOpen && (
                <div className="ml-3 md:ml-4 mt-1 border-l-2 border-pink-300 pl-2 md:pl-3">
                  <RenderSubCate
                    categories={cate.children!}
                    parentSlugChain={slugsChain}
                  />
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  const SkeletonLoading = () => (
    <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
      <div className="w-[4rem] h-[4rem] md:w-[5rem] md:h-[5rem] rounded-lg bg-gray-200"></div>
      <div className="flex-1 h-[3rem] rounded-lg bg-gray-200"></div>
    </div>
  );

  return (
    <div className="bg-white h-full text-[1.4rem] md:text-[1.6rem] w-full md:w-[26rem] shadow-xl md:shadow-none">
      {/* Header - Chỉ hiện trên mobile */}
      <div className="md:hidden sticky top-0 bg-white z-10 border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <h4 className="text-[1.8rem] font-bold text-gray-800">Danh mục sản phẩm</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-[2rem] text-gray-600" />
          </button>
        )}
      </div>

      {/* Title - Chỉ hiện trên desktop */}
      <h4 className="hidden md:block font-bold mb-[1rem] text-gray-600 pl-[1rem] px-1.5 py-1.5 md:px-[1rem] md:py-[1rem]">
        Danh mục
      </h4>

      {/* Content */}
      <div className="px-3 md:px-[1rem] pb-4 overflow-y-auto h-[calc(100vh-8rem)] md:h-auto">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLoading key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2 md:space-y-4">
            {listCategory &&
              listCategory.length > 0 &&
              listCategory.map((cate: CategoriesType) => {
                const slugChain = [cate.slug];
                const isRootActive = isInCurrentPath(slugChain);
                const hasChildren = cate.children && cate.children.length > 0;

                return (
                  <div
                    key={cate.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCategory(slugChain);
                    }}
                  >
                    <div
                      className={`
                        flex items-center justify-between px-3 md:px-4 py-3 rounded-lg cursor-pointer
                        transition-all group
                        ${
                          isRootActive
                            ? "bg-pink-50 shadow-sm"
                            : "hover:bg-gray-50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        {cate.image ? (
                          <img
                            src={cate.image}
                            alt={cate.categoryName}
                            className="w-[4rem] h-[4rem] md:w-[4.5rem] md:h-[4.5rem] rounded-lg object-cover flex-shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="w-[4rem] h-[4rem] md:w-[4.5rem] md:h-[4.5rem] rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="text-[1.8rem] md:text-[2rem] text-gray-400"
                            />
                          </div>
                        )}
                        <span
                          className={`text-[1.3rem] md:text-[1.5rem] truncate ${
                            isRootActive
                              ? "text-pink-600"
                              : "text-gray-700"
                          }`}
                        >
                          {cate.categoryName}
                        </span>
                      </div>
                      {hasChildren && (
                        <FontAwesomeIcon
                          icon={isRootActive ? faAngleDown : faAngleRight}
                          className={`text-[1.2rem] flex-shrink-0 transition-transform duration-300 ${
                            isRootActive ? "text-pink-600" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>

                    {isRootActive && hasChildren && (
                      <div className="mt-2 ml-4 md:ml-6 border-l-2 border-pink-300 pl-3 md:pl-4">
                        <RenderSubCate
                          categories={cate.children!}
                          parentSlugChain={slugChain}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;