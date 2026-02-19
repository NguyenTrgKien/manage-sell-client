import axiosConfig from "../configs/axiosConfig";
import type { CollectionStatus } from "../utils/collection.type";

export const getAllCollections = async (query: {
  page: number;
  limit: number;
  name?: string;
  status?: CollectionStatus | string;
}) => {
  const filterParams = Object.fromEntries(
    Object.entries(query).filter(
      ([_, value]) => value !== null && value !== "",
    ),
  );
  return await axiosConfig.get("/api/v1/collections", {
    params: filterParams,
  });
};

export const toggleCollectionStatus = async (
  collectionId: number,
  status: CollectionStatus,
) => {
  const response = await axiosConfig.patch(
    `/api/v1/collections/${collectionId}/toggle`,
    { status },
  );
  return response.data;
};

export const getCollectionBySlug = async (
  slug: string | undefined,
  sortBy: string,
) => {
  if (!slug) return null;
  return await axiosConfig.get(`/api/v1/collections/by-slug/${slug}`, {
    params: {
      sortBy,
    },
  });
};
