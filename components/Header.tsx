"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-64 right-0 z-40 flex items-center justify-end px-6 shadow-sm">
      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </header>
  );
}
