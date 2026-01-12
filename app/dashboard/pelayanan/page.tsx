import Link from "next/link";
import {
  UserGroupIcon,
  MapIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

export default function PelayananPage() {
  const layananItems = [
    {
      title: "Layanan Kependudukan",
      description: "Pengelolaan data penduduk, KK, KTP, dan dokumen kependudukan lainnya",
      icon: UserGroupIcon,
      href: "/dashboard/pelayanan/kependudukan",
      color: "bg-blue-500"
    },
    {
      title: "Layanan Pertanahan",
      description: "Pengelolaan surat tanah, sertifikat, dan dokumen pertanahan",
      icon: MapIcon,
      href: "/dashboard/pelayanan/pertanahan",
      color: "bg-green-500"
    },
    {
      title: "Layanan Surat Desa",
      description: "Pembuatan berbagai surat keterangan dan surat pengantar",
      icon: DocumentTextIcon,
      href: "/dashboard/pelayanan/surat-desa",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-900">Pelayanan</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Menu Pelayanan</h1>

      {/* Grid Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layananItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300"
          >
            <div className={`p-4 ${item.color} rounded-lg w-fit mb-4`}>
              <item.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
