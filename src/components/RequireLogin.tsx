import { useNavigate } from "react-router-dom";
import MotionWrapper from "./ui/MotionWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface RequireLoginProp {
  open: boolean;
  onClose: () => void;
}

function RequireLogin({ open, onClose }: RequireLoginProp) {
  const navigate = useNavigate();
  return (
    <MotionWrapper
      open={open}
      className="relative w-[95%] md:w-[45rem] xl:w-[50rem] h-auto rounded-lg bg-white p-[2rem]"
    >
      <h2 className="text-[2rem] text-gray-600">
        Vui lòng đăng nhập để thực hiện
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
      <div className="mt-[2.5rem] flex items-center gap-[1rem] justify-end">
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
          type="button"
          className="px-[2rem] py-[.5rem] rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      </div>
    </MotionWrapper>
  );
}

export default RequireLogin;
