import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type Dispatch, type SetStateAction } from "react";
import axiosConfig from "../../../../configs/axiosConfig";

type ToggleActiveCategoryProp = {
  setOpenToggleActive: Dispatch<SetStateAction<any>>;
  openToggleActive: { id: number; title: string } | null;
  refetch: () => Promise<any>;
};

function ToggleActiveCategory({
  setOpenToggleActive,
  openToggleActive,
  refetch,
}: ToggleActiveCategoryProp) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRemove = async () => {
    if (!openToggleActive?.id) {
      setMessage("Không có id của danh mục");
    }
    setIsLoading(true);
    try {
      let res = null;
      console.log(openToggleActive);

      if (openToggleActive?.title === "active") {
        res = await axiosConfig.patch(
          `/api/v1/category/active/${openToggleActive?.id}`
        );
      } else {
        res = await axiosConfig.patch(
          `/api/v1/category/inactive/${openToggleActive?.id}`
        );
      }
      if (res?.status) {
        setOpenToggleActive(false);
        setIsLoading(false);
        await refetch();
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh] flex items-center justify-center bg-[#43434344] z-[999]">
      <div className="relative w-[50rem] h-auto bg-white p-[3rem] rounded-lg">
        <div
          className="absolute flex items-center justify-center top-[1rem] right-[1rem] w-[3rem] h-[3rem] rounded-full bg-gray-200 hover:bg-gray-300 hover-linear"
          onClick={() => setOpenToggleActive(false)}
        >
          <FontAwesomeIcon icon={faClose} className="text-gray-500" />
        </div>
        <h2 className="text-[1.8rem] text-gray-800">
          Bạn có chắc muốn{" "}
          {openToggleActive?.title === "active"
            ? "kích hoạt"
            : "dừng hoạt động"}{" "}
          danh mục này?
        </h2>
        {message && (
          <p className="text-red-500 text-[1.4rem] mt-[4rem]">{message}</p>
        )}
        <div
          className={`flex items-center justify-end gap-[1rem] ${isLoading ? "mt-[1rem]" : "mt-[4rem]"}`}
        >
          <button
            className={`w-[8rem] h-[3.2rem] rounded-sm bg-gray-200 text-gray-600 text-[1.4rem] hover:bg-gray-300 hover-linear ${isLoading ? "cursor-not-allowed" : ""}`}
            onClick={() => setOpenToggleActive(false)}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            className={`w-[6.5rem] h-[3.2rem] rounded-sm bg-red-500 text-white text-[1.4rem] hover:bg-red-600 hover-linear ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-red-600"}`}
            disabled={isLoading}
            onClick={() => handleRemove()}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : openToggleActive?.title === "active" ? (
              "Có"
            ) : (
              "Dừng"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToggleActiveCategory;
