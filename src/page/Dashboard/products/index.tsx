import {
  faAngleLeft,
  faAngleRight,
  faArrowLeft,
  faCirclePlus,
  faClose,
  faEdit,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ActionProduct from "./components/ActionProduct";
import { useQuery } from "@tanstack/react-query";
import type { CategoriesType, ProductT } from "../../../utils/types";
import { getProduct } from "../../../api/product.api";
import { getAllCategory } from "../../../api/category.api";
import axiosConfig from "../../../configs/axiosConfig";
import { toast } from "react-toastify";
import RenderParentOption from "../../../components/RenderParentOption";

function Products() {
  const [openActionProduct, setOpenActionProduct] = useState<{
    open: boolean;
    action: "add" | "edit";
    id: number | undefined;
  }>({
    open: false,
    action: "add",
    id: undefined,
  });
  const [openToggleHidden, setOpenToggleHidden] = useState<{
    open: boolean;
    data: ProductT | null;
  }>({
    open: false,
    data: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filterInput, setFilterInput] = useState<{
    productName: "";
    price: null;
    categoryId: null | number;
  }>({
    productName: "",
    price: null,
    categoryId: null,
  });
  const [filterProduct, setFilterProduct] = useState({
    ...filterInput,
    page: 1,
    limit: 30,
  });
  const {
    data,
    isLoading: isLoadingProduct,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", filterProduct],
    queryFn: getProduct,
  }) as any;

  const { data: dataCategories = [] } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });
  const products = (data && data.data) || [];
  const totalPages = data?.totalPages || 1;

  const handleHiddenProduct = async (product: ProductT | null) => {
    if (!product || !product.id) {
      toast.error("Không có id của sản phẩm!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosConfig.delete(
        `/api/v1/product/toggle-hidden-product/${product.id}`
      );
      if (res.status) {
        toast.success(
          res.status ||
            `${product.isActive ? "Ẩn" : "Hiện"} sản phẩm thành công`
        );
        await refetch();
        setIsLoading(false);
        setOpenToggleHidden({ open: false, data: null });
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handleAppliedFilter = () => {
    setFilterProduct((prev) => ({
      ...prev,
      categoryId: filterInput.categoryId,
      productName: filterInput.productName,
      price: filterInput.price,
    }));
  };

  return (
    <div className="w-full h-[calc(100vh-10rem)] bg-white shadow-lg rounded-[1rem] flex flex-col p-[2rem]">
      <div className="sticky top-0 z-30 flex justify-between items-center pb-[1.5rem] border-b-[.1rem] border-b-gray-300">
        <h3 className="text-[2.5rem] font-semibold text-gray-600">Sản phẩm</h3>
        <div>
          <button
            className="text-white flex gap-1.5 items-center px-4 py-3 bg-[var(--main-button)] rounded-lg hover:bg-[var(--main-button-hover)] cursor-pointer "
            onClick={() =>
              setOpenActionProduct({ action: "add", id: undefined, open: true })
            }
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Thêm sản phẩm
          </button>
        </div>
      </div>
      <div className=" flex-1 overflow-auto hide-scrollbar">
        {openActionProduct.open ? (
          <>
            <div className="mt-[1rem]">
              <button
                type="button"
                className="flex items-center space-x-1 text-gray-600 px-6 rounded-md py-1 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() =>
                  setOpenActionProduct({
                    open: false,
                    action: "add",
                    id: undefined,
                  })
                }
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500" />
                <span>Quay lại danh sách</span>
              </button>
            </div>
            <ActionProduct
              openActionProduct={openActionProduct}
              setOpenActionProduct={setOpenActionProduct}
              dataCategories={dataCategories}
              dataUpdate={
                openActionProduct?.action === "edit"
                  ? products?.find(
                      (product: ProductT) => product.id === openActionProduct.id
                    )
                  : undefined
              }
              refetch={refetch}
            />
          </>
        ) : (
          <>
            <div className="mt-[3rem]">
              <div className="w-full border-[.1rem] border-gray-300 mt-4 p-[2rem] flex items-end gap-[2rem]">
                <div className="w-[35rem] flex flex-col gap-[.5rem]">
                  <label htmlFor="productName" className="text-gray-700">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    placeholder="Nhập tìm kiếm..."
                    className="w-full h-[4rem] rounded-[.5rem] outline-none border border-gray-300 pl-[1.5rem]"
                    onChange={(e) =>
                      setFilterInput((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-[20rem] flex flex-col gap-[.5rem]">
                  <label htmlFor="price" className="text-gray-700">
                    Giá sản phẩm
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="Nhập giá..."
                    className="w-full h-[4rem] rounded-[.5rem] outline-none border border-gray-300 pl-[1.5rem]"
                    onChange={(e) =>
                      setFilterInput((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-[30rem] flex flex-col gap-[.5rem]">
                  <label htmlFor="categoryId" className="text-gray-700">
                    Danh mục
                  </label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    className="w-full h-[4rem] rounded-[.5rem] outline-none border text-gray-600 border-gray-300 pl-[1.5rem]"
                    onChange={(e) =>
                      setFilterInput((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                  >
                    {dataCategories
                      ?.filter((cat: CategoriesType) => cat.isActive)
                      .map((parent: CategoriesType) => (
                        <RenderParentOption
                          key={parent.id}
                          category={parent}
                          allCategories={dataCategories}
                          level={0}
                        />
                      ))}
                  </select>
                </div>
                <button
                  className="w-[15%] flex items-center justify-center gap-[1rem] px-[1.5rem] h-[4rem] bg-[var(--main-button)] text-white rounded-[.5rem] cursor-pointer hover:bg-[var(--main-button-hover)]"
                  onClick={() => handleAppliedFilter()}
                >
                  <FontAwesomeIcon icon={faFilter} />
                  Lọc
                </button>
              </div>
            </div>
            <div className="mt-[2rem] border border-gray-300/50 rounded-md overflow-hidden">
              {isLoadingProduct ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-500">Đang tải...</p>
                  </div>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu!</p>
                </div>
              ) : (
                <>
                  <table className="min-w-full table-auto text-[1.4rem] rounded-lg shadow-sm overflow-hidden">
                    <thead className="bg-gray-100 border-b border-b-gray-200">
                      <tr>
                        <th className="text-left px-6 py-4 text-gray-600 font-semibold tracking-wide">
                          STT
                        </th>
                        <th className="px-6 py-4 text-left text-gray-600 font-semibold tracking-wide">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-4 text-left text-gray-600 font-semibold tracking-wide">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-left text-gray-600 font-semibold tracking-wide">
                          Danh mục
                        </th>
                        <th className="px-6 py-4 text-left text-gray-600 font-semibold tracking-wide">
                          Giá
                        </th>
                        <th className="px-6 py-4 text-center text-gray-600 font-semibold tracking-wide">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.length > 0 ? (
                        products?.map((product: ProductT, index: number) => (
                          <tr
                            key={product.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className=" px-6 py-4">{index}</td>
                            <td className=" px-6 py-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={product.mainImage}
                                  alt="main image"
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                  <h4 className="max-w-[25rem] font-medium text-gray-900 text-limit-1">
                                    {product.productName}
                                  </h4>
                                  <p className="text-gray-500 text-[1.2rem]">
                                    ID: {product.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p
                                className={`py-1 ${product.isActive ? "text-green-600 bg-green-100 rounded-md" : "text-red-600 bg-red-100 rounded-md "} text-center`}
                              >
                                {product.isActive
                                  ? "Đang hoạt động"
                                  : "Dừng hoạt động"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {dataCategories?.find(
                                (cat: any) => cat.id === product.category?.id
                              )?.categoryName ?? "Chưa có danh mục"}
                            </td>
                            <td className="px-6 py-4 text-gray-900 font-medium">
                              {Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.price)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                  onClick={() =>
                                    setOpenActionProduct({
                                      action: "edit",
                                      id: product.id,
                                      open: true,
                                    })
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    className="w-4 h-4"
                                  />
                                  <span>Sửa</span>
                                </button>
                                <button
                                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                  onClick={() => {
                                    setOpenToggleHidden({
                                      open: true,
                                      data: product,
                                    });
                                  }}
                                >
                                  <span>
                                    {product.isActive ? "Ẩn" : "Hiện"} sản phẩm
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr aria-colspan={6}>
                          <td>
                            <div>Không có sản phẩm nào</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </>
        )}
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() =>
              setFilterProduct((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
            disabled={filterProduct.page === 1}
            className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faAngleLeft} className="text-gray-500" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((num) => Math.abs(num - filterProduct.page) <= 2)
            .map((num) => (
              <button
                key={num}
                onClick={() =>
                  setFilterProduct((prev) => ({ ...prev, page: num }))
                }
                className={`w-[3.5rem] h-[3.5rem] rounded hover:bg-gray-300 ${
                  filterProduct.page === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}

          <button
            onClick={() =>
              setFilterProduct((prev) => ({
                ...prev,
                page: Math.min(prev.page + 1, totalPages),
              }))
            }
            disabled={filterProduct.page === totalPages}
            className="w-[3.5rem] h-[3.5rem] bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faAngleRight} className="text-gray-500" />
          </button>
        </div>
      </div>

      {openToggleHidden.open && (
        <div className="fixed top-0 left-0 w-full h-[100vh] flex items-center justify-center bg-[#43434344] z-[999]">
          <div className="relative w-[50rem] h-auto bg-white p-[3rem] rounded-lg">
            <div
              className="absolute flex items-center justify-center top-[1rem] right-[1rem] w-[3rem] h-[3rem] rounded-full bg-gray-200 hover:bg-gray-300 hover-linear"
              onClick={() => setOpenToggleHidden({ open: false, data: null })}
            >
              <FontAwesomeIcon icon={faClose} className="text-gray-500" />
            </div>
            <h2 className="text-[1.8rem] text-gray-800">
              Bạn muốn {openToggleHidden.data?.isActive ? "ẩn" : "hiện"} sản
              phẩm này?
            </h2>
            <div
              className={`flex items-center justify-end gap-[1rem] ${isLoading ? "mt-[1rem]" : "mt-[3rem]"}`}
            >
              <button
                className={`w-[8rem] h-[3.2rem] rounded-sm bg-gray-200 text-gray-600 text-[1.4rem] hover:bg-gray-300 hover-linear ${isLoading ? "cursor-not-allowed" : ""}`}
                disabled={isLoading}
                onClick={() => setOpenToggleHidden({ open: false, data: null })}
              >
                Hủy
              </button>
              <button
                className={`w-[6.5rem] h-[3.2rem] rounded-sm bg-red-500 text-white text-[1.4rem] hover:bg-red-600 hover-linear ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-red-600"}`}
                disabled={isLoading}
                onClick={() => handleHiddenProduct(openToggleHidden.data)}
              >
                {isLoading ? (
                  <div className="w-5 h-5 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : openToggleHidden.data?.isActive ? (
                  "Ẩn"
                ) : (
                  "Hiện"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
