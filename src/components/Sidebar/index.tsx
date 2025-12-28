import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../../api/category.api";
import type { CategoriesType } from "../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentSlugs = pathSegments.length > 1 ? pathSegments.slice(1) : [];
  // lấy slugs hiện tại => mảng slugs hiện tại
  // Cần một danh sách category gốc => category full
  // Kiểm tra một danh mục có nằm trong chuỗi url hiện tại không
  // Dùng hàm đệ quy cây con
  //

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
    console.log(slugChain.join("/"));

    navigate(`/category/${slugChain.join("/")}`);
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
                  flex items-center justify-between px-5 py-4 rounded-lg cursor-pointer
                  transition-all
                  ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}
                `}
              >
                <span>{cate.categoryName}</span>
                {hasChild && (
                  <FontAwesomeIcon
                    icon={isOpen ? faAngleDown : faAngleRight}
                    className=""
                  />
                )}
              </div>

              {hasChild && isOpen && (
                <div className="ml-4 mt-1 border-l-1 border-pink-400 pl-3">
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
    <div className="flex flex-col">
      <li className="flex items-center gap-[1rem] cursor-pointer hover-linear py-[.8rem] px-[1.5rem] rounded-[.5rem]">
        <div className="w-[5rem] h-[5rem] rounded-lg bg-gray-200"></div>
        <span className="flex-1 py-4 rounded-lg bg-gray-200"></span>
      </li>
    </div>
  );

  return (
    <div className="w-[26rem] bg-white px-[1rem] py-[1rem] rounded-[.5rem]">
      <h4 className="font-bold mb-[1rem] text-gray-600 pl-[1rem]">Danh mục</h4>
      <>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonLoading key={i} />)
        ) : (
          <div className="space-y-4">
            {listCategory &&
              listCategory.length > 0 &&
              listCategory.map((cate: CategoriesType) => {
                const slugChain = [cate.slug];
                const isRootActive = isInCurrentPath(slugChain);
                const hasChildren = cate.children && cate.children.length > 0;

                return (
                  <div
                    key={cate.id}
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCategory(slugChain);
                    }}
                  >
                    <div
                      className={`
                    flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer
                    transition-all group
                    ${isRootActive ? "bg-gray-100" : "hover:bg-gray-100"}
                  `}
                    >
                      <div className="flex items-center space-x-4">
                        {cate.image ? (
                          <img
                            src={cate.image}
                            alt={cate.categoryName}
                            className="w-[4rem] h-[4rem] rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-[5rem] h-[5rem] rounded-lg bg-gray-100 flex items-center justify-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="text-[2rem]"
                            />
                          </div>
                        )}
                        <span className="">{cate.categoryName}</span>
                      </div>
                      {hasChildren && (
                        <FontAwesomeIcon
                          icon={isRootActive ? faAngleDown : faAngleRight}
                          className={`transition-transform `}
                        />
                      )}
                    </div>

                    {isRootActive && hasChildren && (
                      <div className="mt-2 ml-6 border-l-1 border-pink-400 pl-4">
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
      </>
    </div>
  );
}

export default Sidebar;
