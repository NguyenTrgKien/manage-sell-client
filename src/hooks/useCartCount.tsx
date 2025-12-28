import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/user.api";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

export const useCartCount = () => {
  const { user } = useUser();
  const [cartCount, setCartCount] = useState(0);

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (user && cartData && cartData.length > 0) {
      const totalCount = cartData[0].items.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
      setCartCount(totalCount);
    } else if (user && (!cartData || cartData.length === 0)) {
      setCartCount(0);
    }
  }, [user, cartData]);

  useEffect(() => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");

      const totalCount = localCart.reduce(
        (total: number, item: { variantId: number; quantity: number }) =>
          total + item.quantity,
        0
      );
      setCartCount(totalCount);

      const handleStorageChange = () => {
        const updatedCart = JSON.parse(
          localStorage.getItem("localCart") || "[]"
        );
        const newCount = updatedCart.reduce(
          (total: number, item: { variantId: number; quantity: number }) =>
            total + item.quantity,
          0
        );
        setCartCount(newCount);
      };

      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("localStorageUpdate", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("localStorageUpdate", handleStorageChange);
      };
    }
  }, [user]);

  return cartCount;
};
