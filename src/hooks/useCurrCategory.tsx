import { useContext } from "react";
import { CategoryContext } from "../contexts/CategoryContext";

const useCurrCategory = () => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCurrCategory must be used within AuthProvider");
  return context;
};

export default useCurrCategory;
