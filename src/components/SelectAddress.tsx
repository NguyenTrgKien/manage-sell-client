import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "./ui/MotionWrapper";
import {
  faAdd,
  faClose,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import type { AddressType } from "../utils/userType";
import ActionAddress from "./ActionAddress";
import { useUser } from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface SelectAddressProp {
  open: boolean;
  onSelect: (addr: any) => void;
  selectedId: number | null;
  onClose: () => void;
}

function SelectAddress({
  open,
  onSelect,
  onClose,
  selectedId,
}: SelectAddressProp) {
  const { refreshUser, user } = useUser();
  const [selectedAdd, setSelectedAdd] = useState<AddressType | null>(null);
  const queryClient = useQueryClient();
  const [openActionAddress, setOpenActionAddress] = useState<{
    open: boolean;
    dataUpdate: AddressType | null;
    action: "edit" | "add";
  }>({
    open: false,
    dataUpdate: null,
    action: "add",
  });
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      if (user.address.length > 0) {
        const dataAddresses = user.address;
        setAddresses(dataAddresses);
      }
    }
  }, [user]);
  console.log(addresses);

  useEffect(() => {
    if (open && selectedId && addresses) {
      const currentAddress = addresses.find((addr) => addr.id === selectedId);
      if (currentAddress) {
        setSelectedAdd(currentAddress);
      }
    }
  }, [selectedId, addresses]);

  const handleConfirm = () => {
    onSelect(selectedAdd);
    refreshUser();
    onClose();
  };

  const handleActionSuccess = async () => {
    setOpenActionAddress({
      open: false,
      dataUpdate: null,
      action: "add",
    });

    await queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <>
      <MotionWrapper
        open={open}
        className="relative w-[60rem] min-h-[20rem] max-h-[65rem] overflow-hidden rounded-lg bg-white p-[2.5rem]"
      >
        <h2 className="text-[2rem] text-center text-orange-600 font-bold">
          Thay đổi địa chỉ
        </h2>
        <div
          className="absolute top-[1rem] right-[1rem]"
          onClick={() => onClose()}
        >
          <FontAwesomeIcon
            icon={faClose}
            className="text-[1.8rem] text-gray-500 hover:text-gray-800 cursor-pointer"
          />
        </div>
        <div className="mt-[2rem] space-y-4 min-h-[40rem] max-h-[50rem] overflow-auto hide-scrollbar">
          <div className="flex items-center justify-between mb-[2rem]">
            <h4 className="text-gray-800">Địa chỉ</h4>
            <button
              type="button"
              className="flex items-center gap-[.3rem] px-[1rem] py-[.5rem] rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100 transition duration-300 cursor-pointer"
              onClick={() =>
                setOpenActionAddress({
                  open: true,
                  dataUpdate: null,
                  action: "add",
                })
              }
            >
              <FontAwesomeIcon icon={faAdd} className="text-[1.4rem]" />
              <span>Thêm địa chỉ</span>
            </button>
          </div>
          {addresses && addresses?.length > 0 ? (
            <>
              {addresses.map((add) => {
                return (
                  <label
                    htmlFor={`select-${add.id}`}
                    key={add.id}
                    className="flex items-center justify-between border border-dashed rounded-md p-[2rem] border-gray-300"
                  >
                    <div className="flex items-center gap-[2rem]">
                      <span className="w-[2rem] h-[2rem] flex items-center justify-center">
                        <input
                          type="radio"
                          id={`select-${add.id}`}
                          name="select"
                          className="scale-[1.5] "
                          style={{ accentColor: "red" }}
                          checked={selectedAdd?.id === add.id}
                          onChange={() => {
                            setSelectedAdd(add);
                          }}
                        />
                      </span>
                      <div className="space-y-2" key={add.id}>
                        <div className="flex items-center gap-[1rem] text-gray-500">
                          <span className="text-gray-800">
                            {add.recipentName}
                          </span>
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
                          <button
                            type="button"
                            className="text-[1.2rem] px-[.8rem] py-[.2rem] text-red-500 border border-red-300 rounded-sm"
                          >
                            Mặc định
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className={`flex items-center gap-[1rem] `}>
                        <button
                          type="button"
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
                      </div>
                      <button
                        type="button"
                        className="flex-1 px-[1rem] py-[.4rem] text-[1.4rem] border text-red-500 border-red-400 hover:border-red-600 hover:text-red-600 rounded-sm"
                        onClick={() => {
                          const updated = addresses.filter(
                            (a) => a.id !== add.id
                          );

                          localStorage.setItem(
                            "guest_addresses",
                            JSON.stringify(updated)
                          );

                          if (updated.length > 0) {
                            const latest = updated[updated.length - 1];
                            localStorage.setItem(
                              "guest_latest_address",
                              JSON.stringify(latest)
                            );

                            window.dispatchEvent(
                              new CustomEvent("guest_address_updated", {
                                detail: { action: "added", address: latest },
                              })
                            );
                          } else {
                            localStorage.removeItem("guest_latest_address");
                            localStorage.removeItem("guest_addresses");

                            window.dispatchEvent(
                              new CustomEvent("guest_address_updated", {
                                detail: { action: "added" },
                              })
                            );
                          }

                          setAddresses(updated);
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </label>
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
        <div className="mt-[2.5rem] flex items-center gap-[1rem] justify-end">
          <button
            type="button"
            className="px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300"
            onClick={() => onClose()}
          >
            Hủy
          </button>
          <button
            type="button"
            className="px-[2rem] py-[.5rem] rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300"
            onClick={() => handleConfirm()}
          >
            Xác nhận
          </button>
        </div>
      </MotionWrapper>
      <ActionAddress
        openActionAddress={openActionAddress}
        onClose={() =>
          setOpenActionAddress({
            open: false,
            dataUpdate: null,
            action: "add",
          })
        }
        onSuccess={handleActionSuccess}
      />
    </>
  );
}

export default SelectAddress;
