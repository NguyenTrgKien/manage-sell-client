import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../api/category.api";
import type { CategoriesType } from "../utils/types";
import { Link } from "react-router-dom";

function CategoriesSection() {
  const { data: dataCategories = [], isLoading } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });
  console.log(dataCategories);

  const SkeletonCategories = () => {
    return <div>Đang tải dữ liệu</div>;
  };

  return (
    <section className="mt-[2rem] rounded-[.5rem] bg-white p-[1.5rem] md:p-[2rem]">
      <h4 className="text-[1.4rem] md:text-[1.8rem] font-bold text-pink-500 mb-6">
        Danh mục
      </h4>
      {isLoading ? (
        <SkeletonCategories />
      ) : dataCategories.length > 0 ? (
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="h-auto grid grid-flow-col auto-cols-[12rem] gap-2.5">
            {dataCategories
              .filter((it: CategoriesType) => it.image)
              .map((c: CategoriesType) => {
                return (
                  <Link
                    to={`/category/${c.slug}`}
                    key={c.id}
                    className="border flex items-center flex-col justify-center border-gray-200 rounded-lg p-2.5 group hover:border-gray-400 shadow-md transition-colors duration-300 cursor-pointer"
                  >
                    <img
                      src={c.image}
                      alt={`image-${c.categoryName}`}
                      className="w-[8rem] h-[8rem] rounded-full object-cover group-hover:scale-[1.1] transition-transform duration-300"
                    />
                    <p className="line-clamp-1 mt-1">{c.categoryName}</p>
                  </Link>
                );
              })}
          </div>
        </div>
      ) : (
        <div>Không có danh mục nào</div>
      )}
    </section>
  );
}

export default CategoriesSection;
