import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

interface SearchingProps {
  // For local search
  onLocalSearch?: (query: string) => void;
  placeholder?: string;
}

function Searching({ onLocalSearch, placeholder }: SearchingProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearchPage = location.pathname === "/search";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // Local search — instant filter
    if (!isSearchPage && onLocalSearch) {
      onLocalSearch(e.target.value);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    if (isSearchPage || !onLocalSearch) {
      // Global search — navigate to search page
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          type="text"
          placeholder={placeholder ?? (isSearchPage ? "Search by exact username..." : "Search or start chat")}
          className="w-full h-10 pl-10 rounded-full focus:outline-none focus:ring-2  bg-slate-700 text-white"
        />
      </div>
    </form>
  );
}

export default Searching;