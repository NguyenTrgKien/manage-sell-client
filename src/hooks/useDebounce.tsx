import { useEffect, useState } from "react";

export default function useDebounce(value: string, delay = 1000) {
  const [debounceQuery, setDebounceQuery] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceQuery(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debounceQuery;
}
