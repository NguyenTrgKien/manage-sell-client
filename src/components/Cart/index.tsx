import {
  faAdd,
  faCartPlus,
  faMinus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cartEmpty from "../../assets/images/cart_empty.png";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import MotionWrapper from "../ui/MotionWrapper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, getVariantByIds } from "../../api/user.api";
import { toast } from "react-toastify";
import type { VariantsType } from "../../utils/types";
import axiosConfig from "../../configs/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

interface CartProp {
  showCart: boolean;
  setShowCart: Dispatch<SetStateAction<boolean>>;
}

function Cart({ showCart, setShowCart }: CartProp) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<VariantsType[]>([]);
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
          };
        });
        setCartItems(formattedItems);
      } else {
        setCartItems([]);
      }
    }
  }, [user, data, showCart]);

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
      localStorage.setItem("localCart", JSON.stringify(newLocalCart));
    }
  };

  const handleRemoveItem = async (variantId: number) => {
    const newCartItems = cartItems.filter((it) => it.id !== variantId);
    setCartItems(newCartItems);
    if (user) {
      try {
        const res = await axiosConfig.delete(
          `/api/v1/cart-items/delete/${variantId}`
        );
        if (res.status) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          return;
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      const newLocalCart = localCart.filter((it) => it.variantId !== variantId);
      localStorage.setItem("localCart", JSON.stringify(newLocalCart));
      window.dispatchEvent(new Event("localStorageUpdate"));
    }
  };
  return (
    <MotionWrapper
      open={showCart}
      className="w-[90%] md:w-[50rem] max-h-[55rem] bg-white rounded-md shadow-xl overflow-hidden px-2 py-4 md:p-5"
    >
      <>
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <FontAwesomeIcon icon={faCartPlus} className="text-red-500" />
          <div className="text-[1.4rem] md:text-[1.6rem] font-semibold text-gray-700">
            GIỎ HÀNG ({cartItems?.length})
          </div>
          <span
            className="ml-auto cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setShowCart(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="text-gray-600" />
          </span>
        </div>

        {cartItems?.length > 0 ? (
          <div className="overflow-y-auto hide-scrollbar max-h-[40rem]">
            {cartItems.map((item: any) => (
              <Link
                to={`/product-detail/${item.product.slug}`}
                key={item.id}
                className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200"
              >
                <div className=" flex items-center gap-[1rem]">
                  <img
                    src={item.product.mainImage}
                    alt=""
                    className="w-[4.8rem] h-[4.8rem] rounded-md object-cover"
                  />
                  <div className="w-[20rem]">
                    <div className="text-[1.2rem] md:text-[1.4rem] text-gray-800 text-limit-1">
                      {item.product.productName}
                    </div>
                    <div className="flex items-center gap-1 md:gap-[1rem]">
                      <p className="flex items-center gap-2 text-gray-600 text-[1rem] md:text-[1.2rem]">
                        Size: <span className="">{item.variantSize.name}</span>
                      </p>
                      <span className="block h-[1.2rem] border-l border-l-gray-400"></span>
                      <p className="flex items-center gap-2 text-gray-600 text-[1rem] md:text-[1.2rem]">
                        Màu: <span className="">{item.variantColor.name}</span>
                      </p>
                    </div>
                    <div className="text-red-500 text-[1rem] md:text-[1.4rem]">
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        Number(item.product.price) || Number(item.price)
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-[2rem] w-[2rem] md:h-[2.4rem] md:w-[2.4rem] text-[1.4rem] md:text-[1.6rem] flex items-center justify-center border border-gray-400 rounded hover:bg-gray-100"
                    onClick={() => handleQuantity(item.id, "decre")}
                  >
                    <FontAwesomeIcon
                      icon={faMinus}
                      className="text-[1.2rem] text-gray-600"
                    />
                  </button>
                  <span className="text-gray-600 text-[1.2rem] md:text-[1.4rem]">
                    {item.quantity}
                  </span>
                  <button
                    className="h-[2rem] w-[2rem] md:h-[2.4rem] md:w-[2.4rem] text-[1.4rem] md:text-[1.6rem] flex items-center justify-center border border-gray-400 rounded hover:bg-gray-100"
                    onClick={() => handleQuantity(item.id, "incre")}
                  >
                    <FontAwesomeIcon
                      icon={faAdd}
                      className="text-[1.2rem] text-gray-600"
                    />
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="text-red-500 cursor-pointer ml-2"
                    />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <img src={cartEmpty} alt="cart empty" className="w-40" />
            <p className="mt-4 text-gray-500">
              Không có sản phẩm trong giỏ hàng
            </p>
          </div>
        )}
        <div className="mt-[2rem] flex items-center justify-end gap-[1rem] text-[1.2rem] md:text-[1.6rem]">
          <button
            className="px-[2rem] h-[3.5rem] rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300"
            onClick={() => setShowCart(false)}
          >
            Đóng
          </button>
          <button
            type="button"
            className="px-[2rem] h-[3.5rem] flex items-center rounded-md from-pink-400 to-red-500 bg-gradient-to-r hover:from-pink-500 hover:to-red-600 text-white transition duration-300"
            onClick={() => {
              setShowCart(false);
              navigate("/cart/detail");
            }}
          >
            Chi tiết giỏ hàng
          </button>
        </div>
      </>
    </MotionWrapper>
  );
}

export default Cart;
