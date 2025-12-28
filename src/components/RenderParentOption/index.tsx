import React from "react";
import type { CategoriesType } from "../../utils/types";

interface RenderParentOptionProp {
  category: CategoriesType;
  allCategories: CategoriesType[];
  level: number;
}

function RenderParentOption({
  category,
  allCategories,
  level = 0,
}: RenderParentOptionProp) {
  if (!category.isActive) return null;
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
        .map((child) => (
          <RenderParentOption
            key={child.id}
            category={child}
            allCategories={allCategories}
            level={level + 1}
          />
        ))}
    </React.Fragment>
  );
}

export default RenderParentOption;
