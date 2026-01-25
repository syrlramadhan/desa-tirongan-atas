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
  TrashIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface SuratTanahFormData {
  nomorSurat: string;
  pemilik: string;
  nikPemilik: string;
  alamatPemilik: string;
  dusun: string;
  rt: string;
  rw: string;
  luas: string;
  batasUtara: string;
  batasSelatan: string;
  batasTimur: string;
  batasBarat: string;
  jenisHak: string;
  keterangan: string;
}

const initialFormData: SuratTanahFormData = {
  nomorSurat: "",
  pemilik: "",
  nikPemilik: "",
  alamatPemilik: "",
  dusun: "",
  rt: "",
  rw: "",
  luas: "",
  batasUtara: "",
  batasSelatan: "",
  batasTimur: "",
  batasBarat: "",
  jenisHak: "",
  keterangan: "",
};

export default function PertanahanPage() {
  const [activeTab, setActiveTab] = useState("surat-tanah");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<SuratTanahFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

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

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Data surat tanah berhasil ditambahkan!");
    closeModal();
    setSubmitting(false);
  };

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
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
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

      {/* Modal Tambah Surat Tanah */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Tambah Surat Tanah</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded">
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Surat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomorSurat: e.target.value }))}
                    placeholder="ST/001/I/2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Hak <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenisHak}
                    onChange={(e) => setFormData(prev => ({ ...prev, jenisHak: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  >
                    <option value="">Pilih Jenis Hak</option>
                    <option value="Hak Milik">Hak Milik</option>
                    <option value="Hak Guna Bangunan">Hak Guna Bangunan</option>
                    <option value="Hak Pakai">Hak Pakai</option>
                    <option value="Hak Sewa">Hak Sewa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pemilik <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pemilik}
                    onChange={(e) => setFormData(prev => ({ ...prev, pemilik: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK Pemilik <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nikPemilik}
                    onChange={(e) => setFormData(prev => ({ ...prev, nikPemilik: e.target.value }))}
                    maxLength={16}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Pemilik <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.alamatPemilik}
                    onChange={(e) => setFormData(prev => ({ ...prev, alamatPemilik: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h3 className="font-medium text-gray-900 mb-3">Lokasi Tanah</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dusun <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.dusun}
                    onChange={(e) => setFormData(prev => ({ ...prev, dusun: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  >
                    <option value="">Pilih Dusun</option>
                    <option value="Dusun 1 - Tirongan">Dusun 1 - Tirongan</option>
                    <option value="Dusun 2 - Bungku">Dusun 2 - Bungku</option>
                    <option value="Dusun 3 - Morowali">Dusun 3 - Morowali</option>
                    <option value="Dusun 4 - Sulawesi">Dusun 4 - Sulawesi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Luas (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.luas}
                    onChange={(e) => setFormData(prev => ({ ...prev, luas: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.rt}
                    onChange={(e) => setFormData(prev => ({ ...prev, rt: e.target.value }))}
                    placeholder="001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RW <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.rw}
                    onChange={(e) => setFormData(prev => ({ ...prev, rw: e.target.value }))}
                    placeholder="001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h3 className="font-medium text-gray-900 mb-3">Batas-batas Tanah</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batas Utara <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.batasUtara}
                    onChange={(e) => setFormData(prev => ({ ...prev, batasUtara: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batas Selatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.batasSelatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, batasSelatan: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batas Timur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.batasTimur}
                    onChange={(e) => setFormData(prev => ({ ...prev, batasTimur: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batas Barat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.batasBarat}
                    onChange={(e) => setFormData(prev => ({ ...prev, batasBarat: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm flex items-center gap-2"
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
