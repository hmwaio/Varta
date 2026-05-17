import { useState, useMemo } from "react";

export const useLocalSearch = <T>(
  items: T[],
  searchKey: keyof T
) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) =>
      String(item[searchKey])
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query, items, searchKey]);

  return { query, setQuery, filtered };
};