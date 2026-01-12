"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DocumentTextIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function PertanahanPage() {
  const [activeTab, setActiveTab] = useState("surat-tanah");

  const tabs = [
    { id: "surat-tanah", name: "Surat Tanah", icon: DocumentTextIcon },
    { id: "peta-bidang", name: "Peta Bidang", icon: MapIcon },
    { id: "riwayat-tanah", name: "Riwayat Tanah", icon: ClipboardDocumentListIcon },
  ];

  // Dummy data
  const dummySuratTanah = [
    { id: 1, nomorSurat: "ST/001/I/2026", pemilik: "Ahmad Sulaiman", lokasi: "Dusun 1, RT 01", luas: "500 m²", status: "Aktif" },
    { id: 2, nomorSurat: "ST/002/I/2026", pemilik: "Budi Santoso", lokasi: "Dusun 2, RT 02", luas: "750 m²", status: "Aktif" },
    { id: 3, nomorSurat: "ST/003/I/2026", pemilik: "Hasan Abdullah", lokasi: "Dusun 1, RT 03", luas: "1000 m²", status: "Proses" },
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <Link href="/dashboard/pelayanan" className="hover:text-blue-600">Pelayanan</Link>
        <span>›</span>
        <span className="text-gray-900">Layanan Pertanahan</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Layanan Pertanahan</h1>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Tambah Surat Tanah
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan nomor surat atau pemilik..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Content */}
      {activeTab === "surat-tanah" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nomor Surat</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pemilik</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Luas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummySuratTanah.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">{item.nomorSurat}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.pemilik}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.lokasi}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.luas}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "Aktif" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "peta-bidang" && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <MapIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Peta Bidang Tanah - Fitur dalam pengembangan</p>
          <p className="text-sm mt-2">Integrasi dengan peta GIS akan ditambahkan</p>
        </div>
      )}

      {activeTab === "riwayat-tanah" && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <ClipboardDocumentListIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Riwayat Tanah - Fitur dalam pengembangan</p>
          <p className="text-sm mt-2">Tracking perubahan kepemilikan tanah</p>
        </div>
      )}
    </div>
  );
}
