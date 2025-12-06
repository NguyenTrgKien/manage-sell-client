import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faTrash,
  faPlus,
  faMinus,
  faCheckSquare,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import type { VariantsType } from "../../../utils/types";
import { getCart, getVariantByIds } from "../../../api/user.api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosConfig from "../../../configs/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";

export default function CartDetail() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<VariantsType[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [localCart, setLocalCart] = useState<
    {
      variantId: number;
      quantity: number;
    }[]
  >([]);

  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      const storedCart = !user
        ? JSON.parse(localStorage.getItem("localCart") || "[]")
        : [];
      setLocalCart(storedCart);
      if (storedCart.length === 0) {
        setCartItems([]);
        return;
      }

      const variantIds = storedCart.map(
        (i: { variantId: number; quantity: number }) => i.variantId
      );

      const fetchVariants = async () => {
        try {
          const res = (await getVariantByIds(variantIds)) as any;

          if (res.status) {
            const itemsWithQuantity = res.data.map((variant: VariantsType) => {
              const cartItem = storedCart.find(
                (c: any) => c.variantId === variant.id
              );
              return {
                ...variant,
                quantity: cartItem.quantity || 1,
                selected: false,
              };
            });
            setCartItems(itemsWithQuantity);
          }
        } catch (error: any) {
          console.log(error);
          toast.error(error.message);
        }
      };
      fetchVariants();
    } else {
      if (data && data.length > 0) {
        const cartData = data[0];
        const formattedItems = cartData.items.map((item: any) => {
          return {
            id: item.variant.id,
            product: item.variant.product,
            variantSize: item.variant.variantSize,
            variantColor: item.variant.variantColor,
            price: item.price,
            quantity: item.quantity,
            inventory: item.variant.inventory,
            selected: false,
          };
        });
        setCartItems(formattedItems);
      } else {
        setCartItems([]);
      }
    }
  }, [user, data]);

  useEffect(() => {
    const allSelected =
      cartItems.length > 0 && cartItems.every((item: any) => item.selected);
    const noneSelected = cartItems.every((item: any) => !item.selected);
    setSelectAll(allSelected && !noneSelected);
  }, [cartItems]);

  const handleQuantity = async (
    variantId: number,
    action: "incre" | "decre"
  ) => {
    const newCartItems = cartItems.map((it: any) => {
      if (it.id === variantId) {
        return {
          ...it,
          quantity:
            action === "incre"
              ? Math.min(it.inventory, it.quantity + 1)
              : Math.max(1, it.quantity - 1),
        };
      }
      return it;
    });
    setCartItems(newCartItems);
    const newQuantity = newCartItems.find((it) => it.id === variantId).quantity;
    const updateQuantity = {
      variantId: variantId,
      quantity: newQuantity,
    };
    if (user) {
      try {
        const res = await axiosConfig.patch(
          "/api/v1/cart-items/update-quantity",
          updateQuantity
        );
        if (res.status) {
          return;
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      const newLocalCart = localCart.map((it) => {
        if (it.variantId === variantId) {
          return {
            ...it,
            quantity: newQuantity,
          };
        }
        return it;
      });
      setLocalCart(newLocalCart);
      localStorage.setItem("localCart", JSON.stringify(newLocalCart));
    }
  };

  const removeItem = async (variantId: number) => {
    if (user) {
      try {
        await axiosConfig.delete(`/api/v1/cart-items/${variantId}`);
        setCartItems((prev) => prev.filter((item) => item.id !== variantId));
      } catch (error: any) {
        toast.error(error.message || "Xóa thất bại");
      }
    } else {
      const newLocalCart = localCart.filter(
        (item) => item.variantId !== variantId
      );
      localStorage.setItem("localCart", JSON.stringify(newLocalCart));
      setLocalCart(newLocalCart);
      setCartItems((prev) => prev.filter((item) => item.id !== variantId));
    }
  };

  const toggleSelectAll = () => {
    const newSelect = !selectAll;
    setSelectAll(newSelect);
    setCartItems(cartItems.map((item) => ({ ...item, selected: newSelect })));
  };

  const toggleItem = (id: number) => {
    setCartItems(
      cartItems.map((item: any) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const formatPrice = (price: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalAmount = () => {
    return cartItems
      .filter((it: any) => it.selected)
      .reduce((acc, item: any) => {
        const price = item.price || item.product?.price || 0;
        return acc + price * item.quantity;
      }, 0);
  };

  const selectedItems = cartItems.filter((item: any) => item.selected);
  const selectedCount = selectedItems.length;

  const processToCheckout = () => {
    const checkoutData = {
      items: selectedItems.map((item: any) => {
        return {
          variantId: item.id,
          productId: item.product.id,
          productName: item.product.productName,
          mainImage: item.product.mainImage,
          price: item.price || item.product.price,
          quantity: item.quantity,
          size: item.variantSize?.name || "",
          color: item.variantColor?.name || "",
          inventory: item.inventory,
        };
      }),
      subtotal: totalAmount(),
      shippingFee: 0,
      total: totalAmount(),
      timestamp: new Date().toISOString(),
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/checkout");
  };

  const handleCheckOut = () => {
    if (selectedCount === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    const outOfInventory = selectedItems.find(
      (item: any) => item.quantity > item.inventory
    );
    if (outOfInventory) {
      toast.error(
        `Sản phẩm "${outOfInventory.product.productName}" không đủ số lượng`
      );
      return;
    }

    processToCheckout();
  };
  console.log(cartItems);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 lg:px-[12rem]">
      <div className="flex items-center gap-4 mb-8">
        <FontAwesomeIcon icon={faCartPlus} className="text-4xl text-red-500" />
        <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
        <span className="text-[1.4rem] text-gray-500">
          ({cartItems.filter((it: any) => it.selected).length} sản phẩm được
          chọn)
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-[1.6rem]">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="py-5 text-left pl-6 font-normal">
                  <div className="flex items-center gap-3">
                    <button onClick={toggleSelectAll}>
                      <FontAwesomeIcon
                        icon={selectAll ? faCheckSquare : faSquare}
                        className={`text-[2rem] ${
                          selectAll ? "text-blue-600" : "text-gray-300"
                        }`}
                      />
                    </button>
                    <span>Sản phẩm</span>
                  </div>
                </th>
                <th className="py-5 font-normal">Đơn giá</th>
                <th className="py-5 font-normal">Số lượng</th>
                <th className="py-5 font-normal">Thành tiền</th>
                <th className="py-5 font-normal">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-6 pl-6">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleItem(item.id)}>
                        <FontAwesomeIcon
                          icon={item.selected ? faCheckSquare : faSquare}
                          className={`text-[2rem] ${
                            item.selected ? "text-blue-600" : "text-gray-300"
                          }`}
                        />
                      </button>
                      <img
                        src={item.product.mainImage}
                        alt={item.product.productName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="max-w-xs">
                        <p className=" text-gray-800 line-clamp-1">
                          {item.product.productName}
                        </p>
                        {item.inventory < 5 && (
                          <p className="text-sm text-red-500 mt-1">
                            Chỉ còn {item.inventory} sản phẩm
                          </p>
                        )}
                        <div className="text-[1.2rem] text-gray-600 flex items-center gap-[.5rem]">
                          <span>size: {item.variantSize.name}</span>
                          <span className="h-[1.5rem] border-r border-r-gray-400"></span>
                          <span>màu: {item.variantColor.name}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <div>
                      <p className=" text-[1.4rem] text-red-600">
                        {formatPrice(Number(item.price || item.product.price))}
                      </p>
                      {item.price && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(item.price)}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleQuantity(item.id, "decre")}
                        disabled={item.quantity <= 1}
                        className="w-10 h-10 rounded-lg border border-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="text-gray-500"
                        />
                      </button>
                      <span className="w-8 text-center text-gray-600">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity(item.id, "incre")}
                        disabled={item.quantity >= item.inventory}
                        className="w-10 h-10 rounded-lg border border-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-gray-500"
                        />
                      </button>
                    </div>
                  </td>

                  <td className="text-center text-[1.4rem] text-red-600">
                    {formatPrice(
                      Number(item.price || item.product.price) *
                        Number(item.quantity)
                    )}
                  </td>

                  <td className="text-center">
                    <button
                      className="text-red-500 hover:text-red-700 transition p-3"
                      onClick={() => removeItem(item.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-[1.4rem]"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cartItems.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-2xl">Giỏ hàng trống</p>
            </div>
          )}
        </div>

        <div className="w-[40rem]">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h2 className="font-bold text-gray-800 mb-6">
              Thông tin thanh toán
            </h2>

            <div className="space-y-6 text-[1.4rem] text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính ({selectedCount} sản phẩm):</span>
                <span className="font-semibold">
                  {formatPrice(totalAmount())}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600 ">Miễn phí</span>
              </div>
              <div className="border-t border-t-gray-400 pt-6">
                <div className="flex justify-between text-[1.4rem]">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-[1.8rem] text-red-600">
                    {formatPrice(totalAmount())}
                  </span>
                </div>
              </div>
            </div>

            <button
              disabled={cartItems.length === 0}
              className={`w-full mt-8 py-4 rounded-xl font-bold text-[1.4rem] transition ${
                selectedCount === 0
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 shadow-lg text-white"
              }`}
              onClick={() => handleCheckOut()}
            >
              {selectedCount === 0
                ? "Vui lòng chọn sản phẩm"
                : "Thanh toán ngay"}
            </button>

            <div className="mt-4 text-center text-[1.2rem] text-gray-500">
              Miễn phí vận chuyển cho đơn từ 500.000₫
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
