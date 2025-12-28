import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "./ui/MotionWrapper";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface OpenLoginProp {
  open: boolean;
  onClose: () => void;
}

function OpenLogin({ open, onClose }: OpenLoginProp) {
  const navigate = useNavigate();
  return (
    <MotionWrapper
      open={open}
      className="relative w-[60rem] rounded-lg bg-white p-[3rem]"
    >
      <h2 className="text-[1.8rem] text-gray-600 mb-[2.5rem] font-bold">
        Email này đã có tài khoản vui lòng đăng nhập để tiếp tục!
      </h2>
      <div
        className="absolute top-[1rem] right-[1rem]"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <FontAwesomeIcon
          icon={faClose}
          className="text-[1.8rem] text-gray-500 hover:text-gray-800 cursor-pointer"
        />
      </div>
      <div className="mt-[3rem] flex items-center gap-[1rem] justify-end">
        <button
          type="button"
          className="px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-[2rem] py-[.5rem] rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300"
          onClick={() => navigate("/login")}
        >
          Đăng nhập ngay
        </button>
      </div>
    </MotionWrapper>
  );
}

export default OpenLogin;
