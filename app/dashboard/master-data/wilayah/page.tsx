"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  HomeModernIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

interface RT {
  id: number;
  nama: string;
  _count: { keluarga: number };
}

interface RW {
  id: number;
  nama: string;
  rts: RT[];
}

interface Dusun {
  id: number;
  nama: string;
  kepalaDusun: string | null;
  rws: RW[];
  _count: { keluarga: number; penduduk: number };
}

interface WilayahResponse {
  dusun: Dusun[];
  stats: {
    totalDusun: number;
    totalRW: number;
    totalRT: number;
    totalKeluarga: number;
    totalPenduduk: number;
  };
}

export default function DataWilayahPage() {
  const [data, setData] = useState<WilayahResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dusun" | "rt">("dusun");

  useEffect(() => {
    fetchWilayah();
  }, []);

  const fetchWilayah = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/wilayah");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching wilayah:", error);
    } finally {
      setLoading(false);
    }
  };

  // Flatten RTs for the RT tab
  const allRTs = data?.dusun?.flatMap(dusun => 
    dusun.rws?.flatMap(rw => 
      rw.rts?.map(rt => ({
        ...rt,
        rwNama: rw.nama,
        dusunNama: dusun.nama
      })) || []
    ) || []
  ) || [];

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 lg:mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-500">Master Data</span>
        <span>›</span>
        <span className="text-gray-900">Data Wilayah</span>
      </div>

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 lg:p-3 bg-purple-500 rounded-lg">
            <MapIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Data Wilayah</h1>
        </div>
        <button className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm lg:text-base">
          <PlusIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="hidden sm:inline">Tambah Wilayah</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">{data?.stats?.totalDusun || 0}</div>
          <div className="text-sm text-gray-600">Total Dusun</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{data?.stats?.totalRT || 0}</div>
          <div className="text-sm text-gray-600">Total RT</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{data?.stats?.totalKeluarga || 0}</div>
          <div className="text-sm text-gray-600">Total KK</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">{data?.stats?.totalPenduduk || 0}</div>
          <div className="text-sm text-gray-600">Total Penduduk</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 lg:mb-6">
        <button
          onClick={() => setActiveTab("dusun")}
          className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
            activeTab === "dusun"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Data Dusun
        </button>
        <button
          onClick={() => setActiveTab("rt")}
          className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
            activeTab === "rt"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Data RT/RW
        </button>
      </div>

      {/* Table Dusun */}
      {activeTab === "dusun" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama Dusun</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kepala Dusun</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah RW/RT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah KK</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah Penduduk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.dusun?.map((dusun, index) => (
                <tr key={dusun.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{dusun.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{dusun.kepalaDusun || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {dusun.rws?.length || 0} RW / {dusun.rws?.reduce((sum, rw) => sum + (rw.rts?.length || 0), 0) || 0} RT
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <HomeModernIcon className="w-4 h-4 text-gray-400" />
                      {dusun._count?.keluarga || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      {dusun._count?.penduduk || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Lihat">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded" title="Edit">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded" title="Hapus">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Table RT */}
      {activeTab === "rt" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">RT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">RW</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dusun</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jumlah KK</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allRTs.map((rt, index) => (
                <tr key={rt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{rt.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rt.rwNama}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rt.dusunNama}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <HomeModernIcon className="w-4 h-4 text-gray-400" />
                      {rt._count.keluarga}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Lihat">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded" title="Edit">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded" title="Hapus">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
