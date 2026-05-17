import { Logout } from "@mui/icons-material";
import { useState } from "react";
import { useSignout } from "../../../hooks/auth/useSignout";

type props = {
  width: string;
};

function Signout({ width }: props) {
  const signout = useSignout();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${width} flex items-center gap-3 px-4 py-2 hover:bg-red-300
        hover:text-red-200 hover:rounded-xl cursor-pointer ${
          loading ? "opacity-50" : ""
        }`}
      >
        <Logout fontSize="small" />
        <span>{loading ? "Logging out..." : "Log out"}</span>
      </button>
    </div>
  );
}

export default Signout;
