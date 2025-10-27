import {
  faCirclePlus,
  faClose,
  faEdit,
  faFilter,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ActionProduct from "./AddProduct";
import { useQuery } from "@tanstack/react-query";
import type { CategoriesType, ProductT } from "../../../utils/types";
import { getProduct } from "../../../api/product.api";
import { getAllCategory } from "../../../api/category.api";
import axiosConfig from "../../../configs/axiosConfig";
import { toast } from "react-toastify";

function Products() {
  const [openActionProduct, setOpenActionProduct] = useState<{
    action: "add" | "edit";
    id: number | undefined;
  } | null>(null);
  const [openDelete, setOpenDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryProduct, setQueryProduct] = useState<{
    page: 1;
    limit: 20;
    price: number | null;
    productName: "";
  }>({
    page: 1,
    limit: 20,
    price: null,
    productName: "",
  });
  const {
    data: products,
    isLoading: isLoadingProduct,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", queryProduct],
    queryFn: ({ queryKey }) => {
      const [_, filters] = queryKey;
      return getProduct(filters);
    },
  });

  const { data: dataCategory } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });

  const handleDelete = async (productId: number) => {
    if (!productId) {
      toast.error("Không có id của sản phẩm!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosConfig.delete(
        `/api/v1/product/delete-product/${productId}`
      );  
      if (res.status) {
        await refetch();
        setIsLoading(false);
        toast.success(res.status || "Xóa sản phẩm thành công");
        setOpenDelete(null);
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  console.log(products);
  
  return (
    <div>
      <div className="flex justify-between items-center pb-[1.5rem] border-b-[.1rem] border-b-gray-300">
        <h3 className="text-[2.5rem] font-semibold text-gray-600">Sản phẩm</h3>
        <div>
          <button
            className="text-white flex gap-1.5 items-center px-4 py-3 bg-[var(--main-button)] rounded-lg hover:bg-[var(--main-button-hover)] cursor-pointer "
            onClick={() =>
              setOpenActionProduct({ action: "add", id: undefined })
            }
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Thêm sản phẩm
          </button>
        </div>
      </div>
      <div className="mt-[3rem]">
        <div className="w-full border-[.1rem] border-gray-300 mt-4 p-[2rem] flex items-end gap-[2rem]">
          <div className="w-[40rem] flex flex-col gap-[.5rem]">
            <label htmlFor="productName" className="text-gray-700">
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="productName"
              id="productName"
              placeholder="Nhập tìm kiếm..."
              className="w-full h-[4rem] rounded-[.5rem] outline-none border border-gray-300 pl-[1.5rem]"
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
            >
              <option value="true">Điện thoại</option>
              <option value="false">Laptop</option>
            </select>
          </div>
          <button className="w-[15%] flex items-center justify-center gap-[1rem] px-[1.5rem] h-[4rem] bg-[var(--main-button)] text-white rounded-[.5rem] cursor-pointer hover:bg-[var(--main-button-hover)]">
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
              <p className="text-gray-500 text-sm">Đang tải...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu!</p>
          </div>
        ) : (
          <table className="min-w-full table-auto text-[1.4rem] bg-white rounded-lg shadow-sm overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 uppercase font-semibold tracking-wide">
                  STT
                </th>
                <th className="px-6 py-4 text-left text-gray-600 uppercase font-semibold tracking-wide">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-gray-600 uppercase font-semibold tracking-wide">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-gray-600 uppercase font-semibold tracking-wide">
                  Giá
                </th>
                <th className="px-6 py-4 text-center text-gray-600 uppercase font-semibold tracking-wide">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products?.map((product: ProductT, index: number) => (
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
                        <h4 className="font-medium text-gray-900">
                          {product.productName}
                        </h4>
                        <p className="text-gray-500 text-[1.2rem]">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {
                      dataCategory?.find(
                        (it: CategoriesType) => it.id === product.categoryId
                      )?.categoryName
                    }
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
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        <span>Sửa</span>
                      </button>
                      <button
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        onClick={() => setOpenDelete(product.id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="w-4 h-4"
                        />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {openActionProduct && (
        <ActionProduct
          openActionProduct={openActionProduct}
          setOpenActionProduct={setOpenActionProduct}
          dataUpdate={
            openActionProduct.action === "edit"
              ? products?.find(
                  (product: ProductT) => product.id === openActionProduct.id
                )
              : undefined
          }
        />
      )}

      {openDelete && (
        <div className="fixed top-0 left-0 w-full h-[100vh] flex items-center justify-center bg-[#43434344] z-[999]">
          <div className="relative w-[50rem] h-auto bg-white p-[3rem] rounded-lg">
            <div
              className="absolute flex items-center justify-center top-[1rem] right-[1rem] w-[3rem] h-[3rem] rounded-full bg-gray-200 hover:bg-gray-300 hover-linear"
              onClick={() => setOpenDelete(null)}
            >
              <FontAwesomeIcon icon={faClose} className="text-gray-500" />
            </div>
            <h2 className="text-[1.8rem] text-gray-800">
              Bạn muốn xóa sản phẩm này?
            </h2>
            <div
              className={`flex items-center justify-end gap-[1rem] ${isLoading ? "mt-[1rem]" : "mt-[4rem]"}`}
            >
              <button
                className={`w-[8rem] h-[3.2rem] rounded-sm bg-gray-200 text-gray-600 text-[1.4rem] hover:bg-gray-300 hover-linear ${isLoading ? "cursor-not-allowed" : ""}`}
                disabled={isLoading}
                onClick={() => setOpenDelete(null)}
              >
                Hủy
              </button>
              <button
                className={`w-[6.5rem] h-[3.2rem] rounded-sm bg-red-500 text-white text-[1.4rem] hover:bg-red-600 hover-linear ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-red-600"}`}
                disabled={isLoading}
                onClick={() => handleDelete(openDelete)}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Xóa"
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
