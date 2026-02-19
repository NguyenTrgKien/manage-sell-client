import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import {
  faClose,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  CollectionStatus,
  type Collection,
} from "../../../utils/collection.type";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCollectionStatus } from "../../../api/collection.api";

interface ToggleStatusModalProp {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

function ToggleStatusModal({
  isOpen,
  onClose,
  collection,
}: ToggleStatusModalProp) {
  const queryClient = useQueryClient();

  const { mutate: handleToggleStatus, isPending } = useMutation({
    mutationFn: (data: { id: number; status: CollectionStatus }) =>
      toggleCollectionStatus(data.id, data.status),
    onSuccess: (_, variables) => {
      const collectionName = collection?.name || "Collection";
      const wasActive = variables.status === CollectionStatus.INACTIVE;

      toast.success(
        `${wasActive ? "Vô hiệu hóa" : "Kích hoạt"} collection "${collectionName}" thành công!`,
      );
      queryClient.invalidateQueries({ queryKey: ["allCollections"] });
      onClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Có lỗi xảy ra";
      toast.error(`Có lỗi xảy ra: ${errorMessage}`);
    },
  });

  if (!collection) return null;

  const isActive = collection.status === CollectionStatus.ACTIVE;
  const newStatus = isActive
    ? CollectionStatus.INACTIVE
    : CollectionStatus.ACTIVE;

  const onToggle = () => {
    if (!collection) {
      toast.error("Không tìm thấy thông tin collection");
      return;
    }
    handleToggleStatus({ id: collection.id, status: newStatus });
  };

  return (
    <MotionWrapper
      open={isOpen}
      className="relative bg-white rounded-xl pb-[2rem] w-[50rem] h-auto overflow-y-auto hide-scrollbar p-8"
    >
      <div className="flex items-start gap-4 mb-6">
        <div>
          <h3 className="font-bold text-[1.8rem] text-gray-800 mb-2">
            {isActive ? "Vô hiệu hóa collection?" : "Kích hoạt collection?"}
          </h3>
          <p className="text-gray-600 text-[1.4rem]">
            {isActive ? (
              <>
                Collection{" "}
                <span className="font-semibold">"{collection.name}"</span> sẽ
                không hiển thị trên trang web. Bạn có thể kích hoạt lại bất cứ
                lúc nào.
              </>
            ) : (
              <>
                Collection{" "}
                <span className="font-semibold">"{collection.name}"</span> sẽ
                được hiển thị trở lại trên trang web.
              </>
            )}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center top-[1rem] right-[1rem] p-2 hover:bg-gray-200 rounded-full transition-colors"
        disabled={isPending}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>

      <div className="flex items-center justify-end mt-8 gap-2">
        <button
          className="py-2 px-8 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors text-[1.4rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onClose}
          disabled={isPending}
        >
          Hủy
        </button>
        <button
          className={`py-2 px-8 text-white rounded-md transition-colors text-[1.4rem] font-medium ${
            isActive
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-green-500 hover:bg-green-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={onToggle}
          disabled={isPending}
        >
          {isPending ? "Đang xử lý..." : isActive ? "Vô hiệu hóa" : "Kích hoạt"}
        </button>
      </div>
    </MotionWrapper>
  );
}

export default ToggleStatusModal;
