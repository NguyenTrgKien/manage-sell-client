import { useState } from "react";
import { useUser } from "./useUser";
import { useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../configs/axiosConfig";

export const useAddCart = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [notify, setNotify] = useState<{ show: boolean; content: string }>({
    show: false,
    content: "",
  });
  const queryClient = useQueryClient();
  const addToCart = async (
    items: {
      variantId: number | undefined;
      quantity: number;
    }[]
  ) => {
    setIsLoading(true);
    try {
      if (!user) {
        let localCart = JSON.parse(localStorage.getItem("localCart") || "[]");

        for (const item of items) {
          const exist = localCart.find(
            (it: any) => it.variantId === item.variantId
          );
          if (exist) {
            exist.quantity += item.quantity;
          } else {
            localCart.push({
              variantId: item.variantId,
              quantity: item.quantity,
            });
          }
        }
        localStorage.setItem("localCart", JSON.stringify(localCart));
        window.dispatchEvent(new Event("localStorageUpdate"));

        setNotify({ show: true, content: "Đã thêm vào giỏ hàng!" });
        return true;
      }

      const res = await axiosConfig.post("/api/v1/cart/add-to-cart", items);
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setNotify({ show: true, content: "Đã thêm vào giỏ hàng!" });
        return true;
      }
    } catch (err) {
      setNotify({ show: true, content: "Có lỗi xảy ra!" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { addToCart, isLoading, notify, setNotify };
};
