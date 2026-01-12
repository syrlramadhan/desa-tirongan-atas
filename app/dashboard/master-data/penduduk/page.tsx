"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

interface Penduduk {
  id: number;
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  statusPerkawinan: string;
  agama: string;
  pekerjaan: string;
  pendidikan: string;
  keluarga?: {
    noKK: string;
  };
}

interface PendudukResponse {
  penduduk: Penduduk[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    lakiLaki: number;
    perempuan: number;
  };
}

export default function DataPendudukPage() {
  const [data, setData] = useState<PendudukResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPenduduk();
  }, [currentPage, statusFilter]);

  const fetchPenduduk = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/penduduk?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching penduduk:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPenduduk();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    
    try {
      const response = await fetch(`/api/penduduk/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchPenduduk();
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error deleting penduduk:", error);
      alert("Gagal menghapus data");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-500">Master Data</span>
        <span>›</span>
        <span className="text-gray-900">Data Penduduk</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-lg">
            <UserGroupIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Data Penduduk</h1>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Tambah Penduduk
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari berdasarkan NIK atau Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="KAWIN">Kawin</option>
            <option value="BELUM_KAWIN">Belum Kawin</option>
            <option value="CERAI_HIDUP">Cerai Hidup</option>
            <option value="CERAI_MATI">Cerai Mati</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Cari
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{data?.stats.total || 0}</div>
          <div className="text-sm text-gray-600">Total Penduduk</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{data?.stats.lakiLaki || 0}</div>
          <div className="text-sm text-gray-600">Laki-laki</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-pink-600">{data?.stats.perempuan || 0}</div>
          <div className="text-sm text-gray-600">Perempuan</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{data?.pagination.total || 0}</div>
          <div className="text-sm text-gray-600">Data Ditampilkan</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIK</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">L/P</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Alamat</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.penduduk.map((penduduk, index) => (
              <tr key={penduduk.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{(currentPage - 1) * 10 + index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-mono">{penduduk.nik}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{penduduk.nama}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {penduduk.jenisKelamin === "LAKI_LAKI" ? "L" : "P"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{penduduk.alamat}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    penduduk.statusPerkawinan === "KAWIN" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {penduduk.statusPerkawinan.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Lihat">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded" title="Edit">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(penduduk.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded" 
                      title="Hapus"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Menampilkan {data ? (currentPage - 1) * 10 + 1 : 0}-{data ? Math.min(currentPage * 10, data.pagination.total) : 0} dari {data?.pagination.total || 0} data
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            {Array.from({ length: data?.pagination.totalPages || 1 }, (_, i) => i + 1).slice(0, 5).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === page 
                    ? "bg-blue-600 text-white" 
                    : "border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(data?.pagination.totalPages || 1, p + 1))}
              disabled={currentPage === (data?.pagination.totalPages || 1)}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
