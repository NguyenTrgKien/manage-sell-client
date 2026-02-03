import axiosConfig from "../configs/axiosConfig";

export const getHistoryChat = async ({
  session_id,
  userId,
}: {
  session_id: string | null;
  userId: number;
}) => {
  const res = axiosConfig.get("/api/v1/chat/history", {
    params: {
      ...(userId ? {} : { session_id: session_id }),
    },
  });
  return res;
};
