import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchAPI } from "../../api/search.api.js";
import Spinner from "../../components/ui/Spinner.js";

type SearchUser = {
  username: string;
  name: string;
  profile_picture: string | null;
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.length < 1) return;

    let isMounted = true;
    setLoading(true);

    const fetchResults = async () => {
      try {
        const res = await searchAPI.searchUser(query);
        if (isMounted) setUsers(res.data.data ?? []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();
    return () => { isMounted = false; };
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-xl font-bold mb-6 text-white">
        {query ? `Results for "@${query}"` : "Search by username"}
      </h1>

      {loading ? (
        <Spinner />
      ) : users.length === 0 && query ? (
        <p className="text-gray-400">No user found with username @{query}</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.username}
              onClick={() => navigate(`/chat/${user.username}`)}
              className="flex items-center gap-4 p-4 bg-slate-700 rounded-xl cursor-pointer hover:bg-slate-600 transition"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
                {user.profile_picture ? (
                  <img src={user.profile_picture} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  user.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                {/* <p className="text-sm text-gray-400">@{user.username}</p> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}