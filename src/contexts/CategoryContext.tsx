import React, {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CategoriesType } from "../utils/types";

interface CategoryContext {
  currCategory: CategoriesType | null;
  setCurrCategory: Dispatch<SetStateAction<any>>;
}

export const CategoryContext = createContext<CategoryContext | null>(null);

function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [currCategory, setCurrCategory] = useState<CategoriesType | null>(null);
  return (
    <CategoryContext.Provider value={{ currCategory, setCurrCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryProvider;
