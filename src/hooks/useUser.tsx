// hooks/useUser.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../configs/axiosConfig";
import type { UserType } from "../utils/userType";

const fetchUser = async (): Promise<UserType | null> => {
  try {
    const res = (await axiosConfig.get("/api/v1/auth/me")) as any;
    if (!res?.user) {
      return null;
    }
    return res.user;
  } catch (err: any) {
    if (err?.response?.status === 401) return null;
    throw err;
  }
};

export const useUser = () => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => error.status !== 401,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const setUser = (data: UserType | null) => {
    queryClient.setQueryData(["user"], data);
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    return await refetch();
  };

  const clearUser = () => {
    queryClient.setQueryData(["user"], null);
  };

  return { user, loading, refreshUser, clearUser, setUser };
};
