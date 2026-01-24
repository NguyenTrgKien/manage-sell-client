import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import AddSizeColor from "./AddSizeColor";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import MotionWrapper from "../../../../components/ui/MotionWrapper";

export interface VariantSize {
  id: number;
  name: string;
  type: "cloth" | "shoes";
  sortOrder: number;
}

export interface VariantColor {
  id: number;
  name: string;
  hexCode: string;
  sortOrder: number;
}

interface ActionVariantProp {
  openActionVariant: { open: boolean; node: "add" | "edit"; data: any };
  setOpenActionVariant: Dispatch<SetStateAction<any>>;
  setValue: any;
  variants: any;
  dataUpdate?: any;
  dataSize: VariantSize[];
  isLoadingSize: any;
  dataColor: VariantColor[];
  isLoadingColor: any;
}

function ActionVariant({
  openActionVariant,
  setOpenActionVariant,
  setValue,
  variants,
  dataUpdate,
  dataSize,
  dataColor,
}: ActionVariantProp) {
  const [sizeType, setSizeType] = useState<"cloth" | "shoes">("cloth");
  const queryClient = useQueryClient();
  const [openAddSizeColor, setOpenAddSizeColor] = useState<{
    open: boolean;
    node: "size" | "color";
  }>({ open: false, node: "size" });
  const [messageInput, setMessageInput] = useState({
    size: "",
    color: "",
    inventory: "",
  });
  const [dataVariants, setDataVariants] = useState<{
    sizeId: number | null;
    colorId: number | null;
    price: string | null;
    inventory: string | null;
  }>({
    sizeId: null,
    colorId: null,
    price: null,
    inventory: null,
  });

  useEffect(() => {
    if (openActionVariant.node === "edit" && dataUpdate) {
      const foundSize = dataSize.find((s) => s.id === dataUpdate.sizeId);
      setDataVariants({
        sizeId: dataUpdate.sizeId,
        colorId: dataUpdate.colorId,
        price: dataUpdate.price,
        inventory: dataUpdate.inventory,
      });
      if (foundSize) {
        setSizeType(foundSize.type);
      }
    }
  }, [dataUpdate, openActionVariant, dataSize]);

  useEffect(() => {
    if (openActionVariant.node === "add") {
      setDataVariants({
        sizeId: null,
        colorId: null,
        price: null,
        inventory: null,
      });
      setSizeType("cloth");
    }
  }, [openActionVariant]);

  const handleAdd = () => {
    if (!dataVariants.sizeId) {
      setMessageInput((prev) => ({
        ...prev,
        size: "Vui lòng chọn size cho sản phẩm!",
      }));
      return;
    }
    if (!dataVariants.colorId) {
      setMessageInput((prev) => ({
        ...prev,
        color: "Vui lòng chọn màu sắc cho sản phẩm!",
      }));
      return;
    }
    if (!dataVariants.inventory) {
      setMessageInput((prev) => ({
        ...prev,
        inventory: "Vui lòng nhập số lượng tồn kho!",
      }));
      return;
    }
    const isDuplicate = variants.some(
      (v: any) =>
        v.sizeId === Number(dataVariants.sizeId) &&
        v.colorId === Number(dataVariants.colorId),
    );
    if (isDuplicate) {
      toast.warn("Thuộc tính với Size và Màu này đã tồn tại!");
      return;
    }
    setValue("variants", [
      ...variants,
      {
        tempId: Date.now(),
        sizeId: Number(dataVariants.sizeId),
        colorId: Number(dataVariants.colorId),
        price: dataVariants.price ? Number(dataVariants.price) : null,
        inventory: Number(dataVariants.inventory),
        isEdited: false,
      },
    ]);
    setOpenActionVariant({ open: false, node: "add", data: null });
  };

  const handleEdit = () => {
    if (!dataVariants.sizeId) {
      setMessageInput((prev) => ({
        ...prev,
        size: "Vui lòng chọn size cho sản phẩm!",
      }));
      return;
    } else if (!dataVariants.colorId) {
      setMessageInput((prev) => ({
        ...prev,
        color: "Vui lòng chọn màu sắc cho sản phẩm!",
      }));
      return;
    } else if (!dataVariants.inventory) {
      setMessageInput((prev) => ({
        ...prev,
        inventory: "Vui lòng nhập số lượng tồn kho!",
      }));
      return;
    }
    const isId = dataUpdate.id;
    const isDuplicate = variants.some((v: any) => {
      const isSameVariant = !isId
        ? v.tempId === dataUpdate.tempId
        : v.id === dataUpdate.id;

      return (
        !isSameVariant &&
        v.sizeId === Number(dataVariants.sizeId) &&
        v.colorId === Number(dataVariants.colorId)
      );
    });

    if (isDuplicate) {
      toast.warn("Thuộc tính với Size và Màu này đã tồn tại!");
      return;
    }

    const updatedVariant = {
      tempId: dataUpdate.tempId,
      sizeId: dataVariants.sizeId,
      colorId: dataVariants.colorId,
      price: dataVariants.price ? Number(dataVariants.price) : null,
      inventory: Number(dataVariants.inventory),
      ...(dataUpdate.id && { id: dataUpdate.id }),
      isEdited: true,
    };

    const editVariant = variants.map((variant: any) => {
      if (variant.tempId === dataUpdate.tempId) {
        return updatedVariant;
      }
      return variant;
    });
    setValue("variants", editVariant);
    setOpenActionVariant({ open: false, node: "add", data: null });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["variantSize"] });
    queryClient.invalidateQueries({ queryKey: ["variantColor"] });
  };

  return (
    <MotionWrapper
      open={openActionVariant.open}
      className="relative max-w-[75rem] bg-white p-[3rem] rounded-lg shadow-md"
    >
      <button
        className="absolute w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center top-[1.5rem] right-[1.5rem] p-2 hover:bg-gray-200 rounded-full"
        onClick={() =>
          setOpenActionVariant({ open: false, node: "add", data: null })
        }
      >
        <FontAwesomeIcon icon={faClose} className="text-gray-600" />
      </button>

      <h2
        className={`text-[2rem] text-center font-bold ${openActionVariant.node === "add" ? "text-green-600" : "text-amber-600"} mb-4`}
      >
        {openActionVariant.node === "add"
          ? "Thêm thuộc tính sản phẩm"
          : "Chỉnh sửa thuộc tính"}
      </h2>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[4rem] mt-[.5rem]">
          <label className="text-gray-600 text-[1.4rem]">Chọn size:</label>
        </div>
        <button
          className="text-blue-600 text-[1.3rem] flex items-center gap-1 hover:underline"
          onClick={() => setOpenAddSizeColor({ node: "size", open: true })}
        >
          <span>+</span> Thêm size
        </button>
      </div>
      <div className="flex items-center overflow-x-auto gap-[4rem] mt-[.5rem]">
        <div className="flex items-center gap-[1rem]">
          <label htmlFor="cloth" className="text-[1.4rem] text-gray-600">
            Quần áo
          </label>
          <input
            type="radio"
            id="cloth"
            className=""
            checked={sizeType === "cloth"}
            onChange={() => setSizeType("cloth")}
          />
        </div>
        <div className="flex items-center gap-[1rem]">
          <label htmlFor="shoes" className="text-[1.4rem] text-gray-600">
            Giày dép
          </label>
          <input
            type="radio"
            id="shoes"
            className=""
            checked={sizeType === "shoes"}
            onChange={() => setSizeType("shoes")}
          />
        </div>
      </div>
      <div className="w-full overflow-auto hide-scrollbar flex flex-nowrap items-center gap-[1rem] mt-[1rem] pt-[.5rem]">
        {dataSize?.map((size) => {
          if (size.type === sizeType) {
            return (
              <button
                key={size.id}
                className={`flex-shrink-0 px-[1.5rem] py-[.5rem] border-[.2rem] text-gray-600 border-gray-300 rounded-xl hover:border-blue-600 hover:translate-y-[-.2rem] hover-linear hover:shadow-xl ${size.id === dataVariants.sizeId ? "bg-blue-500 border-none text-white shadow-xl shadow-blue-100" : ""}`}
                onClick={() => {
                  setDataVariants((prev) => ({ ...prev, sizeId: size.id }));
                  setMessageInput((prev) => ({ ...prev, size: "" }));
                }}
              >
                {size.name}
              </button>
            );
          }
        })}
      </div>
      <p className="text-red-500 text-[1.4rem] mt-[.5rem]">
        {messageInput.size}
      </p>

      <div className="flex justify-between items-center mt-[2.5rem]">
        <div className="flex items-center gap-[4rem] mt-[.5rem]">
          <label className="text-gray-600 text-[1.4rem]">Chọn màu:</label>
        </div>
        <button
          className="text-blue-600 text-[1.3rem] flex items-center gap-1 hover:underline"
          onClick={() => setOpenAddSizeColor({ node: "color", open: true })}
        >
          <span>+</span> Thêm màu
        </button>
      </div>
      <div className="w-full max-h-[24rem] overflow-y-auto grid grid-cols-4 gap-[1rem] mt-[1rem] pt-[.5rem]">
        {dataColor?.map((color) => {
          return (
            <button
              key={color.id}
              className={`w-full flex items-center gap-[1rem] px-[2rem] py-[.6rem] border-[.2rem]  rounded-xl hover:translate-y-[-.2rem] hover-linear hover:shadow-xl hover:border-blue-500 ${color.id === dataVariants.colorId ? "bg-blue-100 border-blue-500" : "border-gray-300"}`}
              onClick={() => {
                setDataVariants((prev) => ({ ...prev, colorId: color.id }));
                setMessageInput((prev) => ({ ...prev, color: "" }));
              }}
            >
              <div
                className={`block w-[3rem] h-[3rem] rounded-full border-[.2rem] border-gray-300`}
                style={{ background: color.hexCode }}
              ></div>
              <p className="text-[1.4rem] text-gray-600">{color.name}</p>
            </button>
          );
        })}
      </div>
      <p className="text-red-500 text-[1.4rem] mt-[.5rem]">
        {messageInput.color}
      </p>

      <div className="flex items-start gap-[2rem]">
        <div className="w-full">
          <label
            htmlFor="price"
            className="block text-gray-600 text-[1.4rem] mt-[2rem]"
          >
            Giá khác
          </label>
          <input
            type="number"
            id="price"
            className="w-full h-[4rem] rounded-xl border border-gray-400 pl-[1.5rem] mt-[.5rem] outline-none focus:border-[.2rem] focus:border-blue-500"
            placeholder="VD: 200000"
            value={dataVariants.price ?? ""}
            onChange={(e) =>
              setDataVariants((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="inventory"
            className="block text-gray-600 text-[1.4rem] mt-[2rem]"
          >
            Số lượng kho
          </label>
          <input
            type="number"
            id="inventory"
            className="w-full h-[4rem] rounded-xl border border-gray-400 pl-[1.5rem] mt-[.5rem] outline-none focus:border-[.2rem] focus:border-blue-500"
            placeholder="VD: 5"
            value={dataVariants.inventory ?? ""}
            onChange={(e) => {
              setDataVariants((prev) => ({
                ...prev,
                inventory: e.target.value,
              }));
              setMessageInput((prev) => ({ ...prev, inventory: "" }));
            }}
          />
          <p className="text-red-500 text-[1.4rem] mt-[.5rem]">
            {messageInput.inventory}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[1.5rem] justify-end mt-[2rem]">
        <button
          className=" bg-gray-200 text-gray-600 py-2 rounded hover:bg-gray-300 px-[2rem] hover-linear"
          onClick={() =>
            setOpenActionVariant({ open: false, node: "add", data: null })
          }
        >
          Hủy
        </button>
        <button
          className=" bg-green-500 text-white py-2 rounded hover:bg-green-600 px-[2rem] hover-linear"
          onClick={() => {
            if (openActionVariant.node === "add") {
              handleAdd();
            } else {
              handleEdit();
            }
          }}
        >
          {openActionVariant.node === "edit" ? "Lưu" : "Thêm"}
        </button>
      </div>
      <AddSizeColor
        openAddSizeColor={openAddSizeColor}
        setOpenAddSizeColor={setOpenAddSizeColor}
        onSuccess={onSuccess}
      />
    </MotionWrapper>
  );
}

export default ActionVariant;
