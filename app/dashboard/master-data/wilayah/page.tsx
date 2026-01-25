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
  UsersIcon,
  XMarkIcon
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

interface DusunFormData {
  nama: string;
  kode: string;
}

interface RWFormData {
  nama: string;
  nomor: string;
  ketua: string;
  dusunId: string;
}

interface RTFormData {
  nama: string;
  nomor: string;
  ketua: string;
  rwId: string;
}

const initialDusunFormData: DusunFormData = {
  nama: "",
  kode: "",
};

const initialRWFormData: RWFormData = {
  nama: "",
  nomor: "",
  ketua: "",
  dusunId: "",
};

const initialRTFormData: RTFormData = {
  nama: "",
  nomor: "",
  ketua: "",
  rwId: "",
};

export default function DataWilayahPage() {
  const [data, setData] = useState<WilayahResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dusun" | "rt">("dusun");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"dusun" | "rw" | "rt">("dusun");
  const [dusunFormData, setDusunFormData] = useState<DusunFormData>(initialDusunFormData);
  const [rwFormData, setRWFormData] = useState<RWFormData>(initialRWFormData);
  const [rtFormData, setRTFormData] = useState<RTFormData>(initialRTFormData);
  const [submitting, setSubmitting] = useState(false);

  // Get all RWs for RT form dropdown
  const allRWs = data?.dusun?.flatMap(dusun => 
    dusun.rws?.map(rw => ({
      id: rw.id,
      nama: rw.nama,
      dusunNama: dusun.nama
    })) || []
  ) || [];

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

  const openModal = (type: "dusun" | "rw" | "rt") => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDusunFormData(initialDusunFormData);
    setRWFormData(initialRWFormData);
    setRTFormData(initialRTFormData);
  };

  const handleDusunSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dusunFormData.nama) {
      alert("Mohon masukkan nama dusun!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/wilayah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dusun", ...dusunFormData }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data dusun berhasil ditambahkan!");
        closeModal();
        fetchWilayah();
      } else {
        alert(result.error || "Gagal menambahkan data dusun");
      }
    } catch (error) {
      console.error("Error creating dusun:", error);
      alert("Gagal menambahkan data dusun");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRWSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rwFormData.nama || !rwFormData.nomor || !rwFormData.dusunId) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/wilayah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "rw", 
          nama: rwFormData.nama,
          nomor: rwFormData.nomor,
          ketua: rwFormData.ketua,
          dusunId: parseInt(rwFormData.dusunId),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data RW berhasil ditambahkan!");
        closeModal();
        fetchWilayah();
      } else {
        alert(result.error || "Gagal menambahkan data RW");
      }
    } catch (error) {
      console.error("Error creating RW:", error);
      alert("Gagal menambahkan data RW");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRTSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rtFormData.nama || !rtFormData.nomor || !rtFormData.rwId) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/wilayah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "rt", 
          nama: rtFormData.nama,
          nomor: rtFormData.nomor,
          ketua: rtFormData.ketua,
          rwId: parseInt(rtFormData.rwId),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data RT berhasil ditambahkan!");
        closeModal();
        fetchWilayah();
      } else {
        alert(result.error || "Gagal menambahkan data RT");
      }
    } catch (error) {
      console.error("Error creating RT:", error);
      alert("Gagal menambahkan data RT");
    } finally {
      setSubmitting(false);
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
        <button 
          onClick={() => openModal("dusun")}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm lg:text-base"
        >
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
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => openModal("rw")}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">RW</span>
          </button>
          <button
            onClick={() => openModal("rt")}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">RT</span>
          </button>
        </div>
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

      {/* Modal Tambah Wilayah */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                {modalType === "dusun" && "Tambah Dusun"}
                {modalType === "rw" && "Tambah RW"}
                {modalType === "rt" && "Tambah RT"}
              </h2>
              <button 
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Form Dusun */}
            {modalType === "dusun" && (
              <form onSubmit={handleDusunSubmit} className="p-4 lg:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Dusun <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={dusunFormData.nama}
                      onChange={(e) => setDusunFormData(prev => ({ ...prev, nama: e.target.value }))}
                      placeholder="Contoh: Dusun 1 - Tirongan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Dusun
                    </label>
                    <input
                      type="text"
                      value={dusunFormData.kode}
                      onChange={(e) => setDusunFormData(prev => ({ ...prev, kode: e.target.value }))}
                      placeholder="Contoh: D001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
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
            )}

            {/* Form RW */}
            {modalType === "rw" && (
              <form onSubmit={handleRWSubmit} className="p-4 lg:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dusun <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={rwFormData.dusunId}
                      onChange={(e) => setRWFormData(prev => ({ ...prev, dusunId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    >
                      <option value="">Pilih Dusun</option>
                      {data?.dusun?.map((dusun) => (
                        <option key={dusun.id} value={dusun.id}>
                          {dusun.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama RW <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rwFormData.nama}
                      onChange={(e) => setRWFormData(prev => ({ ...prev, nama: e.target.value }))}
                      placeholder="Contoh: RW 01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor RW <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rwFormData.nomor}
                      onChange={(e) => setRWFormData(prev => ({ ...prev, nomor: e.target.value }))}
                      placeholder="Contoh: 001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Ketua RW
                    </label>
                    <input
                      type="text"
                      value={rwFormData.ketua}
                      onChange={(e) => setRWFormData(prev => ({ ...prev, ketua: e.target.value }))}
                      placeholder="Masukkan nama ketua RW"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
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
            )}

            {/* Form RT */}
            {modalType === "rt" && (
              <form onSubmit={handleRTSubmit} className="p-4 lg:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RW <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={rtFormData.rwId}
                      onChange={(e) => setRTFormData(prev => ({ ...prev, rwId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                      required
                    >
                      <option value="">Pilih RW</option>
                      {allRWs.map((rw) => (
                        <option key={rw.id} value={rw.id}>
                          {rw.nama} - {rw.dusunNama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama RT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rtFormData.nama}
                      onChange={(e) => setRTFormData(prev => ({ ...prev, nama: e.target.value }))}
                      placeholder="Contoh: RT 01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor RT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rtFormData.nomor}
                      onChange={(e) => setRTFormData(prev => ({ ...prev, nomor: e.target.value }))}
                      placeholder="Contoh: 001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Ketua RT
                    </label>
                    <input
                      type="text"
                      value={rtFormData.ketua}
                      onChange={(e) => setRTFormData(prev => ({ ...prev, ketua: e.target.value }))}
                      placeholder="Masukkan nama ketua RT"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
