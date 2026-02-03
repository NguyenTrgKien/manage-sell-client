import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faClose, faMessage, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import axiosConfig from "../configs/axiosConfig";
import { useUser } from "../hooks/useUser";
import { useSessionId } from "../hooks/useSessionId";
import { useQuery } from "@tanstack/react-query";
import { getHistoryChat } from "../api/chat.api";
import avatarDefault from "../assets/images/avatar-default.png";

function ChatboxAI() {
  const { user } = useUser();
  const sessionId = useSessionId();
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
      timestamp: string;
    }[]
  >([]);
  const { data: dataHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["historyChat", sessionId, user?.id],
    queryFn: () =>
      getHistoryChat({ session_id: sessionId, userId: Number(user?.id) }),
  });

  useEffect(() => {
    if (dataHistory?.data) {
      const mapHistory = dataHistory.data.map((h: any) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
        timestamp: h.timestamp,
      }));
      setMessages(mapHistory);
    }
  }, [dataHistory]);

  const [inputMessage, setInputMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputMessage?.trim()) return;

    const userMsg = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await axiosConfig.post("/api/v1/chat/create", {
        content: userMsg.content,
        ...(user ? {} : { session_id: sessionId }),
      });

      if (!res.status) throw new Error("Lỗi từ server!");

      const aiMsg = {
        role: "assistant",
        content: res.data.message,
        timestamp: res.data.timestamp,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xã ra. Vui lòng thử lại sau nhé!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const SkeletonChat = () => {
    return (
      <div className="flex items-end gap-4 animate-pulse">
        <div className="w-14 h-14 rounded-full bg-gray-200"></div>
        <div className="flex flex-col max-w-[70%] space-y-2">
          <div className="h-20 bg-gray-200 rounded-4xl rounded-bl-none w-64"></div>
          <div className="h-3 bg-gray-100 rounded w-16"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-14 right-8 z-[999]" ref={elementRef}>
      <button
        onClick={() => setIsOpen(true)}
        className="relative bg-green-600 text-white w-22 h-22 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group "
      >
        <FontAwesomeIcon icon={faMessage} className="text-[2rem]" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-8 h-8 text-[1.4rem] flex items-center justify-center animate-pulse">
          1
        </span>
      </button>
      {isOpen && (
        <div className="absolute flex flex-col bottom-[6rem] right-0 md:right-[2rem] lg:right-[5rem] w-[35rem] md:w-[45rem] h-[55rem] rounded-xl shadow-2xl bg-white z-[999]">
          <button
            type="button"
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faClose} className="text-gray-500" />
          </button>
          <div className="w-full h-auto p-6 flex items-center space-x-4 bg-blue-500 rounded-tr-xl rounded-tl-xl text-white">
            <div className="w-14 h-14 rounded-full bg-[#ffffff48] flex items-center justify-center">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div>
              <p>Trợ lý AI</p>
              <p className="text-[1.2rem]">Luôn sẵn sàn hỗ trợ khách hàng</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-8 w-full min-h-[15rem] p-6 overflow-y-auto hide-scrollbar">
            {historyLoading ? (
              Array.from({ length: 4 }).map((_, idx) => {
                return (
                  <div key={idx}>
                    <SkeletonChat />;
                  </div>
                );
              })
            ) : messages.length > 0 ? (
              messages.map((message: any, index: number) => {
                const myMessage = message.role === "user";
                return (
                  <div
                    key={`${message.role}-${message.timestamp}-${index}`}
                    className={`flex items-end gap-4 ${
                      myMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!myMessage && (
                      <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[70%]">
                      <div
                        className={`p-5 rounded-4xl text-[1.4rem] break-words whitespace-pre-wrap
                        ${
                          myMessage
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white border border-gray-200 rounded-bl-none"
                        }
                      `}
                      >
                        {message.content}
                      </div>

                      <span
                        className={`text-[1rem] text-gray-400 mt-1 ${
                          myMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    {myMessage && (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center">
                        <img
                          src={user ? user.avatar : avatarDefault}
                          alt="avatar user"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex items-center space-x-4 w-full h-auto p-6 mt-auto border-t border-t-gray-200">
            <input
              type="text"
              value={inputMessage ?? ""}
              className="flex-1 w-full h-[5rem] rounded-full border border-gray-300 outline-none px-[3rem]"
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button
              className="w-[5rem] h-[5rem] rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
              onClick={handleSend}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatboxAI;
