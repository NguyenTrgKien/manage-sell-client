import React from "react";
import type { CategoriesType } from "../../utils/types";

function RenderParentOption(
  category: CategoriesType,
  _allCategories: CategoriesType[],
  level: number = 0,
) {
  if (!category.isActive) return null;

  const children = (category as any).children ?? [];

  return (
    <React.Fragment key={category.id}>
      <option value={category.id}>
        {"└─ ".repeat(level)}
        {category.categoryName}
        {!category.isActive && " (đã dừng)"}
      </option>

      {children
        .filter((c: CategoriesType) => c.isActive)
        .map((child: CategoriesType) =>
          RenderParentOption(child, [], level + 1),
        )}
    </React.Fragment>
  );
}

export default RenderParentOption;
