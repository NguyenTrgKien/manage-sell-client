import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CategoriesType } from "../../utils/types";
import { Link } from "react-router-dom";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const DropdownMenu = ({
  categories,
  parentSlug,
  parentName,
}: {
  categories: CategoriesType[];
  parentSlug: string;
  parentName: string;
}) => {
  return (
    <div
      className="
        absolute top-full left-0 z-[999] min-w-[30rem] w-max
        bg-white shadow-2xl rounded-b-xl
        opacity-0 invisible translate-y-2
        group-hover/cate:opacity-100 group-hover/cate:visible group-hover/cate:translate-y-0
        transition-all duration-200
      "
    >
      <div className="px-5 py-3 border-b border-pink-100">
        <p className="text-[1.4rem] text-pink-600 uppercase tracking-wide">
          {parentName}
        </p>
      </div>

      <ul className="py-2">
        {categories.map((child: CategoriesType) => (
          <li key={child.id} className="relative group/child">
            <Link
              to={`/category/${parentSlug}/${child.slug}`}
              className="flex items-center justify-between gap-3 px-5 py-[.8rem] hover:bg-pink-50 hover:text-pink-600 transition-colors text-[1.4rem] text-gray-700"
            >
              <div className="flex items-center gap-3">
                {child.image && (
                  <img
                    src={child.image}
                    alt={child.categoryName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200"
                  />
                )}
                <span>{child.categoryName}</span>
              </div>

              {child.children?.length > 0 && (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="text-[1.2rem] text-gray-400 flex-shrink-0"
                />
              )}
            </Link>

            {child.children?.length > 0 && (
              <div
                className="
                  absolute top-0 left-full z-[999] min-w-[30rem] w-max
                  bg-white shadow-2xl rounded-xl
                  opacity-0 invisible translate-x-2
                  group-hover/child:opacity-100 group-hover/child:visible group-hover/child:translate-x-0
                  transition-all duration-200
                "
              >
                <DropdownMenu
                  categories={child.children}
                  parentSlug={`${parentSlug}/${child.slug}`}
                  parentName={child.categoryName}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <Link
          to={`/category/${parentSlug}`}
          className="text-[1.4rem] text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 transition-colors"
        >
          Xem tất cả {parentName}
          <FontAwesomeIcon icon={faAngleRight} className="text-[1.2rem]" />
        </Link>
      </div>
    </div>
  );
};

export default DropdownMenu;
