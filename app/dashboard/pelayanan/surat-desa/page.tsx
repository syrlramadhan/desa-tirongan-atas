"use client";

import Link from "next/link";
import {
  BuildingStorefrontIcon,
  HomeModernIcon,
  DocumentCurrencyDollarIcon,
  UserIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  IdentificationIcon,
  MapIcon,
  UsersIcon,
  TruckIcon,
  SparklesIcon,
  DocumentIcon,
  NewspaperIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";

export default function LayananSuratDesaPage() {
  const suratKeteranganItems = [
    {
      title: "Surat Keterangan Usaha (SKU)",
      icon: BuildingStorefrontIcon,
      href: "/dashboard/pelayanan/surat-desa/sku",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Domisili",
      icon: HomeModernIcon,
      href: "/dashboard/pelayanan/surat-desa/domisili",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Penghasilan",
      icon: DocumentCurrencyDollarIcon,
      href: "/dashboard/pelayanan/surat-desa/penghasilan",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Tidak Mampu",
      icon: UserIcon,
      href: "/dashboard/pelayanan/surat-desa/tidak-mampu",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Kehilangan",
      icon: ExclamationCircleIcon,
      href: "/dashboard/pelayanan/surat-desa/kehilangan",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Belum Pernah",
      icon: ShieldExclamationIcon,
      href: "/dashboard/pelayanan/surat-desa/belum-pernah",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Beda Nama atau",
      icon: IdentificationIcon,
      href: "/dashboard/pelayanan/surat-desa/beda-nama",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Tanah",
      icon: MapIcon,
      href: "/dashboard/pelayanan/surat-desa/tanah",
      color: "bg-gray-300",
      disabled: true
    },
    {
      title: "Surat Keterangan Waris",
      icon: UsersIcon,
      href: "/dashboard/pelayanan/surat-desa/waris",
      color: "bg-gray-300",
      disabled: true
    },
    {
      title: "Surat Keterangan Pindah Sementara",
      icon: TruckIcon,
      href: "/dashboard/pelayanan/surat-desa/pindah-sementara",
      color: "bg-blue-500"
    },
    {
      title: "Surat Keterangan Izin Keramaian",
      icon: SparklesIcon,
      href: "/dashboard/pelayanan/surat-desa/izin-keramaian",
      color: "bg-blue-500"
    }
  ];

  const suratPengantarItems = [
    {
      title: "Surat Pengantar SKCK",
      icon: DocumentIcon,
      href: "/dashboard/pelayanan/surat-desa/pengantar/pengantar-skck",
      color: "bg-green-500"
    },
    {
      title: "Surat Pengantar KTP-el Baru",
      icon: NewspaperIcon,
      href: "/dashboard/pelayanan/surat-desa/pengantar/pengantar-ktp",
      color: "bg-green-500"
    },
    {
      title: "Surat Pengantar Cetak Ulang KK",
      icon: DocumentTextIcon,
      href: "/dashboard/pelayanan/surat-desa/pengantar/pengantar-kk",
      color: "bg-green-500"
    },
    {
      title: "Surat Pengantar Umum",
      icon: ClipboardDocumentListIcon,
      href: "/dashboard/pelayanan/surat-desa/pengantar/pengantar-umum",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">Menu Utama</Link>
        <span>›</span>
        <Link href="/dashboard/pelayanan" className="hover:text-blue-600">Pelayanan</Link>
        <span>›</span>
        <span className="text-gray-900">Layanan Surat Desa</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500 rounded-lg">
          <DocumentTextIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Layanan Surat Desa</h1>
      </div>

      {/* Surat Keterangan Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Surat Keterangan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {suratKeteranganItems.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={`p-6 bg-white rounded-lg shadow hover:shadow-lg transition-all border border-gray-200 ${
                item.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-300"
              }`}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-4 ${item.color} rounded-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 leading-tight">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Surat Pengantar Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Surat Pengantar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {suratPengantarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-all border border-gray-200 hover:border-green-300"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-4 ${item.color} rounded-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 leading-tight">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
