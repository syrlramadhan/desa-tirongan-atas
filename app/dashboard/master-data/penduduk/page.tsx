"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon
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

interface Keluarga {
  id: number;
  noKK: string;
  kepalaKeluarga: string;
}

interface FormData {
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  golonganDarah: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  pendidikan: string;
  kewarganegaraan: string;
  alamat: string;
  rt: string;
  rw: string;
  keluargaId: string;
  statusKeluarga: string;
}

const initialFormData: FormData = {
  nik: "",
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  golonganDarah: "",
  agama: "",
  statusPerkawinan: "",
  pekerjaan: "",
  pendidikan: "",
  kewarganegaraan: "WNI",
  alamat: "",
  rt: "",
  rw: "",
  keluargaId: "",
  statusKeluarga: "",
};

export default function DataPendudukPage() {
  const [data, setData] = useState<PendudukResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [keluargaList, setKeluargaList] = useState<Keluarga[]>([]);

  useEffect(() => {
    fetchPenduduk();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchKeluarga();
  }, []);

  const fetchKeluarga = async () => {
    try {
      const response = await fetch(`/api/keluarga?limit=1000`);
      const result = await response.json();
      setKeluargaList(result.keluarga || []);
    } catch (error) {
      console.error("Error fetching keluarga:", error);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nik || !formData.nama || !formData.tempatLahir || !formData.tanggalLahir || 
        !formData.jenisKelamin || !formData.agama || !formData.statusPerkawinan) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    if (formData.nik.length !== 16) {
      alert("NIK harus 16 digit!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        keluargaId: formData.keluargaId ? parseInt(formData.keluargaId) : null,
      };

      const response = await fetch("/api/penduduk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data penduduk berhasil ditambahkan!");
        setShowModal(false);
        setFormData(initialFormData);
        fetchPenduduk();
      } else {
        alert(result.error || "Gagal menambahkan data penduduk");
      }
    } catch (error) {
      console.error("Error creating penduduk:", error);
      alert("Gagal menambahkan data penduduk");
    } finally {
      setSubmitting(false);
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
    <div className="p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 lg:mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-500">Master Data</span>
        <span>›</span>
        <span className="text-gray-900">Data Penduduk</span>
      </div>

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 lg:p-3 bg-blue-500 rounded-lg">
            <UserGroupIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Data Penduduk</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          <PlusIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="hidden sm:inline">Tambah Penduduk</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow p-3 lg:p-4 mb-4 lg:mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari berdasarkan NIK atau Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
          >
            <option value="">Semua Status</option>
            <option value="KAWIN">Kawin</option>
            <option value="BELUM_KAWIN">Belum Kawin</option>
            <option value="CERAI_HIDUP">Cerai Hidup</option>
            <option value="CERAI_MATI">Cerai Mati</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm lg:text-base">
            Cari
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
              className="px-2 lg:px-3 py-1 border border-gray-300 rounded text-xs lg:text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <span className="sm:hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Penduduk */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Tambah Data Penduduk</h2>
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
                {/* NIK */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    maxLength={16}
                    placeholder="Masukkan 16 digit NIK"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* Tempat Lahir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleInputChange}
                    placeholder="Masukkan tempat lahir"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    required
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                {/* Golongan Darah */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Golongan Darah
                  </label>
                  <select
                    name="golonganDarah"
                    value={formData.golonganDarah}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="">Pilih Golongan Darah</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                {/* Agama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agama <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="agama"
                    value={formData.agama}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    required
                  >
                    <option value="">Pilih Agama</option>
                    <option value="ISLAM">Islam</option>
                    <option value="KRISTEN">Kristen</option>
                    <option value="KATOLIK">Katolik</option>
                    <option value="HINDU">Hindu</option>
                    <option value="BUDDHA">Buddha</option>
                    <option value="KONGHUCU">Konghucu</option>
                  </select>
                </div>

                {/* Status Perkawinan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Perkawinan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="statusPerkawinan"
                    value={formData.statusPerkawinan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value="KAWIN">Kawin</option>
                    <option value="BELUM_KAWIN">Belum Kawin</option>
                    <option value="CERAI_HIDUP">Cerai Hidup</option>
                    <option value="CERAI_MATI">Cerai Mati</option>
                  </select>
                </div>

                {/* Pekerjaan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleInputChange}
                    placeholder="Masukkan pekerjaan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Pendidikan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <select
                    name="pendidikan"
                    value={formData.pendidikan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="">Pilih Pendidikan</option>
                    <option value="TIDAK_SEKOLAH">Tidak/Belum Sekolah</option>
                    <option value="SD">SD/Sederajat</option>
                    <option value="SMP">SMP/Sederajat</option>
                    <option value="SMA">SMA/Sederajat</option>
                    <option value="D1">Diploma I</option>
                    <option value="D2">Diploma II</option>
                    <option value="D3">Diploma III</option>
                    <option value="S1">Sarjana (S1)</option>
                    <option value="S2">Magister (S2)</option>
                    <option value="S3">Doktor (S3)</option>
                  </select>
                </div>

                {/* Kewarganegaraan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kewarganegaraan
                  </label>
                  <select
                    name="kewarganegaraan"
                    value={formData.kewarganegaraan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>

                {/* Keluarga */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kartu Keluarga
                  </label>
                  <select
                    name="keluargaId"
                    value={formData.keluargaId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="">Pilih Kartu Keluarga</option>
                    {keluargaList.map((kk) => (
                      <option key={kk.id} value={kk.id}>
                        {kk.noKK} - {kk.kepalaKeluarga}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status dalam Keluarga */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status dalam Keluarga
                  </label>
                  <select
                    name="statusKeluarga"
                    value={formData.statusKeluarga}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="">Pilih Status</option>
                    <option value="KEPALA_KELUARGA">Kepala Keluarga</option>
                    <option value="ISTRI">Istri</option>
                    <option value="ANAK">Anak</option>
                    <option value="MENANTU">Menantu</option>
                    <option value="CUCU">Cucu</option>
                    <option value="ORANG_TUA">Orang Tua</option>
                    <option value="MERTUA">Mertua</option>
                    <option value="FAMILI_LAIN">Famili Lain</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>

                {/* RT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RT
                  </label>
                  <input
                    type="text"
                    name="rt"
                    value={formData.rt}
                    onChange={handleInputChange}
                    placeholder="Contoh: 001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* RW */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RW
                  </label>
                  <input
                    type="text"
                    name="rw"
                    value={formData.rw}
                    onChange={handleInputChange}
                    placeholder="Contoh: 001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Alamat */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
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
