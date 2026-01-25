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
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface KelahiranFormData {
  namaBayi: string;
  jenisKelamin: string;
  tanggalLahir: string;
  tempatLahir: string;
  namaAyah: string;
  nikAyah: string;
  namaIbu: string;
  nikIbu: string;
  beratBadan: string;
  panjangBadan: string;
  penolong: string;
  keterangan: string;
}

interface KematianFormData {
  nama: string;
  nik: string;
  jenisKelamin: string;
  tanggalLahir: string;
  tanggalMeninggal: string;
  tempatMeninggal: string;
  penyebab: string;
  yangMenerangkan: string;
  hubungan: string;
  keterangan: string;
}

const initialKelahiranForm: KelahiranFormData = {
  namaBayi: "",
  jenisKelamin: "",
  tanggalLahir: "",
  tempatLahir: "",
  namaAyah: "",
  nikAyah: "",
  namaIbu: "",
  nikIbu: "",
  beratBadan: "",
  panjangBadan: "",
  penolong: "",
  keterangan: "",
};

const initialKematianForm: KematianFormData = {
  nama: "",
  nik: "",
  jenisKelamin: "",
  tanggalLahir: "",
  tanggalMeninggal: "",
  tempatMeninggal: "",
  penyebab: "",
  yangMenerangkan: "",
  hubungan: "",
  keterangan: "",
};

export default function KependudukanPage() {
  const [activeTab, setActiveTab] = useState("kelahiran");
  const [showModal, setShowModal] = useState(false);
  const [kelahiranForm, setKelahiranForm] = useState<KelahiranFormData>(initialKelahiranForm);
  const [kematianForm, setKematianForm] = useState<KematianFormData>(initialKematianForm);
  const [submitting, setSubmitting] = useState(false);

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

  const closeModal = () => {
    setShowModal(false);
    setKelahiranForm(initialKelahiranForm);
    setKematianForm(initialKematianForm);
  };

  const handleKelahiranSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Data kelahiran berhasil ditambahkan!");
    closeModal();
    setSubmitting(false);
  };

  const handleKematianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Data kematian berhasil ditambahkan!");
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
        <span className="text-gray-900">Layanan Kependudukan</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Layanan Kependudukan</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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

      {/* Modal Tambah Data */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                Tambah Data {activeTab === "kelahiran" ? "Kelahiran" : activeTab === "kematian" ? "Kematian" : tabs.find(t => t.id === activeTab)?.name}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded">
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form Kelahiran */}
            {activeTab === "kelahiran" && (
              <form onSubmit={handleKelahiranSubmit} className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Bayi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kelahiranForm.namaBayi}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, namaBayi: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={kelahiranForm.jenisKelamin}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, jenisKelamin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="LAKI_LAKI">Laki-laki</option>
                      <option value="PEREMPUAN">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={kelahiranForm.tanggalLahir}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, tanggalLahir: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tempat Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kelahiranForm.tempatLahir}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, tempatLahir: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Ayah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kelahiranForm.namaAyah}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, namaAyah: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIK Ayah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kelahiranForm.nikAyah}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, nikAyah: e.target.value }))}
                      maxLength={16}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Ibu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kelahiranForm.namaIbu}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, namaIbu: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIK Ibu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kelahiranForm.nikIbu}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, nikIbu: e.target.value }))}
                      maxLength={16}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Berat Badan (gram)
                    </label>
                    <input
                      type="number"
                      value={kelahiranForm.beratBadan}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, beratBadan: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Panjang Badan (cm)
                    </label>
                    <input
                      type="number"
                      value={kelahiranForm.panjangBadan}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, panjangBadan: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penolong Kelahiran
                    </label>
                    <select
                      value={kelahiranForm.penolong}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, penolong: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    >
                      <option value="">Pilih Penolong</option>
                      <option value="Dokter">Dokter</option>
                      <option value="Bidan">Bidan</option>
                      <option value="Dukun">Dukun</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      value={kelahiranForm.keterangan}
                      onChange={(e) => setKelahiranForm(prev => ({ ...prev, keterangan: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center gap-2"
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

            {/* Form Kematian */}
            {activeTab === "kematian" && (
              <form onSubmit={handleKematianSubmit} className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Almarhum/ah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kematianForm.nama}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, nama: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIK <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kematianForm.nik}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, nik: e.target.value }))}
                      maxLength={16}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={kematianForm.jenisKelamin}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, jenisKelamin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="LAKI_LAKI">Laki-laki</option>
                      <option value="PEREMPUAN">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={kematianForm.tanggalLahir}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, tanggalLahir: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Meninggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={kematianForm.tanggalMeninggal}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, tanggalMeninggal: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tempat Meninggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kematianForm.tempatMeninggal}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, tempatMeninggal: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penyebab Kematian <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={kematianForm.penyebab}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, penyebab: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    >
                      <option value="">Pilih Penyebab</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Kecelakaan">Kecelakaan</option>
                      <option value="Usia Lanjut">Usia Lanjut</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yang Menerangkan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kematianForm.yangMenerangkan}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, yangMenerangkan: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hubungan dengan Almarhum/ah
                    </label>
                    <select
                      value={kematianForm.hubungan}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, hubungan: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                    >
                      <option value="">Pilih Hubungan</option>
                      <option value="Suami/Istri">Suami/Istri</option>
                      <option value="Anak">Anak</option>
                      <option value="Orang Tua">Orang Tua</option>
                      <option value="Saudara">Saudara</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      value={kematianForm.keterangan}
                      onChange={(e) => setKematianForm(prev => ({ ...prev, keterangan: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-white"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center gap-2"
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

            {/* Message for other tabs */}
            {(activeTab !== "kelahiran" && activeTab !== "kematian") && (
              <div className="p-8 text-center text-gray-500">
                <DocumentDuplicateIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Form {tabs.find(t => t.id === activeTab)?.name} - Dalam pengembangan</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
