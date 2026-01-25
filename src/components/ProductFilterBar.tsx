import {
  faAngleDown,
  faArrowDown,
  faArrowUp,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";

interface ProductFilterBarProp {
  queryDefault: {
    limit: number;
    page: number;
    productName?: string;
    sort: "popular" | "latest" | "best_seller";
    price: "asc" | "desc";
  };
  handleChangeSort: (sort: "popular" | "latest" | "best_seller") => void;
  handleChangePrice: (price: "asc" | "desc") => void;
  setQueryDefault: any;
}

function ProductFilterBar({
  queryDefault,
  handleChangeSort,
  handleChangePrice,
  setQueryDefault,
}: ProductFilterBarProp) {
  const [searchParams] = useSearchParams();
  const isSort = searchParams.get("sort");
  return (
    <div className="w-full py-3 md:py-4 text-[1.2rem] md:text-[1.6rem] bg-gray-200 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-0 md:space-x-6 px-[1rem] md:px-[2rem] rounded-lg">
      <span>Sắp xếp theo</span>

      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        {!isSort && (
          <>
            <button
              type="button"
              className={`px-3 md:px-6 h-[3rem] md:h-[3.4rem] text-[1.2rem] md:text-[1.4rem] cursor-pointer rounded-md transition-colors ${
                queryDefault.sort === "popular"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleChangeSort("popular")}
            >
              Phổ biến
            </button>
            <button
              type="button"
              className={`px-3 md:px-4 h-[3rem] md:h-[3.4rem] text-[1.2rem] md:text-[1.4rem] cursor-pointer rounded-md transition-colors ${
                queryDefault.sort === "latest"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleChangeSort("latest")}
            >
              Mới nhất
            </button>
            <button
              type="button"
              className={`px-3 md:px-4 h-[3rem] md:h-[3.4rem] text-[1.2rem] md:text-[1.4rem] cursor-pointer rounded-md transition-colors ${
                queryDefault.sort === "best_seller"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleChangeSort("best_seller")}
            >
              Bán chạy
            </button>
          </>
        )}
      </div>

      <div className="md:flex hidden relative w-full md:w-[20rem] h-[3rem] md:h-[3.4rem] rounded-md bg-white px-3 md:px-4 items-center justify-between group">
        <span className="text-[1.2rem] md:text-[1.4rem]">
          Giá: {queryDefault.price === "asc" ? "Thấp đến Cao" : "Cao đến Thấp"}
        </span>
        <FontAwesomeIcon
          icon={faAngleDown}
          className="text-[1.2rem] md:text-[1.4rem]"
        />

        <div className="absolute top-[100%] left-0 w-full origin-top scale-y-0 opacity-0 bg-white group-hover:scale-y-100 transition-transform group-hover:opacity-[1] duration-300 shadow-lg rounded-md z-10">
          <div
            className={`flex items-center justify-between px-3 md:px-4 py-2 mt-2 cursor-pointer hover:bg-gray-200 rounded-t-md ${
              queryDefault.price === "asc" ? "text-red-500" : ""
            }`}
            onClick={() => handleChangePrice("asc")}
          >
            <span className="text-[1.2rem] md:text-[1.4rem]">Thấp đến Cao</span>
            {queryDefault.price === "asc" && (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-[1.2rem] md:text-[1.4rem]"
              />
            )}
          </div>
          <div
            className={`flex items-center justify-between px-3 md:px-4 py-2 mb-2 cursor-pointer hover:bg-gray-200 rounded-b-md ${
              queryDefault.price === "desc" ? "text-red-500" : ""
            }`}
            onClick={() => handleChangePrice("desc")}
          >
            <span className="text-[1.2rem] md:text-[1.4rem]">Cao đến Thấp</span>
            {queryDefault.price === "desc" && (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-[1.2rem] md:text-[1.4rem]"
              />
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        className=" md:hidden flex items-center space-x-1 px-4 h-[3rem] bg-white rounded-md cursor-pointer"
        onClick={() =>
          setQueryDefault((prev: any) => ({
            ...prev,
            price: queryDefault.price === "asc" ? "desc" : "asc",
          }))
        }
      >
        <span>Giá</span>
        <FontAwesomeIcon
          icon={queryDefault.price === "asc" ? faArrowUp : faArrowDown}
          className="text-[1rem] font-extralight"
        />
      </button>
    </div>
  );
}

export default ProductFilterBar;
