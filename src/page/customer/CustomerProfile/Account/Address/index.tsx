import { faAdd, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { AddressType } from "../../../../../utils/userType";
import MotionWrapper from "../../../../../components/ui/MotionWrapper";
import { toast } from "react-toastify";
import axiosConfig from "../../../../../configs/axiosConfig";
import ActionAddress from "../../../../../components/ActionAddress";
import { useUser } from "../../../../../hooks/useUser";

function Address() {
  const { user, refreshUser } = useUser();
  const addresses = user?.address;
  const [isLoading, setIsLoading] = useState(false);
  const [openActionAddress, setOpenActionAddress] = useState<{
    open: boolean;
    dataUpdate: null | AddressType;
    action: "edit" | "add";
  }>({
    open: false,
    dataUpdate: null,
    action: "add",
  });
  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    delete: null | number;
  }>({
    open: false,
    delete: null,
  });

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await axiosConfig.delete(
        `/api/v1/address/delete/${openDelete.delete}`,
      );
      if (res.status) {
        setOpenDelete({ open: false, delete: null });
        await refreshUser();
        return;
      }
    } catch (error: any) {
      console.log(error);
      setOpenDelete({ open: false, delete: null });
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const res = await axiosConfig.patch(`/api/v1/address/set-default/${id}`);
      if (res.status) {
        await refreshUser();
        return;
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSuccess = async () => {
    await refreshUser();
  };
  return (
    <div className="p-[2rem]">
      <div className="flex items-center justify-between pb-[2rem] border-b border-b-gray-300">
        <h3 className="text-[1.8rem] text-gray-800">Địa chỉ của tôi</h3>
        <button
          className="flex items-center gap-[.5rem] px-5 py-2.5 bg-red-500 rounded-md hover:bg-red-600 transition duration-300 cursor-pointer"
          onClick={() =>
            setOpenActionAddress({
              open: true,
              action: "add",
              dataUpdate: null,
            })
          }
        >
          <FontAwesomeIcon icon={faAdd} className="text-white" />
          <span className="text-white">Thêm địa chỉ</span>
        </button>
      </div>
      <div className="mt-[2rem] space-y-4">
        {addresses && addresses?.length > 0 ? (
          <>
            <h4 className="text-[1.8rem] text-gray-800 mb-[2rem]">Địa chỉ</h4>
            {addresses.map((add) => {
              return (
                <div
                  key={add.id}
                  className="flex md:items-center flex-col md:flex-row justify-between border border-dashed rounded-md p-[2rem] border-gray-300"
                >
                  <div className="space-y-2" key={add.id}>
                    <div className="flex items-center gap-[1rem] text-gray-500">
                      <span className="text-gray-800">{add.recipentName}</span>
                      <span className="block h-[1.5rem] border-l border-l-gray-300"></span>
                      <span className="text-[1.4rem]">{add.phone}</span>
                    </div>
                    <p className="text-[1.4rem] text-gray-500">
                      {add.addressDetail}
                    </p>
                    <p className="text-[1.4rem] text-gray-500">
                      {add.ward}, {add.district}, {add.province}
                    </p>
                    {add.isDefault && (
                      <button className="text-[1.2rem] px-[.8rem] py-[.2rem] text-red-500 border border-red-300 rounded-sm">
                        Mặc định
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col space-y-4">
                    <div
                      className={`flex items-center gap-[1rem] md:mt-0 mt-5`}
                    >
                      <button
                        className="flex-1 px-[1rem] py-[.4rem] text-[1.4rem] border text-blue-500 border-blue-400 hover:border-blue-600 hover:text-blue-600 rounded-sm"
                        onClick={() =>
                          setOpenActionAddress({
                            open: true,
                            dataUpdate: add,
                            action: "edit",
                          })
                        }
                      >
                        Cập nhật
                      </button>
                      {!add.isDefault && (
                        <button
                          className="px-[1rem] py-[.4rem] text-[1.4rem] border text-red-500 border-red-400 hover:border-red-600 hover:text-red-600 rounded-sm"
                          onClick={() =>
                            setOpenDelete({ open: true, delete: add.id })
                          }
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    <button
                      className={`px-[1rem] py-[.4rem] text-[1.4rem] border ${add.isDefault ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-orange-500 border-orange-400 hover:border-orange-600 hover:text-orange-600"}  rounded-sm`}
                      disabled={add.isDefault}
                      onClick={() => handleSetDefault(add.id)}
                    >
                      Thiết lập mặc định
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-[2rem] text-red-500"
            />
            <p className="text-gray-500 text-[1.6rem] select-none">
              Bạn chưa có địa chỉ nào
            </p>
          </div>
        )}
      </div>

      <ActionAddress
        openActionAddress={openActionAddress}
        onClose={() =>
          setOpenActionAddress({ open: false, dataUpdate: null, action: "add" })
        }
        onSuccess={onSuccess}
      />

      <MotionWrapper
        open={openDelete.open}
        className="relative w-[50rem] min-h-[10rem] rounded-lg bg-white p-[2.5rem]"
      >
        <h2 className="text-[1.8rem] text-gray-800">
          Bạn có chắc muốn xóa địa chỉ này?
        </h2>
        <div className="mt-[2rem] flex items-center justify-end gap-[1rem]">
          <button
            className="px-[2rem] py-[.5rem] text-[1.4rem] text-gray-600 bg-gray-200  hover:bg-gray-300 rounded-sm"
            onClick={() => setOpenDelete({ open: false, delete: null })}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            className="px-[2rem] py-[.5rem] text-[1.4rem] text-white bg-red-500 hover:bg-red-600 rounded-sm"
            onClick={() => handleDelete()}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xóa"}
          </button>
        </div>
      </MotionWrapper>
    </div>
  );
}

export default Address;
