import type { UserType } from "./userType";

export interface ChatType {
  id: number;
  content: string;
  timestamp: string;
  createdAt: string;
  user?: UserType;
  session_id?: string;
  role: "user" | "assistant";
}
