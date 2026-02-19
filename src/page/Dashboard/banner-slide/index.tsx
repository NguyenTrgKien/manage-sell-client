import {
  faAdd,
  faCirclePlus,
  faClose,
  faEdit,
  faSearch,
  faLayerGroup,
  faLink,
  faCalendarAlt,
  faMousePointer,
  faFilter,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { getListBanner } from "../../../api/ui.api";
import {
  BannerStatus,
  BannerPosition,
  BannerRedirectType,
  type BannerType,
} from "../../../utils/ui.type";
import { useForm } from "react-hook-form";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import { getAllCollections } from "../../../api/collection.api";
import type { Collection } from "../../../utils/collection.type";
import { getFlashsales } from "../../../api/flashsale.api";
import type { FlashSale } from "../../../utils/flashsale.type";
import SelectTargetModal from "./SelectTargetModal";

interface BannerForm {
  title?: string;
  subTitle?: string;
  redirectType: BannerRedirectType;
  position: BannerPosition;
  targetSlug?: string;
  redirectUrl?: string;
  imageUrl: null | File | string;
  startDate?: string;
  endDate?: string;
  bannerId?: number;
}

const REDIRECT_TYPE_LABELS: Record<BannerRedirectType, string> = {
  [BannerRedirectType.COLLECTION]: "Collection",
  [BannerRedirectType.PRODUCT]: "Sản phẩm",
  [BannerRedirectType.CATEGORY]: "Danh mục",
  [BannerRedirectType.FLASH_SALE]: "Flash Sale",
};

const REDIRECT_TYPE_COLORS: Record<BannerRedirectType, string> = {
  [BannerRedirectType.COLLECTION]: "bg-purple-100 text-purple-700",
  [BannerRedirectType.PRODUCT]: "bg-blue-100 text-blue-700",
  [BannerRedirectType.CATEGORY]: "bg-orange-100 text-orange-700",
  [BannerRedirectType.FLASH_SALE]: "bg-red-100 text-red-700",
};

const POSITION_LABELS: Record<BannerPosition, string> = {
  [BannerPosition.HOME_SLIDER]: "Slider trang chủ",
  [BannerPosition.HOME_TOP]: "Top trang chủ",
  [BannerPosition.CATEGORY_TOP]: "Top danh mục",
};

const STATUS_CONFIG: Record<
  BannerStatus,
  { label: string; badgeClass: string }
> = {
  [BannerStatus.ACTIVE]: {
    label: "Đang hoạt động",
    badgeClass: "bg-green-500 text-white",
  },
  [BannerStatus.PAUSED]: {
    label: "Tạm dừng",
    badgeClass: "bg-amber-500 text-white",
  },
  [BannerStatus.EXPIRED]: {
    label: "Hết hạn",
    badgeClass: "bg-gray-500 text-gray-300",
  },
};

function formatDate(date?: Date | string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toDatetimeLocal(date?: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

function BannerSlide() {
  const [isAction, setIsAction] = useState<{
    open: boolean;
    action: "add" | "edit";
  }>({ open: false, action: "add" });

  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [activeStatus, setActiveStatus] = useState<BannerStatus>(
    BannerStatus.ACTIVE,
  );

  const [filterPosition, setFilterPosition] = useState<BannerPosition | "">("");
  const [showPositionFilter, setShowPositionFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<BannerStatus, HTMLSpanElement | null>>>(
    {},
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [openConfirm, setOpenConfirm] = useState<{
    open: boolean;
    bannerId: number | null;
    toStatus: BannerStatus | null;
  }>({ open: false, bannerId: null, toStatus: null });

  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<BannerForm>({
    defaultValues: {
      title: "",
      subTitle: "",
      redirectType: BannerRedirectType.COLLECTION,
      position: BannerPosition.HOME_SLIDER,
      targetSlug: undefined,
      redirectUrl: "",
      imageUrl: null,
      startDate: "",
      endDate: "",
      bannerId: undefined,
    },
  });

  const watchedRedirectType = watch("redirectType");

  const {
    data: dataBanner,
    isLoading: isLoadingListBanner,
    refetch,
  } = useQuery({
    queryKey: ["listBanner", isSearch, activeStatus, filterPosition],
    queryFn: () => getListBanner(filterPosition, activeStatus, isSearch),
  });
  const listBanner = dataBanner && dataBanner.data;

  const { data: dataCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: () =>
      getAllCollections({
        page: 1,
        limit: 1000,
      }),
  }) as any;
  const collections = (dataCollections && dataCollections.data) || [];

  const { data: dataFlashSale } = useQuery({
    queryKey: ["flashsales"],
    queryFn: () => getFlashsales({ page: 1, limit: 1000 }),
  }) as any;

  const flashsales = (dataFlashSale && dataFlashSale.data) || [];
  const [selectModal, setSelectModal] = useState<{
    open: boolean;
    type: BannerRedirectType | null;
  }>({ open: false, type: null });

  const [selectedTarget, setSelectedTarget] = useState<{
    slug: string;
    name: string;
    img?: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (displayImage && displayImage.startsWith("blob:")) {
        URL.revokeObjectURL(displayImage);
      }
    };
  }, [displayImage]);

  useEffect(() => {
    const current = tabRefs.current[activeStatus];
    if (!current || !indicatorRef.current) return;
    indicatorRef.current.style.width = `${current.offsetWidth}px`;
    indicatorRef.current.style.left = `${current.offsetLeft}px`;
  }, [activeStatus, listBanner]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowPositionFilter(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setSelectedTarget(null);
    setValue("targetSlug", undefined);
  }, [watchedRedirectType, setValue]);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setValue("imageUrl", file);
      setDisplayImage(url);
    }
  };

  const resetForm = () => {
    reset({
      title: "",
      subTitle: "",
      redirectType: BannerRedirectType.COLLECTION,
      position: BannerPosition.HOME_SLIDER,
      targetSlug: undefined,
      redirectUrl: "",
      imageUrl: null,
      startDate: "",
      endDate: "",
      bannerId: undefined,
    });
    setDisplayImage(null);
    setSelectedTarget(null);
  };

  const onSubmit = async (data: BannerForm) => {
    try {
      const formData = new FormData();
      if (data.title) {
        formData.append("title", data.title);
      }
      if (data.subTitle) {
        formData.append("subTitle", data.subTitle);
      }
      if (data.targetSlug) {
        formData.append("targetSlug", data.targetSlug);
      }
      formData.append("redirectType", data.redirectType);
      formData.append("position", data.position);
      if (data.startDate) {
        formData.append("startDate", data.startDate);
      }
      if (data.endDate) {
        formData.append("endDate", data.endDate);
      }
      if (data.imageUrl instanceof File) {
        formData.append("imageUrl", data.imageUrl);
      }
      for (const a of formData.entries()) {
        console.log(a[0], a[1]);
      }
      let res: any;
      if (isAction.action === "add") {
        res = await axiosConfig.post("/api/v1/banner/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosConfig.patch(
          `/api/v1/banner/update/${data.bannerId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }

      if (res.status) {
        resetForm();
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
    resetForm();
  };

  const handleUpdateBanner = (banner: BannerType) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsAction({ open: true, action: "edit" });
    reset({
      title: banner.title ?? "",
      subTitle: banner.subTitle ?? "",
      redirectType: banner.redirectType,
      position: banner.position,
      targetSlug: banner.targetSlug,
      imageUrl: banner.imageUrl,
      startDate: toDatetimeLocal(banner.startDate),
      endDate: toDatetimeLocal(banner.endDate),
      bannerId: banner.id,
    });
    setDisplayImage(banner.imageUrl);
    if (
      (banner.redirectType === BannerRedirectType.PRODUCT ||
        banner.redirectType === BannerRedirectType.CATEGORY) &&
      banner.targetSlug
    ) {
      const targetInfo = banner.targetInfo;
      setSelectedTarget({
        slug: targetInfo.slug,
        name: targetInfo.name,
        img: targetInfo.image,
      });
    }
  };

  const handleChangeStatus = async (
    bannerId: number | null,
    toStatus: BannerStatus | null,
  ) => {
    try {
      if (!bannerId || !toStatus) {
        toast.error("Không có bannerId");
        return;
      }
      setIsLoading(true);
      const res = (await axiosConfig.patch(
        `/api/v1/banner/change-status/${bannerId}`,
        { status: toStatus },
      )) as any;

      if (res.status) {
        toast.success(res.message);
        await refetch();
        setOpenConfirm({ open: false, bannerId: null, toStatus: null });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "");
    } finally {
      setIsLoading(false);
    }
  };

  const getNextStatusOptions = (current: BannerStatus) => {
    if (current === BannerStatus.ACTIVE)
      return [
        {
          toStatus: BannerStatus.PAUSED,
          label: "Ngừng hoạt động",
          btnClass: "bg-gray-500 hover:bg-gray-600 text-gray-300",
        },
      ];
    if (current === BannerStatus.PAUSED)
      return [
        {
          toStatus: BannerStatus.ACTIVE,
          label: "Mở hoạt động",
          btnClass: "bg-green-500 hover:bg-green-600 text-white",
        },
      ];
  };

  const renderRedirectField = () => {
    if (watchedRedirectType === BannerRedirectType.COLLECTION) {
      return (
        <div className="w-full">
          <label className="text-gray-600 block mb-2">
            Collection <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] outline-none focus:border-cyan-400 bg-white text-gray-700"
            {...register("targetSlug", {
              required: "Vui lòng chọn collection!",
            })}
          >
            <option value="">-- Chọn collection --</option>
            {collections.map((col: Collection) => (
              <option key={col.id} value={col.slug}>
                {col.name}
              </option>
            ))}
          </select>
          {errors.targetSlug && (
            <p className="text-red-500 text-[1.2rem] mt-1">
              {errors.targetSlug.message}
            </p>
          )}
        </div>
      );
    }

    if (watchedRedirectType === BannerRedirectType.FLASH_SALE) {
      return (
        <div className="w-full">
          <label className="text-gray-600 block mb-2">
            Flash sale <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] outline-none focus:border-cyan-400 bg-white text-gray-700"
            {...register("targetSlug", {
              required: "Vui lòng chọn flashSale!",
            })}
          >
            <option value="">-- Chọn flash sale --</option>
            {flashsales.length > 0 ? (
              flashsales.map((fla: FlashSale) => (
                <option key={fla.id} value={fla.slug}>
                  {fla.name}
                </option>
              ))
            ) : (
              <option>Hãy tạo flashSale</option>
            )}
          </select>
          {errors.targetSlug && (
            <p className="text-red-500 text-[1.2rem] mt-1">
              {errors.targetSlug.message}
            </p>
          )}
        </div>
      );
    }

    if (
      watchedRedirectType === BannerRedirectType.PRODUCT ||
      watchedRedirectType === BannerRedirectType.CATEGORY
    ) {
      const isProduct = watchedRedirectType === BannerRedirectType.PRODUCT;
      return (
        <div className="w-full">
          <label className="text-gray-600 block mb-2">
            {isProduct ? "Sản phẩm" : "Danh mục"}
            <span className="text-red-500"> *</span>
          </label>

          <button
            type="button"
            onClick={() =>
              setSelectModal({ open: true, type: watchedRedirectType })
            }
            className={`w-full h-[4rem] border-2 rounded-xl px-[1.5rem] flex items-center gap-3 transition-all text-left ${
              selectedTarget
                ? "border-blue-400 bg-blue-50"
                : "border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/40"
            }`}
          >
            {selectedTarget ? (
              <>
                {selectedTarget.img && (
                  <img
                    src={selectedTarget.img}
                    alt={selectedTarget.name}
                    className="w-[3rem] h-[3rem] object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-gray-800 font-medium text-[1.3rem] truncate">
                    {selectedTarget.name}
                  </span>
                  <span className="text-blue-500 text-[1.1rem]">
                    {selectedTarget.slug}
                  </span>
                </div>
                <span className="text-[1.2rem] text-blue-500 flex-shrink-0 underline">
                  Đổi
                </span>
              </>
            ) : (
              <span className="text-gray-400">
                Nhấn để chọn {isProduct ? "sản phẩm" : "danh mục"}...
              </span>
            )}
          </button>

          <input
            type="hidden"
            {...register("targetSlug", {
              required: `Vui lòng chọn ${isProduct ? "sản phẩm" : "danh mục"}!`,
            })}
          />
          {errors.targetSlug && (
            <p className="text-red-500 text-[1.2rem] mt-1">
              {errors.targetSlug.message}
            </p>
          )}
        </div>
      );
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
                placeholder="Tìm kiếm theo tên..."
                className="w-[30rem] h-[4rem] focus:border-cyan-400 border border-gray-300 outline-none text-gray-600 px-[1.5rem] rounded-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setIsSearch(search)}
              />
              <button
                className="absolute top-[50%] translate-y-[-50%] right-0 px-5 h-full cursor-pointer"
                onClick={() => setIsSearch(search)}
              >
                <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
              </button>
            </div>

            <div className="relative" ref={filterRef}>
              <button
                type="button"
                className="h-[4rem] px-4 flex items-center gap-2 border border-gray-300 rounded-md text-gray-600 hover:border-cyan-400 bg-white text-[1.4rem]"
                onClick={() => setShowPositionFilter((v) => !v)}
              >
                <FontAwesomeIcon icon={faFilter} className="text-[1.3rem]" />
                {filterPosition
                  ? POSITION_LABELS[filterPosition as BannerPosition]
                  : "Vị trí"}
                <FontAwesomeIcon icon={faChevronDown} className="text-[1rem]" />
              </button>
              {showPositionFilter && (
                <div className="absolute top-[4.5rem] right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[18rem] overflow-hidden">
                  <div
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-600 text-[1.4rem] border-b border-gray-100"
                    onClick={() => {
                      setFilterPosition("");
                      setShowPositionFilter(false);
                    }}
                  >
                    Tất cả vị trí
                  </div>
                  {Object.values(BannerPosition).map((pos) => (
                    <div
                      key={pos}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer text-[1.4rem] ${
                        filterPosition === pos
                          ? "text-blue-500 font-medium bg-blue-50"
                          : "text-gray-600"
                      }`}
                      onClick={() => {
                        setFilterPosition(pos);
                        setShowPositionFilter(false);
                      }}
                    >
                      {POSITION_LABELS[pos]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`text-white text-[1.4rem] flex gap-1.5 items-center px-4 h-[4rem] bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer hover-linear ${isSubmitting ? "cursor-not-allowed" : ""}`}
              onClick={() => {
                resetForm();
                scrollContainerRef.current?.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
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
              className={`${isAction.action === "add" ? "text-green-600" : "text-amber-600"} mb-4 text-[1.8rem] font-semibold`}
            >
              {isAction.action === "add" ? "Tạo Banner Mới" : "Cập nhật banner"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-3 gap-[2rem] mb-[2rem]">
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
                    placeholder="Nhập phụ đề..."
                    {...register("subTitle")}
                  />
                  {errors.subTitle && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.subTitle.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="position" className="text-gray-600">
                    Vị trí hiển thị <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="position"
                    className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400 bg-white text-gray-700"
                    {...register("position", {
                      required: "Vui lòng chọn vị trí!",
                    })}
                  >
                    {Object.values(BannerPosition).map((pos) => (
                      <option key={pos} value={pos}>
                        {POSITION_LABELS[pos]}
                      </option>
                    ))}
                  </select>
                  {errors.position && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.position.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 items-start gap-[2rem] mb-[2rem]">
                <div className="w-full">
                  <label htmlFor="redirectType" className="text-gray-600">
                    Loại liên kết <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="redirectType"
                    className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400 bg-white text-gray-700"
                    {...register("redirectType", {
                      required: "Vui lòng chọn loại liên kết!",
                    })}
                  >
                    {Object.values(BannerRedirectType).map((type) => (
                      <option key={type} value={type}>
                        {REDIRECT_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                  {errors.redirectType && (
                    <p className="text-red-500 text-[1.2rem] mt-1">
                      {errors.redirectType.message}
                    </p>
                  )}
                </div>

                <div className="w-full">{renderRedirectField()}</div>

                <div className="w-full">
                  <p className="text-gray-600">Chọn hình ảnh cho Banner</p>
                  <label
                    htmlFor="imageUrl"
                    className="flex items-center justify-center space-x-4 w-full h-[4rem] border border-dashed border-gray-500 rounded-md px-[1.5rem] mt-2 outline-none cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition"
                  >
                    <FontAwesomeIcon icon={faAdd} className="text-gray-500" />
                    <span className="text-gray-600">
                      {displayImage ? "Thay đổi ảnh" : "Hình ảnh"}
                    </span>
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

              <div className="grid grid-cols-3 gap-[2rem] mb-[2rem]">
                <div className="w-full">
                  <label htmlFor="startDate" className="text-gray-600">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-1.5 text-gray-400"
                    />
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400"
                    {...register("startDate")}
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="endDate" className="text-gray-600">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-1.5 text-gray-400"
                    />
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    className="w-full h-[4rem] border border-gray-300 rounded-md px-[1.5rem] mt-2 outline-none focus:border-cyan-400"
                    {...register("endDate")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {displayImage && (
                  <div className="my-5">
                    <img
                      src={displayImage}
                      alt="displayImage"
                      className="w-full h-[35rem] object-cover rounded-md"
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
                  className={`${isAction.action === "add" ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"} text-white px-8 py-2 rounded-lg`}
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
            <div className="w-16 h-16 border-4 border-dashed border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-[2rem]">
            <div className="relative flex items-center pb-4 border-b border-b-gray-200 gap-[2rem]">
              {Object.values(BannerStatus).map((status) => (
                <span
                  key={status}
                  ref={(el) => {
                    tabRefs.current[status] = el;
                  }}
                  onClick={() => setActiveStatus(status)}
                  className={`cursor-pointer transition ${
                    activeStatus === status
                      ? "text-blue-500 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {STATUS_CONFIG[status].label}
                </span>
              ))}
              <div
                ref={indicatorRef}
                className="absolute bottom-0 h-1 bg-blue-500 transition-all duration-300"
              />
            </div>

            {listBanner && listBanner.length > 0 ? (
              <div className="grid grid-cols-2 mt-[2rem] gap-2.5">
                {listBanner.map((banner: BannerType) => {
                  const nextOptions = getNextStatusOptions(banner.status);
                  return (
                    <div
                      key={banner.id}
                      className="w-full h-[35rem] relative border border-gray-200 rounded-md group overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 flex items-stretch z-10">
                        <div className="text-[1.4rem] px-2.5 py-1 bg-amber-200 rounded-br-lg">
                          STT:{banner.sortOrder}
                        </div>
                        <div
                          className={`px-4 rounded-br-lg rounded-bl-lg py-1 text-[1.4rem] ${STATUS_CONFIG[banner.status].badgeClass}`}
                        >
                          {STATUS_CONFIG[banner.status].label}
                        </div>
                      </div>

                      <div className="absolute top-0 right-0 z-10">
                        <div className="bg-blue-500 text-white text-[1.2rem] px-3 py-1.5 rounded-bl-lg">
                          {POSITION_LABELS[banner.position]}
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-[1]" />
                      <img
                        src={banner.imageUrl}
                        alt={`banner-image-${banner.title}`}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute left-[3rem] space-y-2 bottom-[3rem] z-[2]">
                        <p className="text-white text-[2.5rem]">
                          {banner.title}
                        </p>
                        {banner.subTitle && (
                          <p className="text-[1.4rem] text-white">
                            {banner.subTitle}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[1.1rem] px-2 py-0.5 rounded-full font-medium ${REDIRECT_TYPE_COLORS[banner.redirectType]}`}
                          >
                            {REDIRECT_TYPE_LABELS[banner.redirectType]}
                          </span>

                          {banner.redirectType ===
                            BannerRedirectType.COLLECTION &&
                            banner.targetSlug && (
                              <span className="flex items-center gap-1 text-[1.1rem] text-purple-200 bg-purple-900/50 px-2 py-0.5 rounded-full">
                                <FontAwesomeIcon icon={faLayerGroup} />
                                Collection #{banner.targetSlug}
                              </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-[1.2rem] text-gray-300">
                          {(banner.startDate || banner.endDate) && (
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faCalendarAlt} />
                              {formatDate(banner.startDate)} –{" "}
                              {formatDate(banner.endDate)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faMousePointer} />
                            {banner.clickCount} lượt click
                          </span>
                        </div>
                      </div>

                      <div className="absolute flex items-center justify-center space-x-4 inset-0 bg-[#36363659] group-hover:opacity-100 opacity-0 transition duration-300 rounded-md z-[3]">
                        <button
                          type="button"
                          className={`px-[2rem] py-[.8rem] rounded-md text-white ${
                            banner.status !== BannerStatus.ACTIVE
                              ? "cursor-not-allowed bg-gray-400"
                              : "bg-amber-500 hover:bg-amber-600"
                          }`}
                          onClick={() =>
                            banner.status === BannerStatus.ACTIVE &&
                            handleUpdateBanner(banner)
                          }
                          disabled={banner.status !== BannerStatus.ACTIVE}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span> Cập nhật</span>
                        </button>

                        {nextOptions &&
                          nextOptions.map((opt) => (
                            <button
                              key={opt.toStatus}
                              type="button"
                              className={`px-[2rem] py-[.8rem] rounded-md ${opt.btnClass}`}
                              onClick={() =>
                                setOpenConfirm({
                                  open: true,
                                  bannerId: banner.id,
                                  toStatus: opt.toStatus,
                                })
                              }
                            >
                              {opt.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center pt-[14rem]">
                Chưa có banner nào
              </div>
            )}
          </div>
        )}
      </div>

      <MotionWrapper
        open={openConfirm.open}
        className="relative w-[60rem] rounded-lg bg-white p-[2rem]"
      >
        <h2
          className={`text-[2rem] ${
            openConfirm.toStatus === BannerStatus.ACTIVE
              ? "text-green-600"
              : "text-amber-600"
          } mb-[2.5rem] font-bold`}
        >
          Bạn muốn{" "}
          {openConfirm.toStatus === BannerStatus.ACTIVE
            ? "kích hoạt"
            : "tạm dừng"}{" "}
          banner này?
        </h2>

        <div
          className="absolute top-[1rem] right-[1rem]"
          onClick={(e) => {
            e.stopPropagation();
            setOpenConfirm({ open: false, bannerId: null, toStatus: null });
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
            className={`px-[2rem] py-[.5rem] rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300 outline-none ${isLoading ? "cursor-not-allowed" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpenConfirm({ open: false, bannerId: null, toStatus: null });
            }}
            disabled={isLoading}
          >
            Đóng
          </button>
          <button
            type="button"
            className={`px-[2rem] py-[.5rem] rounded-md ${
              openConfirm.toStatus === BannerStatus.ACTIVE
                ? "bg-green-500 hover:bg-green-600"
                : "bg-amber-500 hover:bg-amber-600"
            } text-white transition duration-300 outline-none ${isLoading ? "cursor-not-allowed" : ""}`}
            onClick={() =>
              handleChangeStatus(openConfirm.bannerId, openConfirm.toStatus)
            }
            disabled={isLoading}
          >
            {isLoading
              ? "Đang xử lý..."
              : openConfirm.toStatus === BannerStatus.ACTIVE
                ? "Kích hoạt"
                : "Tạm dừng"}
          </button>
        </div>
      </MotionWrapper>

      <SelectTargetModal
        open={selectModal.open}
        redirectType={selectModal.type ?? BannerRedirectType.PRODUCT}
        selectedSlug={watch("targetSlug")}
        selectType={
          selectModal.type === BannerRedirectType.PRODUCT
            ? "product"
            : "category"
        }
        onSelect={(item) => {
          setValue("targetSlug", item.slug);
          setSelectedTarget(item);
        }}
        onClose={() => setSelectModal({ open: false, type: null })}
      />
    </div>
  );
}

export default BannerSlide;
