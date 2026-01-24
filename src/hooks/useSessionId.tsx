import { useState } from "react";

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    let sid = localStorage.getItem("search_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("search_session_id", sid);
    }
    return sid;
  });

  return sessionId;
};
