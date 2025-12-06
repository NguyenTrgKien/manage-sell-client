export interface ProductT {
  id: number;
  productName: string;
  price: number;
  description: string;
  mainImage: string;
  inventory: number;
  category: CategoriesType;
  publicId: number;
  listImageProduct: ImageProduct[];
  variants: VariantsType[];
}

interface ImageProduct {
  id: number;
  imageUrl: string;
}

export interface CategoriesType {
  id: number;
  categoryName: string;
  isActive: boolean;
  parentId: number;
  createdAt: string;
  updatedAt: string;
  image: string;
}

export interface VariantsType {
  id: number;
  variantColor: VariantColorType;
  variantSize: VariantSizeType;
  price?: number;
  inventory: number;
  product: ProductT;
}

export interface VariantColorType {
  id: number;
  name: string;
  hexCode: string;
  sortOrder: number;
}

export interface VariantSizeType {
  id: number;
  name: string;
  sortOrder: number;
}
