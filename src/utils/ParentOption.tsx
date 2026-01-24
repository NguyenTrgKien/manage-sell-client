import React from "react";
import type { CategoriesType } from "./types";

function ParentOption(
  category: CategoriesType,
  allCategories: CategoriesType[],
  level: number = 0,
) {
  const children = allCategories.filter((c) => c.parentId === category.id);
  const paddingLeft = level * 24;

  return (
    <React.Fragment key={category.id}>
      <option value={category.id} style={{ paddingLeft: `${paddingLeft}px` }}>
        {"└─ ".repeat(level)}
        {category.categoryName}
        {!category.isActive && " (đã dừng)"}
      </option>

      {children
        .filter((c) => c.isActive)
        .map((child) => ParentOption(child, allCategories, level + 1))}
    </React.Fragment>
  );
}

export default ParentOption;
