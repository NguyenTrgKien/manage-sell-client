import {
  faClockRotateLeft,
  faClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRecentSearch } from "../api/product.api";
import { useSessionId } from "../hooks/useSessionId";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../configs/axiosConfig";
import useDebounce from "../hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchInput({ isMobile }: { isMobile: boolean }) {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const debounce = useDebounce(searchQuery, 500);
  const [isSuggesting, setIsSuggesting] = useState(true);
  const [showSuggest, setShowSuggest] = useState({
    open: false,
    data: [],
  });

  const sessionId = useSessionId();
  if (!sessionId) {
    throw new Error("sessionId không tồn tại!");
  }

  const {
    data: recentData,
    isLoading: isRecentLoading,
    refetch,
  } = useQuery({
    queryKey: ["recentSearches", sessionId],
    queryFn: () => getRecentSearch(sessionId, Number(user?.id)),
    enabled: isFocused && (!!user || !!sessionId),
    staleTime: 60 * 1000,
  });

  const recents = (recentData && recentData.data) || [];

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      setShowSuggest((prev) => ({ ...prev, open: false }));
    }
  }, [query]);

  const saveSearchQuery = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      try {
        const res = await axiosConfig.post("/api/v1/search/save", {
          query: q.trim(),
          ...(user ? undefined : { session_id: sessionId }),
        });
        if (res.status) {
          await refetch();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [user, sessionId, refetch],
  );

  useEffect(() => {
    if (!debounce) return;

    const controller = new AbortController();
    setIsSuggesting(true);

    const fetch = async () => {
      try {
        const res = (await axiosConfig.get("/api/v1/product/suggest", {
          params: {
            productName: debounce,
          },
        })) as any;

        if (res.status) {
          setShowSuggest((prev) => ({ ...prev, data: res.suggestions }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSuggesting(false);
      }
    };
    fetch();

    return () => controller.abort();
  }, [debounce]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = searchQuery.trim();
      if (q) {
        saveSearchQuery(q);
        navigate(`/search?q=${encodeURIComponent(q)}`);
      }
    }
  };

  const handleSelectItem = (item: string) => {
    if (!item) return;
    setSearchQuery(item);
    setShowSuggest((prev) => ({ ...prev, open: false }));
    navigate(`/search?q=${encodeURIComponent(item)}`);
  };

  const showDropdown = isFocused;
  const containerClass = isMobile
    ? "mt-4 mb-2"
    : "relative flex-1 max-w-2xl mx-4 lg:mx-8";

  const inputClass = isMobile
    ? "text-[1.4rem] w-full h-[3.5rem] pl-12 pr-4 border-2 border-gray-300 rounded-full outline-none focus:border-pink-500 transition-colors"
    : "text-[1.4rem] w-full h-[3.5rem] md:h-[4rem] pl-10 md:pl-[3.4rem] pr-4 border-2 border-gray-300 rounded-full outline-none focus:border-pink-500 transition-colors";

  return (
    <div className={containerClass} ref={searchRef}>
      <div className="relative w-full">
        <input
          type="text"
          className={inputClass}
          placeholder={
            isMobile
              ? "Tìm kiếm sản phẩm..."
              : "Tìm áo thun, quần jean, giày sneaker..."
          }
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            if (value.startsWith(" ") && searchQuery === "") return;
            setSearchQuery(value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={handleKeyDown}
        />
        <FontAwesomeIcon
          icon={faSearch}
          className={`text-gray-400 absolute top-1/2 -translate-y-1/2 ${
            isMobile
              ? "w-4 h-4 left-3"
              : "w-4 h-4 md:w-5 md:h-5 left-3 md:left-4"
          }`}
        />
      </div>

      {showDropdown && (
        <div className="text-[1.4rem] absolute top-[calc(100%)] md:top-[calc(100%+.5rem)] left-0 bg-white w-full max-h-[400px] overflow-y-auto border border-gray-300 rounded-md shadow-xl z-50">
          {searchQuery.trim() ? (
            <>
              {isSuggesting ? (
                <div className="p-5 text-center text-gray-500">
                  Đang tìm kiếm...
                </div>
              ) : showSuggest.data.length > 0 ? (
                showSuggest.data.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="p-5 hover:bg-pink-50 cursor-pointer transition-colors"
                      onMouseDown={() => handleSelectItem(item)}
                    >
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="text-gray-400 mr-3"
                      />
                      {item}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Không tìm thấy sản phẩm phù hợp
                </div>
              )}
            </>
          ) : (
            <>
              {isRecentLoading ? (
                <div className="p-6 text-center text-gray-500">Đang tải...</div>
              ) : recents.length > 0 ? (
                <>
                  <div className="p-5 text-[1.4rem] text-gray-500 font-medium border-b border-b-gray-300">
                    Tìm kiếm gần đây
                  </div>
                  {recents.map((item: any, idx: any) => {
                    const queryStr =
                      typeof item === "string" ? item : item.query;
                    return (
                      <div
                        key={idx}
                        className="p-5 hover:bg-pink-50 cursor-pointer flex items-center gap-3 transition-colors"
                        onClick={() => handleSelectItem(item.query)}
                      >
                        <div className="flex items-center space-x-4">
                          <FontAwesomeIcon
                            icon={faClockRotateLeft}
                            className="text-gray-400"
                          />
                          <span className="flex-1">{queryStr}</span>
                        </div>
                        <button className="ml-auto cursor-pointer">
                          <FontAwesomeIcon
                            icon={faClose}
                            className="hover:text-gray-800 text-gray-500"
                          />
                        </button>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Chưa có lịch sử tìm kiếm
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
