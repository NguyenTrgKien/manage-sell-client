import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../../components/ui/MotionWrapper";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../../../../configs/axiosConfig";
import Loading from "../../../../components/Loading";

function DeleteStaff({
  openDelete,
  setOpenDelete,
  refetch,
}: {
  openDelete: number | null;
  setOpenDelete: Dispatch<SetStateAction<any>>;
  refetch: () => Promise<any>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = (await axiosConfig.delete(
        `/api/v1/staff/delete/${openDelete}`
      )) as any;
      if (res.status) {
        toast.success(res.message || "Xóa nhân viên thành công!");
        await refetch();
        setOpenDelete(null);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Lỗi không thể xóa nhân viên!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MotionWrapper
      open={!!openDelete}
      className="relative bg-white rounded-lg shadow-lg w-[50rem] p-[2.5rem]"
    >
      <button
        className="absolute top-[1rem] right-[1rem] text-gray-500 hover:text-gray-600 w-[3rem] h-[3rem] rounded-full bg-gray-200 hover:bg-gray-300 hover-linear"
        onClick={() => setOpenDelete(null)}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>

      <div className="mb-6">
        <p className="text-gray-600 text-[1.8rem]">
          Bạn có chắc chắn muốn xóa nhân viên này không?
        </p>
      </div>

      <div className="flex justify-end gap-[1rem] mt-[3rem]">
        <button
          className="px-[1.5rem] py-[.5rem] text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setOpenDelete(null)}
        >
          Hủy
        </button>
        <button
          className="px-[1.5rem] py-[.5rem] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          onClick={() => handleDelete()}
        >
          Xóa
        </button>
      </div>
      {isLoading && <Loading />}
    </MotionWrapper>
  );
}

export default DeleteStaff;
