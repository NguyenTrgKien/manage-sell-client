import MotionWrapper from "./ui/MotionWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface NotifyProp {
  showNotify: boolean;
  content: string;
  duration: number;
  onClose?: () => void;
  isSuccess?: boolean;
}

function Notify({
  showNotify,
  content,
  duration,
  onClose,
  isSuccess = true,
}: NotifyProp) {
  return (
    <MotionWrapper
      open={showNotify}
      duration={duration}
      onClose={onClose}
      className="flex flex-col justify-center items-center gap-[1rem] min-w-[30rem] max-w-[50rem] min-h-[10rem] bg-white p-[3rem] rounded-lg"
    >
      <div
        className={`w-[4rem] h-[4rem] rounded-full ${isSuccess ? "bg-green-500" : "bg-red-500"} flex items-center justify-center`}
      >
        {isSuccess ? (
          <FontAwesomeIcon icon={faCheck} className="text-[2rem] text-white" />
        ) : (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="text-[2rem] text-white"
          />
        )}
      </div>
      <div className="text-gray-600 select-none ">{content}</div>
    </MotionWrapper>
  );
}

export default Notify;
