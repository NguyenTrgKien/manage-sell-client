import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../../../../../configs/axiosConfig";
import { AnimatePresence, motion } from "framer-motion";
import MotionWrapper from "../../../../../components/ui/MotionWrapper";

interface AddSizeColorProp {
  openAddSizeColor: { open: boolean; node: "size" | "color" };
  setOpenAddSizeColor: React.Dispatch<React.SetStateAction<any>>;
  onSuccess: () => void;
}

function AddSizeColor({
  openAddSizeColor,
  setOpenAddSizeColor,
  onSuccess,
}: AddSizeColorProp) {
  const [isLoading, setIsLoading] = useState(false);
  const [sizeName, setSizeName] = useState("");
  const [sizeType, setSizeType] = useState<"cloth" | "shoes">("cloth");
  const [colorName, setColorName] = useState("");
  const [hexCode, setHexCode] = useState("#000000");

  const isSizeMode = openAddSizeColor.node === "size";
  const handleSubmit = async () => {
    if (isSizeMode) {
      if (!sizeName.trim()) {
        toast.error("Vui lòng nhập tên size!");
        return;
      }
    } else {
      if (!colorName.trim()) {
        toast.error("Vui lòng nhập tên màu!");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isSizeMode) {
        const res = (await axiosConfig.post("api/v1/variant-size/create", {
          name: sizeName.trim(),
          type: sizeType,
        })) as any;
        if (res.status) {
          toast.success(res.message || "Thêm size thành công");
        }
      } else {
        const res = (await axiosConfig.post("api/v1/variant-color/create", {
          name: colorName.trim(),
          hexCode: hexCode,
        })) as any;
        if (res.status) {
          toast.success(res.message || "Thêm màu thành công");
        }
      }

      onSuccess();
      setOpenAddSizeColor({ open: false, node: "size" });
      setSizeName("");
      setColorName("");
      setHexCode("#000000");
    } catch (error) {
      toast.error("Thêm thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenAddSizeColor({ open: false, node: "size" });
    setSizeName("");
    setColorName("");
    setHexCode("#000000");
  };

  return (
    <MotionWrapper
      open={openAddSizeColor.open}
      className="relative w-[50rem] bg-white p-[3rem] rounded-lg shadow-xl"
    >
      <button
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        onClick={handleClose}
        disabled={isLoading}
      >
        <FontAwesomeIcon icon={faClose} className="text-gray-600" />
      </button>

      <h2 className="text-[2rem] text-center font-bold text-green-600 mb-6">
        {isSizeMode ? "Thêm Size Mới" : "Thêm Màu Mới"}
      </h2>

      {isSizeMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-[1.4rem] text-gray-700 mb-2">
              Tên size <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sizeName}
              onChange={(e) => setSizeName(e.target.value)}
              className="w-full h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-[1.4rem]"
              placeholder="VD: XXL, 43"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-[1.4rem] text-gray-700 mb-2">
              Loại sản phẩm
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-[1.4rem]">
                <input
                  type="radio"
                  name="sizeType"
                  value="cloth"
                  checked={sizeType === "cloth"}
                  onChange={() => setSizeType("cloth")}
                  disabled={isLoading}
                />
                Quần áo
              </label>
              <label className="flex items-center gap-2 text-[1.4rem]">
                <input
                  type="radio"
                  name="sizeType"
                  value="shoes"
                  checked={sizeType === "shoes"}
                  onChange={() => setSizeType("shoes")}
                  disabled={isLoading}
                />
                Giày dép
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-[1.4rem] text-gray-700 mb-2">
              Tên màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full h-[4rem] px-4 rounded-lg border border-gray-300 focus:border-blue-500 outline-none text-[1.4rem]"
              placeholder="VD: Xanh ngọc"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-[1.4rem] text-gray-700 mb-2">
              Chọn màu
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border border-gray-300"
                disabled={isLoading}
              />
              <span className="text-[1.6rem] font-mono">{hexCode}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang thêm...
            </>
          ) : (
            "Thêm"
          )}
        </button>
      </div>
    </MotionWrapper>
  );
}

export default AddSizeColor;
