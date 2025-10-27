export interface ProductT {
  id: number;
  productName: string;
  price: number;
  description: string;
  mainImage: string;
  inventory: number;
  categoryId: number;
  publicId: number;
  listImages: any[];
}

export interface CategoriesType {
  id: number;
  categoryName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
}
