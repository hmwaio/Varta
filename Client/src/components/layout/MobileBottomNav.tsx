import {
  BookMarked,
  CircleUserRound,
  Home,
  Menu,
  PlusSquare,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileBottomNav({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t shadow-md flex justify-around items-center py-3 lg:hidden z-50">
      <button
        onClick={onMenuClick}
        className="focus-visible:text-orange-500 text-gray-600"
      >
        <Menu className="h-6 w-6 cursor-pointer" />
      </button>

      <Link to="/" className="focus-visible:text-orange-500 text-gray-600">
        <Home className="w-6 h-6 cursor-pointer" />
      </Link>

      <Link
        to="/saved-posts"
        className="focus-visible:text-orange-500 text-gray-600"
      >
        <BookMarked className="w-6 h-6 cursor-pointer" />
      </Link>

      <Link
        to="/search"
        className="focus-visible:text-orange-500 text-gray-600"
      >
        <Search className="w-6 h-6 cursor-pointer" />
      </Link>

      <Link
        to="/new-post"
        className="focus-visible:text-orange-500 text-gray-600"
      >
        <PlusSquare className="w-6 h-6 cursor-pointer" />
      </Link>

      <Link to="/me" className="focus-visible:text-orange-500 text-gray-600">
        <CircleUserRound className="w-6 h-6 cursor-pointer" />
      </Link>
    </div>
  );
}
