import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface CancelFlashSaleProp {
  open: boolean;
  onClose: () => void;
}

function CancelFlashSale({ open, onClose }: CancelFlashSaleProp) {
  const handleCancelled = () => {};

  return (
    <MotionWrapper
      open={open}
      className="relative w-[60rem] h-auto bg-white rounded-[1rem] shadow-xl p-[2rem] text-[1.4rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          onClose();
        }}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>
      <h3 className=" text-[1.6rem] pb-4 font-semibold">
        Bạn có chắc muốn hủy FlashSale này?
      </h3>
      <div className="pt-8 flex justify-end gap-4">
        <button
          type="button"
          className="px-6 py-3 text-[1.4rem] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => {
            onClose();
          }}
        >
          Không
        </button>
        <button
          type="button"
          className="px-6 py-3 text-[1.4rem] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          onClick={() => {
            handleCancelled();
          }}
        >
          Hủy
        </button>
      </div>
    </MotionWrapper>
  );
}

export default CancelFlashSale;
