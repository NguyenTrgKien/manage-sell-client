import {
  faAdd,
  faCirclePlus,
  faClose,
  faEdit,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { getListBanner } from "../../../api/ui.api";
import type { BannerType } from "../../../utils/ui.type";
import { useForm } from "react-hook-form";
import MotionWrapper from "../../../components/ui/MotionWrapper";

interface BannerForm {
  title?: string;
  subTitle?: string;
  link: string;
  imageUrl: null | File | string;
  bannerId?: number | undefined;
}

function BannerSlide() {
  const [isAction, setIsAction] = useState<{
    open: boolean;
    action: "add" | "edit";
  }>({
    open: false,
    action: "add",
  });
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState<"active" | "inactive">("active");
  const indicatorRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const inactiveRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [openInActive, setOpenInActive] = useState<{
    open: boolean;
    bannerId: number | null;
    action: "active" | "inactive";
  }>({ open: false, bannerId: null, action: "inactive" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<BannerForm>({
    defaultValues: {
      title: "",
      subTitle: "",
      link: "",
      bannerId: undefined,
      imageUrl: null,
    },
  });
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const {
    data: listBanner,
    isLoading: isLoadingListBanner,
    refetch,
  } = useQuery({
    queryKey: ["listBanner", isSearch, active],
    queryFn: () => getListBanner(isSearch, active),
  });

  useEffect(() => {
    return () => {
      if (displayImage) {
        URL.revokeObjectURL(displayImage);
      }
    };
  }, [displayImage]);

  useEffect(() => {
    const current =
      active === "active" ? activeRef.current : inactiveRef.current;
    if (!current || !indicatorRef.current) return;

    if (current && indicatorRef.current) {
      indicatorRef.current.style.width = `${current.offsetWidth}px`;
      indicatorRef.current.style.left = `${current.offsetLeft}px`;
    }
  }, [active, listBanner]);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setValue("imageUrl", file);
      setDisplayImage(url);
    }
  };

  const onSubmit = async (data: BannerForm) => {
    try {
      let res;
      const dataRequest = {
        title: data.title,
        subTitle: data.subTitle,
        link: data.link,
        imageUrl: data.imageUrl,
      };
      if (isAction.action === "add") {
        res = (await axiosConfig.post("/api/v1/banner/create", dataRequest, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })) as any;
      } else {
        res = (await axiosConfig.patch(
          `/api/v1/banner/update/${data.bannerId}`,
          dataRequest,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )) as any;
      }

      if (res.status) {
        reset({
          title: "",
          subTitle: "",
          link: "",
          imageUrl: null,
        });
        await refetch();
        toast.success(res.message);
        setIsAction({ open: false, action: "add" });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onCloseAdd = () => {
    setIsAction({ open: false, action: "add" });
    reset({
      title: "",
      subTitle: "",
      link: "",
      imageUrl: null,
    });
  };

  const handleUpdateBanner = (banner: BannerType) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setIsAction({ open: true, action: "edit" });
    reset({
      title: banner.title,
      subTitle: banner.subTitle,
      link: banner.link,
      bannerId: banner.id,
    });
    if (banner.title) {
      setDisplayImage(banner.imageUrl);
    }
  };

  const handleToggleActive = async (bannerId: number | null) => {
    try {
      if (!bannerId) {
        toast.error("Không có bannerId");
        return;
      }
      setIsLoading(true);
      const res = (await axiosConfig.patch(
        `/api/v1/banner/toggle-active/${bannerId}`
      )) as any;

      if (res.status) {
        toast.success(res.message);
        await refetch();
        setOpenInActive({
          open: false,
          bannerId: null,
          action: "active",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-10rem)] bg-white shadow-lg rounded-[1rem] flex flex-col p-[2rem]">
      <div className="sticky top-0 bg-white z-10 pb-[2rem] border-b-[.1rem] border-b-gray-300">
        <div className="flex justify-between items-center">
          <h3 className="text-[2rem] font-semibold text-gray-600">
            Quản lý Banner Slide Trang Chủ
          </h3>
          <div className="flex items-center gap-[1.5rem]">
            <div className="relative">
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Tìm kiếm theo tên..."
                className="w-[30rem] h-[4rem] focus:border-cyan-400 border border-gray-300 outline-none text-gray-600 px-[1.5rem] rounded-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="absolute top-[50%] translate-y-[-50%] right-0 px-5 h-full cursor-pointer"
                onClick={() => setIsSearch(search)}
              >
                <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
              </button>
            </div>
            <button
              type="button"
              className={`text-white text-[1.4rem] flex gap-1.5 items-center px-4 h-[4rem] bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer hover-linear ${isSubmitting ? "cursor-not-allowed" : ""}`}
              onClick={() => {
                reset({
                  title: "",
                  subTitle: "",
                  link: "",
                  imageUrl: null,
                });
                scrollContainerRef.current?.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                setDisplayImage(null);
                setIsAction({ open: true, action: "add" });
              }}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faCirclePlus} />
              Thêm Banner Mới
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto hide-scrollbar mt-[1rem]"
        ref={scrollContainerRef}
      >
        {isAction.open && (
          <div className="mb-8 mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3
              className={`${isAction.action === "add" ? "text-green-600" : "text-amber-600"} mb-4`}
            >
              {isAction.action === "add" ? "Tạo Banner Mới" : "Cập nhật banner"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-3 gap-[2rem]">
                <div className="w-full">
                  <label htmlFor="title" className="text-gray-600">
                    Tiêu đề banner
                  </label>
                  <input
                    type="text"
                    className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400"
                    id="title"
                    placeholder="Nhập tiêu đề cho banner..."
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="subTitle" className="text-gray-600">
                    Phụ đề
                  </label>
                  <input
                    type="text"
                    className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400"
                    id="subTitle"
                    placeholder="Nhập tiêu phụ đề..."
                    {...register("subTitle")}
                  />
                  {errors.subTitle && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.subTitle.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="link" className="text-gray-600">
                    Link đích
                  </label>
                  <input
                    type="text"
                    className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400"
                    id="link"
                    placeholder="Nhập link..."
                    {...register("link", {
                      required: "Vui lòng nhập link đích!",
                    })}
                  />
                  {errors.link && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.link.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <p className="text-gray-600">Chọn hình ảnh cho Banner</p>
                  <label
                    htmlFor="imageUrl"
                    className="flex items-center justify-center space-x-4 w-full h-[4rem] border border-dashed border-gray-500 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faAdd} className="text-gray-500" />
                    <span className="text-gray-600">Hình ảnh</span>
                    <input
                      type="file"
                      className="hidden"
                      id="imageUrl"
                      accept="image/*"
                      onChange={(e) => handleChangeImage(e)}
                    />
                  </label>
                  {errors.imageUrl && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.imageUrl.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {displayImage && (
                  <div className="my-5">
                    <img
                      src={displayImage}
                      alt="displayImage"
                      className="w-full h-[35rem] object-cover"
                    />
                  </div>
                )}
              </div>
              {isAction.action === "edit" && (
                <input
                  type="number"
                  className="hidden"
                  {...register("bannerId")}
                />
              )}
              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => onCloseAdd()}
                  className="bg-gray-200 text-gray-600 px-8 py-2 rounded-lg hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  className={`${isAction.action === "add" ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"}  text-white px-8 py-2 rounded-lg `}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : isAction.action === "add"
                      ? "Thêm"
                      : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        )}
        {isLoadingListBanner ? (
          <div className="w-full flex justify-center items-center pt-[14rem]">
            <div className="w-16 h-16 border-4 border-dashed border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="mt-[2rem]">
            <div className="relative flex items-center pb-4 border-b border-b-gray-200">
              <span
                ref={activeRef}
                onClick={() => setActive("active")}
                className={`cursor-pointer pr-[1rem] transition
                    ${active === "active" ? "text-blue-500 font-medium" : "text-gray-600"}
                  `}
              >
                Đang hoạt động
              </span>

              <span
                ref={inactiveRef}
                onClick={() => setActive("inactive")}
                className={`cursor-pointer pl-[1rem] transition
                    ${active === "inactive" ? "text-blue-500 font-medium" : "text-gray-600"}
                  `}
              >
                Dừng hoạt động
              </span>

              <div
                ref={indicatorRef}
                className="absolute bottom-0 h-1 bg-blue-500 transition-all duration-300"
              />
            </div>
            {listBanner && listBanner.length > 0 ? (
              <>
                <div className="grid grid-cols-2 mt-[2rem] gap-2.5">
                  {listBanner.map((banner: BannerType) => {
                    return (
                      <div
                        key={banner.id}
                        className="w-full h-[35rem] relative  border border-gray-200 rounded-md group"
                      >
                        <div className="absolute top-0 left-0 flex items-center space-x-4">
                          <div className="text-[1.4rem] px-2.5 py-1 bg-amber-200 rounded-br-lg ">
                            STT:{banner.sortOrder}
                          </div>
                          <div
                            className={`px-4 rounded-br-lg rounded-bl-lg ${banner.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300"} py-1 text-[1.4rem]`}
                          >
                            {banner.isActive
                              ? "Đang hoạt động"
                              : "Dừng hoạt động"}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <img
                          src={banner.imageUrl}
                          alt={`banner-image-${banner.title}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute left-[3rem] space-y-2 bottom-[3rem]">
                          <p className="text-white text-[2.5rem]">
                            {banner.title}
                          </p>
                          <p className="text-[1.4rem] text-white">
                            {banner.subTitle}
                          </p>
                        </div>
                        <div className="absolute flex items-center justify-center space-x-4 inset-0 bg-[#36363659] group-hover:opacity-100 opacity-0 transition duration-300 rounded-md">
                          <button
                            type="button"
                            className={`px-[2rem] py-[.8rem] rounded-md  text-white ${!banner.isActive ? "cursor-not-allowed bg-gray-400" : "bg-amber-500 hover:bg-amber-600"}`}
                            onClick={() => handleUpdateBanner(banner)}
                            disabled={!banner.isActive}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Cập nhật</span>
                          </button>
                          <button
                            type="button"
                            className={`px-[2rem] py-[.8rem] rounded-md ${banner.isActive ? "bg-gray-500 hover:bg-gray-600 text-gray-300" : "bg-green-500 hover:bg-green-600 text-white"} `}
                            onClick={() =>
                              setOpenInActive({
                                open: true,
                                bannerId: banner.id,
                                action: banner.isActive ? "inactive" : "active",
                              })
                            }
                          >
                            <span>
                              {banner.isActive
                                ? "Ngừng hoạt động"
                                : "Mở hoạt động"}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center items-center pt-[14rem]">
                Chưa có banner nào
              </div>
            )}
          </div>
        )}
      </div>

      {
        <MotionWrapper
          open={openInActive.open}
          className="relative w-[60rem] rounded-lg bg-white p-[2rem]"
        >
          <h2
            className={`text-[2rem] ${openInActive.action === "inactive" ? "text-amber-600" : "text-green-600"}  mb-[2.5rem] font-bold`}
          >
            Bạn muốn{" "}
            {openInActive.action === "active" ? "kích hoạt" : "tạm dừng"} banner
            này?
          </h2>
          <div
            className="absolute top-[1rem] right-[1rem]"
            onClick={(e) => {
              e.stopPropagation();
              setOpenInActive({
                open: false,
                bannerId: null,
                action: "active",
              });
            }}
          >
            <FontAwesomeIcon
              icon={faClose}
              className="text-[1.8rem] text-gray-500 hover:text-gray-800 cursor-pointer"
            />
          </div>
          <div className="mt-[.5rem] flex items-center gap-[1rem] justify-end">
            <button
              type="button"
              className={`px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300 outline-none ${isSubmitting ? "cursor-not-allowed" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpenInActive({
                  open: false,
                  bannerId: null,
                  action: "active",
                });
              }}
              disabled={isSubmitting}
            >
              Đóng
            </button>
            <button
              type="button"
              className={`px-[2rem] py-[.5rem] rounded-md ${openInActive.action === "active" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}  text-white transition duration-300 outline-none ${isSubmitting ? "cursor-not-allowed" : ""}`}
              onClick={() => {
                handleToggleActive(openInActive.bannerId);
              }}
              disabled={isSubmitting}
            >
              {isLoading
                ? "Đang xử lý..."
                : openInActive.action === "active"
                  ? "Kích hoạt"
                  : "Dừng"}
            </button>
          </div>
        </MotionWrapper>
      }
    </div>
  );
}

export default BannerSlide;
