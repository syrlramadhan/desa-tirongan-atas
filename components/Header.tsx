"use client";

import { useRouter } from "next/navigation";
import { 
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 lg:left-64 z-30 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      {/* Hamburger menu for mobile */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>
      
      {/* Spacer for desktop */}
      <div className="hidden lg:block"></div>
      
      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 lg:px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </header>
  );
}
