"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  TableCellsIcon, 
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Auto-open menu based on current path
  useEffect(() => {
    if (pathname.startsWith("/dashboard/master-data")) {
      setOpenMenu("master-data");
    } else if (pathname.startsWith("/dashboard/pelayanan")) {
      setOpenMenu("pelayanan");
    } else if (pathname.startsWith("/dashboard/settings")) {
      setOpenMenu("settings");
    }
  }, [pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path: string) => pathname === path;
  const isActiveParent = (path: string) => pathname.startsWith(path);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        w-64 bg-gradient-to-b from-blue-100 to-blue-50 h-screen fixed left-0 top-0 flex flex-col shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
      {/* Logo Section */}
      <div className="bg-white p-4 flex items-center gap-3 border-b border-blue-200">
        <div className="w-12 h-12 relative flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo Desa"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="font-bold text-blue-900 text-xs leading-tight">
            Desa Tirongan Atas
          </div>
          <div className="text-[10px] text-gray-600 leading-tight mt-0.5">
            Kec. Bungku Utara
          </div>
        </div>
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Menu Utama
          </h3>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-1 ${
              pathname === "/dashboard"
                ? "text-blue-700 bg-blue-200"
                : "text-gray-700 hover:bg-blue-200"
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          {/* Master Data */}
          <div className="mb-1">
            <button
              onClick={() => toggleMenu("master-data")}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isActiveParent("/dashboard/master-data")
                  ? "text-blue-700 bg-blue-200"
                  : "text-gray-700 hover:bg-blue-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <TableCellsIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Master Data</span>
              </div>
              {openMenu === "master-data" ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            
            {openMenu === "master-data" && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  href="/dashboard/master-data/penduduk"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/master-data/penduduk")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Dt Penduduk
                </Link>
                <Link
                  href="/dashboard/master-data/keluarga"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/master-data/keluarga")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Dt Keluarga
                </Link>
                <Link
                  href="/dashboard/master-data/wilayah"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/master-data/wilayah")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Dt Wilayah
                </Link>
              </div>
            )}
          </div>

          {/* Pelayanan */}
          <div className="mb-1">
            <button
              onClick={() => toggleMenu("pelayanan")}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isActiveParent("/dashboard/pelayanan")
                  ? "text-blue-700 bg-blue-200"
                  : "text-gray-700 hover:bg-blue-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Pelayanan</span>
              </div>
              {openMenu === "pelayanan" ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            
            {openMenu === "pelayanan" && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  href="/dashboard/pelayanan/kependudukan"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/pelayanan/kependudukan")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Ly Kependudukan
                </Link>
                <Link
                  href="/dashboard/pelayanan/pertanahan"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/pelayanan/pertanahan")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Ly Pertanahan
                </Link>
                <Link
                  href="/dashboard/pelayanan/surat-desa"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/pelayanan/surat-desa")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Ly Surat Desa
                </Link>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="mb-1">
            <button
              onClick={() => toggleMenu("settings")}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isActiveParent("/dashboard/settings")
                  ? "text-blue-700 bg-blue-200"
                  : "text-gray-700 hover:bg-blue-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </div>
              {openMenu === "settings" ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            
            {openMenu === "settings" && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  href="/dashboard/settings/profil-desa"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/settings/profil-desa")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Profil Desa
                </Link>
                <Link
                  href="/dashboard/settings/keamanan"
                  className={`block p-2 pl-4 text-sm rounded ${
                    isActiveParent("/dashboard/settings/keamanan")
                      ? "text-blue-700 font-medium bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  Keamanan
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Extras Section - Removed */}
      </nav>

      {/* User Profile - Bottom */}
      <div className="p-4 flex items-center gap-3 border-t border-blue-200 bg-white mt-auto">
        <UserCircleIcon className="w-10 h-10 text-gray-400" />
        <div className="flex-1">
          <div className="font-semibold text-gray-800 text-sm">Juni Prayitno</div>
          <div className="text-xs text-gray-600">Sekertaris Desa</div>
        </div>
      </div>
    </aside>
    </>
  );
}
