"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HomeModernIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UsersIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface Keluarga {
  id: number;
  noKK: string;
  kepalaKeluarga: string;
  alamat: string;
  rt: { nama: string } | null;
  rw: { nama: string } | null;
  dusun: { nama: string } | null;
  _count: { anggota: number };
}

interface KeluargaResponse {
  keluarga: Keluarga[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    totalAnggota: number;
  };
}

interface Dusun {
  id: number;
  nama: string;
}

interface FormData {
  noKK: string;
  kepalaKeluarga: string;
  alamat: string;
  rt: string;
  rw: string;
  dusunId: string;
  kodePos: string;
}

const initialFormData: FormData = {
  noKK: "",
  kepalaKeluarga: "",
  alamat: "",
  rt: "",
  rw: "",
  dusunId: "",
  kodePos: "",
};

export default function DataKeluargaPage() {
  const [data, setData] = useState<KeluargaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [dusunList, setDusunList] = useState<Dusun[]>([]);

  useEffect(() => {
    fetchKeluarga();
  }, [currentPage]);

  useEffect(() => {
    fetchDusun();
  }, []);

  const fetchDusun = async () => {
    try {
      const response = await fetch("/api/wilayah");
      const result = await response.json();
      setDusunList(result.dusun || []);
    } catch (error) {
      console.error("Error fetching dusun:", error);
    }
  };

  const fetchKeluarga = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/keluarga?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching keluarga:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchKeluarga();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    
    try {
      const response = await fetch(`/api/keluarga/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchKeluarga();
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error deleting keluarga:", error);
      alert("Gagal menghapus data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.noKK || !formData.kepalaKeluarga || !formData.alamat || !formData.rt || !formData.rw) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    if (formData.noKK.length !== 16) {
      alert("Nomor KK harus 16 digit!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        dusunId: formData.dusunId ? parseInt(formData.dusunId) : null,
      };

      const response = await fetch("/api/keluarga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data keluarga berhasil ditambahkan!");
        setShowModal(false);
        setFormData(initialFormData);
        fetchKeluarga();
      } else {
        alert(result.error || "Gagal menambahkan data keluarga");
      }
    } catch (error) {
      console.error("Error creating keluarga:", error);
      alert("Gagal menambahkan data keluarga");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
        <span className="text-gray-900">Data Keluarga</span>
      </div>

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 lg:p-3 bg-green-500 rounded-lg">
            <HomeModernIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Data Keluarga</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base"
        >
          <PlusIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="hidden sm:inline">Tambah Kartu Keluarga</span>
          <span className="sm:hidden">Tambah KK</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-3 lg:p-4 mb-4 lg:mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari berdasarkan No. KK atau Nama Kepala Keluarga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Cari
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{data?.stats.total || 0}</div>
          <div className="text-sm text-gray-600">Total Kartu Keluarga</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{data?.stats.totalAnggota || 0}</div>
          <div className="text-sm text-gray-600">Total Anggota Keluarga</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">
            {data && data.stats.total > 0 ? (data.stats.totalAnggota / data.stats.total).toFixed(1) : 0}
          </div>
          <div className="text-sm text-gray-600">Rata-rata Anggota/KK</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. KK</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kepala Keluarga</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Alamat</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jml Anggota</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Wilayah</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.keluarga.map((keluarga, index) => (
              <tr key={keluarga.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{(currentPage - 1) * 10 + index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-mono">{keluarga.noKK}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{keluarga.kepalaKeluarga}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{keluarga.alamat}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    {keluarga._count.anggota} orang
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {keluarga.dusun?.nama || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Lihat Anggota">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded" title="Edit">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(keluarga.id)}
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

        </div>

        {/* Pagination */}
        <div className="px-3 lg:px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs lg:text-sm text-gray-600 text-center sm:text-left">
            Menampilkan {data ? (currentPage - 1) * 10 + 1 : 0}-{data ? Math.min(currentPage * 10, data.pagination.total) : 0} dari {data?.pagination.total || 0} data
          </div>
          <div className="flex gap-1 lg:gap-2 flex-wrap justify-center">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 lg:px-3 py-1 border border-gray-300 rounded text-xs lg:text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Sebelumnya</span>
              <span className="sm:hidden">Prev</span>
            </button>
            {Array.from({ length: data?.pagination.totalPages || 1 }, (_, i) => i + 1).slice(0, 5).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 lg:px-3 py-1 rounded text-xs lg:text-sm ${
                  currentPage === page 
                    ? "bg-green-600 text-white" 
                    : "border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(data?.pagination.totalPages || 1, p + 1))}
              disabled={currentPage === (data?.pagination.totalPages || 1)}
              className="px-2 lg:px-3 py-1 border border-gray-300 rounded text-xs lg:text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <span className="sm:hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Keluarga */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Tambah Kartu Keluarga</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setFormData(initialFormData);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* No KK */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Kartu Keluarga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="noKK"
                    value={formData.noKK}
                    onChange={handleInputChange}
                    maxLength={16}
                    placeholder="Masukkan 16 digit No. KK"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* Kepala Keluarga */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kepala Keluarga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kepalaKeluarga"
                    value={formData.kepalaKeluarga}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama kepala keluarga"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* Dusun */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dusun
                  </label>
                  <select
                    name="dusunId"
                    value={formData.dusunId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="">Pilih Dusun</option>
                    {dusunList.map((dusun) => (
                      <option key={dusun.id} value={dusun.id}>
                        {dusun.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kode Pos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="kodePos"
                    value={formData.kodePos}
                    onChange={handleInputChange}
                    placeholder="Masukkan kode pos"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* RT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="rt"
                    value={formData.rt}
                    onChange={handleInputChange}
                    placeholder="Contoh: 001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* RW */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RW <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="rw"
                    value={formData.rw}
                    onChange={handleInputChange}
                    placeholder="Contoh: 001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* Alamat */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData(initialFormData);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4" />
                      Simpan Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
