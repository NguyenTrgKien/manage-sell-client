import MotionWrapper from "./ui/MotionWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface NotifyProp {
  showNotify: boolean;
  content: string;
  duration: number;
  onClose?: () => void;
}

function Notify({ showNotify, content, duration, onClose }: NotifyProp) {
  return (
    <MotionWrapper
      open={showNotify}
      duration={duration}
      onClose={onClose}
      className="flex flex-col justify-center items-center gap-[1rem] min-w-[30rem] max-w-[50rem] min-h-[10rem] bg-white p-[3rem] rounded-lg"
    >
      <div className="w-[4rem] h-[4rem] rounded-full bg-green-500 flex items-center justify-center">
        <FontAwesomeIcon icon={faCheck} className="text-[2rem] text-white" />
      </div>
      <div className="text-gray-600 select-none ">{content}</div>
    </MotionWrapper>
  );
}

export default Notify;
