"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserMinusIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

export default function KependudukanPage() {
  const [activeTab, setActiveTab] = useState("kelahiran");

  const tabs = [
    { id: "kelahiran", name: "Kelahiran", icon: UserPlusIcon, count: 12 },
    { id: "kematian", name: "Kematian", icon: UserMinusIcon, count: 3 },
    { id: "pindah-masuk", name: "Pindah Masuk", icon: ArrowRightOnRectangleIcon, count: 5 },
    { id: "pindah-keluar", name: "Pindah Keluar", icon: ArrowLeftOnRectangleIcon, count: 2 },
    { id: "pecah-kk", name: "Pecah KK", icon: DocumentDuplicateIcon, count: 4 },
  ];

  // Dummy data
  const dummyData = {
    kelahiran: [
      { id: 1, nama: "Bayi Ahmad", tanggal: "2026-01-05", ayah: "Ahmad Sulaiman", ibu: "Siti Aminah", status: "Terverifikasi" },
      { id: 2, nama: "Bayi Budi", tanggal: "2026-01-02", ayah: "Budi Santoso", ibu: "Dewi Lestari", status: "Pending" },
    ],
    kematian: [
      { id: 1, nama: "Haji Usman", tanggal: "2026-01-10", umur: "85 tahun", penyebab: "Sakit", status: "Terverifikasi" },
    ],
  };

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <Link href="/dashboard/pelayanan" className="hover:text-blue-600">Pelayanan</Link>
        <span>›</span>
        <span className="text-gray-900">Layanan Kependudukan</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Layanan Kependudukan</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Tambah Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeTab === tab.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <tab.icon className={`w-8 h-8 mb-2 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`} />
            <div className="text-2xl font-bold text-gray-900">{tab.count}</div>
            <div className="text-xs text-gray-600">{tab.name}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari data..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === "kelahiran" && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama Bayi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal Lahir</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ayah</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ibu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyData.kelahiran.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.tanggal}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.ayah}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.ibu}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "Terverifikasi" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "kematian" && (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Umur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Penyebab</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyData.kematian.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.tanggal}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.umur}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.penyebab}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {(activeTab === "pindah-masuk" || activeTab === "pindah-keluar" || activeTab === "pecah-kk") && (
          <div className="p-8 text-center text-gray-500">
            <DocumentDuplicateIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Data {tabs.find(t => t.id === activeTab)?.name} - Belum ada data</p>
          </div>
        )}
      </div>
    </div>
  );
}
